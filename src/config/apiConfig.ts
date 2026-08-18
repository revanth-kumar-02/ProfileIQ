/**
 * ProfileIQ — Central API Configuration
 *
 * Configures API base URLs and environment parameters.
 * Ensures consistent route resolution with exactly one `/api` prefix.
 */

const env = (import.meta as unknown as { env?: Record<string, string | boolean> }).env || {};

// Raw base URL from environment or default to http://localhost:3001
const rawBaseUrl = (env.VITE_API_BASE_URL as string) || 'http://localhost:3001';

// Strip any trailing slashes and any trailing /api to establish clean server root
const serverUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/i, '');

// Central API base URL, guaranteed to end with exactly one '/api'
const baseUrl = `${serverUrl}/api`;

export const API_CONFIG = {
  serverUrl,
  baseUrl,
  isDevMode: Boolean(env.DEV),
  endpoints: {
    health: '/health',
    analyze: '/analysis',
    importProfile: '/profile/import',
  },
};
