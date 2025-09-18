'use server';

/**
 * @fileOverview An AI-powered issue triage flow.
 *
 * - aiIssueTriage - A function that triages and categorizes incoming issues.
 * - AiIssueTriageInput - The input type for the aiIssueTriage function.
 * - AiIssueTriageOutput - The return type for the aiIssueTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiIssueTriageInputSchema = z.object({
  description: z.string().describe('The description of the issue.'),
  photoDataUri: z
    .string()
    .describe(
      'A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AiIssueTriageInput = z.infer<typeof AiIssueTriageInputSchema>;

const AiIssueTriageOutputSchema = z.object({
  category: z.string().describe('The category of the issue.'),
  priority: z.enum(['high', 'medium', 'low']).describe('The priority of the issue.'),
  isCritical: z.boolean().describe('Whether the issue is critical and requires immediate attention.'),
  summary: z.string().describe('A short summary of the issue.'),
});
export type AiIssueTriageOutput = z.infer<typeof AiIssueTriageOutputSchema>;

export async function aiIssueTriage(input: AiIssueTriageInput): Promise<AiIssueTriageOutput> {
  return aiIssueTriageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiIssueTriagePrompt',
  input: {schema: AiIssueTriageInputSchema},
  output: {schema: AiIssueTriageOutputSchema},
  prompt: `You are an AI assistant that triages civic issues.

You will receive a description and a photo of the issue.

Based on the description and the photo, you will determine the category, priority, and whether the issue is critical.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Make sure to set the isCritical field to true if the issue requires immediate attention.

Consider these categories: pothole, garbage, water leak, traffic light, street sign, etc.
Prioritize critical issues such as:
- safety hazards, like missing stop signs, open manholes or sinkholes
- large water leaks
- blocked roads
- other issues which pose an immediate threat to public health or safety

Do not be too aggressive in flagging things as critical.

Respond concisely.  The summary should be less than 20 words.
`,
});

const aiIssueTriageFlow = ai.defineFlow(
  {
    name: 'aiIssueTriageFlow',
    inputSchema: AiIssueTriageInputSchema,
    outputSchema: AiIssueTriageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
