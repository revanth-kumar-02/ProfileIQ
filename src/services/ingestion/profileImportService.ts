/**
 * ProfileIQ — Profile Import Service
 *
 * Provider-independent profile import service.
 * UI components call this service without knowing whether ingestion is performed
 * by DevIngestionProvider or production backend scraper API.
 */

import { ProfileIngestionProvider, ProfileIngestionResult } from '../../types/ingestion';
import { DevIngestionProvider } from './devIngestionProvider';

export class ProfileImportService {
  private static provider: ProfileIngestionProvider = new DevIngestionProvider();

  /**
   * Replace ingestion provider (e.g. when connecting backend scraping API in production)
   */
  static setProvider(provider: ProfileIngestionProvider): void {
    this.provider = provider;
  }

  static getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Imports and normalizes a profile by LinkedIn URL or handle.
   */
  static async importProfile(profileUrl: string, candidateName?: string): Promise<ProfileIngestionResult> {
    return this.provider.importProfile(profileUrl, candidateName);
  }
}
