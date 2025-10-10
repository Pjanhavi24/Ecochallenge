'use server';

import { ecoCoach } from '@/ai/flows/eco-coach-flow';
import { teacherBot } from '@/ai/flows/teacher-bot-flow';

// This is a non-streaming action for now.
export async function askEcoCoach(history: any[], message: string) {
    const response = await ecoCoach(history, message);
    return response;
}

export async function askTeacherBot(history: any[], message: string) {
    const response = await teacherBot(history, message);
    return response;
}
