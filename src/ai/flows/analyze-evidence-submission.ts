// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Analyzes student evidence submissions based on image and description correspondence.
 *
 * - analyzeEvidence - A function that analyzes the evidence submission.
 * - AnalyzeEvidenceInput - The input type for the analyzeEvidence function.
 * - AnalyzeEvidenceOutput - The return type for the analyzeEvidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEvidenceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo provided by the student as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The student provided description of the photo.'),
});
export type AnalyzeEvidenceInput = z.infer<typeof AnalyzeEvidenceInputSchema>;

const AnalyzeEvidenceOutputSchema = z.object({
  analysisResult: z
    .string()
    .describe(
      'An analysis of how closely the image corresponds to the description.'
    ),
});
export type AnalyzeEvidenceOutput = z.infer<typeof AnalyzeEvidenceOutputSchema>;

export async function analyzeEvidence(input: AnalyzeEvidenceInput): Promise<AnalyzeEvidenceOutput> {
  return analyzeEvidenceFlow(input);
}

const analyzeEvidencePrompt = ai.definePrompt({
  name: 'analyzeEvidencePrompt',
  input: {schema: AnalyzeEvidenceInputSchema},
  output: {schema: AnalyzeEvidenceOutputSchema},
  prompt: `You are an assistant tasked with analyzing student submissions for eco-challenges.

You will be provided with a photo and a description of the photo.

Your task is to analyze how closely the image corresponds to the description provided by the student.

Photo: {{media url=photoDataUri}}
Description: {{{description}}}

Analysis:`,
});

const analyzeEvidenceFlow = ai.defineFlow(
  {
    name: 'analyzeEvidenceFlow',
    inputSchema: AnalyzeEvidenceInputSchema,
    outputSchema: AnalyzeEvidenceOutputSchema,
  },
  async input => {
    const {output} = await analyzeEvidencePrompt(input);
    return output!;
  }
);
