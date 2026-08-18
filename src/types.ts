/**
 * ProfileIQ — Central Type Re-exports
 *
 * All components & services import domain types from here or direct modules in src/types/*.
 */

export type {
  Profile,
  ProfileSource,
  Experience,
  Education,
  Project,
  Certification,
  ProfileBasicInfo,
} from './types/profile';

export type { TargetRole } from './types/role';

export type {
  ProfileAnalysis,
  AlignmentAnalysis,
  AlignmentDimension,
  Finding,
  FindingCategory,
  PriorityRecommendation,
  SectionAnalysis,
  RoadmapStage,
  OptimizationDetail,
  OptimizationFormula,
  HeadlineOption,
  AnalysisStatus,
  AnalysisState,
} from './types/analysis';

export { ANALYSIS_STAGES } from './types/analysis';

export type {
  ImportStatus,
  ProfileIngestionResult,
  ProfileIngestionProvider,
  IngestionError,
  RawProviderProfileData,
} from './types/ingestion';

/**
 * AppStep / ViewMode — controls which screen in the guided user flow is active.
 */
export type ViewMode =
  | 'import'
  | 'profile-review'
  | 'target-role'
  | 'analyzing'
  | 'report'
  | 'refine';
