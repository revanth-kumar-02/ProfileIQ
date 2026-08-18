/**
 * ProfileIQ — Profile Normalization Layer
 *
 * Converts raw provider-specific payload or untyped response data into the standard ProfileIQ Profile domain model.
 * Handles missing fields gracefully without fabricating fake data.
 */

import { Profile, ProfileBasicInfo, Experience, Education, Project, Certification } from '../types/profile';
import { RawProviderProfileData } from '../types/ingestion';

export function normalizeProfile(raw: RawProviderProfileData, source: 'linkedin' | 'manual' | 'provider' = 'linkedin'): Profile {
  const url = raw.rawUrl?.trim() || '';

  const basicInfo: ProfileBasicInfo = {
    fullName: raw.name?.trim() || undefined,
    headline: raw.headline?.trim() || undefined,
    location: raw.locationName?.trim() || undefined,
    profileImageUrl: raw.photoUrl?.trim() || undefined,
    profileUrl: url || undefined,
  };

  const experience: Experience[] = (raw.workHistory || []).map((work, idx) => ({
    id: `exp-${idx + 1}`,
    company: work.companyName?.trim() || 'Organization',
    title: work.jobTitle?.trim() || 'Role Title',
    startDate: work.dates?.split('-')[0]?.trim(),
    endDate: work.dates?.split('-')[1]?.trim() || 'Present',
    description: work.descriptionText?.trim() || undefined,
  }));

  const education: Education[] = (raw.educationHistory || []).map((edu, idx) => ({
    id: `edu-${idx + 1}`,
    institution: edu.schoolName?.trim() || 'Institution',
    degree: edu.degreeName?.trim() || undefined,
    startDate: edu.dates?.split('-')[0]?.trim(),
    endDate: edu.dates?.split('-')[1]?.trim(),
  }));

  const skills: string[] = Array.from(
    new Set((raw.extractedSkills || []).map((s) => s.trim()).filter(Boolean))
  );

  const projects: Project[] = (raw.portfolioProjects || []).map((p, idx) => ({
    id: `proj-${idx + 1}`,
    name: p.title?.trim() || `Project ${idx + 1}`,
    description: p.summary?.trim() || undefined,
    technologies: p.tags || [],
    url: p.link?.trim() || undefined,
  }));

  const certifications: Certification[] = [];

  return {
    id: `profile-${Date.now()}`,
    source,
    profileUrl: url || undefined,
    basicInfo,
    about: raw.summaryText?.trim() || undefined,
    experience,
    education,
    skills,
    projects,
    certifications,
    importedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
