
import { NextResponse } from 'next/server';
import { getIssues, updateIssue, updateMultipleIssues } from '@/lib/data';
import type { Issue } from '@/lib/types';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const issues = await getIssues();
    return NextResponse.json(issues);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
        // Handle bulk updates
        const updates = body as (Partial<Issue> & { id: string })[];
        await updateMultipleIssues(updates);
        const allIssues = await getIssues();
        return NextResponse.json(allIssues);

    } else {
        // Handle single update
        const { id, ...updates } = body as Partial<Issue> & { id: string };
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'A valid Issue ID is required' }, { status: 400 });
        }
        await updateIssue(id, updates);
        const allIssues = await getIssues();
        return NextResponse.json(allIssues);
    }
  } catch (error) {
    console.error('API PUT Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update issue(s)';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
