/**
 * ProfileIQ — Profile Import Service
 *
 * Provider-independent profile import service.
 * UI components call this service to import and extract profile information.
 */

import { ProfileIngestionProvider, ProfileIngestionResult } from '../../types/ingestion';
import { ApiIngestionProvider } from './apiIngestionProvider';

export class ProfileImportService {
  private static provider: ProfileIngestionProvider = new ApiIngestionProvider();

  /**
   * Replace ingestion provider if needed
   */
  static setProvider(provider: ProfileIngestionProvider): void {
    this.provider = provider;
  }

  static getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Imports and normalizes a profile by LinkedIn URL.
   */
  static async importProfile(profileUrl: string, candidateName?: string): Promise<ProfileIngestionResult> {
    return this.provider.importProfile(profileUrl, candidateName);
  }
}
