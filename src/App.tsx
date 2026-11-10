import React, { useState, useEffect } from 'react';
import { AccountProvider } from './context/AccountContext';
import { BrahmaPathProvider, useBrahmaPath } from './context/BrahmaPathContext';

import {
  scheduleDailySmritiAlarms,
  cancelDailySmritiAlarms,
} from './engine/notificationEngine';
import {
  AppLayout,
  TopBar,
  BottomNav,
  type NavTab,
  HomeDashboard,
  BreathePage,
  VaultPage,
  FeaturesPage,
  ShastraLensDrawer,
  SettingsModal,
  SettingsPage,
  AboutPage,
  SankalpaHub,
} from './components';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { SentinelDashboard } from './components/Sentinel/SentinelDashboard';
import { SentinelVault } from './components/Sentinel/SentinelVault';

type AppViewTab = 'home' | 'features' | 'vault' | 'breathe' | 'harness' | 'sankalpa' | 'settings' | 'about' | 'onboarding';

/**
 * Main application content bound to the global IKS context, decoupled account state,
 * and unified navigation.
 */
function MainContent() {
  const {
    activeView,
    setActiveView,
    activeLensData,
    closeShastraLens,
    openShastraLens,
    preferences,
    updatePreferences,
    userName,
  } = useBrahmaPath();

  const isFrontline = preferences?.battlegroundPath === 'frontline';

  // First-run vs returning user detection:
  // If user has already entered their name, onboarding is complete and app launches on Home.
  // Query param ?onboarding, ?step=..., or #onboarding allows previewing the onboarding flow anytime.
  const isPreviewingOnboarding =
    typeof window !== 'undefined' &&
    (window.location.search.includes('onboarding') ||
      window.location.search.includes('step=') ||
      window.location.hash.includes('onboarding'));

  const hasCompletedOnboarding =
    !isPreviewingOnboarding &&
    Boolean(
      (userName && userName.trim().length > 0) ||
        (preferences?.name && preferences.name.trim().length > 0)
    );

  const handleOnboardingComplete = (name: string) => {
    const validName = name.trim();
    if (validName) {
      updatePreferences({ name: validName, onboardingCompleted: true });
    }
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('brahmapath_onboarding_completed', 'true');
        if (!window.localStorage.getItem('brahmapath_sadhana_logs')) {
          window.localStorage.setItem('brahmapath_sadhana_logs', JSON.stringify([]));
        }
      }
    } catch (e) {
      console.warn('Failed to initialize empty sadhana logs:', e);
    }
  };

  // Navigation tab state bound to global activeView
  const activeTab = (activeView as AppViewTab) || 'home';
  const setActiveTab = (tab: AppViewTab) => {
    setActiveView(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  // Ensure window scrolls to top on any tab or view navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [activeTab, activeView]);

  // Global Settings Modal state (isolated from daily workflows)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Auto-Refresh 7-Day Rolling Smriti Notification Queue on App Launch
  useEffect(() => {
    const isEnabled =
      Boolean(preferences?.notificationsEnabled) ||
      (typeof window !== 'undefined' && localStorage.getItem('bp_notifications_enabled') === 'true');

    if (isEnabled) {
      scheduleDailySmritiAlarms().catch((err) => {
        console.warn('[App] Failed to auto-refresh Smriti alarms on mount:', err);
      });
    }
  }, []);

  // Update alarms when user toggles preferences
  useEffect(() => {
    if (preferences?.notificationsEnabled) {
      scheduleDailySmritiAlarms().catch(() => {});
    } else if (preferences && preferences.notificationsEnabled === false) {
      cancelDailySmritiAlarms().catch(() => {});
    }
  }, [preferences?.notificationsEnabled]);

  // If onboarding is not completed or requested via activeTab, render <OnboardingFlow /> full-screen
  if (!hasCompletedOnboarding || activeTab === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-parchment text-charcoal font-sans antialiased">
      {/* ================= VIEW 1: DEVELOPER / JUDGE TEST HARNESS ================= */}

        <div>
          {/* Header to quickly navigate back to the Mobile UI */}
          <div className="bg-[#1E293B] text-white text-xs px-4 py-2.5 flex items-center justify-between border-b border-slate-700 sticky top-0 z-50 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-semibold tracking-wide">
                BrahmaPath Dev / Judge Harness Mode
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              Back to Mobile UI
            </button>
          </div>

          {/* DevHarness component kept 100% intact for developer/judge evaluation */}
          <DevHarness />
        </div>
      ) : (
        /* ================= VIEW 2: PRODUCTION MOBILE-FIRST UI ================= */
        <AppLayout>
          {/* Top Bar with Sankalpa Goal Centre, isolated Settings modal trigger, and invisible judge double-click */}
          <TopBar
            onSankalpaClick={() => setActiveTab(activeTab === 'sankalpa' ? 'home' : 'sankalpa')}
            isSankalpaActive={activeTab === 'sankalpa'}
            onSettingsClick={() => setActiveTab(activeTab === 'settings' || activeTab === 'about' ? 'home' : 'settings')}
            isSettingsActive={activeTab === 'settings' || activeTab === 'about'}
          />

          <main className="p-4 space-y-4">
            {/* 1. HOME TAB: Clean Cognitive Frameworks (Chariot, Gita Quote, Guna Spectrum) */}
            {activeTab === 'home' && (
              isFrontline ? <SentinelDashboard /> : <HomeDashboard onOpenShastraLens={openShastraLens} />
            )}

            {/* 2. FEATURES TAB (Sadhana Hub, Impulse Interceptor, Bhava Compass) */}
            {activeTab === 'features' && (
              <FeaturesPage />
            )}

            {/* 3. VAULT TAB (Analytics, 8-Day Rolling Dynamic LineChart (Last 7 Days + Current Day) & Offline Backup) */}
            {activeTab === 'vault' && (
              isFrontline ? <SentinelVault /> : <VaultPage />
            )}

            {/* 4. BREATHE TAB (Prāṇamaya Kosha Regulation) */}
            {activeTab === 'breathe' && (
              <div className="space-y-4">
                <BreathePage />
              </div>
            )}

            {/* 5. SANKALPA VIEWPORT (Personalised Intentions & Goals) */}
            {activeTab === 'sankalpa' && (
              <div className="space-y-4">
                <SankalpaHub onOpenShastraLens={openShastraLens} />
              </div>
            )}

            {/* 6. SETTINGS VIEWPORT (User Profile & Danger Zone) */}
            {activeTab === 'settings' && (
              <SettingsPage />
            )}

            {/* 7. ABOUT VIEWPORT (Dedicated Walkthrough & Niṣkāma Bhāva Offering) */}
            {(activeTab === 'about' || activeView === 'about') && (
              <AboutPage onBack={() => setActiveTab('settings')} />
            )}
          </main>

          {/* 4-Icon Bottom Navigation */}
          <BottomNav
            activeTab={activeTab as NavTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        </AppLayout>
      )}

      {/* Slide-out Shastra Lens Drawer */}
      <ShastraLensDrawer
        isOpen={Boolean(activeLensData)}
        onClose={closeShastraLens}
        verse={activeLensData?.sanskritVerse ?? ''}
        transliteration={activeLensData?.transliteration}
        source={activeLensData?.sourceText}
        literalMeaning={activeLensData?.literalMeaning}
        commentary={activeLensData?.literalMeaning || ''}
        practicalApplication={activeLensData?.practicalModernApplication}
        featureKey={activeLensData?.featureKey}
      />

      {/* Global Settings & Account Modal - Kept out of daily workflow */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenDevHarness={() => setActiveTab('harness')}
      />
    </div>
  );
}

/**
 * Root Application Wrapper supplying decoupled global account state and IKS context.
 */
export default function App() {
  return (
    <AccountProvider>
      <BrahmaPathProvider>
        <MainContent />
      </BrahmaPathProvider>
    </AccountProvider>
  );
}
