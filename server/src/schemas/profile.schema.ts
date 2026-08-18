import { z } from 'zod';

export const experienceSchema = z.object({
  id: z.string().optional().default(''),
  company: z.string().optional().default(''),
  title: z.string().optional().default(''),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional().default([]),
});

export const educationSchema = z.object({
  id: z.string().optional().default(''),
  institution: z.string().optional().default(''),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  activities: z.array(z.string()).optional().default([]),
});

export const projectSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string().optional().default(''),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional().default([]),
  url: z.string().optional(),
  repoUrl: z.string().optional(),
  bullets: z.array(z.string()).optional().default([]),
});

export const certificationSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string().optional().default(''),
  issuer: z.string().optional(),
  issuedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export const profileBasicInfoSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  profileImageUrl: z.string().optional(),
  profileUrl: z.string().optional(),
});

export const profileSchema = z.object({
  id: z.string().optional(),
  source: z.string().optional(),
  profileUrl: z.string().optional(),
  basicInfo: profileBasicInfoSchema.optional().default({}),
  about: z.string().optional(),
  experience: z.array(experienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  certifications: z.array(certificationSchema).optional().default([]),
  importedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const targetRoleSchema = z.object({
  id: z.string().optional().default('custom-role'),
  title: z.string().min(1, 'Target role title is required'),
  category: z.string().optional(),
  description: z.string().optional(),
  expectedSkills: z.array(z.string()).optional().default([]),
  importantKeywords: z.array(z.string()).optional().default([]),
  evidenceSignals: z.array(z.string()).optional().default([]),
});

export const analysisRequestSchema = z.object({
  profile: profileSchema,
  targetRole: targetRoleSchema,
});

export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
