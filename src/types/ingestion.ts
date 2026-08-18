/**
 * ProfileIQ — Ingestion Contract Types
 *
 * Defines the provider-independent abstraction for importing and normalizing profile data.
 */

import { Profile } from './profile';

export type ImportStatus =
  | 'idle'
  | 'validating'
  | 'importing'
  | 'success'
  | 'error';

export interface IngestionError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ProfileIngestionResult {
  success: boolean;
  profile?: Profile;
  error?: IngestionError;
  rawPayload?: unknown;
}

export interface ProfileIngestionProvider {
  name: string;
  importProfile(profileUrl: string, candidateName?: string): Promise<ProfileIngestionResult>;
}

/**
 * Interface representing potential raw response structure from external scraping / provider API.
 */
export interface RawProviderProfileData {
  rawUrl?: string;
  name?: string;
  headline?: string;
  summaryText?: string;
  locationName?: string;
  photoUrl?: string;
  workHistory?: Array<{
    companyName?: string;
    jobTitle?: string;
    dates?: string;
    descriptionText?: string;
  }>;
  educationHistory?: Array<{
    schoolName?: string;
    degreeName?: string;
    dates?: string;
  }>;
  extractedSkills?: string[];
  portfolioProjects?: Array<{
    title?: string;
    summary?: string;
    tags?: string[];
    link?: string;
  }>;
}
