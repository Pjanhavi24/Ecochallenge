'use server';
/**
 * @fileOverview A general education chatbot for students.
 *
 * - teacherBot - A function that provides answers to general educational questions.
 */

import { ai } from '@/ai/genkit';

export async function teacherBot(history: any[], message: string) {
  try {
    const prompt = `You are Teacher Bot, a helpful and knowledgeable AI assistant for students. You can help with information queries, grammar checking, homework help, explanations of concepts, and general educational support across all subjects.

Your capabilities include:
- Providing information on various topics
- Checking and correcting grammar
- Explaining concepts clearly
- Helping with homework and assignments
- Offering study tips and learning strategies
- Answering general knowledge questions

Format your responses using markdown for better readability:
- Use bullet points (-) for lists
- Use numbered lists (1., 2., etc.) for steps or sequences
- Use **bold text** for emphasis on important terms
- Use *italic text* for subtle emphasis
- Use \`inline code\` for technical terms or short examples
- Use \`\`\`language\ncode block\n\`\`\` for longer code examples (specify language like javascript, python, etc.)
- Use # Headers for sections if the response is long
- Keep responses structured, organized, and easy to scan

Always be encouraging, patient, and supportive of students' learning journey.

Here is the conversation history:
${history.map((msg: any) => `- ${msg.role}: ${msg.content.map((c: any) => c.text).join('')}`).join('\n')}

New question:
${message}

Response:`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('Teacher Bot AI error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return "I'm sorry, I'm having trouble generating a response right now. Please try again later.";
  }
}