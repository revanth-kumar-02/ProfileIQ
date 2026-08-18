/**
 * ProfileIQ — Analysis Result Types
 *
 * These types define the structured data model for intelligence analysis results.
 * The UI must render these types dynamically; never hardcode individual findings in JSX.
 */

export type FindingCategory = 'strength' | 'developing' | 'missing' | 'warning';
export type ImpactLevel = 'high' | 'medium-high' | 'medium' | 'low';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type SectionStatus = 'Needs Attention' | 'Moderate' | 'Developing' | 'Strong Foundation' | 'High Opportunity';
export type SectionStatusType = 'error' | 'moderate' | 'developing' | 'strong' | 'opportunity';

export interface Finding {
  id: string;
  title: string;
  category: FindingCategory;
  explanation: string;
  evidence?: string[];
  whyItMatters?: string;
  recommendedAction?: string;
}

export interface PriorityRecommendation {
  id: string;
  rank: number;
  title: string;
  priority: PriorityLevel;
  impact: ImpactLevel;
  impactColor: 'violet' | 'secondary' | 'primary';
  expectedImpact: string;
  description: string;
  evidence?: string[];
  evidenceLabel?: string;
  evidenceValue?: string;
  expectedLabel?: string;
  expectedValue?: string;
  missingEvidenceTags?: string[];
  relatedSection: string;
  /** Key used to look up the OptimizationDetail for this recommendation */
  optimizationKey?: string;
}

export interface HeadlineOption {
  id: string;
  headlineText: string;
  bullets: string[];
}

export interface OptimizationFormula {
  targetDirection: string;
  technicalStrength: string;
  specialization: string;
}

export interface OptimizationDetail {
  key: string;
  badge: string;
  title: string;
  subtitle: string;
  currentValue: string;
  currentLabel: string;
  whyLimitingParagraphs: string[];
  formula: OptimizationFormula;
  generatedOptions: HeadlineOption[];
}

export interface SectionAnalysisResult {
  id: string;
  name: string;
  status: SectionStatus;
  statusType: SectionStatusType;
  whatWeFound: string;
  evidenceQuote: string;
  whyThisMatters: string;
  whatToDoNext: string;
  optimizationKey?: string;
}

export interface RoadmapStep {
  id: string;
  rank: number;
  title: string;
  description: string;
  phase: 'NOW' | 'NEXT' | 'REFINE';
  side: 'left' | 'right';
  optimizationKey?: string;
  completed?: boolean;
}

export interface AnalysisMetadata {
  analyzedAt: string;
  modelVersion?: string;
  benchmarkSize?: number;
}

export interface AnalysisResult {
  id: string;
  profileId?: string;
  targetRole: string;
  targetRoleId?: string;

  summary: string;
  analysisHeadline: string;
  executiveSummary: string;
  executiveInsight?: string;

  alignmentScore: number; // 0–100

  evidence: {
    strong: string[];
    developing: string[];
    missing: string[];
  };

  strengths: Finding[];
  developingAreas: Finding[];
  missingSignals: Finding[];

  priorities: PriorityRecommendation[];

  sectionAnalysis: SectionAnalysisResult[];

  roadmap: RoadmapStep[];

  optimizationDetails: Record<string, OptimizationDetail>;

  metadata: AnalysisMetadata;
}

/**
 * Application-level state for analysis lifecycle.
 */
export type AnalysisStatus =
  | 'idle'
  | 'no-profile'
  | 'profile-ready'
  | 'analyzing'
  | 'complete'
  | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
  /** Current step description during analysis (for the loading UI) */
  currentStage?: string;
}

/** The stages shown during the analysis loading experience */
export const ANALYSIS_STAGES = [
  'Analyzing profile clarity',
  'Evaluating professional evidence',
  'Comparing skills with target role',
  'Identifying missing signals',
  'Prioritizing improvements',
] as const;
