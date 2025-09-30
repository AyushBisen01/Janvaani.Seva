
'use server';

import type { Issue, User } from './types';
import dbConnect from '@/lib/db';
import IssueModel from '@/lib/models/Issue';
import UserModel from '@/lib/models/User';
import DetectionModel from '@/lib/models/Detection';
import {_getUsers, _getIssues} from '@/lib/placeholder-data'

// Helper to capitalize first letter
const capitalize = (s: string) => s && s.charAt(0).toUpperCase() + s.slice(1);

// Functions to interact with the real database
export async function getIssues(): Promise<Issue[]> {
  try {
    await dbConnect();
    
    // Fetch all issues and populate the virtual 'detection' field
    const realIssues = await IssueModel.find({})
      .populate('userId', 'name email')
      .populate('detection') // This populates the virtual field
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    // Map database documents to the Issue type
    const mappedIssues = realIssues.map((issue) => {
      const issueIdString = issue._id.toString();
      
      // Access the populated detection document and get the annotatedImageUrl
      const annotatedImageUrl = issue.detection?.annotatedImageUrl || null;
      
      let status = capitalize(issue.status || 'pending');
      if (issue.status === 'inProgress') { // Match "inProgress" from DB
        status = 'Assigned';
      }

      return {
        id: issueIdString,
        category: issue.title,
        description: issue.description,
        location: {
          address: issue.location,
          lat: issue.coordinates?.latitude || 0,
          lng: issue.coordinates?.longitude || 0,
        },
        status: status as any,
        priority: issue.priority || 'Medium', // Default priority
        reportedAt: issue.createdAt,
        resolvedAt: issue.resolvedAt,
        assignedTo: issue.assignedTo,
        citizen: {
          name: (issue.userId as any)?.name || issue.submittedBy || 'Unknown',
          contact: (issue.userId as any)?.email || 'N/A',
        },
        imageUrl: issue.imageUrl, // Original image URL
        annotatedImageUrl: annotatedImageUrl, // Annotated image URL (or null)
        imageHint: issue.title, // Use title as a hint
        proofUrl: issue.proofUrl,
        proofHint: issue.proofHint,
        statusHistory: issue.statusHistory && issue.statusHistory.length > 0 
          ? issue.statusHistory.map(h => ({ status: capitalize(h.status), date: h.date }))
          : [{ status: capitalize(issue.status || 'pending'), date: issue.createdAt }] // Create default history
      };
    });

    const placeholderIssues = _getIssues();
    
    // Combine and remove duplicates, giving preference to real issues
    const combined = [...mappedIssues, ...placeholderIssues];
    const uniqueIssues = combined.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
    
    return uniqueIssues;

  } catch (error) {
    console.error("Error fetching issues from DB, falling back to placeholder data:", error);
    return _getIssues();
  }
}

export async function getUsers(): Promise<User[]> {
   try {
    await dbConnect();
    const realUsers = await UserModel.find({}).lean();

    const mappedUsers = realUsers.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'Citizen',
      avatarUrl: user.faceImageUrl || `https://i.pravatar.cc/150?u=${user.email}`,
      department: user.department,
    }));
    
    const placeholderUsers = _getUsers();

    const combined = [...mappedUsers, ...placeholderUsers];
    const uniqueUsers = combined.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
    
    return uniqueUsers;

  } catch (error) {
    console.error("Error fetching users from DB, falling back to placeholder data:", error);
    return _getUsers();
  }
}

export async function updateIssue(id: string, updates: Partial<Issue>) {
    try {
        await dbConnect();
        const issueToUpdate = await IssueModel.findById(id);

        if (!issueToUpdate) {
            console.warn(`Issue with id ${id} not found in DB, cannot update.`);
            return;
        }
        
        const updateOp: any = {};
        
        // Handle status separately
        if (updates.status) {
            let newStatus = updates.status.toLowerCase();
            // Map "Assigned" from dashboard to "inProgress" for the database
            if (newStatus === 'assigned') {
                newStatus = 'inProgress';
            }
            
            const currentStatus = (issueToUpdate.status || 'pending').toLowerCase();
            if (newStatus !== currentStatus) {
                if (!updateOp.$set) updateOp.$set = {};
                updateOp.$set.status = newStatus;
                
                const newHistoryEntry = { status: newStatus, date: new Date() };

                // Atomically add to statusHistory array
                if (!updateOp.$push) updateOp.$push = {};
                updateOp.$push.statusHistory = newHistoryEntry;
            }
        }
        
        // Handle other fields
        for (const key in updates) {
            const typedKey = key as keyof Issue;
            if (typedKey !== 'status' && typedKey !== 'id') {
                const value = (updates as any)[typedKey];
                if (value !== undefined) {
                    if (!updateOp.$set) updateOp.$set = {};
                    (updateOp.$set as any)[typedKey] = value;
                }
            }
        }
        
        if (Object.keys(updateOp).length > 0) {
            await IssueModel.findByIdAndUpdate(id, updateOp, { new: true, upsert: false }).lean();
        }

    } catch (error) {
        console.error(`Failed to update issue ${id} in DB:`, error);
        throw error;
    }
}

export async function updateMultipleIssues(updates: (Partial<Issue> & {id: string})[]) {
    try {
        await dbConnect();
        if (updates.length === 0) return;

        const bulkOps = updates.map(update => {
            const { id, ...updateData } = update;
            
            const setOp: any = {};
            const pushOp: any = {};
            
            if (updateData.status) {
                let newStatus = updateData.status.toLowerCase();
                 // Map "Assigned" from dashboard to "inProgress" for the database
                if (newStatus === 'assigned') {
                    newStatus = 'inProgress';
                }
                 setOp.status = newStatus;
                 pushOp.statusHistory = { status: newStatus, date: new Date() };
            }
             if (updateData.priority) setOp.priority = updateData.priority;
             if (updateData.assignedTo) setOp.assignedTo = updateData.assignedTo;

            const finalUpdate: any = {};
            if(Object.keys(setOp).length > 0) finalUpdate.$set = setOp;
            if(Object.keys(pushOp).length > 0) finalUpdate.$push = pushOp;

            return {
                updateOne: {
                    filter: { _id: id },
                    update: finalUpdate
                }
            };
        });
        
        const validBulkOps = bulkOps.filter(op => op.updateOne.update.$set || op.updateOne.update.$push);

        if (validBulkOps.length > 0) {
            await IssueModel.bulkWrite(validBulkOps);
        }

    } catch (error) {
        console.error('Failed to bulk update issues in DB:', error);
        throw error;
    }
}
