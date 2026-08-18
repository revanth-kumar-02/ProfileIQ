import React, { useEffect, useState } from 'react';
import { TargetRole } from '../types/role';
import { RoleService } from '../services/role.service';
import { analysisStore, useAnalysisStore } from '../store/analysisStore';

interface TargetRoleViewProps {
  onContinue: () => void;
}

export const TargetRoleView: React.FC<TargetRoleViewProps> = ({ onContinue }) => {
  const { selectedTargetRole } = useAnalysisStore();

  const [roles, setRoles] = useState<TargetRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<TargetRole | null>(selectedTargetRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [customRoleTitle, setCustomRoleTitle] = useState('');

  useEffect(() => {
    RoleService.getTargetRoles().then((fetchedRoles) => {
      setRoles(fetchedRoles);
      if (!selectedTargetRole && fetchedRoles.length > 0) {
        setSelectedRole(fetchedRoles[0]);
      }
    });
  }, [selectedTargetRole]);

  const filteredRoles = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContinue = () => {
    let finalRole: TargetRole;

    if (customRoleTitle.trim()) {
      finalRole = {
        id: `custom-${Date.now()}`,
        title: customRoleTitle.trim(),
        category: 'Custom Role',
        description: `Custom career role benchmark for ${customRoleTitle.trim()}`,
        expectedSkills: ['Core Architecture', 'Technical Leadership', 'Domain Competency'],
        importantKeywords: [customRoleTitle.trim(), 'System Design', 'Domain Knowledge'],
        evidenceSignals: ['Project Outcomes', 'Verified Skills'],
      };
    } else if (selectedRole) {
      finalRole = selectedRole;
    } else if (roles.length > 0) {
      finalRole = roles[0];
    } else {
      finalRole = {
        id: 'default-role',
        title: 'Software Engineer',
        category: 'Engineering',
      };
    }

    analysisStore.setSelectedTargetRole(finalRole);
    onContinue();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#004ac6] uppercase tracking-wider">
        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
        <span>Target Career Goal</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          What career are you working toward?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Select your target role to benchmark your profile evidence against actual recruiter search criteria.
        </p>
      </div>

      {/* Search & Custom Input */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles (e.g. Frontend, Data, Backend)..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
          />
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {filteredRoles.map((role) => {
            const isSelected = selectedRole?.id === role.id && !customRoleTitle.trim();
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role);
                  setCustomRoleTitle('');
                }}
                className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                  isSelected
                    ? 'bg-blue-50/80 border-[#004ac6] ring-1 ring-[#004ac6] shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">{role.title}</span>
                  {role.category && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {role.category}
                    </span>
                  )}
                </div>
                {role.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {role.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Role Option */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Or specify a custom target role
          </label>
          <input
            type="text"
            value={customRoleTitle}
            onChange={(e) => setCustomRoleTitle(e.target.value)}
            placeholder="e.g. Senior Cloud Architect, DevOps Specialist..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-end pt-2">
        <button
          id="btn-continue-to-analysis"
          onClick={handleContinue}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-transform active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Continue to analysis</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
