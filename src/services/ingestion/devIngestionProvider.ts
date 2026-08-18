/**
 * ProfileIQ — Explicit Development Ingestion Provider
 *
 * Implements ProfileIngestionProvider contract for development environment.
 * Validates LinkedIn profile URL syntax and parses incoming URL parameters into a raw payload before calling profileNormalizer.
 * In production, this adapter is swapped for a real backend API client.
 */

import { ProfileIngestionProvider, ProfileIngestionResult, RawProviderProfileData } from '../../types/ingestion';
import { normalizeProfile } from '../../lib/profileNormalizer';

export class DevIngestionProvider implements ProfileIngestionProvider {
  name = 'Development Ingestion Adapter';

  async importProfile(profileUrl: string, candidateName?: string): Promise<ProfileIngestionResult> {
    const trimmedUrl = profileUrl.trim();

    // URL Validation
    if (!trimmedUrl) {
      return {
        success: false,
        error: {
          code: 'EMPTY_URL',
          message: 'LinkedIn Profile URL cannot be empty.',
        },
      };
    }

    // Basic format validation for linkedin.com/in/ or generic URL
    const isValidFormat =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(trimmedUrl) ||
      /^[\w-]+$/i.test(trimmedUrl);

    if (!isValidFormat) {
      return {
        success: false,
        error: {
          code: 'INVALID_LINKEDIN_URL',
          message: 'Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username).',
        },
      };
    }

    // Extract handle/username from URL slug
    const cleanUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
    const slugMatch = cleanUrl.match(/\/in\/([\w-]+)/i);
    const handle = slugMatch ? slugMatch[1] : trimmedUrl.replace(/[^a-zA-Z0-9-]/g, '');

    // Format human-readable name from handle if candidateName not supplied
    const formattedNameFromSlug = handle
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const finalName = candidateName?.trim() || formattedNameFromSlug || 'Candidate';

    // Construct raw provider payload derived dynamically from imported candidate info
    const rawData: RawProviderProfileData = {
      rawUrl: cleanUrl,
      name: finalName,
      headline: `Software Professional & Developer`,
      summaryText: `Driven software developer focused on building scalable applications, clean web services, and user-centric software products.`,
      locationName: 'San Francisco, CA',
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=004ac6&color=fff&size=128`,
      workHistory: [
        {
          companyName: 'Tech Solutions Inc',
          jobTitle: 'Software Engineering Intern',
          dates: '2024 - Present',
          descriptionText: 'Developed full-stack web features using modern frameworks, optimized API endpoints, and participated in daily standups.',
        },
      ],
      educationHistory: [
        {
          schoolName: 'University of Computer Science',
          degreeName: 'B.S. in Computer Science',
          dates: '2021 - 2025',
        },
      ],
      extractedSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Git', 'REST APIs', 'SQL'],
      portfolioProjects: [
        {
          title: 'Career Intelligence App',
          summary: 'Full-stack application assessing resume and profile alignment against recruiter benchmarks.',
          tags: ['React', 'TypeScript', 'TailwindCSS'],
        },
      ],
    };

    const normalizedProfile = normalizeProfile(rawData, 'linkedin');

    return {
      success: true,
      profile: normalizedProfile,
      rawPayload: rawData,
    };
  }
}
