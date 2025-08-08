/**
 * @fileoverview This file is used to load environment variables from a .env file
 * during local development.
 *
 * It is not needed for production builds and should not contain any other code.
 *
 * Genkit automatically looks for a file with this name and loads it before
 * running any other code. This is the recommended way to manage environment
ax
 * variables for local development with Genkit.
 */
import {config} from 'dotenv';
config();
