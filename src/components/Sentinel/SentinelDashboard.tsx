import React, { useState, useMemo } from 'react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import {
  Compass,
  Sparkles,
  Crown,
  Link as LinkIcon,
  Zap,
  RotateCw,
  Shield,
  Wind,
  Flame,
  Moon,
  BookOpen,
  RotateCcw,
  Check,
} from 'lucide-react';
import chariotResting from '../../assets/chariot-poses/chariot-resting.png';
import chariotCalm from '../../assets/chariot-poses/chariot-calm.png';
import chariotBrisk from '../../assets/chariot-poses/chariot-brisk.png';
import chariotGalloping from '../../assets/chariot-poses/chariot-galloping.png';
import { ChariotStatusBadge, ChariotGaitState } from '../Chariot/ChariotHome';
import { FOUNDATIONAL_SENTINEL_SANKALPA } from '../Onboarding/OnboardingFlow';
import {
  SentinelGitaQuote,
  getNextSentinelGitaQuote,
} from '../../data/sentinelShastraData';
import { GunaType } from '../../types/iks';

export interface SentinelDashboardProps {
  className?: string;
  onOpenShastraLens?: (key?: any) => void;
}

const CHARIOT_IMAGES: Record<ChariotGaitState, string> = {
  Resting: chariotResting,
  Calm: chariotCalm,
  Brisk: chariotBrisk,
  Galloping: chariotGalloping,
};

