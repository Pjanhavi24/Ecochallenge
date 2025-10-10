'use server';

import { ecoCoach } from '@/ai/flows/eco-coach-flow';
import { teacherBot } from '@/ai/flows/teacher-bot-flow';

const createReadableStream = async (genkitStream: any) => {
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of genkitStream) {
                controller.enqueue(chunk.text);
            }
            controller.close();
        },
    });
    return readableStream;
};

// This is a streaming action for the Eco Coach.
export async function askEcoCoach(history: any[], message: string) {
    const { stream } = await ecoCoach(history, message);
    return createReadableStream(stream);
}

// This is a streaming action for the Teacher Bot.
export async function askTeacherBot(history: any[], message: string) {
    const { stream } = await teacherBot(history, message);
    return createReadableStream(stream);
}
