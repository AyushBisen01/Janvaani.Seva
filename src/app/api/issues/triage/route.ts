
'use server';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import IssueModel from '@/lib/models/Issue';
import { aiIssueTriage, AiIssueTriageInput } from '@/ai/ai-issue-triage';

/**
 * A new API endpoint to handle incoming civic issues,
 * process them with AI, and save them to the database.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { description, photoDataUri, location, citizen } = body;

    if (!description || !photoDataUri || !location || !citizen) {
      return NextResponse.json({ error: 'Missing required fields: description, photoDataUri, location, and citizen are required.' }, { status: 400 });
    }

    // Prepare the input for the AI flow
    const triageInput: AiIssueTriageInput = {
      description,
      photoDataUri,
    };

    // Call the Genkit AI flow to analyze the issue
    const triageResult = await aiIssueTriage(triageInput);

    const { category, priority, isCritical, summary } = triageResult;

    // Create a new issue using the AI's analysis
    const newIssue = new IssueModel({
      title: category,
      description: summary, // Use the AI-generated summary
      longDescription: description, // Store the original description
      location: location.address,
      coordinates: {
        latitude: location.lat,
        longitude: location.lng,
      },
      status: 'Pending', // All new issues start as Pending for review
      priority: priority,
      imageUrl: photoDataUri,
      submittedBy: citizen.name,
      citizen: { // Assuming citizen object is passed in request
        name: citizen.name,
        contact: citizen.contact,
      },
      statusHistory: [{ status: 'Pending', date: new Date() }],
    });

    await newIssue.save();

    return NextResponse.json(newIssue, { status: 201 });

  } catch (error) {
    console.error('AI Triage API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to triage issue.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
