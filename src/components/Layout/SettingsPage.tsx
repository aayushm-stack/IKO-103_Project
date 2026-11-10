import React, { useState, useEffect } from 'react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import {
  User,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Trash2,
  Check,
  Bell,
  BookOpen,
  Smartphone,
} from 'lucide-react';
import { LIFE_RHYTHMS } from '../../data/seekerShastraData';
import { DEPLOYMENT_ENVIRONMENTS } from '../../data/sentinelShastraData';
import { LifeRhythm, DeploymentEnvironment } from '../../types/shastra';
import {
  FOUNDATIONAL_SEEKER_SANKALPA,
  FOUNDATIONAL_SENTINEL_SANKALPA,
} from '../Onboarding/OnboardingFlow';

import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
  sendTestNotification,
  scheduleDailySmritiAlarms,
  cancelDailySmritiAlarms,
  type NotificationPermissionStatus,
} from '../../engine/notificationEngine';

export interface SettingsPageProps {
  className?: string;
  setActiveView?: (view: string) => void;
}

/**
 * SettingsPage handles user identity preferences, Impulse Interceptor customization,
 * and secure local data management.
 *
 * Implements:
 * 1. Profile Section (Name auto-save).
 * 2. Dynamic Life Rhythm and Posting Terrain Adaptive Micro-Swaps.
 *    - Clickable card wrapped in <label>
 *    - Hidden native checkbox: `sr-only peer`
 *    - Custom card styling: `border border-slate-200 rounded-xl p-3 cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50`
 *    - Validation logic: Enforces minimum of 2 selections (ignores click if unchecking would result in < 2).
 * 3. Smriti (Mindful Check-ins) Section:
 *    - Enable Daily Reminders toggle switch.
 *    - Fires requestNotificationPermission() on toggle ON.
 *    - Muted helper text explaining 4 daily notifications.
 * 4. Danger Zone Data Management Section.
 *    - Destructive button styled with `border-red-500 text-red-600`
 *    - Safety Lock: In-app modal with terracotta header and Cancel/Reset actions.
 *    - Instant execution of resetAllData() and redirect via setActiveView('home').
 */
