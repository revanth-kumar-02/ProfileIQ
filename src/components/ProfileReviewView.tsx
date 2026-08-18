import React, { useState } from 'react';
import { ProfileReport } from '../types';

interface ProfileReviewViewProps {
  profile: ProfileReport;
  onConfirm: () => void;
  onUpdateHeadline: (headline: string) => void;
}

export const ProfileReviewView: React.FC<ProfileReviewViewProps> = ({
  profile,
  onConfirm,
  onUpdateHeadline,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headlineText, setHeadlineText] = useState(profile.currentHeadline);

  const handleSaveHeadline = () => {
    onUpdateHeadline(headlineText);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#004ac6] uppercase tracking-wider">
        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
        <span>Profile Review & Confirmation</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Review Extracted Profile Data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Verify the information imported from <strong className="text-slate-800">{profile.url}</strong> before continuing to role alignment analysis.
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.userName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">{profile.userName}</h2>
              <span className="text-xs text-slate-400 font-mono">{profile.url}</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>{isEditing ? 'Cancel Edit' : 'Edit Information'}</span>
          </button>
        </div>

        {/* Section 1: Headline */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            1. Current Headline
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
              />
              <button
                onClick={handleSaveHeadline}
                className="px-3 py-2 bg-[#004ac6] text-white text-xs font-bold rounded-lg shrink-0"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs sm:text-sm font-semibold text-[#0F172A]">
              {profile.currentHeadline}
            </div>
          )}
        </div>

        {/* Section 2: About / Summary */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            2. Extracted Summary
          </span>
          <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            {profile.executiveSummary}
          </p>
        </div>

        {/* Section 3: Demonstrated Skills & Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3. Verified Skills Extracted
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              {profile.evidence.strong.concat(profile.evidence.developing).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-800 rounded border border-slate-200 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              4. Evidence Audit Points
            </span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div>• {profile.sections.length} core profile sections analyzed</div>
              <div>• Key technical projects detected</div>
              <div>• Alignment history logged for analysis</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Information verified and ready for role comparison
          </span>

          <button
            id="btn-confirm-profile"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl shadow-2xs transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Confirm profile & Select Target Role</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
