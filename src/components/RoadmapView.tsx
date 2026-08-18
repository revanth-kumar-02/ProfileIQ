import React from 'react';
import { ProfileReport, ViewMode } from '../types';

interface RoadmapViewProps {
  report: ProfileReport;
  onNavigate: (view: ViewMode) => void;
  onSelectOptimization: (key: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  report,
  onNavigate,
  onSelectOptimization,
}) => {
  const stages: {
    id: 'NOW' | 'NEXT' | 'REFINE';
    label: string;
    description: string;
    badgeStyle: string;
  }[] = [
    {
      id: 'NOW',
      label: 'NOW — Immediate High-Impact Stage',
      description: 'High-impact improvements that should be addressed first to calibrate core recruiter search filters.',
      badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      id: 'NEXT',
      label: 'NEXT — Evidence & Capability Stage',
      description: 'Improvements that strengthen profile evidence, skills categorization, and proof of accomplishment.',
      badgeStyle: 'bg-blue-50 text-[#004ac6] border-blue-200',
    },
    {
      id: 'REFINE',
      label: 'REFINE — Narrative & Polish Stage',
      description: 'Improvements that elevate professional narrative, clarity, and overall personal branding.',
      badgeStyle: 'bg-violet-50 text-violet-800 border-violet-200',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-200/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px] text-[#004ac6]">timeline</span>
          <span>STRATEGIC IMPROVEMENT JOURNEY</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Optimization Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          A phased sequence prioritizing actions by their expected impact on recruiter search visibility and target role evidence.
        </p>
      </div>

      {/* Strategic Stages Sequence */}
      <div className="space-y-8 relative before:absolute before:left-4 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200/80">
        {stages.map((stage) => {
          const stageItems = report.roadmap.filter((item) => item.phase === stage.id);
          if (stageItems.length === 0) return null;

          return (
            <div key={stage.id} className="relative pl-10 sm:pl-12 space-y-4">
              {/* Stage Marker Circle */}
              <div className="absolute left-1.5 sm:left-2.5 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#004ac6] flex items-center justify-center shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#004ac6]"></span>
              </div>

              {/* Stage Header */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${stage.badgeStyle}`}>
                    {stage.id}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
                    {stage.label}
                  </h2>
                </div>
                <p className="text-xs text-slate-500">{stage.description}</p>
              </div>

              {/* Stage Items List */}
              <div className="space-y-3 pt-1">
                {stageItems.map((item) => (
                  <div
                    key={item.number}
                    id={`roadmap-item-${item.number}`}
                    className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-slate-100 text-[#0F172A] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                        {item.number}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const targetKey = item.optimizationKey || 'headline';
                        onSelectOptimization(targetKey);
                        onNavigate('optimization-detail');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#004ac6] hover:text-[#003ea8] shrink-0 self-end sm:self-center group/btn"
                    >
                      <span>Explore Optimization</span>
                      <span className="material-symbols-outlined text-[15px] transition-transform group-hover/btn:translate-x-0.5">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
