import React from 'react';
import { ProfileReport, ViewMode } from '../types';

interface ReportViewProps {
  report: ProfileReport;
  onNavigate: (view: ViewMode) => void;
  onOpenNewAnalysis: () => void;
  onSelectOptimization: (key: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onNavigate,
  onOpenNewAnalysis,
}) => {
  // Determine semantic alignment label based on score
  const getSemanticAlignment = (score: number) => {
    if (score >= 80) return { label: 'Strong Alignment', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 60) return { label: 'Developing Alignment', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    return { label: 'Limited Alignment', color: 'text-rose-800 bg-rose-50 border-rose-200' };
  };

  const alignment = getSemanticAlignment(report.alignmentScore);

  // Contributing alignment dimensions
  const dimensions = [
    { name: 'Skills Demonstrated', status: 'Moderate', value: 75, color: 'bg-[#004ac6]' },
    { name: 'Profile Clarity', status: 'Needs Calibration', value: 55, color: 'bg-amber-500' },
    { name: 'Experience / Project Evidence', status: 'Developing', value: 65, color: 'bg-[#004ac6]' },
    { name: 'Target Role Signals', status: 'Partial', value: 60, color: 'bg-amber-500' },
    { name: 'Missing Capabilities', status: '3 Gaps Identified', value: 40, color: 'bg-rose-500' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* 1. Profile Context Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={report.avatarUrl}
              alt={report.userName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-[#0F172A]">{report.userName}</h2>
              <span className="text-xs text-slate-400 font-normal truncate max-w-[200px] sm:max-w-xs">
                {report.url}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
              <span>
                Target Role:{' '}
                <strong className="text-[#004ac6] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100/80 font-semibold">
                  {report.targetRole}
                </strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Audited {report.analyzedAt}</span>
            </div>
          </div>
        </div>

        <button
          id="change-target-role-btn"
          onClick={onOpenNewAnalysis}
          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-[#004ac6] bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-auto border border-slate-200/60"
        >
          <span className="material-symbols-outlined text-[15px]">edit</span>
          <span>Edit Target Role</span>
        </button>
      </div>

      {/* 2. Main Assessment Headline */}
      <div className="space-y-2 pt-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100/80 text-violet-900 text-[11px] font-semibold tracking-wide">
          <span className="material-symbols-outlined text-[14px] text-violet-700">auto_awesome</span>
          <span>PROFILE INTELLIGENCE SUMMARY</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug max-w-3xl">
          {report.analysisHeadline}
        </h1>
      </div>

      {/* 3. Executive Assessment */}
      <div className="p-5 bg-slate-50/90 rounded-xl border border-slate-200/80 border-l-4 border-l-[#004ac6] relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-wider text-slate-500">
          <span className="material-symbols-outlined text-[#004ac6] text-[18px]">format_quote</span>
          <span>Executive Assessment</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal pl-0.5">
          {report.executiveSummary}
        </p>
      </div>

      {/* 4. Two Column Grid: Semantic Role Alignment Index & Target Role Evidence Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Role Alignment Index (Semantic First) */}
        <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
                Role Alignment Index
              </h3>
              <span className="text-[11px] font-medium text-slate-400">
                Score: {report.alignmentScore} / 100
              </span>
            </div>

            {/* Prominent Semantic State Header */}
            <div className="p-3.5 rounded-lg border bg-slate-50/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Semantic Status
                </span>
                <span className={`text-base font-extrabold px-2.5 py-1 rounded-md border inline-block ${alignment.color}`}>
                  {alignment.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#0F172A]">{report.alignmentScore}%</span>
                <span className="text-[10px] text-slate-400 block">Benchmark: 85%+</span>
              </div>
            </div>

            {/* Contributing Dimensions Breakdown */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Contributing Alignment Dimensions
              </span>
              <div className="space-y-2">
                {dimensions.map((dim) => (
                  <div key={dim.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{dim.name}</span>
                      <span className="text-[11px] font-semibold text-slate-500">{dim.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dim.color}`}
                        style={{ width: `${dim.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            id="explore-sections-btn"
            onClick={() => onNavigate('sections')}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200/80 text-[#0F172A] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200/60"
          >
            <span>View Section Evidence Breakdown</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

        {/* Right Column: Target Role Evidence Status */}
        <div className="md:col-span-7 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
              Target Role Evidence Status
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Verified Signals</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Strong Evidence (Green) */}
            <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                <span>Strong Evidence</span>
                <span className="text-[10px] font-normal text-emerald-700 ml-auto">Capabilities clearly supported</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.evidence.strong.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium bg-white text-emerald-900 rounded border border-emerald-200/80 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Developing Evidence (Amber) */}
            <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
                <span>Developing Evidence</span>
                <span className="text-[10px] font-normal text-amber-700 ml-auto">Partially demonstrated</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.evidence.developing.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium bg-white text-amber-900 rounded border border-amber-200/80 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Evidence (Red) */}
            <div className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-900 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-rose-600">cancel</span>
                <span>Missing / Not Demonstrated</span>
                <span className="text-[10px] font-normal text-rose-700 ml-auto">Critical signals lacking</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.evidence.missing.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium bg-white text-rose-900 rounded border border-rose-200/80 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Priority Action Banner */}
      <div className="p-5 bg-gradient-to-r from-[#004ac6] to-[#7C3AED] rounded-xl text-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-100">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Recommended Strategic Action</span>
          </div>
          <h3 className="text-base font-bold text-white">
            We identified 3 high-leverage improvements to elevate your profile alignment.
          </h3>
          <p className="text-xs text-blue-100/90 max-w-xl">
            Focusing on your headline and project proof points first yields the highest return on recruiter search visibility.
          </p>
        </div>

        <button
          id="cta-what-to-improve-btn"
          onClick={() => onNavigate('what-to-improve')}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#004ac6] text-xs font-bold rounded-lg shadow-2xs transition-transform active:scale-98 shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Explore Prioritized Actions</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