export const SettingsPage: React.FC<SettingsPageProps> = ({
  className = '',
  setActiveView: setActiveViewProp,
}) => {
  const { preferences, updatePreferences, resetAllData, setActiveView: contextSetActiveView } =
    useBrahmaPath();

  const currentBaselineHours = preferences?.averageScreenTimeHours ?? 6;
  const dynamicMaxHours = Math.min(16, currentBaselineHours + 4);

  // Prefer prop if provided, otherwise fallback to context routing
  const setActiveView = setActiveViewProp || contextSetActiveView;

  const [showResetModal, setShowResetModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>(() =>
    getNotificationPermissionStatus()
  );
  const [testNotificationFeedback, setTestNotificationFeedback] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  // Local state for Name field with empty string validation
  const [nameInput, setNameInput] = useState<string>(preferences.name ?? '');
  const [nameError, setNameError] = useState<string>('');
  
  // Active Sankalpa in Settings - Non-editable exact agreed pledge
  const isFrontline = preferences.battlegroundPath === 'frontline';
  const currentRhythm = preferences.lifeRhythm ?? 'learning_study';
  const currentEnv = preferences.deploymentEnvironment ?? 'active_border';

  const activePledge = isFrontline
    ? FOUNDATIONAL_SENTINEL_SANKALPA
    : FOUNDATIONAL_SEEKER_SANKALPA;


  // Keep nameInput in sync if preferences.name changes externally and no active error
  useEffect(() => {
    if (preferences.name && preferences.name !== nameInput && !nameError) {
      setNameInput(preferences.name);
    }
  }, [preferences.name]);

  const handleNameChange = (val: string) => {
    setNameInput(val);
    const trimmed = val.trim();
    if (trimmed.length === 0) {
      setNameError('Name cannot be empty. Please enter your name.');
      // Explicitly DO NOT save empty string to preferences
    } else {
      setNameError('');
      updatePreferences({ name: trimmed });
    }
  };

  const handleNameBlur = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length === 0) {
      setNameError('Name cannot be empty. Please enter your name.');
      // Revert to existing valid name so input is never left empty/null
      const fallback = preferences.name?.trim() || 'Sadhaka';
      setNameInput(fallback);
      updatePreferences({ name: fallback });
      setTimeout(() => setNameError(''), 2500);
    } else {
      setNameError('');
      updatePreferences({ name: trimmed });
    }
  };

  // Toggle Smriti daily notifications without blocking or snapping back
  const handleToggleNotifications = async () => {
    const nextState = !preferences.notificationsEnabled;
    // Never block the toggle switch from sliding ON:
    updatePreferences({ notificationsEnabled: nextState });

    if (nextState) {
      // Immediately call requestNotificationPermission directly inside user click handler
      const granted = await requestNotificationPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
      await scheduleDailySmritiAlarms();
    } else {
      await cancelDailySmritiAlarms();
      setTestNotificationFeedback(null);
    }
  };

  const handleRetryPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      await scheduleDailySmritiAlarms();
    }
  };

  const handleSendTestNotification = async () => {
    const result = await sendTestNotification(
      'Smriti Check-in — Brahma Path',
      'Take a conscious breath. Where is your attention anchored right now?'
    );
    if (result.osFired) {
      setTestNotificationFeedback({
        text: 'Notification sent to your device!',
        isError: false,
      });
    } else {
      setTestNotificationFeedback({
        text: 'Test check-in triggered.',
        isError: false,
      });
    }
    setTimeout(() => setTestNotificationFeedback(null), 4000);
  };

  return (
    <div className={`w-full max-w-md mx-auto p-4 space-y-6 pb-24 ${className}`}>
      {/* Page Title & Context Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-1">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Manage your personal identity, impulse interceptor toolkit, and local data persistence.
        </p>
      </div>

      {/* TOP SECTION: User Identity / Profile (Name) */}
      <section
        aria-label="User Profile"
        className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
            <User className="w-4 h-4 text-[#D97706]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Profile
            </h2>
            <p className="text-[11px] text-slate-500">
              Identity parameters auto-saved to device storage
            </p>
          </div>
        </div>

        {/* Name Input Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-name-input"
            className="text-xs font-bold text-slate-800 uppercase tracking-wider block"
          >
            Name
          </label>
          <div className="relative">
            <input
              id="profile-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium transition shadow-2xs focus:outline-none ${
                nameError
                  ? 'border-red-400 bg-red-50/30 text-slate-900 focus:ring-2 focus:ring-red-400/30 focus:border-red-500'
                  : 'border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600'
              }`}
            />
          </div>
          {nameError ? (
            <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span>{nameError}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 leading-normal">
              Used across daily greetings, reflection logs, and chariot reports.
            </p>
          )}
        </div>

        {/* Dynamic preview / auto-save status banner */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">
              {nameError ? 'Changes not saved (invalid name)' : 'Auto-saved on change'}
            </span>
          </div>
          <span className="text-[11px] font-serif italic text-amber-800">
            Namaste, {nameInput.trim() ? nameInput.trim() : (preferences.name?.trim() || 'Sadhaka')}
          </span>
        </div>
      </section>

      {/* 2B. ACTIVE BATTLEGROUND SUB-GROUP OPTIONS (BELOW EACH OTHER) */}
      <section
        aria-label="Active Stage Sub-Group"
        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3"
      >
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            {isFrontline
              ? 'Deployment Posting Environment'
              : 'Current Life Rhythm'}
          </h2>
          <p className="text-xs text-slate-500">
            {isFrontline
              ? 'Select your operational posting terrain to adapt somatic countermeasures and watch sleep tools.'
              : 'Select your daily arena rhythm to adapt focus prompts, triggers, and cognitive tools.'}
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          {isFrontline ? (
            DEPLOYMENT_ENVIRONMENTS.map((envItem) => {
              const isSelected = currentEnv === envItem.id;
              return (
                <button
                  key={envItem.id}
                  type="button"
                  onClick={() => updatePreferences({ deploymentEnvironment: envItem.id })}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-700/80 text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{envItem.label}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-emerald-700 bg-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                    </div>
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#D97706] mt-0.5 block">
                    {envItem.badge}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {envItem.summary}
                  </p>
                </button>
              );
            })
          ) : (
            LIFE_RHYTHMS.map((rhythm) => {
              const isSelected = currentRhythm === rhythm.id;
              return (
                <button
                  key={rhythm.id}
                  type="button"
                  onClick={() => updatePreferences({ lifeRhythm: rhythm.id })}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-700/80 text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{rhythm.label}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-emerald-700 bg-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                    </div>
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#D97706] mt-0.5 block">
                    {rhythm.badge}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {rhythm.summary}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* 2C. FOUNDATIONAL SANKALPA (INNER PLEDGE) - NON-EDITABLE */}
      <section
        aria-label="Foundational Sankalpa"
        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3"
      >
        <div className="space-y-0.5 pb-2 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            Your Sankalpa (Inner Pledge)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The foundational intention you anchored when initiating BrahmaPath.
          </p>
        </div>

        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/90 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic">
          {activePledge}
        </div>
      </section>

      {/* ADAPTIVE SCREEN TIME BASELINE SECTION */}
      <section
        aria-label="Screen Time Baseline Configuration"
        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#D97706]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Current Screen Time
              </h2>
              <p className="text-[11px] text-slate-500">
                Self-Anchored Baseline
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 whitespace-nowrap">
            {currentBaselineHours.toFixed(1)} hrs daily
          </span>
        </div>

        {/* Dedicated Psychological Explanation Box */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            Standard tracking apps set a rigid, low screen-time limit that makes you feel judged or demotivated the moment you log an honest day. BrahmaPath works differently: you set your honest current daily average right here (for example, 6 hours), and your Sadhana slider automatically expands its upper limit to 10 hours (+4 hours of breathing room) so your daily reality never feels like an immediate failure.
          </p>
          <p>
            When you log below 6 hours, the engine celebrates your recovery. When you stay near 6 hours, it honors your steady control. And as your habits heal over the coming weeks, you can gradually lower this baseline at your own pace—while your past Vault records permanently keep the achievements they earned.
          </p>
        </div>

        {/* Interactive Baseline Slider (2.0 hrs to 12.0 hrs, step 0.5) */}
        <div className="space-y-2.5 pt-1">
          <label
            htmlFor="baseline-screen-slider"
            className="text-xs font-bold text-slate-800 leading-relaxed block"
          >
            What is your current average screen time that you want to gradually reduce?
          </label>

          <input
            id="baseline-screen-slider"
            type="range"
            min="2"
            max="12"
            step="0.5"
            value={currentBaselineHours}
            onChange={(e) => updatePreferences({ averageScreenTimeHours: Number(e.target.value) })}
            className="w-full accent-[#D97706] cursor-pointer"
          />

          {/* Chosen Dynamic Hour - Center Aligned Just Below Slider */}
          <div className="flex justify-center pt-0.5">
            <span className="text-xs sm:text-sm font-extrabold text-[#D97706] bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/80 shadow-2xs">
              {currentBaselineHours.toFixed(1)} hrs
            </span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
            <span>2.0 hrs (Low)</span>
            <span>6.0 hrs (Default)</span>
            <span>12.0 hrs (High)</span>
          </div>
        </div>

        {/* Live 4-Zone Preview Strip Inside the Settings Card */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60">
            <span className="font-bold text-emerald-800 block">Significant Drop</span>
            <span className="text-emerald-700 font-medium">
              0 – {(currentBaselineHours * 0.5).toFixed(1)} hrs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/60">
            <span className="font-bold text-teal-800 block">Steady Recovery</span>
            <span className="text-teal-700 font-medium">
              {(currentBaselineHours * 0.5).toFixed(1)} – {(currentBaselineHours * 0.85).toFixed(1)} hrs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60">
            <span className="font-bold text-amber-800 block">Maintained Zone</span>
            <span className="text-amber-700 font-medium">
              {(currentBaselineHours * 0.85).toFixed(1)} – {(currentBaselineHours * 1.125).toFixed(1)} hrs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/80">
            <span className="font-bold text-slate-800 block">Slider Ceiling</span>
            <span className="text-slate-600 font-medium">
              Up to {dynamicMaxHours} hrs max
            </span>
          </div>
        </div>
      </section>



      {/* SECTION: Smriti (Mindful Check-ins) */}
      <section
        aria-label="Smriti Mindful Check-ins"
        className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#D97706]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Get notified for Smriti
            </h2>
            <p className="text-[11px] text-slate-500">
              Quiet daily nudges to step back from the noise.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-bold text-slate-800 block">
                Enable Daily Reminders
              </span>
              
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={Boolean(preferences.notificationsEnabled)}
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                preferences.notificationsEnabled ? 'bg-amber-600' : 'bg-slate-300'
              }`}
            >
              <span className="sr-only">Enable Daily Reminders</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  preferences.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dynamic Visual Status & Test Controls when notificationsEnabled is active */}
          {preferences.notificationsEnabled && (
            <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
              {/* Case 1: Granted */}
              {permissionStatus === 'granted' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Notifications Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendTestNotification}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                  >
                    Send Test Check-in
                  </button>
                </div>
              )}

              {/* Case 2: Denied */}
              {permissionStatus === 'denied' && (
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
                  <span>Notifications blocked. Please allow Notifications in App Settings.</span>
                  <button
                    type="button"
                    onClick={handleRetryPermission}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs cursor-pointer whitespace-nowrap"
                  >
                    Retry Permission
                  </button>
                </div>
              )}

              {/* In-App Feedback Banner */}
              {testNotificationFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-xs transition-all animate-in fade-in duration-200 ${
                    testNotificationFeedback.isError
                      ? 'bg-amber-50 border border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20'
                  }`}
                >
                  {testNotificationFeedback.isError ? (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  <span>{testNotificationFeedback.text}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION: About BrahmaPath Walkthrough */}
      <section
        aria-label="About BrahmaPath Walkthrough"
        className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#D97706]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About BrahmaPath
            </h2>
            <p className="text-[11px] text-slate-500">
              Understanding your 12 inner equilibrium tools
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          Read a complete walkthrough of all 12 features in BrahmaPath and know how they work together to support your daily equilibrium.
        </p>

        <button
          type="button"
          onClick={() => setActiveView('about')}
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/90 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
        >
          <span>About BrahmaPath</span>
        </button>
      </section>

      {/* MIDDLE/BOTTOM SECTION: Data Management / Danger Zone (Reset) */}
      <section
        aria-label="Data Management Danger Zone"
        className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-900 uppercase tracking-wider">
              Data Management
            </h2>
            <p className="text-[11px] text-rose-700/80">
              Irreversible actions affecting your local storage
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-rose-50/70 border border-rose-200/60 rounded-2xl text-xs text-rose-800 leading-relaxed space-y-1">
          <p className="font-semibold text-rose-900">
            Erase entire app data
          </p>
          <p className="text-[11px] text-rose-700">
            This will permanently erase all logged daily sadhanas, pratipaksha interceptions, custom preferences from the settings, as well as the username, and you will be redirected to the clean onboarding page.
          </p>
        </div>

        {/* Destructive Action Button */}
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-red-500 text-red-600 bg-red-50/60 hover:bg-red-100 active:scale-[0.98] font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>Reset App Data</span>
        </button>
      </section>

      {/* In-App Reset Confirmation Modal */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowResetModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3
              id="reset-modal-title"
              className="text-lg font-bold text-[#C2410C]"
            >
              Are you sure you want to reset app data?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to erase your entire app data? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
