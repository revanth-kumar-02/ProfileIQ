import React, { useState } from 'react';
import { ProfileReport, ViewMode } from '../types';

interface OptimizationDetailViewProps {
  report: ProfileReport;
  optimizationKey: string;
  onNavigate: (view: ViewMode) => void;
  onUpdateHeadline: (newHeadline: string) => void;
}

export const OptimizationDetailView: React.FC<OptimizationDetailViewProps> = ({
  report,
  optimizationKey,
  onNavigate,
  onUpdateHeadline,
}) => {
  const detail = report.optimizationDetails[optimizationKey] || report.optimizationDetails['headline'];

  // State for interactive actions
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  // Custom formula state
  const [customTarget, setCustomTarget] = useState(detail.formula.targetDirection.replace(/"/g, ''));
  const [customTech, setCustomTech] = useState(detail.formula.technicalStrength.replace(/"/g, ''));
  const [customSpec, setCustomSpec] = useState(detail.formula.specialization.replace(/"/g, ''));
  const [customPreview, setCustomPreview] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApply = (id: string, text: string) => {
    onUpdateHeadline(text);
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 3000);
  };

  const handleBuildCustom = () => {
    const combined = `${customTarget} | ${customTech} | ${customSpec}`;
    setCustomPreview(combined);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Back to Priorities */}
      <div>
        <button
          id="back-to-recommendations-btn"
          onClick={() => onNavigate('what-to-improve')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#004ac6] transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          <span>Back to Prioritized Actions</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1 border-b border-slate-200/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px] text-[#004ac6]">auto_fix_high</span>
          <span>OPTIMIZATION STUDIO</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {detail.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          {detail.subtitle} Target Role: <strong className="text-[#004ac6]">{report.targetRole}</strong>
        </p>
      </div>

      {/* 1. CURRENT PROFILE CONTENT & ANALYSIS RATIONALE */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {detail.currentLabel || 'CURRENT PROFILE CONTENT'}
          </span>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-xs sm:text-sm font-bold text-[#0F172A]">
            {detail.currentValue}
          </div>
        </div>

        {/* What the Analysis Found & Why it is limiting */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h2 className="text-xs uppercase font-bold tracking-wider text-rose-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">error</span>
            <span>Analysis Finding & Constraints</span>
          </h2>
          <div className="space-y-2">
            {detail.whyLimitingParagraphs.map((paragraph, index) => (
              <p key={index} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RECOMMENDED STRATEGY / VALUE ARCHITECTURE */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#004ac6]">
            RECOMMENDED STRATEGY
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
            High-Signal Value Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1. Target Direction
            </div>
            <div className="text-xs font-semibold text-[#0F172A] font-mono">
              {detail.formula.targetDirection}
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-center space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#004ac6]">
              2. Core Technical Capability
            </div>
            <div className="text-xs font-semibold text-[#00174b] font-mono">
              {detail.formula.technicalStrength}
            </div>
          </div>

          <div className="p-3 bg-violet-50/70 rounded-lg border border-violet-100 text-center space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-800">
              3. Relevant Specialization
            </div>
            <div className="text-xs font-semibold text-violet-950 font-mono">
              {detail.formula.specialization}
            </div>
          </div>
        </div>
      </div>

      {/* 3. OPTIONAL OPTIMIZED VERSIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
            Optimization Options
          </h2>
          <span className="text-xs text-slate-400">Grounded in audit findings</span>
        </div>

        <div className="space-y-3">
          {detail.generatedOptions.map((option, index) => {
            const isCopied = copiedId === option.id;
            const isApplied = appliedId === option.id;

            return (
              <div
                key={option.id}
                id={`option-card-${option.id}`}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3 hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Option 0{index + 1}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug">
                      {option.headlineText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`copy-btn-${option.id}`}
                      onClick={() => handleCopy(option.id, option.headlineText)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg transition-colors flex items-center gap-1 border border-slate-200/60"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      id={`apply-btn-${option.id}`}
                      onClick={() => handleApply(option.id, option.headlineText)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-2xs'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isApplied ? 'done_all' : 'done'}
                      </span>
                      <span>{isApplied ? 'Applied to Profile' : 'Apply to Profile'}</span>
                    </button>
                  </div>
                </div>

                {/* Bullets */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {option.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-[#004ac6] font-bold">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CUSTOM FORMULA STUDIO */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#004ac6]">tune</span>
          <h2 className="text-xs sm:text-sm font-bold text-[#0F172A]">
            Tailor Your Custom Option
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Target Direction</label>
            <input
              type="text"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
              placeholder="e.g. Software Engineer Intern"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Core Technical Capability</label>
            <input
              type="text"
              value={customTech}
              onChange={(e) => setCustomTech(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
              placeholder="e.g. Full-Stack & System Fundamentals"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Specialization</label>
            <input
              type="text"
              value={customSpec}
              onChange={(e) => setCustomSpec(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
              placeholder="e.g. Scalable Web Apps"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <button
            onClick={handleBuildCustom}
            className="px-3.5 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-bold rounded-lg transition-colors self-start"
          >
            Preview Custom Strategy
          </button>

          {customPreview && (
            <div className="flex-1 p-2.5 bg-white border border-blue-200 rounded-lg flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#0F172A] truncate">
                {customPreview}
              </span>
              <button
                onClick={() => handleApply('custom', customPreview)}
                className="px-2.5 py-1 bg-[#004ac6] text-white text-xs font-bold rounded-md shrink-0"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
