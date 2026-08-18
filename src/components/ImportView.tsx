import React, { useState } from 'react';
import { ProfileReport } from '../types';

interface ImportViewProps {
  onContinue: (url: string, userName: string) => void;
  sampleProfiles: ProfileReport[];
  onSelectSample: (profile: ProfileReport) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
  onContinue,
  sampleProfiles,
  onSelectSample,
}) => {
  const [profileUrl, setProfileUrl] = useState('linkedin.com/in/alex-chen');
  const [name, setName] = useState('Alex Chen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) return;
    onContinue(profileUrl.trim(), name.trim() || 'Profile Candidate');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#004ac6] uppercase tracking-wider">
        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
        <span>Profile Import</span>
      </div>

      {/* Main Headline */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
          Understand what your profile communicates.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Import your LinkedIn profile, choose your career goal, and receive a personalized strategy for improvement.
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="space-y-2">
          <label htmlFor="linkedin-url-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            LinkedIn Profile URL or Identifier
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
              link
            </span>
            <input
              id="linkedin-url-input"
              type="text"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="linkedin.com/in/your-profile"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="candidate-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Candidate Name
          </label>
          <input
            id="candidate-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Chen"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all"
          />
        </div>

        <button
          id="btn-analyze-profile"
          type="submit"
          className="w-full py-3.5 bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold text-sm rounded-xl shadow-2xs transition-transform active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Analyze my profile</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      {/* Demo Profile Selectors */}
      <div className="space-y-3 pt-2">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or test with a sample profile
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleProfiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectSample(p)}
              className="p-3 bg-white hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl transition-all text-left space-y-1 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <img
                  src={p.avatarUrl}
                  alt={p.userName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-bold text-[#0F172A] truncate">{p.userName}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{p.targetRole}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
