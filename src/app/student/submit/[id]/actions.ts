'use server';

import { z } from 'zod';
import { analyzeEvidence } from '@/ai/flows/analyze-evidence-submission';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const formSchema = z.object({
  description: z.string(),
  photoDataUri: z.string().startsWith('data:'),
  studentId: z.string().uuid('Invalid student ID format'),
  challengeId: z.string(),
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
    // Debug logging
    console.log('Submission data:', {
      studentId,
      challengeId,
      studentIdType: typeof studentId,
      challengeIdType: typeof challengeId,
      challengeIdParsed: parseInt(challengeId),
      isNaN: isNaN(parseInt(challengeId))
    });

    const result = await analyzeEvidence({
      photoDataUri,
      description,
    });

    // Validate challengeId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(challengeId)) {
      console.error('Invalid challenge ID format:', challengeId);
      return { error: `Invalid challenge ID format. Expected UUID, received: "${challengeId}"` };
    }

    // Debug logging before insert
    const insertData = {
      user_id: studentId,
      challenge_id: challengeId,
      description,
      image_url: photoDataUri,
      ai_analysis: result.analysisResult,
    };
    console.log('Insert data:', insertData);

  // Save submission to database (pending review) via Supabase
  const { error: insertError } = await supabaseAdmin
    .from('submissions')
    .insert([
      {
        user_id: studentId,
        challenge_id: challengeId,
        description,
        image_url: photoDataUri,
        ai_analysis: result.analysisResult,
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
