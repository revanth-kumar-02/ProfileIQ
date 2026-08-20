import {
  ProfileExtractionProvider,
  ExtractionResult,
  ExtractionDiagnostics,
  FailureStage,
} from './types.js';
import { mapPDLResponseToRawProfile } from './pdlProfileMapper.js';
import { ENV } from '../../config/env.js';

/**
 * PDLProfileProvider
 *
 * Server-side profile data provider integrating with People Data Labs Person Enrichment API.
 * Uses LinkedIn profile URL for person lookup and maps raw PDL responses into ProfileIQ domain schema.
 *
 * Provides explicit failure stages, configuration validation, and request tracing.
 */
export class PDLProfileProvider implements ProfileExtractionProvider {
  id = 'pdl';
  name = 'People Data Labs Profile Provider';

  async isAvailable(): Promise<boolean> {
    const apiKey = ENV.PDL_API_KEY || process.env.PDL_API_KEY;
    return Boolean(apiKey && apiKey.trim().length > 0);
  }

  async extractProfile(profileUrl: string): Promise<ExtractionResult> {
    const rawUrl = (profileUrl || '').trim();

    console.log('[PDL Provider] Starting extraction');

    // 1. Configuration Stage Verification
    const apiKey = (ENV.PDL_API_KEY || process.env.PDL_API_KEY || '').trim();
    const isApiKeyConfigured = Boolean(apiKey);

    console.log(`[PDL Provider] API key configured: ${isApiKeyConfigured}`);

    if (!isApiKeyConfigured) {
      console.warn('[PDL Provider] Configuration error: PDL_API_KEY is not configured.');
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROVIDER_NOT_CONFIGURED',
          message: 'Profile import is not configured yet. The profile data provider API key is missing.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: false,
          failureStage: 'configuration',
          httpStatus: null,
          requestCompleted: false,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    // 2. Input Validation Stage
    if (!rawUrl) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'validation',
          httpStatus: null,
          requestCompleted: false,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
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
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'validation',
          httpStatus: null,
          requestCompleted: false,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    const cleanUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    // 3. Request Construction Stage
    console.log('[PDL Provider] Preparing API request');
    const apiUrl = new URL('https://api.peopledatalabs.com/v5/person/enrich');
    apiUrl.searchParams.set('profile', cleanUrl);
    apiUrl.searchParams.set('pretty', 'true');

    console.log(`[PDL Provider] Endpoint: ${apiUrl.origin}${apiUrl.pathname}`);

    // 4. Network Request Stage (With 15-second Timeout)
    console.log('[PDL Provider] Sending request');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    let responseText = '';

    try {
      response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      responseText = await response.text();

      console.log('[PDL Provider] Response received');
      console.log(`[PDL Provider] HTTP status: ${response.status}`);
      console.log(`[PDL Provider] Response length: ${responseText.length}`);
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      const isTimeout = err instanceof Error && err.name === 'AbortError';
      const errorType = err instanceof Error ? err.constructor.name || err.name : 'NetworkError';
      const errorMessage = err instanceof Error ? err.message : String(err);

      console.error('[PDL Provider] Request failed before response');
      console.error(`[PDL Provider] Error type: ${errorType}`);
      console.error(`[PDL Provider] Error message: ${errorMessage}`);

      if (isTimeout) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROVIDER_TIMEOUT',
            message: 'Request to profile data provider timed out. Please try again later.',
          },
          diagnostics: this.createDiagnostics({
            apiKeyConfigured: true,
            failureStage: 'network_request',
            httpStatus: null,
            errorType: 'TimeoutError',
            requestCompleted: false,
            profileRecordFound: false,
            responseMappingSuccessful: false,
          }),
        };
      }

      return {
        success: false,
        provider: this.id,
        error: {
          code: 'NETWORK_ERROR',
          message: 'We couldn\'t connect to the profile data service. Check your connection and try again.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'network_request',
          httpStatus: null,
          errorType,
          requestCompleted: false,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    // 5. Provider Response Processing Stage
    const httpStatus = response.status;

    if (httpStatus === 400) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROVIDER_BAD_REQUEST',
          message: 'People Data Labs rejected the request. Please provide a valid LinkedIn URL.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'provider_response',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    if (httpStatus === 401 || httpStatus === 403) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROVIDER_AUTH_ERROR',
          message: 'People Data Labs API authentication failed. Check server API key configuration.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'provider_response',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
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
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'provider_response',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
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
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'provider_response',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
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
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'provider_response',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    // 6. Response Parsing & Mapping Stage
    let responsePayload: any;
    try {
      responsePayload = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'Received invalid JSON response from People Data Labs.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'response_mapping',
          httpStatus,
          errorType: 'JSONParseError',
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    if (responsePayload.status === 404 || !responsePayload.data) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROFILE_DATA_NOT_AVAILABLE',
          message: 'We couldn\'t find profile data for this LinkedIn URL in People Data Labs.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'provider_response',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: false,
          responseMappingSuccessful: false,
        }),
      };
    }

    const rawData = mapPDLResponseToRawProfile(cleanUrl, responsePayload);

    const hasProfileData =
      Boolean(rawData.name) ||
      Boolean(rawData.headline) ||
      (rawData.workHistory && rawData.workHistory.length > 0) ||
      (rawData.extractedSkills && rawData.extractedSkills.length > 0);

    if (!hasProfileData) {
      return {
        success: false,
        provider: this.id,
        error: {
          code: 'PROFILE_DATA_NOT_AVAILABLE',
          message: 'People Data Labs returned empty profile information for this candidate.',
        },
        diagnostics: this.createDiagnostics({
          apiKeyConfigured: true,
          failureStage: 'response_mapping',
          httpStatus,
          requestCompleted: true,
          profileRecordFound: true,
          responseMappingSuccessful: false,
        }),
      };
    }

    return {
      success: true,
      provider: this.id,
      data: rawData,
      diagnostics: this.createDiagnostics({
        apiKeyConfigured: true,
        failureStage: undefined,
        httpStatus,
        requestCompleted: true,
        profileRecordFound: true,
        responseMappingSuccessful: true,
      }),
    };
  }

  private createDiagnostics(params: {
    apiKeyConfigured: boolean;
    failureStage?: FailureStage;
    httpStatus?: number | null;
    errorType?: string;
    requestCompleted: boolean;
    profileRecordFound: boolean;
    responseMappingSuccessful: boolean;
  }): ExtractionDiagnostics {
    return {
      provider: this.id,
      apiKeyConfigured: params.apiKeyConfigured,
      failureStage: params.failureStage,
      httpStatus: params.httpStatus,
      errorType: params.errorType,
      requestCompleted: params.requestCompleted,
      profileRecordFound: params.profileRecordFound,
      responseMappingSuccessful: params.responseMappingSuccessful,
    };
  }
}
