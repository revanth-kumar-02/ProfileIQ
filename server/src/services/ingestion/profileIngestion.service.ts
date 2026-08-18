import { LinkedInExtractionProvider } from './linkedinExtractionProvider.service.js';
import { normalizeRawExtractedProfile } from '../profile/profileNormalizer.service.js';
import { Profile } from '../../types/profile.types.js';
import { ProfileExtractionProvider, ExtractionResult, ExtractionDiagnostics } from './types.js';

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
  private extractionProvider: ProfileExtractionProvider;

  constructor(provider?: ProfileExtractionProvider) {
    this.extractionProvider = provider || new LinkedInExtractionProvider();
  }

  /**
   * Set or replace extraction provider
   */
  setProvider(provider: ProfileExtractionProvider): void {
    this.extractionProvider = provider;
  }

  getProviderName(): string {
    return this.extractionProvider.name;
  }

  async importProfileFromUrl(profileUrl: string, candidateNameHint?: string): Promise<ProfileImportResponse> {
    const result: ExtractionResult = await this.extractionProvider.extractProfile(profileUrl);

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

    console.log('[Normalization] Profile successfully normalized');
    const normalizedProfile = normalizeRawExtractedProfile(rawData);

    return {
      success: true,
      data: {
        profile: normalizedProfile,
      },
      diagnostics: result.diagnostics,
    };
  }
}

export const profileIngestionService = new ProfileIngestionService();
