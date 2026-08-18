/**
 * ProfileIQ — Target Role Domain Model
 */

export interface TargetRole {
  id: string;
  title: string;
  category?: string;
  description?: string;
  expectedSkills?: string[];
  importantKeywords?: string[];
  evidenceSignals?: string[];
}
