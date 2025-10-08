'use server';

import { ecoCoach } from '@/ai/flows/eco-coach-flow';

// This is a streaming action.
export async function askEcoCoach(history: any[], message: string) {
    const { stream, response } = await ecoCoach(history, message);

    // Create a new ReadableStream from the Genkit stream
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                controller.enqueue(chunk.text);
            }
            controller.close();
        },
    });

    return readableStream;
}
