import { Groq } from 'groq-sdk';
import { ENV } from './env.js';

export function getGroqClient(): Groq {
  if (!ENV.GROQ_API_KEY) {
    console.warn('[Warning] GROQ_API_KEY is not configured in server environment variables.');
  }

  return new Groq({
    apiKey: ENV.GROQ_API_KEY || 'MISSING_API_KEY',
  });
}

export function getGroqModel(): string {
  return ENV.GROQ_MODEL || 'openai/gpt-oss-120b';
}
