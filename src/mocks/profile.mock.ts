/**
 * ProfileIQ — Profile Models
 *
 * Empty profile template for initial unpopulated state.
 */

import { Profile } from '../types';

export const EMPTY_PROFILE: Profile = {
  id: 'empty-profile',
  source: 'linkedin',
  basicInfo: {},
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export const MOCK_PROFILES: Profile[] = [];
