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
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL.',
        },
      };
    }

    const apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.importProfile}`;

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
        const errorCode = resData.error?.code || 'PROFILE_DATA_NOT_AVAILABLE';
        let errorMessage = resData.error?.message;

        if (errorCode === 'PROFILE_DATA_NOT_AVAILABLE') {
          errorMessage = "We couldn't find profile data for this LinkedIn URL in the configured data source.";
        } else if (errorCode === 'PROVIDER_RATE_LIMITED') {
          errorMessage = "Profile import is temporarily unavailable due to provider limits. Please try again later.";
        } else if (errorCode === 'PROVIDER_UNAVAILABLE' || errorCode === 'PROVIDER_AUTH_ERROR') {
          errorMessage = "Profile import is temporarily unavailable. Please try again later.";
        } else if (errorCode === 'NETWORK_ERROR') {
          errorMessage = "We couldn't connect to the profile data service. Check your connection and try again.";
        }

        return {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage || "We couldn't extract public profile information from this LinkedIn URL.",
          },
          diagnostics: resData.diagnostics,
        };
      }

      return {
        success: true,
        profile: resData.data.profile,
        diagnostics: resData.diagnostics,
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
