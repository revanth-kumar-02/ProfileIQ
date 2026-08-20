import { RawExtractedProfile } from './types.js';

/**
 * PDL Response Mapper
 *
 * Dedicated mapper to convert People Data Labs Person Enrichment API responses
 * into ProfileIQ's RawExtractedProfile domain schema.
 *
 * Ensures PDL-specific response format does not leak into the rest of the application.
 */

function cleanString(val: unknown): string | undefined {
  if (typeof val === 'string' && val.trim().length > 0) {
    return val.trim();
  }
  return undefined;
}

function normalizeSkills(skills: unknown[]): string[] {
  if (!Array.isArray(skills)) return [];

  const seenLower = new Set<string>();
  const canonicalSkills: string[] = [];

  for (const rawSkill of skills) {
    let skillStr: string | undefined;
    if (typeof rawSkill === 'string') {
      skillStr = rawSkill.trim();
    } else if (rawSkill && typeof rawSkill === 'object' && 'name' in rawSkill) {
      skillStr = cleanString((rawSkill as { name?: string }).name);
    }

    if (skillStr) {
      const lower = skillStr.toLowerCase();
      if (!seenLower.has(lower)) {
        seenLower.add(lower);
        canonicalSkills.push(skillStr);
      }
    }
  }

  return canonicalSkills;
}

function formatDateRange(startDate?: unknown, endDate?: unknown, isCurrent?: boolean): string | undefined {
  const start = cleanString(startDate);
  const end = cleanString(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  } else if (start) {
    return isCurrent ? `${start} - Present` : start;
  } else if (end) {
    return end;
  }
  return undefined;
}

export function mapPDLResponseToRawProfile(
  linkedinUrl: string,
  pdlResponse: any
): RawExtractedProfile {
  const data = pdlResponse?.data || pdlResponse || {};

  // 1. Basic Info
  const fullName =
    cleanString(data.full_name) ||
    cleanString(data.name) ||
    [cleanString(data.first_name), cleanString(data.last_name)].filter(Boolean).join(' ') ||
    undefined;

  const headline =
    cleanString(data.headline) ||
    cleanString(data.job_title) ||
    (data.job_title && data.job_company_name
      ? `${data.job_title} at ${data.job_company_name}`
      : undefined);

  const about = cleanString(data.summary) || cleanString(data.bio) || undefined;

  let locationName = cleanString(data.location_name);
  if (!locationName && data.location) {
    if (typeof data.location === 'string') {
      locationName = cleanString(data.location);
    } else if (typeof data.location === 'object') {
      const parts = [
        cleanString(data.location.locality || data.location.city),
        cleanString(data.location.region || data.location.state),
        cleanString(data.location.country),
      ].filter(Boolean);
      if (parts.length > 0) {
        locationName = parts.join(', ');
      }
    }
  }

  const photoUrl = cleanString(data.photo) || cleanString(data.profile_pic_url) || cleanString(data.photo_url);

  // 2. Work History / Experience
  const rawExperience = Array.isArray(data.experience) ? data.experience : [];
  const workHistory = rawExperience
    .map((exp: any) => {
      let companyName: string | undefined;
      if (typeof exp.company === 'string') {
        companyName = cleanString(exp.company);
      } else if (exp.company && typeof exp.company === 'object') {
        companyName = cleanString(exp.company.name) || cleanString(exp.company.raw);
      }
      companyName = companyName || cleanString(exp.company_name);

      let jobTitle: string | undefined;
      if (typeof exp.title === 'string') {
        jobTitle = cleanString(exp.title);
      } else if (exp.title && typeof exp.title === 'object') {
        jobTitle = cleanString(exp.title.name) || cleanString(exp.title.raw);
      }
      jobTitle = jobTitle || cleanString(exp.job_title);

      const dates = formatDateRange(exp.start_date, exp.end_date, exp.is_primary);
      const descriptionText = cleanString(exp.summary) || cleanString(exp.description);

      if (!companyName && !jobTitle) return null;

      return {
        companyName,
        jobTitle,
        dates,
        descriptionText,
      };
    })
    .filter((w: any) => Boolean(w));

  // 3. Education
  const rawEducation = Array.isArray(data.education) ? data.education : [];
  const educationHistory = rawEducation
    .map((edu: any) => {
      let schoolName: string | undefined;
      if (typeof edu.school === 'string') {
        schoolName = cleanString(edu.school);
      } else if (edu.school && typeof edu.school === 'object') {
        schoolName = cleanString(edu.school.name) || cleanString(edu.school.raw);
      }
      schoolName = schoolName || cleanString(edu.school_name);

      let degreeName: string | undefined;
      const degreesStr = Array.isArray(edu.degrees)
        ? edu.degrees.map(cleanString).filter(Boolean).join(', ')
        : cleanString(edu.degree) || cleanString(edu.degree_name);
      const majorsStr = Array.isArray(edu.majors)
        ? edu.majors.map(cleanString).filter(Boolean).join(', ')
        : cleanString(edu.major) || cleanString(edu.field_of_study);

      if (degreesStr && majorsStr) {
        degreeName = `${degreesStr} in ${majorsStr}`;
      } else {
        degreeName = degreesStr || majorsStr;
      }

      const dates = formatDateRange(edu.start_date, edu.end_date);

      if (!schoolName && !degreeName) return null;

      return {
        schoolName,
        degreeName,
        dates,
      };
    })
    .filter((e: any) => Boolean(e));

  // 4. Skills (Deduplicated & Canonicalized)
  const extractedSkills = normalizeSkills(data.skills);

  // 5. Certifications
  const rawCertifications = Array.isArray(data.certifications) ? data.certifications : [];
  const certifications = rawCertifications
    .map((cert: any) => {
      const name = cleanString(cert.name) || cleanString(cert.title);
      const issuer = cleanString(cert.organization) || cleanString(cert.issuer) || cleanString(cert.authority);
      if (!name) return null;
      return { name, issuer };
    })
    .filter((c: any) => Boolean(c));

  return {
    rawUrl: linkedinUrl,
    name: fullName,
    headline,
    about,
    locationName,
    photoUrl,
    workHistory,
    educationHistory,
    extractedSkills,
    portfolioProjects: [],
    certifications,
  };
}
