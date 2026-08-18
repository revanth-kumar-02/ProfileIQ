/**
 * ProfileIQ — Profile Mock Data
 *
 * Mock profiles representing what the profile acquisition service returns in development mode.
 */

import { Profile } from '../types';

export const EMPTY_PROFILE: Profile = {
  source: 'linkedin',
  basicInfo: {},
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export const MOCK_PROFILE_SWE_INTERN: Profile = {
  id: 'mock-profile-001',
  source: 'linkedin',
  basicInfo: {
    fullName: 'Sarah Connor',
    profileUrl: 'linkedin.com/in/sarah-connor',
    headline: 'Software Engineer & Full Stack Developer',
    location: 'San Francisco, CA',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=004ac6&color=fff&size=128',
  },
  about: 'Computer Science developer focused on web applications, scalable backend systems, and user-centric software engineering.',
  experience: [
    {
      id: 'exp-001',
      company: 'Tech Solutions Inc',
      title: 'Software Developer Intern',
      startDate: 'Jan 2024',
      endDate: 'Present',
      bullets: [
        'Developed full-stack web applications using React and TypeScript.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-001',
      institution: 'State University',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2021',
      endDate: '2025',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Python', 'Git', 'REST APIs', 'SQL'],
  projects: [
    {
      id: 'proj-001',
      name: 'Career Intelligence Application',
      description: 'Profile analysis engine assessing candidate readiness against recruiter standards.',
      technologies: ['React', 'TypeScript', 'TailwindCSS'],
    },
  ],
  certifications: [],
};

export const MOCK_PROFILES: Profile[] = [MOCK_PROFILE_SWE_INTERN];
