/**
 * ProfileIQ — Central API Configuration
 *
 * Configures API base URLs and environment parameters.
 * Note: Groq API keys must NEVER be exposed in frontend client code.
 * All LLM intelligence operations must execute via server-side endpoints.
 */

const env = (import.meta as unknown as { env?: Record<string, string | boolean> }).env || {};

export const API_CONFIG = {
  baseUrl: (env.VITE_API_BASE_URL as string) || '/api/v1',
  isDevMode: Boolean(env.DEV),
  endpoints: {
    ingestProfile: '/profiles/ingest',
    analyzeProfile: '/analysis/evaluate',
    getTargetRoles: '/roles',
  },
};
