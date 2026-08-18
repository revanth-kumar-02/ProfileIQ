import React, { useState } from 'react';
import { ProfileReport } from '../types';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (url: string, targetRole: string, userName: string) => void;
  sampleProfiles: ProfileReport[];
  onSelectSample: (profile: ProfileReport) => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  sampleProfiles,
  onSelectSample,
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  if (!isOpen) return null;

  const popularRoles = [
    'Software Engineer Intern',
    'Senior Product Manager',
    'Full-Stack Developer',
    'AI / ML Engineer',
    'Data Scientist',
    'Product Designer (UI/UX)',
  ];

  const scanSteps = [
    'Fetching LinkedIn profile structure & headline...',
    'Extracting technical skill keywords & experience tokens...',
    'Benchmarking against 50,000+ top-tier candidate profiles...',
    'Synthesizing editorial gap analysis & optimization roadmap...',
  ];

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = targetRole === 'custom' ? customRole : targetRole;
    if (!finalRole.trim()) return;

    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsScanning(false);
            onAnalyze(url, finalRole, name);
            onClose();
          }, 600);
          return prev;
        }
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Close Button */}
        {!isScanning && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#475569] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eeefff] text-[#004ac6] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            <span>Profile Intelligence Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            Audit a LinkedIn Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#475569]">
            Analyze semantic alignment, detect missing evidence, and generate a step-by-step optimization roadmap.
          </p>
        </div>

        {/* Loading / Scanning State */}
        {isScanning ? (
          <div className="py-8 space-y-6 text-center animate-in fade-in">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#eeefff] border-t-[#004ac6] rounded-full animate-spin"></div>
              <span className="material-symbols-outlined text-[#004ac6] text-[24px] absolute">
                auto_awesome
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#0F172A]">
                {scanSteps[scanStep]}
              </h3>
              <p className="text-xs text-[#737686]">
                Step {scanStep + 1} of {scanSteps.length}
              </p>
            </div>

            <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#004ac6] h-full transition-all duration-500 rounded-full"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleStartAnalysis} className="space-y-5">
            {/* Quick Sample Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#737686]">
                Quick Sample Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sampleProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectSample(p);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#004ac6] hover:bg-[#eeefff]/40 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.userName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#c3c6d7]"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#004ac6] truncate">
                        {p.userName}
                      </div>
                      <div className="text-[10px] text-[#737686] truncate">
                        {p.targetRole}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-[#E2E8F0] w-full"></div>
              <span className="bg-white px-2 text-[11px] font-semibold text-[#737686] uppercase absolute">
                Or Enter Custom URL
              </span>
            </div>

            {/* Profile URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                <span>LinkedIn Profile URL or Handle</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737686] text-[18px]">
                  link
                </span>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. linkedin.com/in/alex-chen"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#f7f9fb] border border-[#c3c6d7] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0F172A]">
                Target Career Goal / Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {popularRoles.map((role) => {
                  const isSelected = targetRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg font-medium border text-center transition-all truncate ${
                        isSelected
                          ? 'bg-[#004ac6] text-white border-[#004ac6] font-bold shadow-xs'
                          : 'bg-[#f7f9fb] text-[#475569] border-[#E2E8F0] hover:bg-[#eceef0]'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>

              {/* Custom Target Role */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setTargetRole('custom');
                  }}
                  placeholder="Or type a custom role (e.g. Cloud Security Architect)..."
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-all ${
                    targetRole === 'custom'
                      ? 'border-[#004ac6] bg-white ring-2 ring-[#004ac6]/20'
                      : 'border-[#E2E8F0] bg-[#f7f9fb]'
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#004ac6] hover:bg-[#003ea8] text-white text-sm font-bold rounded-xl shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Generate Profile Intelligence Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
