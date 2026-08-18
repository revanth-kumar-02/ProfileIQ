import React, { useState } from 'react';
import { ProfileReport, ViewMode, SectionAnalysis } from '../types';

interface SectionsAuditViewProps {
  report: ProfileReport;
  onNavigate: (view: ViewMode) => void;
  onSelectOptimization: (key: string) => void;
}

export const SectionsAuditView: React.FC<SectionsAuditViewProps> = ({
  report,
  onNavigate,
  onSelectOptimization,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('headline');

  const currentSection: SectionAnalysis =
    report.sections.find((s) => s.id === selectedSectionId) || report.sections[0];

  const getStatusBadge = (statusType: SectionAnalysis['statusType'], status: string) => {
    switch (statusType) {
      case 'error':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            {status}
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
      case 'developing':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {status}
          </span>
        );
      case 'strong':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            {status}
          </span>
        );
      case 'opportunity':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-violet-50 text-violet-800 border border-violet-200">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Document Header */}
      <div className="space-y-1.5 border-b border-slate-200/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px] text-[#004ac6]">description</span>
          <span>EDITORIAL AUDIT DOCUMENT</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Section-by-Section Evidence Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Comprehensive breakdown evaluating current profile text against semantic screening standards for <strong className="text-[#0F172A]">{report.targetRole}</strong>.
        </p>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/60">
        {report.sections.map((section) => {
          const isSelected = section.id === selectedSectionId;
          return (
            <button
              key={section.id}
              id={`section-tab-${section.id}`}
              onClick={() => setSelectedSectionId(section.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              <span>{section.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : section.statusType === 'error'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {section.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Audit Document Body */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        {/* Document Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              AUDIT SCOPE
            </span>
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              {currentSection.name} Audit
            </h2>
          </div>
          <div>{getStatusBadge(currentSection.statusType, currentSection.status)}</div>
        </div>

        {/* 1. What We Found */}
        <div className="space-y-1.5">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[#004ac6] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>What We Found</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {currentSection.whatWeFound}
          </p>
        </div>

        {/* 2. Evidence from Profile (Distinct Quoted Block) */}
        <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-[#004ac6] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#004ac6]">format_quote</span>
            <span>Evidence from your profile</span>
          </span>
          <p className="text-xs sm:text-sm font-mono font-medium text-[#0F172A] italic leading-relaxed">
            {currentSection.evidenceQuote}
          </p>
        </div>

        {/* 3. Why It Matters for Target Role */}
        <div className="space-y-1.5">
          <h3 className="text-xs uppercase font-bold tracking-wider text-violet-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>Why it matters for {report.targetRole}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentSection.whyThisMatters}
          </p>
        </div>

        {/* 4. Recommended Direction & Action Link */}
        <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-100 space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#004ac6] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">directions</span>
              <span>Recommended Direction</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#00174b]">
              {currentSection.whatToDoNext}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {currentSection.optimizationKey && (
              <button
                id={`btn-open-optimization-${currentSection.id}`}
                onClick={() => {
                  onSelectOptimization(currentSection.optimizationKey!);
                  onNavigate('optimization-detail');
                }}
                className="px-3.5 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                <span>Explore {currentSection.name} Optimization</span>
              </button>
            )}

            <button
              id="btn-goto-roadmap-from-sections"
              onClick={() => onNavigate('roadmap')}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
            >
              <span>View in Strategy Roadmap</span>
              <span className="material-symbols-outlined text-[15px]">timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
