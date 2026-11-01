import React, { useState } from 'react';
import { ShastraLensButton } from './Shastra/ShastraLensButton';
import { useBrahmaPath } from '../context/BrahmaPathContext';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import {
  estimateCascadeStage,
  GITA_CASCADE_STEPS,
} from '../engine/cascadeEngine';
import {
  TRIGGER_REFRAME_TEMPLATES,
  validatePratipakshaReframe,
} from '../engine/pratipakshaEngine';
import { BHAVA_COMPASS_MAP } from '../engine/bhavaEngine';
import { computeYuktaScore } from '../engine/yuktaEngine';
import {
  TriggerCategory,
  BhavaEmotion,
  GunaType,
  ShastraFeatureKey,
} from '../types/iks';

type TabKey = 'sadhana' | 'interceptor' | 'breathing' | 'bhava' | 'vault';

export function DevHarness() {
  const {
    userName,
    setUserName,
    logs,
    preferences,
    todayLog,
    addOrUpdateDailyLog,
    interceptions,
    logInterception,
    gunaDistribution,
    doshaDiagnosis,
    chariotStatus,
    weeklyTrend,
    triggerBreakdown,
    activeLensData,
    openShastraLens,
    closeShastraLens,
    exportPlainJsonBackup,
    importPlainJsonBackup,
    exportEncryptedBackup,
    importEncryptedBackup,
    resetAllData,
  } = useBrahmaPath();

  const [activeTab, setActiveTab] = useState<TabKey>('sadhana');

  // --- SADHANA HUB STATE ---
  const [nutritionQuality, setNutritionQuality] = useState<'Sattvic' | 'Rajasic' | 'Tamasic'>(
    todayLog?.ahara.nutritionQuality ?? 'Sattvic'
  );
  const [digitalMinutes, setDigitalMinutes] = useState<number>(
    todayLog?.ahara.digitalConsumptionMinutes ?? 90
  );
  const [mindfulnessScore, setMindfulnessScore] = useState<number>(
    todayLog?.ahara.sensoryMindfulnessScore ?? 4
  );
  const [hoursSlept, setHoursSlept] = useState<number>(todayLog?.nidra.hoursSlept ?? 7.5);
  const [bedtimeConsistency, setBedtimeConsistency] = useState<boolean>(
    todayLog?.nidra.bedtimeConsistency ?? true
  );
  const [restQuality, setRestQuality] = useState<'Restorative' | 'Disturbed' | 'Lethargic'>(
    todayLog?.nidra.restQuality ?? 'Restorative'
  );
  const [energyRating, setEnergyRating] = useState<number>(
    todayLog?.brahmacharya.energyConservationRating ?? 4
  );
  const [studyBlocks, setStudyBlocks] = useState<number>(
    todayLog?.brahmacharya.focusedStudyBlocks ?? 4
  );
  const [dominantGuna, setDominantGuna] = useState<GunaType>(
    todayLog?.brahmacharya.dominantGuna ?? 'Sattva'
  );
  const [reflection, setReflection] = useState<string>(
    todayLog?.generalReflection ?? ''
  );
  const [sadhanaMessage, setSadhanaMessage] = useState<string>('');

  // --- PAUSE GATE STATE ---
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerCategory>('Doomscrolling');
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [vitarkaText, setVitarkaText] = useState<string>(
    TRIGGER_REFRAME_TEMPLATES.Doomscrolling.vitarkaExample
  );
  const [pratipakshaText, setPratipakshaText] = useState<string>(
    TRIGGER_REFRAME_TEMPLATES.Doomscrolling.suggestedReframe
  );
  const [selectedSwap, setSelectedSwap] = useState<string>(
    TRIGGER_REFRAME_TEMPLATES.Doomscrolling.defaultMicroSwaps[0]
  );
  const [gateFeedback, setGateFeedback] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  // --- BREATHING ENGINE HOOK ---
  const breathing = useBreathingEngine('SamaVritti');
  const isBreathingHold = breathing.actionText === 'HOLD' || breathing.actionText === 'PAUSED';

  // --- BHAVA COMPASS STATE ---
  const [selectedEmotion, setSelectedEmotion] = useState<BhavaEmotion>('Peer_Envy');

  // --- VAULT SECURITY STATE ---
  const [vaultPassword, setVaultPassword] = useState<string>('');
  const [vaultMessage, setVaultMessage] = useState<string>('');

  // Handle trigger change in Pause Gate
  const handleTriggerSelect = (cat: TriggerCategory) => {
    setSelectedTrigger(cat);
    const tmpl = TRIGGER_REFRAME_TEMPLATES[cat];
    setVitarkaText(tmpl.vitarkaExample);
    setPratipakshaText(tmpl.suggestedReframe);
    setSelectedSwap(tmpl.defaultMicroSwaps[0]);
    setGateFeedback(null);
  };

  // Submit Sadhana Log
  const handleSaveSadhana = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const ahara = {
      nutritionQuality,
      digitalConsumptionMinutes: Number(digitalMinutes),
      sensoryMindfulnessScore: Number(mindfulnessScore),
    };
    const nidra = {
      hoursSlept: Number(hoursSlept),
      bedtimeConsistency,
      restQuality,
    };
    const brahmacharya = {
      energyConservationRating: Number(energyRating),
      focusedStudyBlocks: Number(studyBlocks),
      dominantGuna,
    };

    const score = computeYuktaScore(ahara, nidra, brahmacharya);
    addOrUpdateDailyLog(
      {
        date: today,
        ahara,
        nidra,
        brahmacharya,
        generalReflection: reflection,
      },
      score
    );

    setSadhanaMessage(`Sadhana saved for ${today}! Yukta Balance Score: ${score}/100`);
    setTimeout(() => setSadhanaMessage(''), 5000);
  };

  // Submit Pause Gate
  const handleCommitInterception = () => {
    const validation = validatePratipakshaReframe(vitarkaText, pratipakshaText);
    if (!validation.isValid) {
      setGateFeedback({ text: validation.feedback, isError: true });
      return;
    }

    const currentStageInfo = estimateCascadeStage(selectedTrigger, urgeIntensity);

    logInterception({
      triggerCategory: selectedTrigger,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText,
      pratipakshaText,
      selectedMicroSwap: selectedSwap,
      microSwapAction: selectedSwap,
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: validation.resultingGuna,
    });

    setGateFeedback({
      text: `Interception logged at stage "${currentStageInfo.englishTitle}". ${validation.feedback}`,
      isError: false,
    });
  };

  const estimatedStage = estimateCascadeStage(selectedTrigger, urgeIntensity);

  return (
    <div
      style={{
        backgroundColor: '#FDFBF7',
        color: '#1E293B',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      className="p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ==================== TOP HEADER ==================== */}
        <header
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
          className="p-6 space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  BrahmaPath Dev Harness
                </h1>
                <span
                  style={{
                    backgroundColor:
                      chariotStatus.state === 'Calm'
                        ? '#DEF7EC'
                        : chariotStatus.state === 'Brisk'
                        ? '#FEF08A'
                        : '#FEE2E2',
                    color:
                      chariotStatus.state === 'Calm'
                        ? '#03543F'
                        : chariotStatus.state === 'Brisk'
                        ? '#713F12'
                        : '#991B1B',
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full"
                >
                  Chariot: {chariotStatus.state}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Katha Upanishad Chariot Engine &amp; Gita 2.62-63 Cascade Architecture
              </p>
            </div>

            {/* Quick Shastra Lens buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openShastraLens('chariot')}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  borderColor: '#CBD5E1',
                }}
                className="text-xs px-3 py-1.5 rounded border hover:bg-slate-200 transition"
              >
                📜 Chariot Lens
              </button>
              <button
                onClick={() => openShastraLens('gunas')}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  borderColor: '#CBD5E1',
                }}
                className="text-xs px-3 py-1.5 rounded border hover:bg-slate-200 transition"
              >
                📜 Gunas Lens
              </button>
              <button
                onClick={() => openShastraLens('trayopastambha')}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  borderColor: '#CBD5E1',
                }}
                className="text-xs px-3 py-1.5 rounded border hover:bg-slate-200 transition"
              >
                📜 Trayopastambha Lens
              </button>
            </div>
          </div>

          {/* Global Settings & Account Preferred Name Section */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ⚙️ Global Settings:
              </span>
              <span className="text-[11px] text-slate-500">
                (Account identity kept out of daily task flow)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="harness-preferred-name" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Preferred Name:
              </label>
              <input
                id="harness-preferred-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="px-2.5 py-1 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-amber-800 font-medium">
                Active: {userName || 'Sadhaka'}
              </span>
            </div>
          </div>

          {/* Chariot Allegory Status Box */}
          <div
            style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
            className="p-4 rounded-lg border text-sm grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div>
              <span className="font-semibold text-slate-700 block">
                🐎 Senses (Horses):
              </span>
              <span className="text-slate-600">{chariotStatus.horsesStatus}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 block">
                🧵 Mind (Reins):
              </span>
              <span className="text-slate-600">{chariotStatus.reinsStatus}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 block">
                👑 Intellect (Charioteer):
              </span>
              <span className="text-slate-600">{chariotStatus.charioteerStatus}</span>
            </div>
          </div>

          {/* Tri-Guna & Dosha Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tri-Guna Balance:
              </span>
              <span
                style={{ backgroundColor: '#065F46', color: '#FFFFFF' }}
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                Sattva: {gunaDistribution.sattva}%
              </span>
              <span
                style={{ backgroundColor: '#D97706', color: '#FFFFFF' }}
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                Rajas: {gunaDistribution.rajas}%
              </span>
              <span
                style={{ backgroundColor: '#475569', color: '#FFFFFF' }}
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                Tamas: {gunaDistribution.tamas}%
              </span>
            </div>

            <div className="text-xs flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Dosha Diagnostic:</span>
              <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {doshaDiagnosis.aggravatedDosha} Aggravation
              </span>
              <span className="text-slate-500 hidden sm:inline">
                ({doshaDiagnosis.pranayamaSuggestion})
              </span>
            </div>
          </div>
        </header>

        {/* ==================== NAVIGATION TABS ==================== */}
        <div className="flex border-b border-slate-300 gap-2 overflow-x-auto pb-1">
          {(
            [
              { key: 'sadhana', label: '1. Sadhana Hub (Trayopastambha)' },
              { key: 'interceptor', label: '2. Impulse Interceptor' },
              { key: 'breathing', label: '3. Pranayama Sanctum' },
              { key: 'bhava', label: '4. Bhava Compass (YS 1.33)' },
              { key: 'vault', label: '5. Vault & Analytics' },
            ] as { key: TabKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                borderBottomWidth: activeTab === tab.key ? 3 : 0,
                borderBottomColor: '#D97706',
                color: activeTab === tab.key ? '#D97706' : '#64748B',
                fontWeight: activeTab === tab.key ? 600 : 500,
              }}
              className="px-4 py-2 text-sm whitespace-nowrap transition hover:text-slate-900"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: SADHANA HUB ==================== */}
        {activeTab === 'sadhana' && (
          <div
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
            className="p-6 rounded-xl border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Trayopastambha Daily Tracker (Charaka Sutra 11.35 &amp; Gita 6.17)
                </h2>
                <p className="text-xs text-slate-500">
                  Assess nourishment, sleep rhythm, and cognitive energy conservation.
                </p>
              </div>
              <ShastraLensButton onClick={() => openShastraLens('trayopastambha')} />
            </div>

            {sadhanaMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded">
                {sadhanaMessage}
              </div>
            )}

            <form onSubmit={handleSaveSadhana} className="space-y-6">
              {/* Ahara Pillar */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm">
                  🍲 1. Āhāra (Nourishment &amp; Sensory Intake)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Nutritional Quality
                    </label>
                    <select
                      value={nutritionQuality}
                      onChange={(e) =>
                        setNutritionQuality(e.target.value as 'Sattvic' | 'Rajasic' | 'Tamasic')
                      }
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    >
                      <option value="Sattvic">Sattvic (Fresh, wholesome, pure)</option>
                      <option value="Rajasic">Rajasic (Pungent, stimulated, salty)</option>
                      <option value="Tamasic">Tamasic (Stale, heavy, processed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Digital Screen Intake ({digitalMinutes} mins)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={digitalMinutes}
                      onChange={(e) => setDigitalMinutes(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>0m</span>
                      <span>120m (target)</span>
                      <span>360m+</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Sensory Mindfulness ({mindfulnessScore} / 5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={mindfulnessScore}
                      onChange={(e) => setMindfulnessScore(Number(e.target.value))}
                      className="w-full accent-emerald-700"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>1 (Mindless)</span>
                      <span>5 (Disciplined)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nidra Pillar */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm">
                  🌙 2. Nidrā (Restorative Sleep &amp; Rhythm)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Hours Slept ({hoursSlept} hrs)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="3"
                      max="14"
                      value={hoursSlept}
                      onChange={(e) => setHoursSlept(Number(e.target.value))}
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    />
                    <span className="text-xs text-slate-400">Optimal: 6.5 - 8.0 hrs</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Rest Quality
                    </label>
                    <select
                      value={restQuality}
                      onChange={(e) =>
                        setRestQuality(
                          e.target.value as 'Restorative' | 'Disturbed' | 'Lethargic'
                        )
                      }
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    >
                      <option value="Restorative">Restorative (Refreshed, clear)</option>
                      <option value="Disturbed">Disturbed (Awakenings, racing mind)</option>
                      <option value="Lethargic">Lethargic (Heavy, groggy upon waking)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="bedtimeConsistency"
                      checked={bedtimeConsistency}
                      onChange={(e) => setBedtimeConsistency(e.target.checked)}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <label
                      htmlFor="bedtimeConsistency"
                      className="text-xs font-medium text-slate-700"
                    >
                      Adhered to consistent bedtime (Circadian alignment)
                    </label>
                  </div>
                </div>
              </div>

              {/* Brahmacharya Pillar */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm">
                  ⚡ 3. Brahmacharya (Vital Energy Conservation &amp; Deep Work)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Energy Conservation ({energyRating} / 5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={energyRating}
                      onChange={(e) => setEnergyRating(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Focused Study Blocks (25m Pomodoros)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={studyBlocks}
                      onChange={(e) => setStudyBlocks(Number(e.target.value))}
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Dominant Observed Guna
                    </label>
                    <select
                      value={dominantGuna}
                      onChange={(e) => setDominantGuna(e.target.value as GunaType)}
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    >
                      <option value="Sattva">Sattva (Calm, lucid, absorbed)</option>
                      <option value="Rajas">Rajas (Agitated, driven, multitasking)</option>
                      <option value="Tamas">Tamas (Fatigued, procrastination, dull)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Daily Reflection */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Daily Reflection / Mindful Note
                </label>
                <input
                  type="text"
                  placeholder="e.g., Felt steady focus during labs, replaced bedtime scrolling with breathing."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full p-2.5 border rounded bg-white text-slate-800 text-sm"
                />
              </div>

              <button
                type="submit"
                style={{ backgroundColor: '#065F46', color: '#FFFFFF' }}
                className="px-5 py-2.5 rounded font-semibold text-sm hover:opacity-95 transition"
              >
                Record Sadhana Log (Gita 6.17 Yukta Scoring)
              </button>
            </form>
          </div>
        )}

        {/* ==================== TAB 2: PAUSE GATE ==================== */}
        {activeTab === 'interceptor' && (
          <div
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
            className="p-6 rounded-xl border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gita 2.62-63 Cascade Interceptor
                </h2>
                <p className="text-xs text-slate-500">
                  Intercept sensory craving (Kāma) and cognitive loss using Pratipaksha Bhavana (YS 2.33).
                </p>
              </div>
              <ShastraLensButton onClick={() => openShastraLens('interceptor')} />
            </div>

            {/* Trigger Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Select Active Trigger:
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Doomscrolling',
                    'Academic Anxiety',
                    'Social Comparison',
                    'Lethargy',
                    'Cheap Dopamine / Junk Stimulation',
                  ] as TriggerCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleTriggerSelect(cat)}
                    style={{
                      backgroundColor: selectedTrigger === cat ? '#D97706' : '#F1F5F9',
                      color: selectedTrigger === cat ? '#FFFFFF' : '#334155',
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition"
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Urge Intensity Slider */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-amber-900">
                  Urge Intensity (1-5): {urgeIntensity}
                </span>
                <span className="text-amber-800 font-medium">
                  Current Stage: {estimatedStage.stepNumber}. {estimatedStage.englishTitle} (
                  {estimatedStage.canInterceptEasily ? 'Easily Intercepted' : 'Late Stage Labyrinth'}
                  )
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={urgeIntensity}
                onChange={(e) => setUrgeIntensity(Number(e.target.value))}
                className="w-full accent-amber-700"
              />
            </div>

            {/* 7-Step Gita 2.62-63 Visual Progress Tracker */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gita 2.62-63 Psychological Descent Tracker:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {GITA_CASCADE_STEPS.map((step) => {
                  const isCurrent = step.stepNumber === estimatedStage.stepNumber;
                  const isPast = step.stepNumber < estimatedStage.stepNumber;

                  return (
                    <div
                      key={step.stage}
                      style={{
                        backgroundColor: isCurrent
                          ? '#FEF3C7'
                          : isPast
                          ? '#F1F5F9'
                          : '#FFFFFF',
                        borderColor: isCurrent
                          ? '#D97706'
                          : isPast
                          ? '#CBD5E1'
                          : '#E2E8F0',
                      }}
                      className="p-2 rounded border text-center space-y-1"
                    >
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Step {step.stepNumber}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {step.englishTitle}
                      </p>
                      <span
                        style={{
                          color: step.canInterceptEasily ? '#065F46' : '#991B1B',
                        }}
                        className="text-[9px] block"
                      >
                        {step.canInterceptEasily ? '✓ Early' : '⚠ Critical'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pratipaksha Bhavana Form */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Vitarka (Unwholesome Impulse / Distractive Thought)
                </label>
                <textarea
                  rows={2}
                  value={vitarkaText}
                  onChange={(e) => setVitarkaText(e.target.value)}
                  className="w-full p-2.5 border rounded bg-white text-slate-800 text-sm"
                  placeholder="Articulate the compulsive urge..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Pratipaksha (Wholesome Reframe - YS 2.33)
                </label>
                <textarea
                  rows={2}
                  value={pratipakshaText}
                  onChange={(e) => setPratipakshaText(e.target.value)}
                  className="w-full p-2.5 border rounded bg-white text-slate-800 text-sm"
                  placeholder="Evoke the opposite tranquil contemplation..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Select Śreyas Micro-Swap Action:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRIGGER_REFRAME_TEMPLATES[selectedTrigger].defaultMicroSwaps.map(
                    (swap) => (
                      <button
                        key={swap}
                        type="button"
                        onClick={() => setSelectedSwap(swap)}
                        style={{
                          backgroundColor: selectedSwap === swap ? '#ECFDF5' : '#F8FAFC',
                          borderColor: selectedSwap === swap ? '#065F46' : '#E2E8F0',
                          color: selectedSwap === swap ? '#065F46' : '#334155',
                        }}
                        className="p-2 rounded border text-left text-xs font-medium transition"
                      >
                        {selectedSwap === swap ? '✓ ' : ''}
                        {swap}
                      </button>
                    )
                  )}
                </div>
              </div>

              {gateFeedback && (
                <div
                  className={`p-3 rounded text-sm ${
                    gateFeedback.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {gateFeedback.text}
                </div>
              )}

              <button
                type="button"
                onClick={handleCommitInterception}
                style={{ backgroundColor: '#D97706', color: '#FFFFFF' }}
                className="px-5 py-2.5 rounded font-semibold text-sm hover:opacity-95 transition"
              >
                Commit Reframe &amp; Log Interception
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: PRANAYAMA SANCTUM ==================== */}
        {activeTab === 'breathing' && (
          <div
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
            className="p-6 rounded-xl border shadow-sm space-y-6 text-center"
          >
            <div className="flex items-center justify-between border-b pb-3 text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Breathing Sanctum
                </h2>
                <p className="text-xs text-slate-500">
                  Naturally calm your mind and nervous system through guided, rhythmic breathing.
                </p>
              </div>
              <ShastraLensButton onClick={() => openShastraLens('breathing')} />
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
              {(
                [
                  { key: 'SamaVritti', title: 'Samavritti', cycle: '4-4-4-4 Box' },
                  { key: 'Relaxation478', title: 'Relaxation', cycle: '4-7-8 Box' },
                  { key: 'NadiShodhana', title: 'Nadi Shodhana', cycle: '4-4-6 Box' },
                ] as const
              ).map((m) => {
                const isActive = breathing.mode === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => breathing.setMode(m.key)}
                    style={{
                      backgroundColor: isActive ? '#065F46' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#334155',
                      borderColor: isActive ? '#047857' : '#E2E8F0',
                    }}
                    className="flex flex-col items-center justify-center py-2 px-1.5 sm:px-2 rounded-xl border text-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                  >
                    <span className="text-xs font-bold leading-tight">
                      {m.title}
                    </span>
                    <span
                      style={{
                        color: isActive ? '#A7F3D0' : '#64748B',
                      }}
                      className="text-[10px] font-medium leading-tight mt-0.5"
                    >
                      {m.cycle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Visual concentric pacer with anti-overlap container */}
            <div className="flex flex-col items-center justify-center pt-2 pb-4">
              <div className="w-full h-80 flex items-center justify-center">
                <div
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    backgroundColor: isBreathingHold ? '#FEF3C7' : '#ECFDF5',
                    borderColor: isBreathingHold ? '#D97706' : '#059669',
                    borderWidth: 4,
                    borderStyle: 'solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${breathing.visualScale})`,
                    transition: 'transform 100ms linear, background-color 400ms ease, border-color 400ms ease, box-shadow 400ms ease',
                    boxShadow: isBreathingHold
                      ? '0 10px 25px -5px rgba(217, 119, 6, 0.25)'
                      : '0 10px 25px -5px rgba(5, 150, 105, 0.25)',
                  }}
                >
                  <div
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: '50%',
                      backgroundColor: isBreathingHold ? '#D97706' : '#059669',
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 8,
                      transition: 'background-color 400ms ease',
                    }}
                  >
                    <span className="text-3xl font-extrabold">
                      {breathing.secondsRemainingInPhase}s
                    </span>
                    <span
                      className={`text-[10px] mt-1 uppercase tracking-wider font-bold transition-colors duration-300 ${
                        isBreathingHold ? 'text-amber-100' : 'text-emerald-100'
                      }`}
                    >
                      {breathing.actionText}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-base font-bold text-slate-800">
                  {breathing.phaseLabel}
                </p>
                <p
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isBreathingHold ? 'text-amber-800' : 'text-emerald-800'
                  }`}
                >
                  {breathing.sanskritLabel}
                </p>
                <p className="text-xs text-slate-400">
                  Completed Cycles: {breathing.completedCycles}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {!breathing.isActive ? (
                <button
                  onClick={breathing.start}
                  style={{ backgroundColor: '#059669', color: '#FFFFFF' }}
                  className="px-6 py-2 rounded font-semibold text-sm hover:opacity-95 transition"
                >
                  Start Pranayama
                </button>
              ) : (
                <button
                  onClick={breathing.pause}
                  style={{ backgroundColor: '#D97706', color: '#FFFFFF' }}
                  className="px-6 py-2 rounded font-semibold text-sm hover:opacity-95 transition"
                >
                  Pause
                </button>
              )}
              <button
                onClick={breathing.reset}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  borderColor: '#CBD5E1',
                }}
                className="px-4 py-2 rounded border text-sm hover:bg-slate-200 transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: BHAVA COMPASS ==================== */}
        {activeTab === 'bhava' && (
          <div
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
            className="p-6 rounded-xl border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Bhāva Compass (Chitta Prasādanam - Yoga Sutra 1.33)
                </h2>
                <p className="text-xs text-slate-500">
                  Neutralize mental turbulences through the four classical counter-attitudes.
                </p>
              </div>
              <ShastraLensButton onClick={() => openShastraLens('chitta_prasadanam')} />
            </div>

            {/* 4 Emotion Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                [
                  { key: 'Peer_Envy', label: 'Peer Envy / Jealousy' },
                  { key: 'Other_Suffering', label: 'Witnessing Suffering' },
                  { key: 'Shared_Success', label: 'Peer Success / Joy' },
                  { key: 'Toxic_Hostility', label: 'Toxicity / Hostility' },
                ] as { key: BhavaEmotion; label: string }[]
              ).map((em) => (
                <button
                  key={em.key}
                  onClick={() => setSelectedEmotion(em.key)}
                  style={{
                    backgroundColor:
                      selectedEmotion === em.key ? '#DEF7EC' : '#F8FAFC',
                    borderColor:
                      selectedEmotion === em.key ? '#065F46' : '#E2E8F0',
                    color: selectedEmotion === em.key ? '#065F46' : '#334155',
                  }}
                  className="p-3 rounded-lg border text-sm font-semibold transition"
                >
                  {em.label}
                </button>
              ))}
            </div>

            {/* Prescription Details Card */}
            {(() => {
              const presc = BHAVA_COMPASS_MAP[selectedEmotion];
              return (
                <div
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
                  className="p-5 rounded-xl border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{ backgroundColor: '#065F46', color: '#FFFFFF' }}
                      className="text-xs px-3 py-1 rounded-full font-bold"
                    >
                      Prescribed Attitude: {presc.recommendedAttitude.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500 italic">
                      {presc.sanskritSutra}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Cognitive Reappraisal Prompt:
                    </h4>
                    <p className="text-sm text-slate-800">{presc.cognitivePrompt}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actionable Practice:
                    </h4>
                    <p className="text-sm text-slate-700 bg-white p-3 rounded border border-slate-200">
                      {presc.actionableStep}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== TAB 5: VAULT & ANALYTICS ==================== */}
        {activeTab === 'vault' && (
          <div
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
            className="p-6 rounded-xl border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Vault, Analytics &amp; Local-First Backup
                </h2>
                <p className="text-xs text-slate-500">
                  Your data is completely private. It stays securely encrypted directly on your device and is never sent to the cloud.
                </p>
              </div>
              <ShastraLensButton onClick={() => openShastraLens('gunas')} />
            </div>

            {/* Weekly Trend Table */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800">
                Weekly BrahmaPath Progression (Last 7 Days)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b">
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Yukta Score</th>
                      <th className="p-2.5">Sleep (hrs)</th>
                      <th className="p-2.5">Digital (mins)</th>
                      <th className="p-2.5">Dominant Guna</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyTrend.map((row) => (
                      <tr key={row.date} className="border-b hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-900">{row.date}</td>
                        <td className="p-2.5 font-bold text-emerald-800">
                          {row.yuktaScore}/100
                        </td>
                        <td className="p-2.5">{row.sleepHours}h</td>
                        <td className="p-2.5">{row.digitalMinutes}m</td>
                        <td className="p-2.5">
                          <span
                            style={{
                              backgroundColor:
                                row.dominantGuna === 'Sattva'
                                  ? '#DEF7EC'
                                  : row.dominantGuna === 'Rajas'
                                  ? '#FEF08A'
                                  : '#F1F5F9',
                              color:
                                row.dominantGuna === 'Sattva'
                                  ? '#03543F'
                                  : row.dominantGuna === 'Rajas'
                                  ? '#713F12'
                                  : '#475569',
                            }}
                            className="px-2 py-0.5 rounded-full font-semibold"
                          >
                            {row.dominantGuna}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trigger Breakdown */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-800">
                Trigger Loop Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {triggerBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center"
                  >
                    <span className="text-xs text-slate-700 font-medium">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Backup & Encryption Management */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Encrypted Vault &amp; Export Controls
              </h3>

              {vaultMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded">
                  {vaultMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plain JSON */}
                <div className="p-4 bg-slate-50 rounded-lg border space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">
                    1. Plain JSON Export/Import
                  </h4>
                  <button
                    onClick={exportPlainJsonBackup}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#CBD5E1',
                      color: '#334155',
                    }}
                    className="w-full py-2 border rounded text-xs font-medium hover:bg-slate-100 transition"
                  >
                    Download Plain JSON Backup
                  </button>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Restore from JSON:
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const res = await importPlainJsonBackup(file);
                          setVaultMessage(res.message);
                        }
                      }}
                      className="text-xs text-slate-600"
                    />
                  </div>
                </div>

                {/* Encrypted Vault */}
                <div className="p-4 bg-slate-50 rounded-lg border space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">
                    2. AES-GCM Encrypted Vault (.bplock)
                  </h4>
                  <input
                    type="password"
                    placeholder="Enter vault passphrase..."
                    value={vaultPassword}
                    onChange={(e) => setVaultPassword(e.target.value)}
                    className="w-full p-2 border rounded bg-white text-xs text-slate-800"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await exportEncryptedBackup(vaultPassword);
                          setVaultMessage('Encrypted vault exported successfully.');
                        } catch (err) {
                          setVaultMessage((err as Error).message);
                        }
                      }}
                      style={{ backgroundColor: '#065F46', color: '#FFFFFF' }}
                      className="flex-1 py-2 rounded text-xs font-semibold hover:opacity-95 transition"
                    >
                      Export .bplock
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Decrypt &amp; Restore .bplock:
                    </label>
                    <input
                      type="file"
                      accept=".bplock"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const res = await importEncryptedBackup(file, vaultPassword);
                          setVaultMessage(res.message);
                        }
                      }}
                      className="text-xs text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Data */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to reset all local BrahmaPath data?'
                      )
                    ) {
                      resetAllData();
                      setVaultMessage('All local storage cleared and reset.');
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium underline"
                >
                  Reset All Local BrahmaPath Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SHASTRA LENS SLIDE-OVER MODAL ==================== */}
        {activeLensData && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 50,
            }}
            onClick={closeShastraLens}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 480,
                backgroundColor: '#FDFBF7',
                height: '100%',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
              }}
              className="p-6 overflow-y-auto space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span
                    style={{ backgroundColor: '#065F46', color: '#FFFFFF' }}
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  >
                    Shastra Lens
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {activeLensData.sourceText}
                  </h3>
                </div>
                <button
                  onClick={closeShastraLens}
                  className="text-slate-400 hover:text-slate-800 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Sanskrit Devanagari */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-center space-y-2">
                <p
                  style={{ fontFamily: 'Georgia, serif' }}
                  className="text-lg font-semibold text-amber-950 whitespace-pre-line leading-relaxed"
                >
                  {activeLensData.sanskritVerse}
                </p>
                <p className="text-xs text-amber-800 italic">
                  {activeLensData.transliteration}
                </p>
              </div>

              {/* Literal Meaning */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Literal Translation:
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {activeLensData.literalMeaning}
                </p>
              </div>

              {/* Modern Application */}
              <div className="space-y-1 pt-2 border-t">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Practical Student Habit Application:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/60 p-3 rounded border border-emerald-200">
                  {activeLensData.practicalModernApplication}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={closeShastraLens}
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                  }}
                  className="w-full py-2 rounded text-xs font-semibold hover:opacity-90 transition"
                >
                  Close Shastra Lens
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

