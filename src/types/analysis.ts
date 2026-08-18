/**
 * ProfileIQ — Analysis Result Types & Domain Model
 *
 * All report rendering, evidence breakdowns, strategic priorities, section audits,
 * and contextual optimizations are driven by this dynamic model.
 */

import { TargetRole } from './role';

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
  rank: string; // e.g. "01", "02"
  title: string;
  priority: PriorityLevel;
  impact: string; // e.g. "High Impact"
  impactColor: 'violet' | 'secondary' | 'primary';
  description: string;
  evidenceLabel?: string;
  evidenceValue?: string;
  expectedLabel?: string;
  expectedValue?: string;
  missingEvidenceTags?: string[];
  relatedSection: string;
  optimizationKey?: string;
}

export interface AlignmentDimension {
  name: string;
  status: string;
  score: number; // 0-100
  color: string;
}

export interface AlignmentAnalysis {
  status: 'strong' | 'developing' | 'limited';
  statusLabel: string; // e.g. "DEVELOPING ALIGNMENT"
  alignmentScore: number; // 0-100
  dimensions: AlignmentDimension[];
}

export interface SectionAnalysis {
  id: string;
  name: string;
  status: SectionStatus;
  statusType: SectionStatusType;
  whatWeFound: string;
  evidenceQuote?: string;
  whyThisMatters: string;
  whatToDoNext: string;
  optimizationKey?: string;
}

export interface RoadmapStage {
  id: string;
  rank: string;
  title: string;
  description: string;
  phase: 'NOW' | 'NEXT' | 'REFINE';
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

export interface ProfileAnalysis {
  id: string;
  profileId?: string;
  profileUrl?: string;
  userName?: string;

  targetRole: TargetRole;

  overallAssessment: {
    status: 'strong' | 'developing' | 'limited';
    summary: string;
  };

  analysisHeadline: string;
  executiveAssessment: string;

  alignment: AlignmentAnalysis;

  evidence: {
    strong: Finding[];
    developing: Finding[];
    missing: Finding[];
  };

  priorities: PriorityRecommendation[];

  sections: SectionAnalysis[];

  roadmap: RoadmapStage[];

  optimizationDetails: Record<string, OptimizationDetail>;

  analyzedAt: string;
}

export type AnalysisStatus =
  | 'idle'
  | 'no-profile'
  | 'profile-ready'
  | 'preparing'
  | 'analyzing'
  | 'complete'
  | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  analysis: ProfileAnalysis | null;
  error: string | null;
  currentStage?: string;
}

export const ANALYSIS_STAGES = [
  'Preparing profile data',
  'Evaluating profile clarity & narrative',
  'Analyzing technical evidence',
  'Comparing skills with target role criteria',
  'Identifying missing recruiter signals',
  'Prioritizing high-impact improvements',
] as const;
