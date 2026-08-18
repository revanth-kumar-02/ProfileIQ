import { RawGroqAnalysisResponse } from '../../schemas/analysis.schema.js';
import { ProfileAnalysis, SectionAnalysis, RoadmapStage, Finding, PriorityRecommendation, OptimizationDetail } from '../../types/analysis.types.js';
import { Profile, TargetRole } from '../../types/profile.types.js';

export function normalizeAnalysisResult(params: {
  rawResponse: RawGroqAnalysisResponse;
  profile: Profile;
  targetRole: TargetRole;
}): ProfileAnalysis {
  const { rawResponse, profile, targetRole } = params;

  const profileUrl = profile.basicInfo?.profileUrl || profile.profileUrl || 'linkedin.com/in/candidate';
  const userName = profile.basicInfo?.fullName || 'Candidate';

  // Normalize Evidence Findings
  const normalizeFinding = (f: Partial<Finding>, prefix: string, idx: number): Finding => ({
    id: f.id || `${prefix}-${idx + 1}`,
    title: f.title || 'Signal Finding',
    category: f.category || (prefix === 'str' ? 'strength' : prefix === 'dev' ? 'developing' : 'missing'),
    explanation: f.explanation || 'Not demonstrated in the provided profile.',
    evidence: (f.evidence || []).map((e: string) => e.trim()).filter(Boolean),
    whyItMatters: f.whyItMatters || undefined,
    recommendedAction: f.recommendedAction || undefined,
  });

  const strong = (rawResponse.evidence?.strong || []).map((f, i) => normalizeFinding(f, 'str', i));
  const developing = (rawResponse.evidence?.developing || []).map((f, i) => normalizeFinding(f, 'dev', i));
  const missing = (rawResponse.evidence?.missing || []).map((f, i) => normalizeFinding(f, 'miss', i));

  // Normalize Priorities and Sort by Rank
  const priorities: PriorityRecommendation[] = (rawResponse.priorities || [])
    .map((p, idx) => {
      const rankNum = String(idx + 1).padStart(2, '0');
      const rankVal = p.rank !== undefined ? String(p.rank) : rankNum;
      return {
        id: p.id || `imp-${rankNum}`,
        rank: rankVal.padStart(2, '0'),
        title: p.title || `Priority ${rankNum}`,
        priority: (p.priority as 'high' | 'medium' | 'low') || 'high',
        impact: p.impact || 'High Impact',
        impactColor: (p.impactColor as 'violet' | 'secondary' | 'primary') || 'violet',
        description: p.description || 'Improve evidence clarity for recruiters.',
        evidenceLabel: p.evidenceLabel || 'CURRENT EVIDENCE',
        evidenceValue: p.evidenceValue || 'General descriptor',
        expectedLabel: p.expectedLabel || 'EXPECTED IMPROVEMENT',
        expectedValue: p.expectedValue || 'Target role alignment',
        missingEvidenceTags: (p.missingEvidenceTags || []).filter(Boolean),
        relatedSection: p.relatedSection || 'headline',
        optimizationKey: p.optimizationKey || p.relatedSection || 'headline',
      };
    })
    .sort((a: PriorityRecommendation, b: PriorityRecommendation) => parseInt(a.rank, 10) - parseInt(b.rank, 10));

  // Ensure mandatory 5 sections exist
  const standardSections = ['headline', 'about', 'experience', 'skills', 'projects'];
  const rawSectionsMap = new Map<string, Partial<SectionAnalysis>>();
  (rawResponse.sections || []).forEach((sec) => {
    if (sec && sec.id) {
      rawSectionsMap.set(sec.id.toLowerCase(), sec);
    }
  });

  const sections: SectionAnalysis[] = standardSections.map((secId) => {
    const existing = rawSectionsMap.get(secId);
    const capitalName = secId.charAt(0).toUpperCase() + secId.slice(1);
    return {
      id: secId,
      name: existing?.name || capitalName,
      status: existing?.status || 'Moderate',
      statusType: existing?.statusType || 'moderate',
      whatWeFound: existing?.whatWeFound || `Section evaluation completed for ${capitalName}.`,
      evidenceQuote: existing?.evidenceQuote || undefined,
      whyThisMatters: existing?.whyThisMatters || `${capitalName} provides vital signal to recruiters and search algorithms.`,
      whatToDoNext: existing?.whatToDoNext || `Refine ${capitalName} to highlight key competencies.`,
      optimizationKey: existing?.optimizationKey || secId,
    };
  });

  // Normalize Roadmap
  const roadmap: RoadmapStage[] = (rawResponse.roadmap || []).map((stage, idx) => {
    const rankNum = String(idx + 1).padStart(2, '0');
    return {
      id: stage.id || `road-${rankNum}`,
      rank: String(stage.rank || rankNum).padStart(2, '0'),
      title: stage.title || `Stage ${rankNum}`,
      description: stage.description || 'Optimize key signals',
      phase: stage.phase || (idx < 2 ? 'NOW' : idx < 4 ? 'NEXT' : 'REFINE'),
      optimizationKey: stage.optimizationKey || 'headline',
    };
  });

  // Normalize Optimization Details
  const optimizationDetails: Record<string, OptimizationDetail> = {};
  if (rawResponse.optimizationDetails) {
    Object.entries(rawResponse.optimizationDetails).forEach(([k, opt]) => {
      optimizationDetails[k] = {
        key: opt.key || k,
        badge: opt.badge || 'OPTIMIZATION DETAIL',
        title: opt.title || 'Section Optimization',
        subtitle: opt.subtitle || 'Improve content clarity for recruiters.',
        currentValue: opt.currentValue || '',
        currentLabel: opt.currentLabel || 'CURRENT STATE',
        whyLimitingParagraphs: opt.whyLimitingParagraphs || [],
        formula: {
          targetDirection: opt.formula?.targetDirection || targetRole.title,
          technicalStrength: opt.formula?.technicalStrength || 'Key Skills',
          specialization: opt.formula?.specialization || 'Core Impact',
        },
        generatedOptions: (opt.generatedOptions || []).map((gOpt, idx) => ({
          id: gOpt.id || `opt-${k}-${idx + 1}`,
          headlineText: gOpt.headlineText || '',
          bullets: gOpt.bullets || [],
        })),
      };
    });
  }

  return {
    id: `analysis-${Date.now()}`,
    profileId: profile.id,
    profileUrl,
    userName,
    targetRole,
    overallAssessment: {
      status: rawResponse.overallAssessment?.status || 'developing',
      summary: rawResponse.overallAssessment?.summary || 'Profile evaluation complete.',
    },
    analysisHeadline: rawResponse.analysisHeadline || 'ProfileIQ Assessment Complete',
    executiveAssessment: rawResponse.executiveAssessment || 'Profile evaluation completed.',
    alignment: {
      status: rawResponse.alignment?.status || 'developing',
      statusLabel: rawResponse.alignment?.statusLabel || 'DEVELOPING ALIGNMENT',
      alignmentScore: typeof rawResponse.alignment?.alignmentScore === 'number' ? rawResponse.alignment.alignmentScore : 65,
      dimensions: (rawResponse.alignment?.dimensions || []).map((d) => ({
        name: d.name,
        status: d.status,
        score: typeof d.score === 'number' ? d.score : 60,
        color: d.color || 'bg-[#004ac6]',
      })),
    },
    evidence: {
      strong,
      developing,
      missing,
    },
    priorities,
    sections,
    roadmap,
    optimizationDetails,
    analyzedAt: new Date().toISOString(),
  };
}
