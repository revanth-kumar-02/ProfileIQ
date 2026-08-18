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

export interface ProfileBasicInfo {
  fullName?: string;
  headline?: string;
  location?: string;
  profileImageUrl?: string;
  profileUrl?: string;
}

export interface Profile {
  id?: string;
  source?: string;
  profileUrl?: string;
  basicInfo: ProfileBasicInfo;
  about?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  importedAt?: string;
  updatedAt?: string;
}

export interface TargetRole {
  id: string;
  title: string;
  category?: string;
  description?: string;
  expectedSkills?: string[];
  importantKeywords?: string[];
  evidenceSignals?: string[];
}
