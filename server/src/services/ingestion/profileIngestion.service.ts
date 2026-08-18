import { LinkedInExtractionProvider, ExtractionResult } from './linkedinExtractionProvider.service.js';
import { normalizeRawExtractedProfile } from '../profile/profileNormalizer.service.js';
import { Profile } from '../../types/profile.types.js';

export interface ProfileImportResponse {
  success: boolean;
  data?: {
    profile: Profile;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class ProfileIngestionService {
  private extractionProvider: LinkedInExtractionProvider;

  constructor() {
    this.extractionProvider = new LinkedInExtractionProvider();
  }

  async importProfileFromUrl(profileUrl: string, candidateNameHint?: string): Promise<ProfileImportResponse> {
    const result: ExtractionResult = await this.extractionProvider.extractProfile(profileUrl);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || {
          code: 'PROFILE_EXTRACTION_FAILED',
          message: "We couldn't extract information from this LinkedIn profile.",
        },
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
    };
  }
}

export const profileIngestionService = new ProfileIngestionService();
