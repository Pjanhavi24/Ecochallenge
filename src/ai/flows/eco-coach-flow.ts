'use server';
/**
 * @fileOverview A chatbot for answering questions about environmental topics.
 *
 * - ecoCoach - A function that streams answers to environmental questions.
 */

import { ai } from '@/ai/genkit';

export async function ecoCoach(history: any[], message: string) {
  try {
    const prompt = `You are Eco-Coach, a friendly and knowledgeable AI assistant for students learning about environmental topics. Your goal is to provide clear, concise, and encouraging answers to their questions. Keep your answers focused on the environment, sustainability, and conservation.

Format your responses using markdown for better readability:
- Use bullet points (-) for lists
- Use numbered lists (1., 2., etc.) for steps or sequences
- Use **bold text** for emphasis on important terms
- Use *italic text* for subtle emphasis
- Use \`inline code\` for technical terms or short code snippets
- Use \`\`\`language\ncode block\n\`\`\` for longer code examples (specify language like javascript, python, etc.)
- Use # Headers for sections if the response is long
- Keep responses structured, organized, and easy to scan

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
    console.error('EcoCoach AI error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return "I'm sorry, I'm having trouble generating a response right now. Please try again later.";
  }
}