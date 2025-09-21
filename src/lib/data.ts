

'use server';

import type { Issue, User } from './types';
import dbConnect from '@/lib/db';
import IssueModel from '@/lib/models/Issue';
import UserModel from '@/lib/models/User';
import {_getUsers, _getIssues} from '@/lib/placeholder-data'


// Functions to interact with the real database
export async function getIssues(): Promise<Issue[]> {
  try {
    await dbConnect();
    const realIssues = await IssueModel.find({}).populate('userId', 'name email').sort({ createdAt: -1 }).lean();
    
    // Map database documents to the Issue type
    const mappedIssues = realIssues.map(issue => ({
      id: issue._id.toString(),
      category: issue.title,
      description: issue.description,
      location: {
        address: issue.location,
        lat: issue.coordinates?.latitude || 0,
        lng: issue.coordinates?.longitude || 0,
      },
      status: issue.status as any,
      priority: issue.priority || 'Medium',
      reportedAt: issue.createdAt,
      resolvedAt: issue.resolvedAt,
      assignedTo: issue.assignedTo,
      citizen: {
        name: (issue.userId as any)?.name || issue.submittedBy || 'Unknown',
        contact: (issue.userId as any)?.email || 'N/A',
      },
      imageUrl: issue.imageUrl,
      imageHint: issue.title, // Use title as a hint
      proofUrl: issue.proofUrl,
      proofHint: issue.proofHint,
      statusHistory: issue.statusHistory || [{ status: issue.status, date: issue.createdAt }]
    }));

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

        const updateOp: any = { $set: {} };
        const issueToUpdate = await IssueModel.findById(id);

        if (!issueToUpdate) {
            console.error(`Issue with id ${id} not found in DB`);
            return null;
        }
        
        // Ensure statusHistory exists
        if (!issueToUpdate.statusHistory || issueToUpdate.statusHistory.length === 0) {
            issueToUpdate.statusHistory = [{ status: issueToUpdate.status, date: issueToUpdate.createdAt }];
        }

        for (const key in updates) {
            const typedKey = key as keyof Issue;
            if (typedKey === 'status') {
                updateOp.$set.status = updates.status;
                if (issueToUpdate.status !== updates.status) {
                    updateOp.$push = { statusHistory: { status: updates.status, date: new Date() } };
                }
            } else if (typedKey === 'priority' || typedKey === 'assignedTo' || typedKey === 'resolvedAt') {
                 updateOp.$set[key] = updates[typedKey];
            }
        }
        
        if (Object.keys(updateOp.$set).length > 0) {
            const updatedIssue = await IssueModel.findByIdAndUpdate(id, updateOp, { new: true }).lean();
            return updatedIssue;
        }
        return issueToUpdate;

    } catch (error) {
        console.error(`Failed to update issue ${id} in DB:`, error);
        // Fallback to placeholder update logic if needed, or just throw
        throw error;
    }
}

export async function updateMultipleIssues(updates: (Partial<Issue> & {id: string})[]) {
    try {
        await dbConnect();
        const bulkOps = updates.map(update => {
            const { id, ...updateData } = update;
            const updateOp: any = { $set: {} };
            if (updateData.status) {
                 updateOp.$set.status = updateData.status;
                 updateOp.$push = { statusHistory: { status: updateData.status, date: new Date() } };
            }
             if (updateData.priority) updateOp.$set.priority = updateData.priority;
             if (updateData.assignedTo) updateOp.$set.assignedTo = updateData.assignedTo;

            return {
                updateOne: {
                    filter: { _id: id },
                    update: updateOp
                }
            };
        });

        if (bulkOps.length > 0) {
            await IssueModel.bulkWrite(bulkOps);
        }
        return await getIssues();

    } catch (error) {
        console.error('Failed to bulk update issues in DB:', error);
        throw error;
    }
}
