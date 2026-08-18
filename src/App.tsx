import React, { useState } from 'react';
import { ViewMode, ProfileReport } from './types';
import { defaultSoftwareEngineerReport, sampleProfiles } from './data/sampleProfiles';
import { Navbar } from './components/Navbar';
import { ReportView } from './components/ReportView';
import { WhatToImproveView } from './components/WhatToImproveView';
import { SectionsAuditView } from './components/SectionsAuditView';
import { RoadmapView } from './components/RoadmapView';
import { OptimizationDetailView } from './components/OptimizationDetailView';
import { NewAnalysisModal } from './components/NewAnalysisModal';
import { AnalysisService } from './services/analysis.service';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('report');
  const [allProfiles, setAllProfiles] = useState<ProfileReport[]>(sampleProfiles);
  const [activeProfile, setActiveProfile] = useState<ProfileReport>(defaultSoftwareEngineerReport);
  const [selectedOptimizationKey, setSelectedOptimizationKey] = useState<string>('headline');
  const [isNewAnalysisOpen, setIsNewAnalysisOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateHeadline = (newHeadline: string) => {
    setActiveProfile((prev) => {
      const updated = {
        ...prev,
        currentHeadline: newHeadline,
        sections: prev.sections.map((s) =>
          s.id === 'headline'
            ? { ...s, evidenceQuote: `"${newHeadline}"`, status: 'Strong Foundation' as const, statusType: 'strong' as const }
            : s
        ),
      };
      return updated;
    });

    setAllProfiles((prev) =>
      prev.map((p) => (p.id === activeProfile.id ? { ...p, currentHeadline: newHeadline } : p))
    );

    showToast('Headline applied to your profile and refreshed!');
  };

  const handleAnalyzeNew = async (url: string, targetRole: string, userName: string) => {
    const newReport = await AnalysisService.analyzeProfile(url, targetRole, userName);

    setAllProfiles((prev) => [newReport, ...prev]);
    setActiveProfile(newReport);
    setCurrentView('report');
    showToast(`Generated profile intelligence for ${targetRole}!`);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col selection:bg-[#dbe1ff] selection:text-[#00174b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            check_circle
          </span>
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeProfile={activeProfile}
        allProfiles={allProfiles}
        onSelectProfile={(p) => {
          setActiveProfile(p);
          showToast(`Switched active profile to ${p.userName}`);
        }}
        onOpenNewAnalysis={() => setIsNewAnalysisOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'report' && (
          <ReportView
            report={activeProfile}
            onNavigate={setCurrentView}
            onOpenNewAnalysis={() => setIsNewAnalysisOpen(true)}
            onSelectOptimization={(key) => setSelectedOptimizationKey(key)}
          />
        )}

        {currentView === 'what-to-improve' && (
          <WhatToImproveView
            report={activeProfile}
            onNavigate={setCurrentView}
            onSelectOptimization={(key) => {
              setSelectedOptimizationKey(key);
              setCurrentView('optimization-detail');
            }}
          />
        )}

        {currentView === 'sections' && (
          <SectionsAuditView
            report={activeProfile}
            onNavigate={setCurrentView}
            onSelectOptimization={(key) => {
              setSelectedOptimizationKey(key);
              setCurrentView('optimization-detail');
            }}
          />
        )}

        {currentView === 'roadmap' && (
          <RoadmapView
            report={activeProfile}
            onNavigate={setCurrentView}
            onSelectOptimization={(key) => {
              setSelectedOptimizationKey(key);
              setCurrentView('optimization-detail');
            }}
          />
        )}

        {currentView === 'optimization-detail' && (
          <OptimizationDetailView
            report={activeProfile}
            optimizationKey={selectedOptimizationKey}
            onNavigate={setCurrentView}
            onUpdateHeadline={handleUpdateHeadline}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737686]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">ProfileIQ</span>
            <span>•</span>
            <span>Profile Intelligence for Career Growth</span>
          </div>
          <div>
            Built with editorial intelligence & semantic role benchmarking.
          </div>
        </div>
      </footer>

      {/* New Analysis Modal */}
      <NewAnalysisModal
        isOpen={isNewAnalysisOpen}
        onClose={() => setIsNewAnalysisOpen(false)}
        onAnalyze={handleAnalyzeNew}
        sampleProfiles={allProfiles}
        onSelectSample={(p) => {
          setActiveProfile(p);
          setCurrentView('report');
          showToast(`Loaded ${p.userName}'s report`);
        }}
      />
    </div>
  );
}

export default App;
