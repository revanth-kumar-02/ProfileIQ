import React, { useState } from 'react';
import { ProfileImportService } from '../services/ingestion/profileImportService';
import { analysisStore, useAnalysisStore } from '../store/analysisStore';

interface ImportViewProps {
  onSuccess: () => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onSuccess }) => {
  const { importStatus, importError, importDiagnostics } = useAnalysisStore();

  const [profileUrl, setProfileUrl] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleImport = async (urlToImport: string, nameToUse?: string) => {
    setValidationError(null);
    const targetUrl = urlToImport.trim();

    if (!targetUrl) {
      setValidationError('Please enter a LinkedIn profile URL.');
      return;
    }

    // Basic frontend format check
    const isValidFormat =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(targetUrl) ||
      /^linkedin\.com\/in\/[\w-]+\/?$/i.test(targetUrl);

    if (!isValidFormat) {
      setValidationError('Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username).');
      return;
    }

    analysisStore.setImportStatus('validating');

    try {
      analysisStore.setImportStatus('importing');
      const result = await ProfileImportService.importProfile(targetUrl, nameToUse || candidateName);

      if (result.success && result.profile) {
        analysisStore.setCurrentProfile(result.profile, result.diagnostics);
        onSuccess();
      } else {
        const errorMsg = result.error?.message || "We couldn't extract public profile information from this LinkedIn URL.";
        analysisStore.setImportStatus('error', errorMsg, result.diagnostics);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during profile ingestion.';
      analysisStore.setImportStatus('error', errorMsg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleImport(profileUrl, candidateName);
  };

  const isProcessing = importStatus === 'validating' || importStatus === 'importing';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#004ac6] uppercase tracking-wider">
        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
        <span>Profile Ingestion</span>
      </div>

      {/* Main Headline */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
          Understand what your profile communicates.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Import your LinkedIn profile URL to extract real candidate signals, review your details, and analyze against target career standards.
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="space-y-2">
          <label htmlFor="linkedin-url-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            LinkedIn Profile URL
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
              link
            </span>
            <input
              id="linkedin-url-input"
              type="text"
              value={profileUrl}
              onChange={(e) => {
                setProfileUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="https://www.linkedin.com/in/username"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all disabled:opacity-60"
              disabled={isProcessing}
            />
          </div>
          {validationError && (
            <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              <span>{validationError}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="candidate-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Candidate Name (Optional)
          </label>
          <input
            id="candidate-name-input"
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="e.g. Alex Chen"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all disabled:opacity-60"
            disabled={isProcessing}
          />
        </div>

        {/* Global Ingestion Error Banner */}
        {importStatus === 'error' && importError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">
                warning
              </span>
              <div className="space-y-1">
                <span className="font-bold block text-rose-950 text-sm">Extraction Failed</span>
                <span className="leading-relaxed block">{importError}</span>
              </div>
            </div>

            {/* Development Diagnostics Accordion */}
            {importDiagnostics && (
              <div className="pt-2 border-t border-rose-200/70">
                <button
                  type="button"
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {showDiagnostics ? 'expand_less' : 'expand_more'}
                  </span>
                  <span>{showDiagnostics ? 'Hide Extraction Diagnostics' : 'Show Extraction Diagnostics (Dev Mode)'}</span>
                </button>

                {showDiagnostics && (
                  <div className="mt-2 p-3 bg-white/80 rounded-lg border border-rose-200 font-mono text-[11px] space-y-1 text-slate-700">
                    <div><strong>Provider:</strong> {importDiagnostics.provider}</div>
                    <div><strong>HTTP Status:</strong> {importDiagnostics.httpStatus ?? 'N/A'}</div>
                    <div><strong>Page Classification:</strong> <span className="font-bold text-rose-700">{importDiagnostics.pageType}</span></div>
                    <div><strong>Response Length:</strong> {importDiagnostics.responseLength ?? 0} bytes</div>
                    <div><strong>Signals Detected:</strong> Name ({String(importDiagnostics.profileSignalsDetected?.name)}), Headline ({String(importDiagnostics.profileSignalsDetected?.headline)}), Skills ({importDiagnostics.profileSignalsDetected?.skillsCount || 0}), Experience ({importDiagnostics.profileSignalsDetected?.experienceCount || 0})</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button
          id="btn-analyze-profile"
          type="submit"
          disabled={isProcessing}
          className="w-full py-3.5 bg-[#004ac6] hover:bg-[#003ea8] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              <span>
                {importStatus === 'validating'
                  ? 'Validating profile URL...'
                  : 'Importing your LinkedIn profile... This may take a moment.'}
              </span>
            </>
          ) : (
            <>
              <span>Import Profile</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
