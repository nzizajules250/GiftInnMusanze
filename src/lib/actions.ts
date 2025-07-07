"use server";

import { getPersonalizedRecommendations, PersonalizedRecommendationsInput } from "@/ai/flows/personalized-recommendations";

export async function getRecommendationsAction(input: PersonalizedRecommendationsInput) {
  try {
    const result = await getPersonalizedRecommendations(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || "Failed to get recommendations." };
  }
}
