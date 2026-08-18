import {
  ProfileExtractionProvider,
  ExtractionResult,
  RawExtractedProfile,
  ExtractionDiagnostics,
} from './types.js';

/**
 * ExternalProfileProvider
 *
 * Generic external profile data API adapter implementation.
 * Integrates with third-party profile data provider services via configuration environment variables.
 *
 * Environment Configuration:
 * - PROFILE_PROVIDER_API_KEY: Authentication key for external profile API
 * - PROFILE_PROVIDER_BASE_URL: Endpoint URL for external profile API
 */
export class ExternalProfileProvider implements ProfileExtractionProvider {
  id = 'external-provider';
  name = 'Configured External Profile Data Provider';

  async isAvailable(): Promise<boolean> {
    const apiKey = process.env.PROFILE_PROVIDER_API_KEY;
    const baseUrl = process.env.PROFILE_PROVIDER_BASE_URL;
    return Boolean(apiKey && apiKey.trim() && baseUrl && baseUrl.trim());
  }

  async extractProfile(profileUrl: string): Promise<ExtractionResult> {
    const rawUrl = (profileUrl || '').trim();
    const apiKey = process.env.PROFILE_PROVIDER_API_KEY?.trim();
    const baseUrl = process.env.PROFILE_PROVIDER_BASE_URL?.trim();

    console.log(`[External Profile Provider] Triggered for URL: "${rawUrl}"`);

    const isAvailable = await this.isAvailable();

    if (!isAvailable || !apiKey || !baseUrl) {
      console.warn('[External Profile Provider] Not configured or API credentials missing.');
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
          message:
            'External profile data provider is not configured. Please set PROFILE_PROVIDER_API_KEY and PROFILE_PROVIDER_BASE_URL in server environment.',
        },
        diagnostics,
      };
    }

    try {
      console.log(`[External Profile Provider] Requesting profile data from: ${baseUrl}`);

      const apiResponse = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ profileUrl: rawUrl }),
      });

      const httpStatus = apiResponse.status;
      console.log(`[External Profile Provider] Provider HTTP status: ${httpStatus}`);

      if (httpStatus === 404) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROFILE_NOT_PUBLIC',
            message: 'The requested profile was not found or is not publicly accessible via the external data provider.',
          },
          diagnostics: {
            provider: this.id,
            providerAvailable: true,
            httpStatus,
            pageType: 'empty',
            recordsFound: false,
            profileSignalsDetected: {
              name: false,
              headline: false,
              about: false,
              skillsCount: 0,
              experienceCount: 0,
              educationCount: 0,
            },
          },
        };
      }

      if (httpStatus === 401 || httpStatus === 403) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: 'External profile provider authentication failed. Check API key configuration.',
          },
        };
      }

      if (httpStatus === 429) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROFILE_ACCESS_BLOCKED',
            message: 'External profile provider rate limit exceeded.',
          },
        };
      }

      if (!apiResponse.ok) {
        return {
          success: false,
          provider: this.id,
          error: {
            code: 'PROFILE_DATA_NOT_AVAILABLE',
            message: `External profile provider returned error status ${httpStatus}.`,
          },
        };
      }

      const responsePayload = await apiResponse.json();
      const rawData = this.mapProviderPayloadToRawProfile(rawUrl, responsePayload);

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
            message: 'External provider returned empty data for this profile.',
          },
          diagnostics: {
            provider: this.id,
            providerAvailable: true,
            httpStatus,
            pageType: 'empty',
            recordsFound: false,
            profileSignalsDetected: profileSignals,
          },
        };
      }

      return {
        success: true,
        provider: this.id,
        data: rawData,
        diagnostics: {
          provider: this.id,
          providerAvailable: true,
          httpStatus,
          pageType: 'profile',
          recordsFound: true,
          profileSignalsDetected: profileSignals,
        },
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[External Profile Provider Error]: ${errMsg}`);

      return {
        success: false,
        provider: this.id,
        error: {
          code: 'NETWORK_ERROR',
          message: `Failed to communicate with external profile provider: ${errMsg}`,
        },
      };
    }
  }

  /**
   * Generic payload mapper to normalize external provider responses into RawExtractedProfile schema
   */
  private mapProviderPayloadToRawProfile(rawUrl: string, payload: any): RawExtractedProfile {
    const data = payload.data || payload.profile || payload;

    return {
      rawUrl,
      name: data.name || data.fullName || data.full_name || undefined,
      headline: data.headline || data.title || data.occupation || undefined,
      about: data.about || data.summary || data.bio || undefined,
      locationName: data.location || data.locationName || data.city || undefined,
      photoUrl: data.photoUrl || data.pictureUrl || data.profile_pic || undefined,
      workHistory: (data.workHistory || data.experiences || data.positions || []).map((exp: any) => ({
        companyName: exp.company || exp.companyName || exp.company_name,
        jobTitle: exp.title || exp.jobTitle || exp.position,
        dates: exp.dates || exp.period || (exp.startDate ? `${exp.startDate} - ${exp.endDate || 'Present'}` : undefined),
        descriptionText: exp.description || exp.summary,
      })),
      educationHistory: (data.educationHistory || data.education || []).map((edu: any) => ({
        schoolName: edu.school || edu.institution || edu.schoolName,
        degreeName: edu.degree || edu.degreeName,
        dates: edu.dates || edu.period,
      })),
      extractedSkills: (data.skills || data.extractedSkills || []).map((s: any) =>
        typeof s === 'string' ? s : s.name
      ),
      portfolioProjects: (data.projects || data.portfolioProjects || []).map((proj: any) => ({
        title: proj.title || proj.name,
        summary: proj.summary || proj.description,
        tags: proj.tags || proj.technologies || [],
      })),
    };
  }
}
