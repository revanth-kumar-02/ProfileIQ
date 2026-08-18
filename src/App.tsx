import React, { useState } from 'react';
import { ViewMode, ProfileReport } from './types';
import { defaultSoftwareEngineerReport, sampleProfiles } from './data/sampleProfiles';
import { Navbar } from './components/Navbar';
import { ImportView } from './components/ImportView';
import { ProfileReviewView } from './components/ProfileReviewView';
import { TargetRoleView } from './components/TargetRoleView';
import { AnalyzingView } from './components/AnalyzingView';
import { ReportView } from './components/ReportView';
import { RefineView } from './components/RefineView';
import { AnalysisService } from './services/analysis.service';

export function App() {
  const [currentStep, setCurrentStep] = useState<ViewMode>('import');
  const [allProfiles, setAllProfiles] = useState<ProfileReport[]>(sampleProfiles);
  const [activeProfile, setActiveProfile] = useState<ProfileReport>(defaultSoftwareEngineerReport);
  const [selectedRefineSection, setSelectedRefineSection] = useState<string>('headline');

  // Input states during guided flow
  const [importedUrl, setImportedUrl] = useState('linkedin.com/in/alex-chen');
  const [candidateName, setCandidateName] = useState('Alex Chen');
  const [selectedTargetRole, setSelectedTargetRole] = useState('Software Engineer Intern');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Handle initial profile import
  const handleImportSubmit = (url: string, userName: string) => {
    setImportedUrl(url);
    setCandidateName(userName);
    setCurrentStep('profile-review');
  };

  // Handle selecting a sample profile from import screen
  const handleSelectSampleProfile = (profile: ProfileReport) => {
    setActiveProfile(profile);
    setImportedUrl(profile.url);
    setCandidateName(profile.userName);
    setSelectedTargetRole(profile.targetRole);
    setCurrentStep('profile-review');
  };

  // 2. Handle profile confirmation
  const handleConfirmProfile = () => {
    setCurrentStep('target-role');
  };

  // 3. Handle target role selection
  const handleSelectTargetRole = (roleTitle: string) => {
    setSelectedTargetRole(roleTitle);
    setCurrentStep('analyzing');
  };

  // 4. Handle analysis completion
  const handleAnalysisComplete = async () => {
    const newReport = await AnalysisService.analyzeProfile(
      importedUrl,
      selectedTargetRole,
      candidateName
    );

    setAllProfiles((prev) => [newReport, ...prev]);
    setActiveProfile(newReport);
    setCurrentStep('report');
    showToast(`Generated profile intelligence for ${selectedTargetRole}!`);
  };

  // Handle headline update from refine view
  const handleUpdateHeadline = (newHeadline: string) => {
    setActiveProfile((prev) => ({
      ...prev,
      currentHeadline: newHeadline,
      sections: prev.sections.map((s) =>
        s.id === 'headline'
          ? {
              ...s,
              evidenceQuote: `"${newHeadline}"`,
              status: 'Strong Foundation',
              statusType: 'strong',
            }
          : s
      ),
    }));

    setAllProfiles((prev) =>
      prev.map((p) => (p.id === activeProfile.id ? { ...p, currentHeadline: newHeadline } : p))
    );

    showToast('Updated headline applied to profile!');
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

      {/* Minimal Header */}
      <Navbar
        currentView={currentStep}
        onNavigate={setCurrentStep}
        activeProfile={activeProfile}
        onStartNewAnalysis={() => setCurrentStep('import')}
      />

      {/* Main Content Area: Guided User Flow */}
      <main className="flex-1 pb-16">
        {currentStep === 'import' && (
          <ImportView
            onContinue={handleImportSubmit}
            sampleProfiles={allProfiles}
            onSelectSample={handleSelectSampleProfile}
          />
        )}

        {currentStep === 'profile-review' && (
          <ProfileReviewView
            profile={activeProfile}
            onConfirm={handleConfirmProfile}
            onUpdateHeadline={handleUpdateHeadline}
          />
        )}

        {currentStep === 'target-role' && (
          <TargetRoleView
            initialRole={selectedTargetRole}
            onSelectRole={handleSelectTargetRole}
          />
        )}

        {currentStep === 'analyzing' && (
          <AnalyzingView
            targetRole={selectedTargetRole}
            userName={candidateName}
            onComplete={handleAnalysisComplete}
          />
        )}

        {currentStep === 'report' && (
          <ReportView
            report={activeProfile}
            onOpenNewAnalysis={() => setCurrentStep('import')}
            onSelectRefineSection={(sectionKey) => {
              setSelectedRefineSection(sectionKey);
              setCurrentStep('refine');
            }}
          />
        )}

        {currentStep === 'refine' && (
          <RefineView
            report={activeProfile}
            sectionKey={selectedRefineSection}
            onBack={() => setCurrentStep('report')}
            onUpdateHeadline={handleUpdateHeadline}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">ProfileIQ</span>
            <span>•</span>
            <span>Understand what your profile communicates</span>
          </div>
          <div>
            Guided profile intelligence & strategic role alignment.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