export const SentinelDashboard: React.FC<SentinelDashboardProps> = ({
  className = '',
  onOpenShastraLens,
}) => {
  const {
    chariotStatus,
    gunaDistribution,
    preferences,
    updatePreferences,
    openShastraLens,
    setActiveView,
  } = useBrahmaPath();

  const handleOpenLens = onOpenShastraLens ?? openShastraLens;

  const activeWarriorPledge =
    preferences?.sankalpa ||
    FOUNDATIONAL_SENTINEL_SANKALPA;

  // ================= 1. CHARIOT / RATHA CALCULATIONS =================
  const rawState = (chariotStatus as any)?.gait || chariotStatus?.state || 'Calm';
  const normalizedState: ChariotGaitState =
    rawState === 'Resting'
      ? 'Resting'
      : rawState === 'Calm'
      ? 'Calm'
      : rawState === 'Brisk'
      ? 'Brisk'
      : 'Galloping';

  const displayScore = chariotStatus?.composureScore ?? chariotStatus?.score ?? 85;
  const yuktaScore = chariotStatus?.yuktaScore ?? 75;
  const gateScore = chariotStatus?.gateScore ?? 75;
  const bhavaScore = chariotStatus?.bhavaScore ?? 75;
  const sensoryAvg = (yuktaScore + bhavaScore) / 2;

  // Dynamic status values for 2x2 grid
  let reinsShortValue = 'At Rest';
  let horsesShortValue = 'Stabled';

  if (normalizedState !== 'Resting') {
    if (gateScore >= 80) {
      reinsShortValue = 'Firm Command';
    } else if (gateScore >= 50) {
      reinsShortValue = 'Taut (Active)';
    } else {
      reinsShortValue = 'Slack / Strained';
    }

    if (sensoryAvg >= 78) {
      horsesShortValue = 'Retracted (Kūrma)';
    } else if (sensoryAvg >= 45) {
      horsesShortValue = 'High Vigilance';
    } else {
      horsesShortValue = 'Hyper-Alert / Bolting';
    }
  }

  // Diagnostic rows for sentinel life
  const buddhiSummary = useMemo(() => {
    if (normalizedState === 'Resting') {
      return 'Command intellect is in dawn stillness. Awaken the inner charioteer through morning reflection and clear operational resolve.';
    }
    if (displayScore >= 80) {
      return 'Discriminative command intellect is luminous and unwavering. Mission priorities are crystal clear, holding steady composure under operational pressure.';
    }
    if (displayScore >= 50) {
      return 'Command intellect is actively navigating shift fatigue and tactical friction. Ground your focus through deliberate breath before critical choices.';
    }
    return 'Command intellect is strained by severe fatigue and sensory overload. Disengage from secondary battles and execute fundamental rest protocol immediately.';
  }, [normalizedState, displayScore]);

  const manasSummary = useMemo(() => {
    if (normalizedState === 'Resting') {
      return 'Mental impulses (Manas) are resting without strain, preparing for the upcoming duty rotation.';
    }
    const reinsState = (chariotStatus as any)?.reinsState;
    if (reinsState === 'firm' || gateScore >= 80) {
      return 'Firm tactical hold over impulsive reactions. The mind remains steady against post-watch restlessness, urge spikes, and situational frustration.';
    }
    if (reinsState === 'taut' || gateScore >= 50) {
      return 'Reins are taut under operational friction. Moderate post-watch mental chatter; practice 5 slow exhalations to prevent displaced anger (Krodha).';
    }
    return 'Reins are slackened under acute fatigue. High risk of reactive irritability; disengage from heated barracks debates and rest.';
  }, [normalizedState, chariotStatus, gateScore]);

  const indriyasSummary = useMemo(() => {
    if (normalizedState === 'Resting') {
      return 'Sensory radar is stabled in quiet quarters. No intrusive triggers have disturbed your inner perimeter.';
    }
    const horsesState = (chariotStatus as any)?.horsesState;
    if (horsesState === 'subdued' || sensoryAvg >= 75) {
      return 'Kūrma sensory retraction active. Senses are stabled cleanly off-watch, shielding your mental bunker from intrusive stimulation and screen glare.';
    }
    if (horsesState === 'spirited' || sensoryAvg >= 45) {
      return 'Senses remain partially vigilant from prolonged watch scanning. Limit smartphone glow in the bunk and allow your nervous system to cool down.';
    }
    return 'Sensory radar remains locked in hypervigilance. Senses are pulling hard; initiate 60 seconds of eye palming and darkness protocol.';
  }, [normalizedState, chariotStatus, sensoryAvg]);

  // ================= 2. SENTINEL GITA QUOTE STATE =================
  const [currentQuote, setCurrentQuote] = useState<SentinelGitaQuote>(() =>
    getNextSentinelGitaQuote()
  );

  const handleCycleQuote = () => {
    setCurrentQuote((prev) => getNextSentinelGitaQuote(prev?.id));
  };

  // ================= 3. TRI-GUNA STATE =================
  const rawSattva = gunaDistribution?.sattva ?? 50;
  const rawRajas = gunaDistribution?.rajas ?? 35;
  const rawTamas = gunaDistribution?.tamas ?? 15;
  const totalGuna = rawSattva + rawRajas + rawTamas || 100;
  const sattvaPct = Math.round((rawSattva / totalGuna) * 100);
  const rajasPct = Math.round((rawRajas / totalGuna) * 100);
  const tamasPct = Math.max(0, 100 - sattvaPct - rajasPct);

  const dominantGunaType: GunaType = useMemo(() => {
    if (sattvaPct >= 50) return 'Sattva';
    if (rajasPct >= tamasPct) return 'Rajas';
    return 'Tamas';
  }, [sattvaPct, rajasPct, tamasPct]);

  const [selectedGuna, setSelectedGuna] = useState<GunaType>(dominantGunaType);



  return (
    <div className={`space-y-6 pb-24 ${className}`}>

      {/* ============================================================== */}
      {/* CARD 1: KATHA UPANISHAD WAR CHARIOT (RATHA READINESS)        */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Top Header with Title, Subtitle, and Shastra Lens Trigger */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                War Chariot &amp; Command Composure
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Operational discipline &amp; real-time intellect alignment telemetry
            </p>
          </div>

          <ShastraLensButton
            onClick={() => handleOpenLens('chariot')}
            className="ml-2 flex-shrink-0"
          />
        </div>

        {/* Dynamic Chariot Image Container with Smooth 700ms Crossfade */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-slate-50/70 to-[#F1F5F9] border border-slate-200/90 shadow-inner flex items-center justify-center">
          {(['Resting', 'Calm', 'Brisk', 'Galloping'] as const).map((stateKey) => {
            const isActive = normalizedState === stateKey;
            return (
              <div
                key={stateKey}
                className={`absolute inset-0 flex items-center justify-center p-2 sm:p-3 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <img
                  src={CHARIOT_IMAGES[stateKey]}
                  alt={`War Chariot State - ${stateKey}`}
                  className="w-full h-full object-contain rounded-xl select-none transition-transform duration-700 ease-out"
                />
              </div>
            );
          })}

          <div className="absolute top-3.5 z-20 flex justify-center w-full px-4 pointer-events-none">
            <ChariotStatusBadge state={normalizedState} />
          </div>
        </div>

        {/* 2x2 Status Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Ratha Gait */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Ratha Gait
            </span>
            <span
              style={{
                color:
                  normalizedState === 'Resting'
                    ? '#0284C7'
                    : normalizedState === 'Calm'
                    ? '#047857'
                    : normalizedState === 'Brisk'
                    ? '#B45309'
                    : '#B91C1C',
              }}
              className="text-base sm:text-lg font-bold flex items-center gap-1.5"
            >
              {normalizedState === 'Resting' && (
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              )}
              {normalizedState === 'Calm' && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              )}
              {normalizedState === 'Brisk' && (
                <span className="w-2 h-2 rounded-full bg-amber-600" />
              )}
              {normalizedState === 'Galloping' && (
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              )}
              {normalizedState}
            </span>
          </div>

          {/* Composure Score */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Composure Score
            </span>
            <span
              style={{
                color:
                  normalizedState === 'Resting'
                    ? '#0284C7'
                    : displayScore >= 75
                    ? '#047857'
                    : displayScore >= 40
                    ? '#B45309'
                    : '#B91C1C',
              }}
              className="text-base sm:text-lg font-bold"
            >
              {normalizedState === 'Resting' ? 'At Rest' : `${displayScore}/100`}
            </span>
          </div>

          {/* Reins (Manas) */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Reins (Manas)
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-800">
              {reinsShortValue}
            </span>
          </div>

          {/* Horses (Indriyas) */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Horses (Indriyas)
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-800">
              {horsesShortValue}
            </span>
          </div>
        </div>

        {/* 3-Pillar Horizontal Breakdown Bars with Dynamic Composure Weights */}
        {normalizedState !== 'Resting' && (() => {
          const isInterceptorActive = Boolean(chariotStatus?.interceptionStats?.hasActivityToday);
          const sadhanaWeightBadge = isInterceptorActive ? '50% wt' : '65% wt';
          const bhavaWeightBadge = isInterceptorActive ? '25% wt' : '35% wt';
          const prqScore = chariotStatus?.interceptionStats?.prqScore ?? gateScore;

          return (
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Composure Score Breakdown
              </h4>

              <div className="space-y-2.5 pt-1">
                {/* Row 1: Duty & Tactical Rest (Daily Sadhana) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      Duty &amp; Tactical Rest (Daily Sadhana)
                    </span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{yuktaScore}/100</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-md border border-slate-300/60">
                        {sadhanaWeightBadge}
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, yuktaScore))}%`,
                        backgroundColor: '#D97706',
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Row 2: Impulse & Krodha Restraint — Manas */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      Impulse &amp; Krodha Restraint — Manas
                    </span>
                    {isInterceptorActive ? (
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{prqScore}/100</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-md border border-slate-300/60">
                          25% wt
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-xs">
                        Standby (Not logged today — 0% wt)
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: isInterceptorActive
                          ? `${Math.min(100, Math.max(0, prqScore))}%`
                          : '0%',
                        backgroundColor: '#D97706',
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Row 3: Unit & Homefront Poise — Bhāva Compass */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      Unit &amp; Homefront Poise — Bhāva Compass
                    </span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{bhavaScore}/100</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-md border border-slate-300/60">
                        {bhavaWeightBadge}
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, bhavaScore))}%`,
                        backgroundColor: '#D97706',
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 3 Full-Width Diagnostic Rows Tailored to Sentinel Life */}
        <div className="flex flex-col space-y-3 pt-1">
          {/* Row 1: BUDDHI (COMMAND INTELLECT) */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100/90 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-amber-700" />
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                BUDDHI (COMMAND INTELLECT)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {buddhiSummary}
            </p>
          </div>

          {/* Row 2: MANAS (TACTICAL REINS) */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-100/90 text-orange-800 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-4 h-4 text-orange-700" />
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                MANAS (TACTICAL REINS)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {manasSummary}
            </p>
          </div>

          {/* Row 3: INDRIYAS (SENSORY DISCIPLINE) */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100/90 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-emerald-700" />
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                INDRIYAS (SENSORY DISCIPLINE)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {indriyasSummary}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FOUNDATIONAL WARRIOR PLEDGE (ABOVE DAILY FIELD DISPATCH)       */}
      {/* ============================================================== */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs"
      >
        <div className="p-4 sm:p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
          {/* Header Row Inside Grey Box */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                YOUR SANKALPA (INNER PLEDGE)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                The foundational intention you anchored when initiating BrahmaPath.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ShastraLensButton
                onClick={() => handleOpenLens('sankalpa')}
                className="flex-shrink-0"
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
            {activeWarriorPledge}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CARD 2: DAILY KURUKSHETRA FIELD DISPATCH                     */}
      {/* ============================================================== */}
      <article className="bg-white shadow-xs rounded-3xl p-5 sm:p-6 border border-slate-200/90 flex flex-col items-center space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5 w-full">
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Daily Kurukshetra Field Dispatch
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Operational Bhagavad Gita wisdom for composure on the frontline
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleCycleQuote}
              aria-label="Next Field Dispatch"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Cycle Field Verse"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <ShastraLensButton
              onClick={() => handleOpenLens('svadhyaya')}
              className="ml-1 flex-shrink-0"
            />
          </div>
        </div>

        {/* Top Header Pill */}
        <div>
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 tracking-wide uppercase shadow-2xs">
            {currentQuote.verseRef}
          </span>
        </div>

        {/* Sanskrit Shloka */}
        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1E293B] leading-relaxed tracking-wide text-center px-2 whitespace-pre-line">
          {currentQuote.sanskritDevanagari}
        </h2>

        {/* English Pronunciation */}
        <p className="font-serif italic text-xs sm:text-sm text-[#1E293B]/70 leading-relaxed text-center px-2 whitespace-pre-line">
          {currentQuote.transliteration}
        </p>

        {/* English Translation */}
        <div className="w-full text-left">
          <p className="text-sm text-[#1E293B] leading-relaxed">
            {currentQuote.englishTranslation}
          </p>
        </div>

        {/* Field & Duty Application Highlight Box */}
        <div className="w-full bg-[#F5F1E8]/70 border-l-4 border-[#D97706] p-3.5 rounded-r-xl text-sm text-left space-y-1.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
            FIELD &amp; DUTY APPLICATION
          </span>
          <p className="text-xs text-[#1E293B]/85 leading-relaxed">
            {currentQuote.fieldApplication}
          </p>
        </div>
      </article>

      {/* ============================================================== */}
      {/* CARD 4: OPERATIONAL TRI-GUNA ENERGY BALANCE                  */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Operational Tri-Guna Energy Balance
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Field vigilance, mental agitation, and fatigue telemetry
            </p>
          </div>

          <ShastraLensButton
            onClick={() => handleOpenLens('gunas')}
            className="ml-2 flex-shrink-0"
          />
        </div>

        {/* Interactive Guna Exploration Pills */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
          {(
            [
              { key: 'Sattva', label: 'Sattva' },
              { key: 'Rajas', label: 'Rajas' },
              { key: 'Tamas', label: 'Tamas' },
            ] as const
          ).map(({ key, label }) => {
            const isSelected = selectedGuna === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedGuna(key)}
                className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Selected Content Enclosed in Grey Box */}
        <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          {/* Centered State Badge */}
          <div className="flex justify-center pb-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${
                selectedGuna === 'Sattva'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : selectedGuna === 'Rajas'
                  ? 'bg-orange-100 text-amber-900 border-orange-200'
                  : 'bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {selectedGuna === 'Sattva' && <Sparkles className="w-3.5 h-3.5" />}
              {selectedGuna === 'Rajas' && <Flame className="w-3.5 h-3.5" />}
              {selectedGuna === 'Tamas' && <Moon className="w-3.5 h-3.5" />}
              {selectedGuna === 'Sattva'
                ? 'Sattva • Calm Readiness'
                : selectedGuna === 'Rajas'
                ? 'Rajas • Hyper-Vigilance'
                : 'Tamas • Field Fatigue'}
            </span>
          </div>

          {/* Headline & Description */}
          <div className="pt-1.5 space-y-1">
            <h3
              className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${
                selectedGuna === 'Sattva'
                  ? 'text-emerald-800'
                  : selectedGuna === 'Rajas'
                  ? 'text-amber-800'
                  : 'text-slate-800'
              }`}
            >
              {selectedGuna === 'Sattva' && 'What Calm Readiness Feels Like'}
              {selectedGuna === 'Rajas' && 'What Hyper-Vigilance Feels Like'}
              {selectedGuna === 'Tamas' && 'What Field Fatigue Feels Like'}
            </h3>
            <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">
              {selectedGuna === 'Sattva' &&
                'Alert, clear, and unagitated. Senses are sharp on watch without burning nervous energy on phantom alarms or restless agitation.'}
              {selectedGuna === 'Rajas' &&
                'Racing pulse, compulsive sentry scanning, irritability at minor noises, and an inability to wind down into bunk rest.'}
              {selectedGuna === 'Tamas' &&
                'Heavy eyelids on duty, flat apathy, emotional disconnection from home, and dragging physical sluggishness.'}
            </p>
          </div>

          {/* Operational Actionable Recommendations */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
              <span className="text-base select-none">🍲</span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="font-bold text-slate-900">Mess Ration Ahara: </strong>
                {selectedGuna === 'Sattva' &&
                  'Prioritize warm, freshly cooked rations and steady hydration; avoid surplus sugar.'}
                {selectedGuna === 'Rajas' &&
                  'Cut back on extra watch tea and high-caffeine energy drinks that over-heat the nervous system.'}
                {selectedGuna === 'Tamas' &&
                  'Avoid heavy, oily, or cold rations that overload digestive Agni during night shifts.'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
              <span className="text-base select-none">🛡️</span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="font-bold text-slate-900">Operational Habit: </strong>
                {selectedGuna === 'Sattva' &&
                  'Channel this calm vigilance into steady situational awareness and measured unit communication (Sahyog).'}
                {selectedGuna === 'Rajas' &&
                  'Practice 5 slow extended exhalations (Rechaka) in the dark before attempting sleep.'}
                {selectedGuna === 'Tamas' &&
                  'Splash cold water on face and neck, do 3 minutes of shoulder mobility, and debrief with your unit buddy.'}
              </div>
            </div>
          </div>

          {/* Guna Spectrum Distribution Section */}
          <div className="pt-3 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-slate-800">
                Guna Spectrum Distribution
              </h4>
            </div>

            {/* Legend Text Labels */}
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
                <span className="text-slate-700">Sattva</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                <span className="text-slate-700">Rajas</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
                <span className="text-slate-700">Tamas</span>
              </div>
            </div>

            {/* Horizontal Stacked Progress Bar */}
            <div className="w-full h-4 bg-slate-200/70 rounded-full overflow-hidden flex shadow-inner">
              {sattvaPct > 0 && (
                <div
                  style={{ width: `${sattvaPct}%` }}
                  className="bg-emerald-700 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                  title={`Sattva: ${sattvaPct}%`}
                >
                  {sattvaPct >= 8 && `${sattvaPct}%`}
                </div>
              )}

              {rajasPct > 0 && (
                <div
                  style={{ width: `${rajasPct}%` }}
                  className="bg-amber-600 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                  title={`Rajas: ${rajasPct}%`}
                >
                  {rajasPct >= 8 && `${rajasPct}%`}
                </div>
              )}

              {tamasPct > 0 && (
                <div
                  style={{ width: `${tamasPct}%` }}
                  className="bg-slate-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                  title={`Tamas: ${tamasPct}%`}
                >
                  {tamasPct >= 8 && `${tamasPct}%`}
                </div>
              )}
            </div>

            {/* Explanatory Note */}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {sattvaPct >= 50
                ? 'Primary operational state is Calm Readiness (Sattva) — optimal for watch duty and command composure.'
                : rajasPct >= 40
                ? 'Elevated Hyper-Vigilance (Rajas) detected; practice Kūrma sensory withdrawal to prevent nerve burnout.'
                : 'Elevated Field Fatigue (Tamas) detected; ensure active hydration, bunk darkness, and post-watch mobility.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SentinelDashboard;
