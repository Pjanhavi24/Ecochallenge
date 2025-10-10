'use server';
/**
 * @fileOverview A chatbot that acts as a helpful teacher for students.
 *
 * - teacherBot - A function that streams answers to academic questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TeacherBotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })),
  message: z.string().describe("The user's message, which may include a command like 'Summarize', 'Check Grammar', 'Translate', 'Write', or 'Rewrite'."),
});

export async function teacherBot(history: any[], message: string) {
  const prompt = `You are an AI Teacher Bot. Your goal is to help students with their academic questions.
You should provide clear, concise, and helpful explanations.

You have several tools available. If a user's message starts with a specific command, you should perform that task. The available commands are:
- 'Summarize': Condense the provided text into a shorter version.
- 'Check Grammar': Proofread the text for grammatical errors and suggest corrections.
- 'Translate': Translate the text into a requested language. If no language is specified, ask for clarification.
- 'Write': Generate original text on a given topic. For example, "Write a short story about a brave knight."
- 'Rewrite': Rephrase or improve the provided text to make it clearer, more engaging, or to change its tone.

For general questions that do not use a command, act as a knowledgeable and patient teacher.

Here is the conversation history:
{{#each history}}
- {{role}}: {{#each content}}{{this.text}}{{/each}}
{{/each}}

New question or command:
{{{message}}}`;

  const { stream, response } = ai.generateStream({
    prompt,
    history: history,
    input: {
      message
    }
  });

  // Also wait for the full response.
  await response;

  return { stream, response };
}
