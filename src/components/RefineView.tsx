import React, { useState } from 'react';
import { useAnalysisStore, analysisStore } from '../store/analysisStore';

interface RefineViewProps {
  sectionKey: string;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const RefineView: React.FC<RefineViewProps> = ({
  sectionKey,
  onBack,
  onShowToast,
}) => {
  const { currentProfile, currentAnalysis } = useAnalysisStore();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!currentProfile || !currentAnalysis) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0F172A]">No Analysis Context Found</h2>
        <button onClick={onBack} className="px-4 py-2 bg-[#004ac6] text-white text-xs font-bold rounded-lg">
          ← Back to Analysis
        </button>
      </div>
    );
  }

  const detail =
    currentAnalysis.optimizationDetails[sectionKey] ||
    currentAnalysis.optimizationDetails['headline'] || {
      key: sectionKey,
      badge: 'SECTION OPTIMIZATION',
      title: `Optimize Profile ${sectionKey.toUpperCase()}`,
      subtitle: `Refining identity for ${currentAnalysis.targetRole.title}.`,
      currentValue: currentProfile.basicInfo.headline || 'No content found',
      currentLabel: 'CURRENT CONTENT',
      whyLimitingParagraphs: [
        `Your current ${sectionKey} requires stronger alignment with ${currentAnalysis.targetRole.title}.`,
        'Recruiters look for high-signal keywords and quantifiable achievements in search results.',
      ],
      formula: {
        targetDirection: `"${currentAnalysis.targetRole.title}"`,
        technicalStrength: '"Core Expertise"',
        specialization: '"Key Impact"',
      },
      generatedOptions: [
        {
          id: 'gen-opt-1',
          headlineText: `${currentAnalysis.targetRole.title} | Specializing in Modern Systems & Product Scalability`,
          bullets: [
            'Directly indexes for recruiter search queries.',
            'Highlights core professional direction.',
          ],
        },
      ],
    };

  const currentOriginalText =
    sectionKey === 'headline'
      ? currentProfile.basicInfo.headline || 'No headline set'
      : sectionKey === 'about'
      ? currentProfile.about || 'No summary text available'
      : currentProfile.basicInfo.headline || 'No content found';

  const [customTarget, setCustomTarget] = useState(detail.formula.targetDirection.replace(/"/g, ''));
  const [customTech, setCustomTech] = useState(detail.formula.technicalStrength.replace(/"/g, ''));
  const [customSpec, setCustomSpec] = useState(detail.formula.specialization.replace(/"/g, ''));
  const [customPreview, setCustomPreview] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Copied text to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApply = (id: string, text: string) => {
    if (sectionKey === 'headline') {
      analysisStore.updateProfileHeadline(text);
    }
    setAppliedId(id);
    onShowToast('Applied optimization to active profile!');
    setTimeout(() => setAppliedId(null), 3000);
  };

  const handleBuildCustom = () => {
    const combined = `${customTarget} | ${customTech} | ${customSpec}`;
    setCustomPreview(combined);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Back Button */}
      <div>
        <button
          id="btn-back-to-analysis"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#004ac6] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>← Back to Profile Analysis</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-200/80 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#004ac6] border border-blue-100">
          SECTION REFINEMENT
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {detail.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Target Role: <strong className="text-[#004ac6]">{currentAnalysis.targetRole.title}</strong>
        </p>
      </div>

      {/* 1. CURRENT CONTENT */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          CURRENT PROFILE CONTENT
        </span>
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs sm:text-sm font-bold text-[#0F172A]">
          {currentOriginalText}
        </div>
      </div>

      {/* 2. WHAT WE FOUND & WHY THIS MATTERS */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xs uppercase font-bold tracking-wider text-[#004ac6] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>WHAT WE FOUND</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {detail.whyLimitingParagraphs[0]}
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <h2 className="text-xs uppercase font-bold tracking-wider text-violet-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>WHY THIS MATTERS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {detail.whyLimitingParagraphs[1] || detail.whyLimitingParagraphs[0]}
          </p>
        </div>
      </div>

      {/* 3. RECOMMENDED STRATEGY */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#004ac6]">
            RECOMMENDED STRATEGY
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-[#0F172A]">
            Value Architecture Strategy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Target Direction
            </span>
            <span className="text-xs font-semibold text-[#0F172A] font-mono">
              {detail.formula.targetDirection}
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#004ac6] block">
              Technical Skill
            </span>
            <span className="text-xs font-semibold text-[#00174b] font-mono">
              {detail.formula.technicalStrength}
            </span>
          </div>

          <div className="p-3 bg-violet-50/70 rounded-lg border border-violet-100 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800 block">
              Specialization
            </span>
            <span className="text-xs font-semibold text-violet-950 font-mono">
              {detail.formula.specialization}
            </span>
          </div>
        </div>
      </div>

      {/* 4. OPTIONAL IMPROVEMENTS */}
      <div className="space-y-4 pt-2 border-t border-slate-200/80">
        <h2 className="text-sm font-bold text-[#0F172A]">
          Optional AI Optimizations
        </h2>

        <div className="space-y-3">
          {detail.generatedOptions.map((option, index) => {
            const isCopied = copiedId === option.id;
            const isApplied = appliedId === option.id;

            return (
              <div
                key={option.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Option {String.fromCharCode(65 + index)}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug">
                      {option.headlineText}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(option.id, option.headlineText)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg transition-colors flex items-center gap-1 border border-slate-200/60"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
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
                      <span>{isApplied ? 'Applied' : 'Apply to Profile'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Why this works:
                  </span>
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

      {/* 5. CUSTOM STRATEGY FORMULA */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#004ac6]">tune</span>
          <h2 className="text-xs sm:text-sm font-bold text-[#0F172A]">
            Customize Your Strategy
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
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Technical Skill</label>
            <input
              type="text"
              value={customTech}
              onChange={(e) => setCustomTech(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Specialization</label>
            <input
              type="text"
              value={customSpec}
              onChange={(e) => setCustomSpec(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
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
