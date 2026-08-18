import { profileProviderRegistry } from './profileProviderRegistry.js';
import { normalizeRawExtractedProfile } from '../profile/profileNormalizer.service.js';
import { Profile } from '../../types/profile.types.js';
import { ExtractionDiagnostics, ProviderStatusData } from './types.js';

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
   * Return safe capability & status info for registered extraction providers
   */
  async getProviderStatus(): Promise<ProviderStatusData> {
    const activeProvider = await profileProviderRegistry.getActiveProvider();
    const registeredProviders = await profileProviderRegistry.getProvidersStatus();
    const isAvailable = await activeProvider.isAvailable();
    const configuredProvider = process.env.PROFILE_EXTRACTION_PROVIDER || 'direct-linkedin';

    return {
      available: isAvailable,
      providerConfigured: Boolean(configuredProvider),
      activeProvider: activeProvider.id,
      registeredProviders,
    };
  }
}

export const profileIngestionService = new ProfileIngestionService();
