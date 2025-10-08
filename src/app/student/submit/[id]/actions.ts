'use server';

import { z } from 'zod';
import { analyzeEvidence } from '@/ai/flows/analyze-evidence-submission';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const formSchema = z.object({
  description: z.string(),
  photoDataUri: z.string().startsWith('data:'),
  studentId: z.string(),
  challengeId: z.string().uuid(),
});

// Client sends data URI; no file handling needed on the server

export async function handleEvidenceSubmission(data: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(data);

  if (!validatedFields.success) {
    const details = validatedFields.error.flatten();
    return { error: `Invalid fields: ${JSON.stringify(details.fieldErrors)}` };
  }

  const { description, photoDataUri, studentId, challengeId } = validatedFields.data;

  try {
    const result = await analyzeEvidence({
      photoDataUri,
      description,
    });

  // Save submission to database (pending review) via Supabase
  const { error: insertError } = await supabaseAdmin
    .from('submissions')
    .insert([
      {
        user_id: studentId,
        challenge_id: challengeId,
        description,
        image_url: photoDataUri,
      },
    ]);
  if (insertError) {
    return { error: `Failed to save submission: ${insertError.message}` };
  }

    return { analysis: result.analysisResult };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during analysis.';
    return { error: `AI analysis failed: ${errorMessage}` };
  }
}
