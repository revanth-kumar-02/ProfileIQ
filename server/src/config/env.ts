import dotenv from 'dotenv';
import path from 'path';

// Load .env file from root or server directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  PROFILE_EXTRACTION_PROVIDER: process.env.PROFILE_EXTRACTION_PROVIDER || 'pdl',
  PDL_API_KEY: process.env.PDL_API_KEY || '',
  PROFILE_PROVIDER_API_KEY: process.env.PROFILE_PROVIDER_API_KEY || '',
  PROFILE_PROVIDER_BASE_URL: process.env.PROFILE_PROVIDER_BASE_URL || '',
  PROFILE_PROVIDER_CHAIN: process.env.PROFILE_PROVIDER_CHAIN || '',
};
