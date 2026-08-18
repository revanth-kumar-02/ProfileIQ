import React, { useState } from 'react';
import { useAnalysisStore, analysisStore } from '../store/analysisStore';

interface ProfileReviewViewProps {
  onConfirm: () => void;
}

export const ProfileReviewView: React.FC<ProfileReviewViewProps> = ({ onConfirm }) => {
  const { currentProfile } = useAnalysisStore();

  if (!currentProfile) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-slate-400">person_off</span>
        <h2 className="text-xl font-bold text-[#0F172A]">No Profile Imported</h2>
        <p className="text-xs text-slate-500">Start by importing your LinkedIn profile to review extracted data.</p>
        <button
          onClick={() => analysisStore.setImportStatus('idle')}
          className="px-4 py-2 bg-[#004ac6] text-white text-xs font-bold rounded-lg"
        >
          Import Profile
        </button>
      </div>
    );
  }

  const basic = currentProfile.basicInfo;
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [headlineInput, setHeadlineInput] = useState(basic.headline || '');

  const handleSaveHeadline = () => {
    analysisStore.updateProfileHeadline(headlineInput);
    setIsEditingHeadline(false);
  };

  const avatarUrl =
    basic.profileImageUrl ||
    (basic.fullName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(basic.fullName)}&background=004ac6&color=fff&size=128`
      : undefined);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#004ac6] uppercase tracking-wider">
        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
        <span>Profile Data Review</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Review Extracted Profile Data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Verify the information parsed from <strong className="text-slate-800">{basic.profileUrl || 'imported profile'}</strong> before selecting your target role.
        </p>
      </div>

      {/* Profile Review Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={basic.fullName || 'Candidate'}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#004ac6] text-white text-base font-bold flex items-center justify-center">
                {(basic.fullName || 'U').charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">{basic.fullName || 'Candidate Profile'}</h2>
              <span className="text-xs text-slate-400 font-mono">{basic.profileUrl || 'Profile Imported'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditingHeadline(!isEditingHeadline)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>{isEditingHeadline ? 'Cancel Edit' : 'Edit Headline'}</span>
          </button>
        </div>

        {/* Section 1: Headline */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            1. Current Headline
          </span>
          {isEditingHeadline ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
              />
              <button
                onClick={handleSaveHeadline}
                className="px-3.5 py-2 bg-[#004ac6] text-white text-xs font-bold rounded-lg shrink-0"
              >
                Save
              </button>
            </div>
          ) : basic.headline ? (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs sm:text-sm font-semibold text-[#0F172A]">
              {basic.headline}
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-900 font-medium">
              No headline detected on imported profile.
            </div>
          )}
        </div>

        {/* Section 2: About / Summary */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            2. Extracted Summary
          </span>
          {currentProfile.about ? (
            <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              {currentProfile.about}
            </p>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 italic">
              No summary or about section was detected from this profile.
            </div>
          )}
        </div>

        {/* Section 3: Demonstrated Skills & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3. Extracted Skills ({currentProfile.skills.length})
            </span>
            {currentProfile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto">
                {currentProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-800 rounded border border-slate-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 italic">
                No skills extracted.
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              4. Experience & Projects Audit
            </span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div>
                • Work History:{' '}
                <strong className="text-slate-800">
                  {currentProfile.experience.length > 0
                    ? `${currentProfile.experience.length} entry detected`
                    : 'No work experience detected'}
                </strong>
              </div>
              <div>
                • Projects:{' '}
                <strong className="text-slate-800">
                  {currentProfile.projects.length > 0
                    ? `${currentProfile.projects.length} project(s) detected`
                    : 'No project information was detected'}
                </strong>
              </div>
              <div>
                • Education:{' '}
                <strong className="text-slate-800">
                  {currentProfile.education.length > 0
                    ? `${currentProfile.education.length} entry detected`
                    : 'No education entries detected'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Information parsed and ready for target role benchmarking
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
