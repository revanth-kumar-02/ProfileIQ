/**
 * ProfileIQ — Ingestion & Extraction Architecture Types
 */

export type PageTypeClassification =
  | 'profile'
  | 'login'
  | 'auth_wall'
  | 'challenge'
  | 'blocked'
  | 'empty'
  | 'unknown';

export type ExtractionErrorCode =
  | 'PROFILE_NOT_PUBLIC'
  | 'PROFILE_LOGIN_REQUIRED'
  | 'PROFILE_ACCESS_BLOCKED'
  | 'PROFILE_DATA_NOT_AVAILABLE'
  | 'PROVIDER_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'INVALID_PROFILE_URL'
  | 'UNKNOWN_ERROR';

export interface RawExtractedProfile {
  rawUrl: string;
  name?: string;
  headline?: string;
  about?: string;
  locationName?: string;
  photoUrl?: string;
  workHistory?: {
    companyName?: string;
    jobTitle?: string;
    dates?: string;
    descriptionText?: string;
  }[];
  educationHistory?: {
    schoolName?: string;
    degreeName?: string;
    dates?: string;
  }[];
  extractedSkills?: string[];
  portfolioProjects?: {
    title?: string;
    summary?: string;
    tags?: string[];
  }[];
  certifications?: {
    name?: string;
    issuer?: string;
  }[];
}

export interface ExtractionDiagnostics {
  provider: string;
  providerAvailable?: boolean;
  configuredProvider?: string;
  fallbackAttempted?: boolean;
  httpStatus?: number;
  pageType: PageTypeClassification;
  redirectedUrl?: string;
  responseContentType?: string;
  responseLength?: number;
  recordsFound?: boolean;
  profileSignalsDetected: {
    name: boolean;
    headline: boolean;
    about: boolean;
    skillsCount: number;
    experienceCount: number;
    educationCount: number;
  };
}

export interface ExtractionResult {
  success: boolean;
  provider: string;
  data?: RawExtractedProfile;
  error?: {
    code: ExtractionErrorCode | string;
    message: string;
  };
  diagnostics?: ExtractionDiagnostics;
}

export interface ProfileExtractionProvider {
  id: string;
  name: string;
  isAvailable(): Promise<boolean>;
  extractProfile(profileUrl: string): Promise<ExtractionResult>;
}

export interface ProviderStatusData {
  available: boolean;
  providerConfigured: boolean;
  activeProvider: string;
  registeredProviders: {
    id: string;
    name: string;
    available: boolean;
  }[];
}
