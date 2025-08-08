/**
 * @fileoverview This file defines the global Genkit AI instance.
 *
 * It is initialized with the Google AI plugin, allowing access to Gemini models.
 * The `ai` object exported from this file is used throughout the application
 * to define and run AI flows, prompts, and tools.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // Default to a fast model for general use cases.
  // Specific flows can override this with more powerful models.
  model: 'googleai/gemini-2.0-flash',
});
