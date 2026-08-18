/**
 * ProfileIQ — Central Application Store
 *
 * Single source of truth for the active analysis journey.
 * Tracks:
 * - currentProfile: Normalized candidate profile
 * - selectedTargetRole: Target career role selected by user
 * - currentAnalysis: Dynamic intelligence report result
 * - importStatus, importError & importDiagnostics
 */

import { useState, useEffect } from 'react';
import { Profile } from '../types/profile';
import { TargetRole } from '../types/role';
import { ProfileAnalysis, AnalysisStatus } from '../types/analysis';
import { ImportStatus, IngestionDiagnostics } from '../types/ingestion';

export interface AppStoreState {
  currentProfile: Profile | null;
  selectedTargetRole: TargetRole | null;
  currentAnalysis: ProfileAnalysis | null;
  importStatus: ImportStatus;
  importError: string | null;
  importDiagnostics: IngestionDiagnostics | null;
  analysisStatus: AnalysisStatus;
  analysisError: string | null;
  analysisStageIndex: number;
}

const initialState: AppStoreState = {
  currentProfile: null,
  selectedTargetRole: null,
  currentAnalysis: null,
  importStatus: 'idle',
  importError: null,
  importDiagnostics: null,
  analysisStatus: 'idle',
  analysisError: null,
  analysisStageIndex: 0,
};

// Simple event listener store pattern to avoid unnecessary external dependencies
let currentState: AppStoreState = { ...initialState };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const analysisStore = {
  getState(): AppStoreState {
    return currentState;
  },

  setState(partial: Partial<AppStoreState>): void {
    currentState = { ...currentState, ...partial };
    notify();
  },

  reset(): void {
    currentState = { ...initialState };
    notify();
  },

  setCurrentProfile(profile: Profile | null, diagnostics: IngestionDiagnostics | null = null): void {
    this.setState({
      currentProfile: profile,
      importStatus: profile ? 'success' : 'idle',
      importError: null,
      importDiagnostics: diagnostics,
      analysisStatus: profile ? 'profile-ready' : 'idle',
    });
  },

  setSelectedTargetRole(role: TargetRole | null): void {
    this.setState({ selectedTargetRole: role });
  },

  setCurrentAnalysis(analysis: ProfileAnalysis | null): void {
    this.setState({
      currentAnalysis: analysis,
      analysisStatus: analysis ? 'complete' : 'idle',
      analysisError: null,
    });
  },

  setImportStatus(status: ImportStatus, error: string | null = null, diagnostics: IngestionDiagnostics | null = null): void {
    this.setState({ importStatus: status, importError: error, importDiagnostics: diagnostics });
  },

  setAnalysisStatus(status: AnalysisStatus, error: string | null = null): void {
    this.setState({ analysisStatus: status, analysisError: error });
  },

  setAnalysisStageIndex(index: number): void {
    this.setState({ analysisStageIndex: index });
  },

  updateProfileHeadline(newHeadline: string): void {
    if (!currentState.currentProfile) return;
    const updatedProfile: Profile = {
      ...currentState.currentProfile,
      basicInfo: {
        ...currentState.currentProfile.basicInfo,
        headline: newHeadline,
      },
      updatedAt: new Date().toISOString(),
    };
    this.setState({ currentProfile: updatedProfile });
  },
};

/**
 * Custom React hook for accessing and subscribing to central analysis store
 */
export function useAnalysisStore(): AppStoreState {
  const [state, setState] = useState<AppStoreState>(analysisStore.getState());

  useEffect(() => {
    const handleStoreChange = () => setState(analysisStore.getState());
    listeners.add(handleStoreChange);
    return () => {
      listeners.delete(handleStoreChange);
    };
  }, []);

  return state;
}
