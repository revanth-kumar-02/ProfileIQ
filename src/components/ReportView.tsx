import React from 'react';
import { ProfileReport } from '../types';

interface ReportViewProps {
  report: ProfileReport;
  onOpenNewAnalysis: () => void;
  onSelectRefineSection: (sectionKey: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onOpenNewAnalysis,
  onSelectRefineSection,
}) => {
  // Semantic alignment state
  const getSemanticAlignment = (score: number) => {
    if (score >= 80) return { label: 'STRONG ALIGNMENT', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 60) return { label: 'DEVELOPING ALIGNMENT', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    return { label: 'LIMITED ALIGNMENT', color: 'text-rose-800 bg-rose-50 border-rose-200' };
  };

  const alignment = getSemanticAlignment(report.alignmentScore);

  const dimensions = [
    { name: 'Skills Demonstrated', status: 'Moderate', value: 75, color: 'bg-[#004ac6]' },
    { name: 'Profile Clarity', status: 'Needs Calibration', value: 55, color: 'bg-amber-500' },
    { name: 'Project Evidence', status: 'Developing', value: 65, color: 'bg-[#004ac6]' },
    { name: 'Experience Evidence', status: 'Partial', value: 60, color: 'bg-amber-500' },
    { name: 'Missing Signals', status: '3 Gaps Identified', value: 40, color: 'bg-rose-500' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-10 animate-in fade-in duration-200">
      {/* 1. PROFILE CONTEXT BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={report.avatarUrl}
            alt={report.userName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">{report.userName}</h2>
              <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                {report.url}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
              <span>
                Target Role:{' '}
                <strong className="text-[#004ac6] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-semibold">
                  {report.targetRole}
                </strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Analysis completed just now
              </span>
            </div>
          </div>
        </div>

        <button
          id="btn-edit-target-role"
          onClick={onOpenNewAnalysis}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#004ac6] bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-auto border border-slate-200/60"
        >
          <span className="material-symbols-outlined text-[15px]">tune</span>
          <span>Change Role / Re-analyze</span>
        </button>
      </div>

      {/* 2. MAIN INTELLIGENCE ASSESSMENT */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 text-[11px] font-semibold tracking-wider">
          <span className="material-symbols-outlined text-[14px] text-violet-700">auto_awesome</span>
          <span>PROFILE INTELLIGENCE ASSESSMENT</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug max-w-3xl">
          {report.analysisHeadline}
        </h1>
      </div>

      {/* 3. EXECUTIVE ASSESSMENT */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 border-l-4 border-l-[#004ac6] space-y-2">
        <div className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-wider text-slate-500">
          <span className="material-symbols-outlined text-[#004ac6] text-[18px]">format_quote</span>
          <span>Executive Assessment</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          {report.executiveSummary}
        </p>
      </div>

      {/* 4. ROLE ALIGNMENT */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500">
            Role Alignment Status
          </h3>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-md border self-start sm:self-auto ${alignment.color}`}>
            {alignment.label}
          </span>
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Contributing Assessment Dimensions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dimensions.map((dim) => (
              <div key={dim.name} className="space-y-1 p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{dim.name}</span>
                  <span className="text-[11px] font-bold text-slate-500">{dim.status}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
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

      {/* 5. TARGET ROLE EVIDENCE */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
        <div className="space-y-1 border-b border-slate-100 pb-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500">
            Target Role Evidence Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Evaluated against demonstrated profile assets. Missing capabilities should be learned or genuinely demonstrated—never artificially added.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Strong Evidence */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>Strong Evidence</span>
            </div>
            <div className="space-y-1.5">
              {report.evidence.strong.map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-xs font-medium text-emerald-900 bg-white p-2 rounded-lg border border-emerald-200/80">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Developing Evidence */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
              <span className="material-symbols-outlined text-[18px] text-amber-600">pending</span>
              <span>Developing Evidence</span>
            </div>
            <div className="space-y-1.5">
              {report.evidence.developing.map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-xs font-medium text-amber-950 bg-white p-2 rounded-lg border border-amber-200/80">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Evidence */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-rose-900 text-xs font-bold">
              <span className="material-symbols-outlined text-[18px] text-rose-600">cancel</span>
              <span>Missing Signals</span>
            </div>
            <div className="space-y-1.5">
              {report.evidence.missing.map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-xs font-medium text-rose-950 bg-white p-2 rounded-lg border border-rose-200/80">
                  <span className="text-rose-600 font-bold">○</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. WHAT TO IMPROVE FIRST */}
      <div className="space-y-6 pt-4 border-t border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004ac6] border border-blue-100 text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">priority_high</span>
            <span>STRATEGIC RECOMMENDATIONS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            What to improve first
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Focus on these improvements first for the strongest impact on your profile.
          </p>
        </div>

        <div className="space-y-8">
          {report.improvements.map((item) => {
            const sectionKey = item.optimizationKey || 'headline';
            return (
              <div
                key={item.id}
                id={`priority-item-${item.id}`}
                className="group space-y-3 pb-6 border-b border-slate-200/60 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-300 font-mono group-hover:text-[#004ac6] transition-colors">
                      {item.number}
                    </span>
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#004ac6] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 self-start sm:self-auto">
                    {item.impact}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pl-0 sm:pl-10">
                  <div className="md:col-span-7 space-y-1">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                    {item.evidenceValue && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Evidence from your profile:
                        </span>
                        <p className="font-mono text-xs font-semibold text-[#0F172A] italic mt-0.5">
                          {item.evidenceValue}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-5 space-y-2">
                    {item.expectedValue && (
                      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#004ac6]">
                          Expected outcome:
                        </span>
                        <p className="font-semibold text-[#004ac6]">
                          {item.expectedValue}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => onSelectRefineSection(sectionKey)}
                      className="w-full py-2.5 px-4 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Refine this →</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. SECTION ANALYSIS */}
      <div className="space-y-6 pt-4 border-t border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px] text-[#004ac6]">view_agenda</span>
            <span>SECTION AUDIT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Your profile, section by section
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A comprehensive breakdown of how each section is currently performing.
          </p>
        </div>

        <div className="space-y-3">
          {report.sections.map((sec) => (
            <div
              key={sec.id}
              className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition-all"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                    {sec.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {sec.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sec.whatWeFound}
                </p>
              </div>

              <button
                onClick={() => onSelectRefineSection(sec.optimizationKey || sec.id)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#004ac6] hover:text-[#003ea8] shrink-0 self-end sm:self-center"
              >
                <span>View analysis →</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 8. ROADMAP SECTION */}
      <div className="space-y-6 pt-4 border-t border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px] text-[#004ac6]">timeline</span>
            <span>OPTIMIZATION ROADMAP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Personalized Improvement Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A structured sequence prioritizing actions by expected recruiter impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200 inline-block">
              NOW
            </span>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-1">
              <li>• Clarify your professional direction</li>
              <li>• Strengthen project descriptions</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 inline-block">
              NEXT
            </span>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-1">
              <li>• Improve skill representation</li>
              <li>• Demonstrate missing technical capabilities</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-violet-800 bg-violet-100 px-2 py-0.5 rounded border border-violet-200 inline-block">
              REFINE
            </span>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-1">
              <li>• Improve your About section</li>
              <li>• Polish supporting profile details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
