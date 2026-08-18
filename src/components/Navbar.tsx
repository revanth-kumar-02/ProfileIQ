import React from 'react';
import { ViewMode, ProfileReport } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  activeProfile: ProfileReport;
  allProfiles: ProfileReport[];
  onSelectProfile: (profile: ProfileReport) => void;
  onOpenNewAnalysis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeProfile,
  allProfiles,
  onSelectProfile,
  onOpenNewAnalysis,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'report', label: 'Overview', icon: 'analytics' },
    { id: 'what-to-improve', label: 'Priorities', icon: 'priority_high' },
    { id: 'sections', label: 'Section Audit', icon: 'view_agenda' },
    { id: 'roadmap', label: 'Roadmap', icon: 'timeline' },
    { id: 'optimization-detail', label: 'Optimization Studio', icon: 'auto_fix_high' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo-container"
            onClick={() => onNavigate('report')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#004ac6] to-[#7C3AED] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-[#0F172A]">ProfileIQ</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#eeefff] text-[#004ac6] border border-[#dbe1ff]">
                  AI Audit
                </span>
              </div>
              <p className="text-[11px] text-[#475569] hidden sm:block">Profile Intelligence for Career Growth</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#eceef0] text-[#004ac6] font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#004ac6]' : 'text-[#737686]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Profile Switcher & New Analysis */}
          <div className="flex items-center gap-2.5">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="profile-dropdown-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-[#f2f4f6] border border-[#E2E8F0] transition-colors"
                title="Switch analyzed profile"
              >
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.userName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-[#c3c6d7]"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-[#0F172A] max-w-[110px] truncate">
                    {activeProfile.userName}
                  </div>
                  <div className="text-[10px] text-[#475569] max-w-[110px] truncate">
                    {activeProfile.targetRole}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#737686]">
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
                      Saved Profiles
                    </div>
                    {allProfiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProfile(p);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f7f9fb] transition-colors ${
                          p.id === activeProfile.id ? 'bg-[#eeefff]/50' : ''
                        }`}
                      >
                        <img
                          src={p.avatarUrl}
                          alt={p.userName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-[#c3c6d7]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-[#0F172A] truncate">
                            {p.userName}
                          </div>
                          <div className="text-[11px] text-[#475569] truncate">
                            Target: {p.targetRole}
                          </div>
                        </div>
                        {p.id === activeProfile.id && (
                          <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="border-t border-[#E2E8F0] mt-1 pt-1">
                      <button
                        id="dropdown-new-profile-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenNewAnalysis();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#004ac6] hover:bg-[#eeefff] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>Analyze New Profile</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* CTA Button */}
            <button
              id="header-analyze-btn"
              onClick={onOpenNewAnalysis}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">New Audit</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto gap-1 py-2 border-t border-[#E2E8F0] no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#eceef0] text-[#004ac6] font-semibold'
                    : 'text-[#475569] hover:bg-[#f2f4f6]'
                }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-[#004ac6]' : 'text-[#737686]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
