import React, { useEffect, useState } from 'react';

interface AnalyzingViewProps {
  targetRole: string;
  userName: string;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  'Profile information prepared',
  'Analyzing profile clarity & tone',
  'Evaluating technical evidence',
  'Comparing skills with target role benchmarks',
  'Identifying missing recruiter signals',
  'Prioritizing high-impact improvements',
];

export const AnalyzingView: React.FC<AnalyzingViewProps> = ({
  targetRole,
  userName,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100);

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
          Evaluating {userName}'s Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Benchmarking evidence against recruiter signals for <strong className="text-[#004ac6]">{targetRole}</strong>.
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
        {ANALYSIS_STEPS.map((stepText, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

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
