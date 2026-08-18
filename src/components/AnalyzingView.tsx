import React, { useEffect, useState } from 'react';
import { ANALYSIS_STAGES } from '../types/analysis';
import { useAnalysisStore, analysisStore } from '../store/analysisStore';
import { AnalysisService } from '../services/analysis.service';

interface AnalyzingViewProps {
  onComplete: () => void;
}

export const AnalyzingView: React.FC<AnalyzingViewProps> = ({ onComplete }) => {
  const { currentProfile, selectedTargetRole, analysisStatus, analysisError } = useAnalysisStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const candidateName = currentProfile?.basicInfo.fullName || 'Candidate';
  const roleTitle = selectedTargetRole?.title || 'Target Role';

  useEffect(() => {
    if (!currentProfile || !selectedTargetRole) return;

    analysisStore.setAnalysisStatus('analyzing');

    // Smooth stage progress indicator
    const stageInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    // Trigger analysis service
    AnalysisService.analyzeProfile({
      profile: currentProfile,
      targetRole: selectedTargetRole,
    })
      .then((result) => {
        analysisStore.setCurrentAnalysis(result);
        setTimeout(() => {
          clearInterval(stageInterval);
          onComplete();
        }, 500);
      })
      .catch((err) => {
        clearInterval(stageInterval);
        const errorMsg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
        analysisStore.setAnalysisStatus('error', errorMsg);
      });

    return () => clearInterval(stageInterval);
  }, [currentProfile, selectedTargetRole, onComplete]);

  if (analysisStatus === 'error') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px]">warning</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#0F172A]">Analysis Failed</h2>
          <p className="text-xs text-slate-500">{analysisError || 'We couldn’t complete your analysis.'}</p>
        </div>
        <button
          onClick={() => {
            analysisStore.setAnalysisStatus('idle');
            window.location.reload();
          }}
          className="px-5 py-2.5 bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-2xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStepIndex + 1) / ANALYSIS_STAGES.length) * 100);

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-16 space-y-8 animate-in fade-in duration-200 text-center">
      {/* Animated Pulse Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#004ac6] to-[#7C3AED] text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[32px] animate-spin">
            sync
          </span>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Evaluating {candidateName}'s Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Benchmarking evidence against recruiter signals for <strong className="text-[#004ac6]">{roleTitle}</strong>.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden max-w-md mx-auto">
        <div
          className="bg-gradient-to-r from-[#004ac6] to-[#7C3AED] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Analysis Stages List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs text-left space-y-3 max-w-md mx-auto">
        {ANALYSIS_STAGES.map((stepText, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={stepText}
              className={`flex items-center gap-3 text-xs font-semibold transition-all ${
                isDone
                  ? 'text-emerald-700'
                  : isCurrent
                  ? 'text-[#004ac6] font-bold'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                {isDone ? (
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                ) : isCurrent ? (
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6] animate-spin">rotate_right</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
              </span>
              <span>{stepText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
