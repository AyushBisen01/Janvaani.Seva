
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
    
    // --- START: CONSOLIDATED FLAG COUNTING & AUTO-APPROVAL/REJECTION LOGIC ---
    const approvalThreshold = 25;
    const rejectionThreshold = 25;

    // This pipeline calculates flag counts and determines new statuses in one go
    const issuesToUpdate = await IssueModel.aggregate([
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
          greenFlags: {
            $size: {
              $filter: { input: '$flags', as: 'flag', cond: { $eq: ['$$flag.type', 'green'] } }
            }
          },
          redFlags: {
            $size: {
              $filter: { input: '$flags', as: 'flag', cond: { $eq: ['$$flag.type', 'red'] } }
            }
          }
        }
      },
      {
        $addFields: {
          // Determine the new status if thresholds are met
          newStatus: {
            $switch: {
              branches: [
                {
                  case: { $and: [{ $eq: ['$status', 'Pending'] }, { $gte: ['$greenFlags', approvalThreshold] }] },
                  then: 'Approved'
                },
                {
                  case: { $and: [{ $eq: ['$status', 'Pending'] }, { $gte: ['$redFlags', rejectionThreshold] }] },
                  then: 'Rejected'
                }
              ],
              default: '$status' // Keep original status if no condition is met
            }
          }
        }
      },
      {
        // Project only the fields needed for the update operation
        $project: {
          _id: 1,
          greenFlags: 1,
          redFlags: 1,
          newStatus: 1,
          status: 1, // original status
        }
      }
    ]);

    const bulkOps = issuesToUpdate.map(issue => {
      const updateOp: any = {
        $set: {
          greenFlags: issue.greenFlags,
          redFlags: issue.redFlags,
        }
      };

      // If the status has changed, update it and push to history
      if (issue.newStatus !== issue.status) {
        updateOp.$set.status = issue.newStatus;
        updateOp.$push = { 
          statusHistory: { 
            status: issue.newStatus, 
            date: new Date(), 
            notes: `Auto-${issue.newStatus.toLowerCase()} by crowd consensus.` 
          } 
        };
      }

      return {
        updateOne: {
          filter: { _id: issue._id },
          update: updateOp
        }
      };
    });

    if (bulkOps.length > 0) {
      await IssueModel.bulkWrite(bulkOps);
    }
    // --- END: CONSOLIDATED LOGIC ---

    // Now, fetch all issues with the updated data for the frontend
    const realIssues = await IssueModel.aggregate([
      {
        $lookup: {
          from: 'users',
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
          from: 'flags',
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
            { $unwind: { path: '$flagger', preserveNullAndEmptyArrays: true } }
          ],
          as: 'flags'
        }
      },
      {
        $addFields: {
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
                user: { $ifNull: ['$$redFlag.flagger.name', 'Anonymous'] }
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
      if (issue.status === 'inProgress') {
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
        priority: issue.priority || 'Medium',
        reportedAt: issue.createdAt,
        resolvedAt: issue.resolvedAt,
        assignedTo: issue.assignedTo,
        citizen: {
          name: issue.user?.name || issue.submittedBy || 'Unknown',
          contact: issue.user?.email || 'N/A',
        },
        imageUrl: issue.imageUrl || '',
        imageHint: issue.title,
        proofUrl: issue.proofUrl,
        proofHint: issue.proofHint,
        greenFlags: issue.greenFlags || 0,
        redFlags: issue.redFlags || 0,
        redFlagReasons: issue.redFlagReasons?.filter((r: any) => r.reason) || [],
        statusHistory: issue.statusHistory && issue.statusHistory.length > 0 
          ? issue.statusHistory.map((h: any) => ({ status: capitalize(h.status), date: h.date }))
          : [{ status: capitalize(issue.status || 'Pending'), date: issue.createdAt }]
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
            if (newStatus === 'Assigned') {
                newStatus = 'inProgress';
            }

            const currentStatus = (issueToUpdate.status || 'Pending');

            if (newStatus !== currentStatus) {
                updateOp.$set.status = newStatus;
                updateOp.$push = { statusHistory: { status: newStatus, date: new Date() } };
            }
        }
        
        if (updates.assignedTo) {
            updateOp.$set.assignedTo = updates.assignedTo;
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
                 if (newStatus === 'Assigned') {
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
