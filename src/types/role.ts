/**
 * ProfileIQ — Target Role Types
 *
 * These types define the data model for career target roles.
 * Role data must come from a centralized source; never hardcode role values in components.
 */

export interface TargetRole {
  id: string;
  title: string;
  category?: string;
  description?: string;
  expectedSkills: string[];
  importantKeywords: string[];
  evidenceSignals: string[];
}
