import { z } from 'zod';

export const findingSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  category: z.enum(['strength', 'developing', 'missing', 'warning']).optional().default('developing'),
  explanation: z.string(),
  evidence: z.array(z.string()).optional().default([]),
  whyItMatters: z.string().optional(),
  recommendedAction: z.string().optional(),
});

export const priorityRecommendationSchema = z.object({
  id: z.string().optional(),
  rank: z.union([z.string(), z.number()]).optional().default('01'),
  title: z.string(),
  priority: z.enum(['high', 'medium', 'low']).optional().default('high'),
  impact: z.string().optional().default('High Impact'),
  impactColor: z.enum(['violet', 'secondary', 'primary']).optional().default('violet'),
  description: z.string(),
  evidenceLabel: z.string().optional(),
  evidenceValue: z.string().optional(),
  expectedLabel: z.string().optional(),
  expectedValue: z.string().optional(),
  missingEvidenceTags: z.array(z.string()).optional().default([]),
  relatedSection: z.string().optional().default('headline'),
  optimizationKey: z.string().optional().default('headline'),
});

export const alignmentDimensionSchema = z.object({
  name: z.string(),
  status: z.string(),
  score: z.number().min(0).max(100),
  color: z.string().optional().default('bg-[#004ac6]'),
});

export const alignmentAnalysisSchema = z.object({
  status: z.enum(['strong', 'developing', 'limited']),
  statusLabel: z.string(),
  alignmentScore: z.number().min(0).max(100),
  dimensions: z.array(alignmentDimensionSchema),
});

export const sectionAnalysisSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['Needs Attention', 'Moderate', 'Developing', 'Strong Foundation', 'High Opportunity']),
  statusType: z.enum(['error', 'moderate', 'developing', 'strong', 'opportunity']),
  whatWeFound: z.string(),
  evidenceQuote: z.string().optional(),
  whyThisMatters: z.string(),
  whatToDoNext: z.string(),
  optimizationKey: z.string().optional(),
});

export const roadmapStageSchema = z.object({
  id: z.string(),
  rank: z.string(),
  title: z.string(),
  description: z.string(),
  phase: z.enum(['NOW', 'NEXT', 'REFINE']),
  optimizationKey: z.string().optional(),
});

export const headlineOptionSchema = z.object({
  id: z.string().optional(),
  headlineText: z.string(),
  bullets: z.array(z.string()),
});

export const optimizationFormulaSchema = z.object({
  targetDirection: z.string(),
  technicalStrength: z.string(),
  specialization: z.string(),
});

export const optimizationDetailSchema = z.object({
  key: z.string(),
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
  currentValue: z.string(),
  currentLabel: z.string(),
  whyLimitingParagraphs: z.array(z.string()),
  formula: optimizationFormulaSchema,
  generatedOptions: z.array(headlineOptionSchema),
});

export const rawGroqAnalysisResponseSchema = z.object({
  overallAssessment: z.object({
    status: z.enum(['strong', 'developing', 'limited']),
    summary: z.string(),
  }),
  analysisHeadline: z.string(),
  executiveAssessment: z.string(),
  alignment: alignmentAnalysisSchema,
  evidence: z.object({
    strong: z.array(findingSchema).default([]),
    developing: z.array(findingSchema).default([]),
    missing: z.array(findingSchema).default([]),
  }),
  priorities: z.array(priorityRecommendationSchema).default([]),
  sections: z.array(sectionAnalysisSchema).default([]),
  roadmap: z.array(roadmapStageSchema).default([]),
  optimizationDetails: z.record(optimizationDetailSchema).optional().default({}),
});

export type RawGroqAnalysisResponse = z.infer<typeof rawGroqAnalysisResponseSchema>;
