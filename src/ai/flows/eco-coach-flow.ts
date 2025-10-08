'use server';
/**
 * @fileOverview A chatbot for answering questions about environmental topics.
 *
 * - ecoCoach - A function that streams answers to environmental questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EcoCoachInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })),
  message: z.string().describe('The user\'s message.'),
});

export async function ecoCoach(history: any[], message: string) {
  const prompt = `You are Eco-Coach, a friendly and knowledgeable AI assistant for students learning about environmental topics. Your goal is to provide clear, concise, and encouraging answers to their questions. Keep your answers focused on the environment, sustainability, and conservation.

Here is the conversation history:
{{#each history}}
- {{role}}: {{#each content}}{{this.text}}{{/each}}
{{/each}}

New question:
{{{message}}}`;

  const { stream, response } = ai.generateStream(prompt);

  // Also wait for the full response and return it.
  const fullResponse = await response;

  return { stream, response: fullResponse };
}
