/**
 * ProfileIQ — Ingestion Provider
 *
 * All ingestion requests are routed through ApiIngestionProvider to ensure real profile extraction.
 * Fake/demo profile fallback generation has been removed.
 */

import { ProfileIngestionProvider, ProfileIngestionResult } from '../../types/ingestion';
import { ApiIngestionProvider } from './apiIngestionProvider';

export class DevIngestionProvider implements ProfileIngestionProvider {
  name = 'Real Extraction Ingestion Provider';
  private apiProvider = new ApiIngestionProvider();

  async importProfile(profileUrl: string, candidateName?: string): Promise<ProfileIngestionResult> {
    return this.apiProvider.importProfile(profileUrl, candidateName);
  }
}
