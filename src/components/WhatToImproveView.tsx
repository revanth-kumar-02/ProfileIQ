import React from 'react';
import { ProfileReport, ViewMode } from '../types';

interface WhatToImproveViewProps {
  report: ProfileReport;
  onNavigate: (view: ViewMode) => void;
  onSelectOptimization: (key: string) => void;
}

export const WhatToImproveView: React.FC<WhatToImproveViewProps> = ({
  report,
  onNavigate,
  onSelectOptimization,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="space-y-1.5 border-b border-slate-200/80 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004ac6] border border-blue-100 text-[11px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px]">priority_high</span>
          <span>HIGH-LEVERAGE AUDIT PRIORITIES</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          What to Improve First
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          If you only address three aspects of your profile today, these recommendations yield the greatest increase in recruiter clarity and target-role relevance.
        </p>
      </div>

      {/* Strategic Ranked Priorities List (Whitespace & Dividers over Task Cards) */}
      <div className="space-y-8">
        {report.improvements.map((item, index) => {
          const isViolet = item.impactColor === 'violet';
          return (
            <div
              key={item.id}
              id={`improvement-item-${item.id}`}
              className="group space-y-4 pt-2 border-b border-slate-200/60 pb-8 last:border-b-0"
            >
              {/* Header row: Large Number + Title + Impact Tag */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-300 group-hover:text-[#004ac6] transition-colors font-mono">
                    {item.number}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#004ac6] transition-colors">
                    {item.title}
                  </h2>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start sm:self-auto ${
                    isViolet
                      ? 'bg-violet-100 text-violet-900 border border-violet-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  {item.impact}
                </span>
              </div>

              {/* Grid breakdown: Why this matters / Evidence / Expected Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pl-0 sm:pl-11">
                {/* Why this matters */}
                <div className="md:col-span-6 space-y-1">
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Why this matters
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Evidence / Expected Outcome box */}
                <div className="md:col-span-6 space-y-2">
                  {item.evidenceValue && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.evidenceLabel || 'Profile Evidence'}
                      </span>
                      <p className="font-mono text-xs font-semibold text-[#0F172A] italic">
                        {item.evidenceValue}
                      </p>
                    </div>
                  )}

                  {item.expectedValue && (
                    <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#004ac6]">
                        {item.expectedLabel || 'Expected Outcome'}
                      </span>
                      <p className="font-semibold text-[#004ac6]">
                        {item.expectedValue}
                      </p>
                    </div>
                  )}

                  {item.missingEvidenceTags && (
                    <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                        Missing Required Signals
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.missingEvidenceTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[11px] font-semibold bg-white text-rose-800 border border-rose-200 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="pl-0 sm:pl-11 pt-1">
                <button
                  onClick={() => {
                    const targetKey = item.optimizationKey || 'headline';
                    onSelectOptimization(targetKey);
                    onNavigate('optimization-detail');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004ac6] hover:text-[#003ea8] transition-colors group/btn"
                >
                  <span>Explore Recommendation & Optimization Strategy</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover/btn:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <h3 className="text-xs font-bold text-[#0F172A]">Looking for section-by-section audit proof?</h3>
          <p className="text-[11px] text-slate-500">Review detailed evidence across Headline, About, Experience, and Projects.</p>
        </div>
        <button
          id="btn-goto-sections-audit"
          onClick={() => onNavigate('sections')}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Section Audit Document</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
