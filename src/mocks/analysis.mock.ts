/**
 * ProfileIQ — Analysis Results Mock Data
 *
 * TEMPORARY DEVELOPMENT DATA — Replace with Groq Analysis Engine API responses when backend is connected.
 */

import { ProfileReport } from '../types';
import { defaultSoftwareEngineerReport, sampleProductManagerReport } from '../data/sampleProfiles';

export const MOCK_ANALYSIS_REPORTS: ProfileReport[] = [
  defaultSoftwareEngineerReport,
  sampleProductManagerReport,
];

export const getMockReportById = (id: string): ProfileReport | undefined => {
  return MOCK_ANALYSIS_REPORTS.find((r) => r.id === id);
};
