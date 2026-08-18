import React from 'react';
import { ViewMode, ProfileReport } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  activeProfile: ProfileReport;
  onStartNewAnalysis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeProfile,
  onStartNewAnalysis,
}) => {
  const showNewAnalysis = currentView === 'report' || currentView === 'refine';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo & Name */}
          <div
            id="brand-logo-container"
            onClick={() => onNavigate('import')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#004ac6] to-[#7C3AED] flex items-center justify-center text-white shadow-2xs transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#0F172A]">ProfileIQ</span>
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-[#004ac6] border border-blue-100 hidden sm:inline-block">
                Profile Intelligence
              </span>
            </div>
          </div>

          {/* Right Controls: New Analysis & Avatar */}
          <div className="flex items-center gap-3">
            {showNewAnalysis && (
              <button
                id="header-new-analysis-btn"
                onClick={onStartNewAnalysis}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-[#0F172A] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200/60"
              >
                <span className="material-symbols-outlined text-[16px] text-[#004ac6]">add_circle</span>
                <span>New Analysis</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.userName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
              <span className="text-xs font-bold text-[#0F172A] hidden sm:inline-block">
                {activeProfile.userName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
