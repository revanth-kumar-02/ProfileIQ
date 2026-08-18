/**
 * ProfileIQ — Core Profile Types
 *
 * These types define the structured data model for a user's professional profile.
 * Components must consume these types; never hardcode profile values directly in JSX.
 */

export type ProfileSource = 'linkedin' | 'manual';

export interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string | 'Present';
  description?: string;
  bullets?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  activities?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  repoUrl?: string;
  bullets?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  issuedDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Profile {
  id?: string;
  source: ProfileSource;

  basic: {
    fullName?: string;
    profileUrl?: string;
    headline?: string;
    location?: string;
    avatarUrl?: string;
  };

  about?: string;

  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications?: Certification[];

  lastUpdated?: string;
}
