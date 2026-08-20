import {
  ProfileExtractionProvider,
  ExtractionResult,
  ExtractionDiagnostics,
} from './types.js';
import { mapPDLResponseToRawProfile } from './pdlProfileMapper.js';

/**
 * PDLProfileProvider
 *
 * Server-side profile data provider integrating with People Data Labs Person Enrichment API.
 * Uses LinkedIn profile URL for person lookup and maps raw PDL responses into ProfileIQ domain schema.
 */
export class PDLProfileProvider implements ProfileExtractionProvider {
  id = 'pdl';
  name = 'People Data Labs Profile Provider';

  async isAvailable(): Promise<boolean> {
    const apiKey = process.env.PDL_API_KEY;
    return Boolean(apiKey && apiKey.trim().length > 0);
  }

  async extractProfile(profileUrl: string): Promise<ExtractionResult> {
    const rawUrl = (profileUrl || '').trim();

    console.log(`\n[PDL Provider] Extract profile request for URL: "${rawUrl}"`);

    // 1. Validate environment configuration
    const apiKey = process.env.PDL_API_KEY?.trim();
    if (!apiKey) {
      console.warn('[PDL Provider] Unavailable: PDL_API_KEY environment variable is not configured.');
      const diagnostics: ExtractionDiagnostics = {
        provider: this.id,
        providerAvailable: false,
        configuredProvider: this.id,
        pageType: 'unknown',
        recordsFound: false,
        profileSignalsDetected: {
          name: false,
          headline: false,
          about: false,
          skillsCount: 0,
          experienceCount: 0,
          educationCount: 0,
        },
      };

      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'People Data Labs profile provider is not configured. Missing PDL_API_KEY.',
        },
        diagnostics,
      };
    }

    // 2. Validate URL syntax
    if (!rawUrl) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL.',
        },
      };
    }

    const isValidFormat =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(rawUrl) ||
      /^linkedin\.com\/in\/[\w-]+\/?$/i.test(rawUrl);

    if (!isValidFormat) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username).',
        },
      };
    }

    const cleanUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    // 3. Prepare API Request to People Data Labs Person Enrichment API
    const apiUrl = new URL('https://api.peopledatalabs.com/v5/person/enrich');
    apiUrl.searchParams.set('profile', cleanUrl);
    apiUrl.searchParams.set('pretty', 'true');

    try {
      console.log(`[PDL Provider] Querying PDL Person Enrichment API for profile: "${cleanUrl}"`);

      const apiResponse = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          Accept: 'application/json',
        },
      });

      const httpStatus = apiResponse.status;
      console.log(`[PDL Provider] Response HTTP Status: ${httpStatus}`);

      // Handle HTTP status error codes according to PDL contract & domain errors
      if (httpStatus === 400) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'INVALID_PROFILE_URL',
            message: 'People Data Labs rejected the request. Please provide a valid LinkedIn URL.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'empty', false),
        };
      }

      if (httpStatus === 401 || httpStatus === 403) {
        console.error('[PDL Provider] Authentication error with People Data Labs API key.');
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROVIDER_AUTH_ERROR',
            message: 'People Data Labs API authentication failed. Check server API key configuration.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'unknown', false),
        };
      }

      if (httpStatus === 404) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROFILE_DATA_NOT_AVAILABLE',
            message: 'We couldn\'t find profile data for this LinkedIn URL in People Data Labs.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'empty', false),
        };
      }

      if (httpStatus === 429) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROVIDER_RATE_LIMITED',
            message: 'Profile import is temporarily unavailable due to provider limits. Please try again later.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'unknown', false),
        };
      }

      if (httpStatus >= 500) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: 'People Data Labs service is currently unavailable. Please try again later.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'unknown', false),
        };
      }

      if (!apiResponse.ok) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: `People Data Labs API returned error status ${httpStatus}.`,
          },
          diagnostics: this.createDiagnostics(httpStatus, 'unknown', false),
        };
      }

      // 4. Parse successful payload
      const responsePayload: any = await apiResponse.json();

      if (responsePayload.status === 404 || !responsePayload.data) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROFILE_DATA_NOT_AVAILABLE',
            message: 'We couldn\'t find profile data for this LinkedIn URL in People Data Labs.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'empty', false),
        };
      }

      // Map PDL JSON response using mapper
      const rawData = mapPDLResponseToRawProfile(cleanUrl, responsePayload);

      const profileSignals = {
        name: Boolean(rawData.name),
        headline: Boolean(rawData.headline),
        about: Boolean(rawData.about),
        skillsCount: (rawData.extractedSkills || []).length,
        experienceCount: (rawData.workHistory || []).length,
        educationCount: (rawData.educationHistory || []).length,
      };

      const hasSignals =
        profileSignals.name ||
        profileSignals.headline ||
        profileSignals.skillsCount > 0 ||
        profileSignals.experienceCount > 0;

      if (!hasSignals) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROFILE_DATA_NOT_AVAILABLE',
            message: 'People Data Labs returned empty profile information for this URL.',
          },
          diagnostics: this.createDiagnostics(httpStatus, 'empty', false, profileSignals),
        };
      }

      return {
        success: true,
        provider: this.id,
        data: rawData,
        diagnostics: this.createDiagnostics(httpStatus, 'profile', true, profileSignals),
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[PDL Provider Network Error]: ${errMsg}`);

      return {
        success: false,
        provider: this.id,
        error: {
          code: 'NETWORK_ERROR',
          message: 'We couldn\'t connect to the profile data service. Check your connection and try again.',
        },
        diagnostics: this.createDiagnostics(undefined, 'unknown', false),
      };
    }
  }

  private createDiagnostics(
    httpStatus?: number,
    pageType: string = 'unknown',
    recordsFound: boolean = false,
    profileSignals?: {
      name: boolean;
      headline: boolean;
      about: boolean;
      skillsCount: number;
      experienceCount: number;
      educationCount: number;
    }
  ): ExtractionDiagnostics {
    return {
      provider: this.id,
      providerAvailable: true,
      configuredProvider: this.id,
      httpStatus,
      pageType: pageType as any,
      recordsFound,
      profileSignalsDetected: profileSignals || {
        name: false,
        headline: false,
        about: false,
        skillsCount: 0,
        experienceCount: 0,
        educationCount: 0,
      },
    };
  }
}
