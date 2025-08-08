'use server';
/**
 * @fileOverview An AI flow for confirming a user's booking details.
 * 
 * - confirmBookingWithAI - A function that uses AI to answer a user's query about their booking.
 * - BookingConfirmationInput - The input type for the flow.
 * - BookingConfirmationOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Booking } from '@/lib/types';

const BookingSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  guestName: z.string(),
  guestIdNumber: z.string(),
  phoneNumber: z.string(),
  roomName: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  status: z.enum(['Confirmed', 'Pending', 'Cancelled']),
  total: z.number(),
  avatar: z.string().optional(),
});

const BookingConfirmationInputSchema = z.object({
  query: z.string().describe("The user's question about their booking."),
  bookings: z.array(BookingSchema).describe("A list of the user's current bookings."),
});
export type BookingConfirmationInput = z.infer<typeof BookingConfirmationInputSchema>;

const BookingConfirmationOutputSchema = z.object({
  response: z.string().describe("A helpful and conversational response to the user's query."),
});
export type BookingConfirmationOutput = z.infer<typeof BookingConfirmationOutputSchema>;

export async function confirmBookingWithAI(input: {query: string, bookings: Booking[]}): Promise<BookingConfirmationOutput> {
  return bookingConfirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookingConfirmationPrompt',
  input: { schema: BookingConfirmationInputSchema },
  output: { schema: BookingConfirmationOutputSchema },
  prompt: `You are a friendly and helpful hotel concierge AI for the "Gift Inn".

A user is asking a question about their booking. Your task is to answer their question based *only* on the booking information provided in the context.

- Be conversational and polite.
- If you can answer the question, state the information clearly.
- If the user asks about a booking that doesn't exist in the provided data, politely inform them you can't find that booking.
- Do not make up any information. If the data isn't there, you don't know it.

User's Question:
"{{{query}}}"

Here is the user's booking data:
{{#each bookings}}
- Room Name: {{roomName}}
- Status: {{status}}
- Check-in: {{checkIn}}
- Check-out: {{checkOut}}
{{/each}}
{{#if @first~}}
  {{#unless bookings}}
- No bookings found.
  {{~/unless}}
{{~/if}}
`,
});

const bookingConfirmationFlow = ai.defineFlow(
  {
    name: 'bookingConfirmationFlow',
    inputSchema: BookingConfirmationInputSchema,
    outputSchema: BookingConfirmationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
