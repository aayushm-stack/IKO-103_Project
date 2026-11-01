import React, { useState, useEffect } from 'react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { MASTER_MICRO_SWAPS, MicroSwapItem } from '../../data/microSwaps';
import {
  User,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Trash2,
  Sliders,
  Check,
  Bell,
  BookOpen,
  Smartphone,
} from 'lucide-react';
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
 * SettingsPage handles user identity preferences, Pause Gate micro-swap customization,
 * and secure local data management.
 *
 * Implements:
 * 1. Profile Section (Name auto-save).
 * 2. Pause Gate Toolkit Section (Select 2 to 12 customizable Shreyas Micro-Swaps).
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

  // Selected micro-swap IDs with fallback to all 12 master micro-swaps
  const selectedSwapIds: string[] =
    Array.isArray(preferences.selectedMicroSwapIds) && preferences.selectedMicroSwapIds.length > 0
      ? preferences.selectedMicroSwapIds
      : MASTER_MICRO_SWAPS.map((s) => s.id);

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

  // Toggle Micro-Swap with strict minimum-of-2 validation
  const handleToggleSwap = (swapId: string) => {
    const isChecked = selectedSwapIds.includes(swapId);

    if (isChecked) {
      // Validation Logic: If user tries to uncheck an item and resulting length < 2, ignore the click
      if (selectedSwapIds.length <= 2) {
        return;
      }
      const next = selectedSwapIds.filter((id) => id !== swapId);
      updatePreferences({ selectedMicroSwapIds: next });
    } else {
      // Add up to 12 swaps
      const next = [...selectedSwapIds, swapId];
      updatePreferences({ selectedMicroSwapIds: next });
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
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Personal Sanctum &amp; Config
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Local-First
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Settings &amp; Preferences
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage your personal identity, impulse interceptor toolkit, and local data persistence.
          </p>
        </div>
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
            {currentBaselineHours} hrs / day
          </span>
        </div>

        {/* Dedicated Psychological Explanation Box */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            Standard tracking apps set a rigid, low screen-time limit that makes you feel judged or demotivated the moment you log an honest 7 or 8 hours. BrahmaPath works differently: you set your honest current daily average right here, and your Sadhana slider automatically expands its maximum limit to {dynamicMaxHours} hours (+4 hours of breathing room) so your current habit never looks like a worst-case failure.
          </p>
          <p>
            When you log below {currentBaselineHours} hours, the engine celebrates your recovery. When you stay near {currentBaselineHours} hours, it honors your steady control. And as your habits heal over the coming weeks, you can lower this baseline at your own pace—while your past Vault logs permanently keep the achievements they earned under your earlier baseline.
          </p>
        </div>

        {/* Interactive Baseline Slider (2.0 hrs to 12.0 hrs, step 0.5) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="baseline-screen-slider"
              className="text-xs font-bold text-slate-800"
            >
              What is your current average screen time that you want to gradually reduce?
            </label>
            <span className="text-xs font-extrabold text-[#D97706]">
              {currentBaselineHours} hrs
            </span>
          </div>
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
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
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

      {/* MIDDLE SECTION: Impulse Interceptor */}
      <section
        aria-label="Impulse Interceptor Micro-Swap Selection"
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
              <Sliders className="w-4 h-4 text-orange-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                Impulse Interceptor
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                Micro-Swap Toolkit
              </p>
            </div>
          </div>

          {/* Active Counter Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex-shrink-0 ${
              selectedSwapIds.length <= 2
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {selectedSwapIds.length} / 12
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Select between 2 and 12 Shreyas Micro-Swaps. These wholesome somatic and mental actions appear
          when intercepting compulsive dopamine triggers.
        </p>

        {/* Clean Grid of the 12 Swaps with Variable Row Heights and Perfectly Aligned Row Pairs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          {MASTER_MICRO_SWAPS.map((swap: MicroSwapItem) => {
            const isChecked = selectedSwapIds.includes(swap.id);
            const isAtMinimum = isChecked && selectedSwapIds.length <= 2;

            return (
              <label
                key={swap.id}
                className="relative block select-none group cursor-pointer h-full"
              >
                {/* Hidden default native checkbox */}
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={() => handleToggleSwap(swap.id)}
                />

                {/* Styled Card */}
                <div
                  className={`border rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all flex flex-col justify-between h-full shadow-2xs hover:shadow-xs ${
                    isChecked
                      ? 'border-orange-500 bg-orange-50/80 ring-1 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header: Title on left, Checkbox on right (No Emojis) */}
                    <div className="flex items-start justify-between gap-2.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {swap.title}
                      </span>

                      {/* Custom Checkbox Indicator Box at Top-Right */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-orange-500 text-white shadow-2xs'
                            : 'border border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Gray Line Below the Heading */}
                    <div className="border-b border-slate-200/80" />

                    {/* Explanatory Rule & Instructions (2-3 lines) */}
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                      {swap.description}
                    </p>
                  </div>

                  {/* Bottom Category & Minimum Warning */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400 uppercase tracking-wider font-semibold">
                      {swap.category}
                    </span>
                    {isAtMinimum && (
                      <span className="text-amber-700 font-semibold italic">
                        Min 2 required
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
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
