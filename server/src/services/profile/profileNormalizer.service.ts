import { Profile, Experience, Education, Project, Certification } from '../../types/profile.types.js';
import { RawExtractedProfile } from '../ingestion/types.js';

export function normalizeRawExtractedProfile(raw: RawExtractedProfile): Profile {
  const profileUrl = raw.rawUrl?.trim() || undefined;

  const basicInfo = {
    fullName: raw.name?.trim() || undefined,
    headline: raw.headline?.trim() || undefined,
    location: raw.locationName?.trim() || undefined,
    profileImageUrl: raw.photoUrl?.trim() || undefined,
    profileUrl,
  };

  const experience: Experience[] = (raw.workHistory || [])
    .filter((w) => w && (w.companyName || w.jobTitle))
    .map((w, idx) => ({
      id: `exp-${idx + 1}`,
      company: w.companyName?.trim() || 'Company',
      title: w.jobTitle?.trim() || 'Role',
      startDate: w.dates?.split('-')[0]?.trim(),
      endDate: w.dates?.split('-')[1]?.trim() || 'Present',
      description: w.descriptionText?.trim() || undefined,
      bullets: [],
    }));

  const education: Education[] = (raw.educationHistory || [])
    .filter((e) => e && (e.schoolName || e.degreeName))
    .map((e, idx) => ({
      id: `edu-${idx + 1}`,
      institution: e.schoolName?.trim() || 'Institution',
      degree: e.degreeName?.trim() || undefined,
      startDate: e.dates?.split('-')[0]?.trim(),
      endDate: e.dates?.split('-')[1]?.trim(),
    }));

  const skills: string[] = Array.from(
    new Set((raw.extractedSkills || []).map((s) => s.trim()).filter(Boolean))
  );

  const projects: Project[] = (raw.portfolioProjects || [])
    .filter((p) => p && p.title)
    .map((p, idx) => ({
      id: `proj-${idx + 1}`,
      name: p.title?.trim() || 'Project',
      description: p.summary?.trim() || undefined,
      technologies: (p.tags || []).map((t) => t.trim()).filter(Boolean),
    }));

  const certifications: Certification[] = (raw.certifications || [])
    .filter((c) => c && c.name)
    .map((c, idx) => ({
      id: `cert-${idx + 1}`,
      name: c.name?.trim() || 'Certification',
      issuer: c.issuer?.trim() || undefined,
    }));

  return {
    id: `profile-${Date.now()}`,
    source: 'linkedin',
    profileUrl,
    basicInfo,
    about: raw.about?.trim() || undefined,
    experience,
    education,
    skills,
    projects,
    certifications,
    importedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeProfileForAnalysis(rawProfile: any): Profile {
  if (rawProfile && rawProfile.rawUrl) {
    return normalizeRawExtractedProfile(rawProfile);
  }

  const basicInfo = {
    fullName: rawProfile?.basicInfo?.fullName?.trim() || undefined,
    headline: rawProfile?.basicInfo?.headline?.trim() || undefined,
    location: rawProfile?.basicInfo?.location?.trim() || undefined,
    profileImageUrl: rawProfile?.basicInfo?.profileImageUrl?.trim() || undefined,
    profileUrl: rawProfile?.basicInfo?.profileUrl?.trim() || rawProfile?.profileUrl?.trim() || undefined,
  };

  const experience: Experience[] = (rawProfile?.experience || [])
    .filter((exp: any) => exp && (exp.company || exp.title))
    .map((exp: any, idx: number) => ({
      id: exp.id || `exp-${idx + 1}`,
      company: exp.company?.trim() || 'Company',
      title: exp.title?.trim() || 'Role',
      location: exp.location?.trim() || undefined,
      startDate: exp.startDate?.trim() || undefined,
      endDate: exp.endDate?.trim() || undefined,
      description: exp.description?.trim() || undefined,
      bullets: (exp.bullets || []).map((b: any) => String(b).trim()).filter(Boolean),
    }));

  const education: Education[] = (rawProfile?.education || [])
    .filter((edu: any) => edu && edu.institution)
    .map((edu: any, idx: number) => ({
      id: edu.id || `edu-${idx + 1}`,
      institution: edu.institution?.trim() || 'Institution',
      degree: edu.degree?.trim() || undefined,
      field: edu.field?.trim() || undefined,
      startDate: edu.startDate?.trim() || undefined,
      endDate: edu.endDate?.trim() || undefined,
      gpa: edu.gpa?.trim() || undefined,
      activities: (edu.activities || []).map((a: any) => String(a).trim()).filter(Boolean),
    }));

  const skills: string[] = Array.from(
    new Set(
      (rawProfile?.skills || [])
        .map((s: any) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean)
    )
  );

  const projects: Project[] = (rawProfile?.projects || [])
    .filter((p: any) => p && p.name)
    .map((p: any, idx: number) => ({
      id: p.id || `proj-${idx + 1}`,
      name: p.name?.trim() || 'Project',
      description: p.description?.trim() || undefined,
      technologies: (p.technologies || []).map((t: any) => String(t).trim()).filter(Boolean),
      url: p.url?.trim() || undefined,
      repoUrl: p.repoUrl?.trim() || undefined,
      bullets: (p.bullets || []).map((b: any) => String(b).trim()).filter(Boolean),
    }));

  const certifications: Certification[] = (rawProfile?.certifications || [])
    .filter((c: any) => c && c.name)
    .map((c: any, idx: number) => ({
      id: c.id || `cert-${idx + 1}`,
      name: c.name?.trim() || 'Certification',
      issuer: c.issuer?.trim() || undefined,
      issuedDate: c.issuedDate?.trim() || undefined,
      expiryDate: c.expiryDate?.trim() || undefined,
      credentialUrl: c.credentialUrl?.trim() || undefined,
    }));

  return {
    id: rawProfile?.id || `profile-${Date.now()}`,
    source: rawProfile?.source || 'linkedin',
    profileUrl: basicInfo.profileUrl,
    basicInfo,
    about: rawProfile?.about?.trim() || undefined,
    experience,
    education,
    skills,
    projects,
    certifications,
    importedAt: rawProfile?.importedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
