import { profileProviderRegistry } from './profileProviderRegistry.js';
import { normalizeRawExtractedProfile } from '../profile/profileNormalizer.service.js';
import { Profile } from '../../types/profile.types.js';
import { ExtractionDiagnostics, ProviderStatusData } from './types.js';
import { ENV } from '../../config/env.js';

export interface ProfileImportResponse {
  success: boolean;
  data?: {
    profile: Profile;
  };
  error?: {
    code: string;
    message: string;
  };
  diagnostics?: ExtractionDiagnostics;
}

export class ProfileIngestionService {
  /**
   * Import candidate profile from URL using active provider / provider chain
   */
  async importProfileFromUrl(profileUrl: string, candidateNameHint?: string): Promise<ProfileImportResponse> {
    const result = await profileProviderRegistry.executeExtraction(profileUrl);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || {
          code: 'PROFILE_DATA_NOT_AVAILABLE',
          message: "We couldn't extract public profile information from this LinkedIn URL.",
        },
        diagnostics: result.diagnostics,
      };
    }

    const rawData = result.data;
    if (candidateNameHint && candidateNameHint.trim() && !rawData.name) {
      rawData.name = candidateNameHint.trim();
    }

    console.log(`[Normalization] Profile successfully normalized (Source Provider: ${result.provider})`);
    const normalizedProfile = normalizeRawExtractedProfile(rawData);

    return {
      success: true,
      data: {
        profile: normalizedProfile,
      },
      diagnostics: result.diagnostics,
    };
  }

  /**
   * Return safe capability & status info for active provider (Health Check)
   */
  async getProviderStatus(): Promise<ProviderStatusData> {
    const activeProvider = await profileProviderRegistry.getActiveProvider();
    const isAvailable = await activeProvider.isAvailable();
    const configuredProvider = (ENV.PROFILE_EXTRACTION_PROVIDER || process.env.PROFILE_EXTRACTION_PROVIDER || 'pdl').trim();

    const apiKey = (ENV.PDL_API_KEY || process.env.PDL_API_KEY || '').trim();
    const apiKeyConfigured = Boolean(apiKey);

    if (activeProvider.id === 'pdl' && !apiKeyConfigured) {
      return {
        provider: 'pdl',
        configured: false,
        available: false,
        apiKeyConfigured: false,
        reason: 'PDL_API_KEY_MISSING',
      };
    }

    return {
      provider: activeProvider.id,
      configured: Boolean(configuredProvider),
      available: isAvailable,
      apiKeyConfigured: activeProvider.id === 'pdl' ? apiKeyConfigured : true,
    };
  }
}

export const profileIngestionService = new ProfileIngestionService();
