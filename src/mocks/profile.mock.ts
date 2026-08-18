/**
 * ProfileIQ — Profile Mock Data
 *
 * TEMPORARY DEVELOPMENT DATA — Replace with API response when backend is connected.
 *
 * These mock profiles represent what the profile acquisition service would return.
 * Components must never hardcode profile data inline; use this as the mock source.
 */

import { Profile } from '../types';

// Empty profile template — used for the "no profile" state
export const EMPTY_PROFILE: Profile = {
  source: 'linkedin',
  basic: {},
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

// Mock profile: Software engineering student targeting internship
export const MOCK_PROFILE_SWE_INTERN: Profile = {
  id: 'mock-profile-001',
  source: 'linkedin',
  basic: {
    fullName: 'Alex Chen',
    profileUrl: 'linkedin.com/in/alex-chen-swe',
    headline: 'Student | Developer',
    location: 'San Francisco, CA',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBuobs23FpWnLMrtJ9hU9k5J8AVSSZxfAY_m1pAAZEITz6LoWYBxKH3POKr5j3qB5DdKoZwF6RYrdSyy705t0iZ_7ZIRX6y6NfHuFaMzQaYShNgnBUiumUSpwt3VsPLcK4QakOZUZK6LNLLRFb9ek5So6QcpQSm061q9WgqBHT2yrpwyqxODcCUvjBkSMYAY2eia2Nw93MHIM0t15RFB3-baZGhbfHTp7H8yp30sY8XQD9inP0MmOtDQ',
  },
  about: 'Computer Science undergraduate with an interest in web development, machine learning algorithms, and building software applications.',
  experience: [
    {
      id: 'exp-001',
      company: 'State University',
      title: 'Undergraduate Teaching Assistant',
      startDate: 'Jan 2024',
      endDate: 'Present',
      bullets: [
        'Assisted professors in grading assignments and held weekly lab sessions for 40+ students in introductory Python.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-001',
      institution: 'State University',
      degree: 'B.Sc.',
      field: 'Computer Science',
      startDate: '2022',
      endDate: '2026',
    },
  ],
  skills: ['JavaScript', 'Python', 'HTML/CSS', 'Git', 'Problem Solving'],
  projects: [
    {
      id: 'proj-001',
      name: 'E-Commerce Web Application',
      description: 'E-Commerce Web Application built with React and Node.js for class final project.',
      technologies: ['React', 'Node.js'],
    },
  ],
};

// Mock profile: Marketing manager targeting Senior Product Manager
export const MOCK_PROFILE_PM: Profile = {
  id: 'mock-profile-002',
  source: 'linkedin',
  basic: {
    fullName: 'Sarah Jenkins',
    profileUrl: 'linkedin.com/in/sarah-jenkins-pm',
    headline: 'Senior Marketing Manager at Acme Corp | B2B & Digital Strategy',
    location: 'New York, NY',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGmWH2x9rv7ZU1KJonx_b2XfmRYJlPInZr5NNhMYAYsw-7Lfwbezx6B4hXSfR9wFo7irFl1OIX9aondkMocD22xFIblC9HkRVc4VoNO5N_FhHvVjSP4hmqNAEge3lljM5PnQmhKgbDNdBueFwvarRl6oEKK-gFM7s2ZiXN60xbd3IhpSSONeRudSixWjfbloIv1Q4Sx-8qHQtCpHN_brS5hWV_fYvv3hHzMyJPQ3dWg-JsHadbLgLbXQ',
  },
  about: 'Passionate marketing leader driving revenue growth across enterprise B2B SaaS accounts.',
  experience: [
    {
      id: 'exp-pm-001',
      company: 'Acme Corp',
      title: 'Senior Marketing Manager',
      startDate: 'Mar 2019',
      endDate: 'Present',
      bullets: [
        'Managed $1.2M marketing budget and grew pipeline by 35% YoY across 3 verticals.',
        'Led the new customer portal rollout across sales and marketing teams.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-pm-001',
      institution: 'Northwestern University',
      degree: 'MBA',
      field: 'Marketing & Strategy',
      endDate: '2019',
    },
  ],
  skills: ['Product Marketing', 'Digital Strategy', 'Market Research', 'Customer Journeys', 'Go-To-Market Strategy'],
  projects: [
    {
      id: 'proj-pm-001',
      name: 'Enterprise Self-Service Customer Portal',
      description: 'Led the new customer portal rollout across sales and marketing teams.',
    },
  ],
};

export const MOCK_PROFILES: Profile[] = [MOCK_PROFILE_SWE_INTERN, MOCK_PROFILE_PM];
