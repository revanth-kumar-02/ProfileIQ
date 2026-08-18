import { analysisRequestSchema } from '../../schemas/profile.schema.js';
import { normalizeProfileForAnalysis } from '../profile/profileNormalizer.service.js';
import { getRoleContext } from '../roles/roleContext.service.js';
import { analyzeWithGroq } from './groqAnalysis.service.js';
import { validateGroqAnalysis } from './analysisValidator.service.js';
import { normalizeAnalysisResult } from './analysisNormalizer.service.js';
import { ProfileAnalysis } from '../../types/analysis.types.js';
import { TargetRole } from '../../types/profile.types.js';

export class AnalysisOrchestratorService {
  static async runAnalysisPipeline(rawInput: unknown): Promise<ProfileAnalysis> {
    // 1. Request Validation
    const validation = analysisRequestSchema.safeParse(rawInput);
    if (!validation.success) {
      const issueSummary = validation.error.issues
        .map((i: { path: (string | number)[]; message: string }) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      throw new Error(`Invalid analysis request input: ${issueSummary}`);
    }

    const { profile: rawProfile, targetRole: rawTargetRole } = validation.data;

    // 2. Profile Normalization
    const normalizedProfile = normalizeProfileForAnalysis(rawProfile);

    // 3. Target Role Context Building
    const targetRole: TargetRole = {
      id: rawTargetRole.id || 'target-role',
      title: rawTargetRole.title || 'Target Role',
      category: rawTargetRole.category,
      description: rawTargetRole.description,
      expectedSkills: rawTargetRole.expectedSkills || [],
      importantKeywords: rawTargetRole.importantKeywords || [],
      evidenceSignals: rawTargetRole.evidenceSignals || [],
    };

    const roleContext = getRoleContext(targetRole);

    // 4. Groq Execution
    const rawGroqOutput = await analyzeWithGroq({
      profile: normalizedProfile,
      targetRole,
      roleContext,
    });

    // 5. Response Validation
    const groqValidation = validateGroqAnalysis(rawGroqOutput);
    if (!groqValidation.success || !groqValidation.data) {
      throw new Error(groqValidation.error || 'Failed to validate Groq response format');
    }

    // 6. Analysis Normalization
    const finalAnalysis = normalizeAnalysisResult({
      rawResponse: groqValidation.data,
      profile: normalizedProfile,
      targetRole,
    });

    return finalAnalysis;
  }
}
