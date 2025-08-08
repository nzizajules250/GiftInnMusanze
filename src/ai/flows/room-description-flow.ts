'use server';
/**
 * @fileOverview An AI flow for generating compelling hotel room descriptions.
 *
 * - generateRoomDescription - A function that creates a description from a room name.
 * - RoomDescriptionInput - The input type for the flow.
 * - RoomDescriptionOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RoomDescriptionInputSchema = z.object({
  roomName: z.string().describe('The name of the hotel room.'),
});
export type RoomDescriptionInput = z.infer<typeof RoomDescriptionInputSchema>;

const RoomDescriptionOutputSchema = z.object({
  description: z.string().describe('A well-written, professional, and appealing description for the hotel room. It should be around 4-5 sentences.'),
});
export type RoomDescriptionOutput = z.infer<typeof RoomDescriptionOutputSchema>;

export async function generateRoomDescription(
  input: RoomDescriptionInput
): Promise<RoomDescriptionOutput> {
  return roomDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'roomDescriptionPrompt',
  input: { schema: RoomDescriptionInputSchema },
  output: { schema: RoomDescriptionOutputSchema },
  prompt: `You are a professional copywriter for a luxury hotel called "Gift Inn".

Your task is to generate a compelling, professional, and appealing hotel room description based on the room name provided.

The description should be approximately 4-5 sentences long. Focus on creating a sense of comfort, luxury, and relaxation.

Use the room name as inspiration for the description's tone and features.

Room Name: {{{roomName}}}`,
});

const roomDescriptionFlow = ai.defineFlow(
  {
    name: 'roomDescriptionFlow',
    inputSchema: RoomDescriptionInputSchema,
    outputSchema: RoomDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
