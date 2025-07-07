// src/ai/flows/personalized-recommendations.ts
'use server';
/**
 * @fileOverview Personalized recommendation flow.
 *
 * This file exports:
 * - `getPersonalizedRecommendations`: A function that returns personalized room/service recommendations.
 * - `PersonalizedRecommendationsInput`: The input type for `getPersonalizedRecommendations`.
 * - `PersonalizedRecommendationsOutput`: The output type for `getPersonalizedRecommendations`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  pastBehavior: z.string().describe('User past behavior, such as previously viewed rooms, bookings, etc.'),
  statedPreferences: z.string().describe('User stated preferences, such as room type, amenities, budget, etc.'),
  availableRooms: z.string().describe('A description of available rooms and services.'),
});

export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Personalized recommendations for rooms or services based on user past behavior and stated preferences.'),
});

export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a hotel concierge expert.

  Based on the user's past behavior: {{{pastBehavior}}},
  stated preferences: {{{statedPreferences}}},
  and available rooms/services: {{{availableRooms}}},

generate personalized recommendations that best suit their needs. 

Consider all of these factors when providing your recommendations. Return a detailed explanation of why you recommended a particular room, or service.
  `, 
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);

