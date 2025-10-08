import { NextResponse } from 'next/server';
import { handleEvidenceSubmission } from '@/app/student/submit/[id]/actions';

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binaryString = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
  const base64 = btoa(binaryString);
  return `data:${file.type};base64,${base64}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const description = formData.get('description') as string;
    const photo = formData.get('photo') as File;
    const studentId = formData.get('studentId') as string;
    const challengeId = formData.get('challengeId') as string;

    if (!photo) return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    if (!studentId) return NextResponse.json({ error: 'No studentId provided' }, { status: 400 });
    if (!challengeId) return NextResponse.json({ error: 'No challengeId provided' }, { status: 400 });

    const photoDataUri = await fileToDataUri(photo);

    const result = await handleEvidenceSubmission({ description, photoDataUri, studentId, challengeId });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
