/**
 * ProfileIQ — Profile Service
 *
 * Service layer for fetching, importing, and updating profile data using ProfileImportService.
 */

import { Profile } from '../types/profile';
import { ProfileImportService } from './ingestion/profileImportService';

export class ProfileService {
  /**
   * Import a profile by LinkedIn URL or manual input handle.
   */
  static async importProfile(url: string, fullName?: string): Promise<Profile> {
    const result = await ProfileImportService.importProfile(url, fullName);
    if (!result.success || !result.profile) {
      throw new Error(result.error?.message || 'Failed to import profile');
    }
    return result.profile;
  }

  /**
   * Update profile fields.
   */
  static async updateProfile(profile: Profile): Promise<Profile> {
    return {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
  }
}
