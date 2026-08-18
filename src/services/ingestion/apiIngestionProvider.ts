/**
 * ProfileIQ — Production API Ingestion Provider
 *
 * Calls the backend POST /api/profile/import endpoint to extract real LinkedIn profile data.
 * Does NOT generate fake or demo profile data.
 */

import { ProfileIngestionProvider, ProfileIngestionResult } from '../../types/ingestion';
import { API_CONFIG } from '../../config/apiConfig';

export class ApiIngestionProvider implements ProfileIngestionProvider {
  name = 'Production Backend Ingestion Provider';

  async importProfile(profileUrl: string, candidateName?: string): Promise<ProfileIngestionResult> {
    const trimmedUrl = (profileUrl || '').trim();

    if (!trimmedUrl) {
      return {
        success: false,
        error: {
          code: 'EMPTY_URL',
          message: 'Please enter a valid LinkedIn profile URL.',
        },
      };
    }

    const apiUrl = `${API_CONFIG.baseUrl}/api/profile/import`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileUrl: trimmedUrl,
          candidateName: candidateName?.trim() || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success || !resData.data?.profile) {
        return {
          success: false,
          error: {
            code: resData.error?.code || 'PROFILE_EXTRACTION_FAILED',
            message:
              resData.error?.message ||
              "We couldn't extract information from this LinkedIn profile. Please verify the URL points to a public profile.",
          },
        };
      }

      return {
        success: true,
        profile: resData.data.profile,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[ApiIngestionProvider Error]: ${message}`);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to the ProfileIQ ingestion server. Make sure the server is running.',
        },
      };
    }
  }
}
