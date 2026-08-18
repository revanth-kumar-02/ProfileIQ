import React, { useState } from 'react';
import { ViewMode } from './types';
import { Navbar } from './components/Navbar';
import { ImportView } from './components/ImportView';
import { ProfileReviewView } from './components/ProfileReviewView';
import { TargetRoleView } from './components/TargetRoleView';
import { AnalyzingView } from './components/AnalyzingView';
import { ReportView } from './components/ReportView';
import { RefineView } from './components/RefineView';
import { analysisStore, useAnalysisStore } from './store/analysisStore';

export function App() {
  const { currentProfile, currentAnalysis } = useAnalysisStore();

  const [currentStep, setCurrentStep] = useState<ViewMode>('import');
  const [selectedRefineSection, setSelectedRefineSection] = useState<string>('headline');

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleStartNewAnalysis = () => {
    analysisStore.reset();
    setCurrentStep('import');
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentStep(view);
  };

  const handleSelectRefineSection = (sectionKey: string) => {
    setSelectedRefineSection(sectionKey);
    setCurrentStep('refine');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-100 selection:text-[#004ac6]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="px-4 py-3 bg-[#0F172A] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 border border-slate-700">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        currentView={currentStep}
        onNavigate={handleNavigate}
        onStartNewAnalysis={handleStartNewAnalysis}
      />

      {/* Main Journey Container */}
      <main className="flex-1 w-full pb-16">
        {currentStep === 'import' && (
          <ImportView onSuccess={() => setCurrentStep('profile-review')} />
        )}

        {currentStep === 'profile-review' && (
          <ProfileReviewView onConfirm={() => setCurrentStep('target-role')} />
        )}

        {currentStep === 'target-role' && (
          <TargetRoleView onContinue={() => setCurrentStep('analyzing')} />
        )}

        {currentStep === 'analyzing' && (
          <AnalyzingView onComplete={() => setCurrentStep('report')} />
        )}

        {currentStep === 'report' && (
          <ReportView
            onOpenNewAnalysis={handleStartNewAnalysis}
            onSelectRefineSection={handleSelectRefineSection}
          />
        )}

        {currentStep === 'refine' && (
          <RefineView
            sectionKey={selectedRefineSection}
            onBack={() => setCurrentStep('report')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">ProfileIQ</span>
            <span>— Profile Intelligence Platform</span>
          </div>
          <p>© {new Date().getFullYear()} ProfileIQ. Driven by dynamic profile ingestion.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
