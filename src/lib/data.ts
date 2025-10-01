
'use server';

import type { Issue, User } from './types';
import dbConnect from '@/lib/db';
import IssueModel from '@/lib/models/Issue';
import UserModel from '@/lib/models/User';
import FlagModel from '@/lib/models/Flag';
import {_getUsers, _getIssues} from '@/lib/placeholder-data'
import mongoose from 'mongoose';

// Helper to capitalize first letter
const capitalize = (s: string) => s && s.charAt(0).toUpperCase() + s.slice(1);

// Functions to interact with the real database
export async function getIssues(): Promise<Issue[]> {
  try {
    await dbConnect();
    
    // --- START: AUTO-APPROVAL/REJECTION LOGIC ---
    const approvalThreshold = 20;
    const rejectionThreshold = 20;

    const pendingIssuesForTriage = await IssueModel.aggregate([
      { $match: { status: 'Pending' } },
      {
        $lookup: {
          from: 'flags',
          localField: '_id',
          foreignField: 'issueId',
          as: 'flags'
        }
      },
      {
        $addFields: {
          greenFlags: { $size: { $filter: { input: '$flags', as: 'flag', cond: { $eq: ['$$flag.type', 'green'] } } } },
          redFlags: { $size: { $filter: { input: '$flags', as: 'flag', cond: { $eq: ['$$flag.type', 'red'] } } } }
        }
      },
      {
        $match: {
          $or: [
            { greenFlags: { $gte: approvalThreshold } },
            { redFlags: { $gte: rejectionThreshold } }
          ]
        }
      }
    ]);

    const issuesToApprove = pendingIssuesForTriage.filter(i => i.greenFlags >= approvalThreshold).map(i => i._id);
    const issuesToReject = pendingIssuesForTriage.filter(i => i.redFlags >= rejectionThreshold).map(i => i._id);
    
    const bulkOps = [];
    if (issuesToApprove.length > 0) {
      bulkOps.push({
        updateMany: {
          filter: { _id: { $in: issuesToApprove } },
          update: { 
            $set: { status: 'Approved' },
            $push: { statusHistory: { status: 'Approved', date: new Date(), notes: 'Auto-approved by crowd consensus.' } }
          }
        }
      });
    }
    if (issuesToReject.length > 0) {
       bulkOps.push({
        updateMany: {
          filter: { _id: { $in: issuesToReject } },
          update: { 
            $set: { status: 'Rejected' },
            $push: { statusHistory: { status: 'Rejected', date: new Date(), notes: 'Auto-rejected by crowd consensus.' } }
          }
        }
      });
    }

    if (bulkOps.length > 0) {
      await IssueModel.bulkWrite(bulkOps);
    }
    // --- END: AUTO-APPROVAL/REJECTION LOGIC ---

    // Aggregate to get flag counts and reasons
    const realIssues = await IssueModel.aggregate([
      {
        $lookup: {
          from: 'users', // The collection name for UserModel
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'flags', // The collection name for FlagModel
          let: { issue_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$issueId", "$$issue_id"] } } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'flagger'
              }
            },
            { $unwind: '$flagger' }
          ],
          as: 'flags'
        }
      },
      {
        $addFields: {
          greenFlags: {
            $size: {
              $filter: {
                input: '$flags',
                as: 'flag',
                cond: { $eq: ['$$flag.type', 'green'] }
              }
            }
          },
          redFlags: {
            $size: {
              $filter: {
                input: '$flags',
                as: 'flag',
                cond: { $eq: ['$$flag.type', 'red'] }
              }
            }
          },
          redFlagReasons: {
            $map: {
              input: {
                $filter: {
                  input: '$flags',
                  as: 'flag',
                  cond: { $eq: ['$$flag.type', 'red'] }
                }
              },
              as: 'redFlag',
              in: {
                reason: '$$redFlag.reason',
                user: '$$redFlag.flagger.name'
              }
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Map issues to the format expected by the frontend
    const mappedIssues = realIssues.map((issue) => {
      const issueIdString = issue._id.toString();
      
      let status = capitalize(issue.status || 'Pending');
      if (issue.status === 'inProgress') { // Match "inProgress" from DB
        status = 'Assigned';
      }
      if (issue.status === 'approved') {
        status = 'Approved';
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
        assignedTo: issue.assignedDepartment,
        citizen: {
          name: issue.user?.name || issue.submittedBy || 'Unknown',
          contact: issue.user?.email || 'N/A',
        },
        imageUrl: issue.imageUrl || '', // Use the imageUrl from the issue itself
        imageHint: issue.title, // Use title as a hint
        proofUrl: issue.proofUrl,
        proofHint: issue.proofHint,
        greenFlags: issue.greenFlags || 0,
        redFlags: issue.redFlags || 0,
        redFlagReasons: issue.redFlagReasons?.filter((r: any) => r.reason) || [],
        statusHistory: issue.statusHistory && issue.statusHistory.length > 0 
          ? issue.statusHistory.map(h => ({ status: capitalize(h.status), date: h.date }))
          : [{ status: capitalize(issue.status || 'Pending'), date: issue.createdAt }] // Create default history
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
        
        const updateOp: any = { $set: {} };
        
        if (updates.status) {
            let newStatus = updates.status;
            const currentStatus = (issueToUpdate.status || 'Pending');

            if (newStatus !== currentStatus) {
                updateOp.$set.status = newStatus;
                updateOp.$push = { statusHistory: { status: newStatus, date: new Date() } };
            }
        }
        
        if (updates.assignedTo) {
            updateOp.$set.assignedDepartment = updates.assignedTo;
        }
        if (updates.priority) {
            updateOp.$set.priority = updates.priority;
        }
        
        if (Object.keys(updateOp.$set).length > 0) {
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
                let newStatus = updateData.status;
                 setOp.status = newStatus;
                 pushOp.statusHistory = { status: newStatus, date: new Date() };
            }
             if (updateData.priority) setOp.priority = updateData.priority;
             if (updateData.assignedTo) setOp.assignedDepartment = updateData.assignedTo;

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

    