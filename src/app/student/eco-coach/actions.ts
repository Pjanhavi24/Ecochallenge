'use server';

import { ecoCoach } from '@/ai/flows/eco-coach-flow';

// This is a non-streaming action for now.
export async function askEcoCoach(history: any[], message: string) {
    const response = await ecoCoach(history, message);
    return response;
}
