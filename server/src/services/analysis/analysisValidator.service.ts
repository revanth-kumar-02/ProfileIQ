import { rawGroqAnalysisResponseSchema, RawGroqAnalysisResponse } from '../../schemas/analysis.schema.js';

export interface ValidationResult {
  success: boolean;
  data?: RawGroqAnalysisResponse;
  error?: string;
}

export function validateGroqAnalysis(rawOutput: unknown): ValidationResult {
  const parseResult = rawGroqAnalysisResponseSchema.safeParse(rawOutput);

  if (parseResult.success) {
    return {
      success: true,
      data: parseResult.data,
    };
  }

  const issueSummaries = parseResult.error.issues
    .map((issue: { path: (string | number)[]; message: string }) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');

  console.warn('[AnalysisValidator] Validation issues detected in Groq response:', issueSummaries);

  return {
    success: false,
    error: `Groq analysis response schema mismatch: ${issueSummaries}`,
  };
}
