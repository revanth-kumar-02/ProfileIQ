/**
 * ProfileIQ — Profile Service
 *
 * API-ready service layer for fetching, importing, and updating user profile data.
 * Currently backed by development mock data. Swap out mock calls with HTTP/API requests in production.
 */

import { Profile } from '../types';
import { MOCK_PROFILES, MOCK_PROFILE_SWE_INTERN } from '../mocks/profile.mock';

export class ProfileService {
  /**
   * Import a profile by LinkedIn URL or manual input handle.
   */
  static async importProfile(url: string, fullName?: string): Promise<Profile> {
    // Simulated async API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      ...MOCK_PROFILE_SWE_INTERN,
      id: `profile-${Date.now()}`,
      source: 'linkedin',
      basic: {
        ...MOCK_PROFILE_SWE_INTERN.basic,
        profileUrl: url,
        fullName: fullName || MOCK_PROFILE_SWE_INTERN.basic.fullName,
      },
    };
  }

  /**
   * Retrieve active profile details by ID.
   */
  static async getProfile(profileId: string): Promise<Profile | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const found = MOCK_PROFILES.find((p) => p.id === profileId);
    return found || null;
  }

  /**
   * Update profile fields.
   */
  static async updateProfile(profile: Profile): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
  }
}
