
import { NextResponse } from 'next/server';
import { getIssues, updateIssue, updateMultipleIssues } from '@/lib/data';
import type { Issue } from '@/lib/types';

export async function GET() {
  const issues = getIssues();
  return NextResponse.json(issues);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
        // Handle bulk updates
        const updates = body as (Partial<Issue> & { id: string })[];
        const updatedIssues = updateMultipleIssues(updates);
        return NextResponse.json(updatedIssues);

    } else {
        // Handle single update
        const { id, ...updates } = body as Partial<Issue> & { id: string };
        if (!id) {
            return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });
        }
        const updatedIssue = updateIssue(id, updates);
        if (!updatedIssue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        return NextResponse.json(updatedIssue);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update issue(s)' }, { status: 500 });
  }
}
