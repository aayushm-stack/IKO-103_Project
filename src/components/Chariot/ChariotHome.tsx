import React from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { ChariotState } from '../../types/iks';
import { ChariotStatusReport } from '../../engine/chariotEngine';
import { Compass, Sparkles, Crown, Link as LinkIcon, Zap } from 'lucide-react';

// Local high-resolution PNG assets from src/assets/chariot-poses/
import chariotResting from '../../assets/chariot-poses/chariot-resting.png';
import chariotCalm from '../../assets/chariot-poses/chariot-calm.png';
import chariotBrisk from '../../assets/chariot-poses/chariot-brisk.png';
import chariotGalloping from '../../assets/chariot-poses/chariot-galloping.png';

export type ChariotGaitState = 'Resting' | 'Calm' | 'Brisk' | 'Galloping';

export interface ChariotHomeProps {
  status?: ChariotState;
  score?: number;
  report?: ChariotStatusReport;
  onInspectShastra?: () => void;
  className?: string;
}

export interface ChariotStatusBadgeProps {
  state?: 'Resting' | 'Calm' | 'Brisk' | 'Galloping' | 'Gallop';
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Dictionary mapping each Chariot state to its corresponding high-resolution PNG image asset.
 */
export const CHARIOT_STATE_IMAGES: Record<ChariotGaitState, string> = {
  Resting: chariotResting,
  Calm: chariotCalm,
  Brisk: chariotBrisk,
  Galloping: chariotGalloping,
};

/**
 * Switch statement resolving the image asset path for any chariot gait state.
 */
export function getChariotImageForState(state: ChariotGaitState | string): string {
  switch (state) {
    case 'Resting':
      return CHARIOT_STATE_IMAGES.Resting;
    case 'Calm':
      return CHARIOT_STATE_IMAGES.Calm;
    case 'Brisk':
      return CHARIOT_STATE_IMAGES.Brisk;
    case 'Galloping':
    case 'Gallop':
      return CHARIOT_STATE_IMAGES.Galloping;
    default:
      return CHARIOT_STATE_IMAGES.Resting;
  }
}

/**
 * Dynamic Status Badge Component for the Chariot UI.
 * Responsive pill styling with generous padding and clean contrast.
 */
export const ChariotStatusBadge: React.FC<ChariotStatusBadgeProps> = ({
  state = 'Calm',
  text,
  className = '',
  style,
}) => {
  const normalized: ChariotGaitState =
    state === 'Resting'
      ? 'Resting'
      : state === 'Gallop' || state === 'Galloping'
      ? 'Galloping'
      : state === 'Brisk'
      ? 'Brisk'
      : state === 'Calm'
      ? 'Calm'
      : 'Resting';

  const badgeConfig = {
    Resting: {
      defaultText: 'RESTING • EQUILIBRIUM',
      bgClass: 'bg-[#F1F5F9]',
      textClass: 'text-[#475569]',
      borderClass: 'border-[#64748B]/40',
      inlineBg: '#F1F5F9',
      inlineColor: '#475569',
      inlineBorder: 'rgba(100, 116, 139, 0.4)',
    },
    Calm: {
      defaultText: 'CALM • SATTVIC POISE',
      bgClass: 'bg-[#DEF7EC]',
      textClass: 'text-[#065F46]',
      borderClass: 'border-[#065F46]/40',
      inlineBg: '#DEF7EC',
      inlineColor: '#065F46',
      inlineBorder: 'rgba(6, 95, 70, 0.4)',
    },
    Brisk: {
      defaultText: 'BRISK • ACTIVE GAIT',
      bgClass: 'bg-[#FEF3C7]',
      textClass: 'text-[#92400E]',
      borderClass: 'border-[#D97706]/40',
      inlineBg: '#FEF3C7',
      inlineColor: '#92400E',
      inlineBorder: 'rgba(217, 119, 6, 0.4)',
    },
    Galloping: {
      defaultText: 'GALLOPING • UNCHECKED IMPULSE',
      bgClass: 'bg-[#FEE2E2]',
      textClass: 'text-[#991B1B]',
      borderClass: 'border-[#DC2626]/40',
      inlineBg: '#FEE2E2',
      inlineColor: '#991B1B',
      inlineBorder: 'rgba(220, 38, 38, 0.4)',
    },
  }[normalized];

  const displayText = text ?? badgeConfig.defaultText;

  return (
    <div
      role="status"
      aria-label={`Chariot gait state: ${displayText}`}
      style={{
        width: 'fit-content',
        whiteSpace: 'nowrap',
        backgroundColor: badgeConfig.inlineBg,
        color: badgeConfig.inlineColor,
        borderColor: badgeConfig.inlineBorder,
        ...style,
      }}
      className={`w-fit whitespace-nowrap px-4 py-1 sm:px-5 sm:py-1.5 rounded-full text-[10.5px] sm:text-xs font-bold tracking-wider uppercase border shadow-2xs transition-colors duration-300 pointer-events-auto ${badgeConfig.bgClass} ${badgeConfig.textClass} ${badgeConfig.borderClass} ${className}`}
    >
      {displayText}
    </div>
  );
};

/**
 * Katha Upanishad Chariot (1.3.3-4) Home Visualizer.
 *
 * Replaces legacy SVGs with local, high-resolution PNG assets from
 * `src/assets/chariot-poses/`:
 * - Resting: `chariot-resting.png`
 * - Calm: `chariot-calm.png`
 * - Brisk: `chariot-brisk.png`
 * - Galloping: `chariot-galloping.png`
 *
 * Features:
 * - Real-time dynamic Manas (Reins) and Indriyas (Horses) derivation based on
 *   subsystem metrics (GateScore, YuktaScore, and BhavaScore).
 * - Weighted Capacity Breakdown Card (50% Yukta / 30% Gate / 20% Bhāva).
 * - Smooth 700ms crossfade between gait postures.
 */
export const ChariotHome: React.FC<ChariotHomeProps> = ({
  status,
  score,
  report,
  onInspectShastra,
  className = '',
}) => {
  const context = useBrahmaPath();

  // Resolve active report and state from props or context
  const activeReport = report ?? context.chariotStatus;
  const rawState =
    status ??
    activeReport?.state ??
    (context.todayLog ? 'Calm' : 'Resting');
  const displayScore = score ?? activeReport?.score ?? 85;

  // Normalize state to one of the 4 valid states
  const normalizedState: ChariotGaitState =
    rawState === 'Resting'
      ? 'Resting'
      : rawState === 'Calm'
      ? 'Calm'
      : rawState === 'Brisk'
      ? 'Brisk'
      : 'Galloping';

  const handleInspect =
    onInspectShastra ?? (() => context.openShastraLens('chariot'));

  // 1. Strictly dynamic short values derived from subsystem scores to reflect live engine math
  let reinsShortValue = 'At Rest';
  let horsesShortValue = 'Stabled';

  if (normalizedState === 'Resting') {
    reinsShortValue = 'At Rest';
    horsesShortValue = 'Stabled';
  } else {
    // Derive reinsShortValue (Manas / Mind) from activeReport?.gateScore ?? 75:
    // >= 80 -> 'Supple & Firm'
    // >= 50 -> 'Taut (Active)'
    // < 50  -> 'Slack / Strained'
    const gate = activeReport?.gateScore ?? 75;
    if (gate >= 80) {
      reinsShortValue = 'Supple & Firm';
    } else if (gate >= 50) {
      reinsShortValue = 'Taut (Active)';
    } else {
      reinsShortValue = 'Slack / Strained';
    }

    // Derive horsesShortValue (Indriyas / Senses & Emotion) from the average of
    // activeReport?.yuktaScore ?? 75 and activeReport?.bhavaScore ?? 75:
    // >= 78 -> 'Subdued & Poised'
    // >= 45 -> 'Spirited'
    // < 45  -> 'Bolting / Restless'
    const yScore = activeReport?.yuktaScore ?? 75;
    const bScore = activeReport?.bhavaScore ?? 75;
    const sensoryDisciplineAvg = (yScore + bScore) / 2;
    if (sensoryDisciplineAvg >= 78) {
      horsesShortValue = 'Subdued & Poised';
    } else if (sensoryDisciplineAvg >= 45) {
      horsesShortValue = 'Spirited';
    } else {
      horsesShortValue = 'Bolting / Restless';
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      className={`rounded-3xl border shadow-xs p-5 sm:p-6 space-y-5 ${className}`}
    >
      {/* 1. Header with Title and Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Katha Upanishad Chariot
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time sensory composure &amp; intellect alignment score
          </p>
        </div>

        <ShastraLensButton
          onClick={handleInspect}
          className="ml-2"
        />
      </div>

      {/* 2. High-Resolution Chariot Image Container with Smooth 700ms Crossfade */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-slate-50/70 to-[#F1F5F9] border border-slate-200/90 shadow-inner flex items-center justify-center">
        {/* Render all 4 states in stacked absolute layers for zero layout shift and smooth crossfade */}
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
                src={CHARIOT_STATE_IMAGES[stateKey]}
                alt={`Chariot State - ${stateKey}`}
                className="w-full h-full object-contain rounded-xl select-none transition-transform duration-700 ease-out"
              />
            </div>
          );
        })}

        {/* Dynamic Status Badge Overlay */}
        <div className="absolute top-3.5 z-20 flex justify-center w-full px-4 pointer-events-none">
          <ChariotStatusBadge state={normalizedState} />
        </div>
      </div>

      {/* 3. Aesthetic State Banner Blended with Nearby UI */}
      {normalizedState === 'Resting' && (
        <div className="p-4 bg-sky-50/90 rounded-2xl border border-sky-200/90 text-sky-950 flex items-start gap-3 shadow-2xs">
          <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800">
              Awaken The Charioteer
            </h4>
            <p className="text-xs sm:text-sm font-medium text-sky-900 leading-relaxed">
              A new dawn begins. Log your morning Sadhana to awaken the charioteer (Buddhi) and take the reins.
            </p>
          </div>
        </div>
      )}

      {normalizedState === 'Calm' && (
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-emerald-950 flex items-start gap-3 shadow-2xs">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Sattvic Poise &amp; Steady Gait
            </h4>
            <p className="text-xs sm:text-sm font-medium text-emerald-900 leading-relaxed">
              Your senses (horses) are tranquil and harmonious. The intellect (Buddhi) holds the reins with effortless clarity.
            </p>
          </div>
        </div>
      )}

      {normalizedState === 'Brisk' && (
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-amber-950 flex items-start gap-3 shadow-2xs">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Active Drive &amp; Focused Momentum
            </h4>
            <p className="text-xs sm:text-sm font-medium text-amber-900 leading-relaxed">
              Dynamic forward energy. Keep the reins (Manas) taut to ensure Rajas fuels constructive action rather than distraction.
            </p>
          </div>
        </div>
      )}

      {normalizedState === 'Galloping' && (
        <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200/80 text-rose-950 flex items-start gap-3 shadow-2xs">
          <Sparkles className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Unchecked Impulse — Reclaim the Reins
            </h4>
            <p className="text-xs sm:text-sm font-medium text-rose-900 leading-relaxed">
              The senses are pulling aggressively at the reins. Engage a Shreyas Micro-Swap or deep breath to restore discriminative intellect.
            </p>
          </div>
        </div>
      )}

      {/* 4. Real-Time Top 4 Metric Blocks (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Gait State */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Gait State
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

        {/* Dynamic Composure Score */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Composure Score
          </span>
          <span
            style={{
              color:
                normalizedState === 'Resting'
                  ? '#0284C7'
                  : displayScore > 75
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

        {/* Mind (Reins) */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Reins (Manas)
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-800">
            {reinsShortValue}
          </span>
        </div>

        {/* Senses (Horses) */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Horses (Indriyas)
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-800">
            {horsesShortValue}
          </span>
        </div>
      </div>

      {/* Weighted Capacity Breakdown (50 / 30 / 20) Card */}
      {normalizedState !== 'Resting' && activeReport && (
        <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Composure Score Breakdown
            </h4>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* Yukta Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  Yukta Score
                </span>
                <span className="font-bold text-slate-900">
                  {activeReport.yuktaScore}/100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, activeReport.yuktaScore))}%`,
                    backgroundColor: '#D97706',
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Resilience Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  Resilience Score
                </span>
                <span className="font-bold text-slate-900">
                  {activeReport.gateScore}/100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, activeReport.gateScore))}%`,
                    backgroundColor: '#D97706',
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Bhāva Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  Bhāva Score
                </span>
                <span className="font-bold text-slate-900">
                  {activeReport.bhavaScore}/100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, activeReport.bhavaScore))}%`,
                    backgroundColor: '#D97706',
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Philosophical Diagnostic Insights (Centered below point heading) */}
      {activeReport && (
        <div className="flex flex-col space-y-3 pt-1">
          {/* Buddhi Card */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100/90 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-amber-700" />
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Buddhi (Charioteer)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {activeReport.charioteerStatus}
            </p>
          </div>

          {/* Manas Card */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-100/90 text-orange-800 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-4 h-4 text-orange-700" />
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Manas (Reins)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {activeReport.reinsStatus}
            </p>
          </div>

          {/* Indriyas Card */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100/90 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-emerald-700" />
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Indriyas (Horses)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {activeReport.horsesStatus}
            </p>
          </div>
        </div>
      )}

      {/* 6. Classical Exegesis Quote */}
      {activeReport?.upanishadAllegory && (
        <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900/90 leading-relaxed font-serif italic shadow-2xs">
          {activeReport.upanishadAllegory}
        </div>
      )}
    </div>
  );
};

export default ChariotHome;
