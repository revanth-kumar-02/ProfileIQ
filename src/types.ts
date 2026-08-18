/**
 * ProfileIQ — Central Type Re-exports
 *
 * Import all types from here for convenience.
 * e.g. import { Profile, AnalysisResult, TargetRole } from '../types';
 */

// Core type exports
export type { Profile, ProfileSource, Experience, Education, Project, Certification } from './types/profile';
export type { AnalysisResult, AnalysisState, AnalysisStatus, AnalysisMetadata, Finding, FindingCategory, PriorityRecommendation, PriorityLevel, ImpactLevel, HeadlineOption, OptimizationDetail, OptimizationFormula, SectionAnalysisResult, SectionStatus, SectionStatusType, RoadmapStep } from './types/analysis';
export { ANALYSIS_STAGES } from './types/analysis';
export type { TargetRole } from './types/role';

/**
 * AppStep / ViewMode — controls which screen in the guided user flow is active.
 *
 * Guided Flow:
 * import -> profile-review -> target-role -> analyzing -> report -> refine
 */
export type ViewMode =
  | 'import'
  | 'profile-review'
  | 'target-role'
  | 'analyzing'
  | 'report'
  | 'refine';

export interface ImprovementItem {
  id: string;
  number: string;
  impact: 'High Impact' | 'Medium-High Impact' | 'Medium Impact';
  impactColor: 'violet' | 'secondary' | 'primary';
  title: string;
  description: string;
  evidenceLabel?: string;
  evidenceValue?: string;
  expectedLabel?: string;
  expectedValue?: string;
  missingEvidenceTags?: string[];
  optimizationKey?: string;
}

export interface SectionAnalysis {
  id: string;
  name: string;
  status: 'Needs Attention' | 'Moderate' | 'Developing' | 'Strong Foundation' | 'High Opportunity';
  statusType: 'error' | 'moderate' | 'developing' | 'strong' | 'opportunity';
  whatWeFound: string;
  evidenceQuote: string;
  whyThisMatters: string;
  whatToDoNext: string;
  optimizationKey?: string;
}

export interface RoadmapItem {
  number: string;
  title: string;
  description: string;
  phase: 'NOW' | 'NEXT' | 'REFINE';
  side: 'left' | 'right';
  optimizationKey?: string;
  completed?: boolean;
}

export interface GeneratedHeadlineOption {
  id: string;
  headlineText: string;
  bullets: string[];
}

export interface OptimizationDetailLegacy {
  key: string;
  badge: string;
  title: string;
  subtitle: string;
  currentValue: string;
  currentLabel: string;
  whyLimitingParagraphs: string[];
  formula: {
    targetDirection: string;
    technicalStrength: string;
    specialization: string;
  };
  generatedOptions: GeneratedHeadlineOption[];
}

export interface ProfileReport {
  id: string;
  url: string;
  userName: string;
  targetRole: string;
  avatarUrl: string;
  currentHeadline: string;
  analysisHeadline: string;
  executiveSummary: string;
  alignmentScore: number; // 0 to 100
  evidence: {
    strong: string[];
    developing: string[];
    missing: string[];
  };
  improvements: ImprovementItem[];
  sections: SectionAnalysis[];
  roadmap: RoadmapItem[];
  optimizationDetails: Record<string, OptimizationDetailLegacy>;
  analyzedAt: string;
}
