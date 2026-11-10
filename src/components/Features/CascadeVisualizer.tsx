import React, { useRef, useEffect, useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';

export interface CascadeStep {
  stepNumber: number;
  name: string;
  sanskrit: string;
  description: string;
}

export const GITA_CASCADE_SEVEN_STEPS: CascadeStep[] = [
  {
    stepNumber: 1,
    name: 'Dwelling',
    sanskrit: 'Dhyāna (ध्यायतो विषयान्)',
    description: 'Idle sensory contemplation & mental lingering',
  },
  {
    stepNumber: 2,
    name: 'Attachment',
    sanskrit: 'Saṅga (सङ्ग)',
    description: 'Psychological affinity & emotional attachment',
  },
  {
    stepNumber: 3,
    name: 'Craving',
    sanskrit: 'Kāma (काम)',
    description: 'Urge peak & compulsive wanting',
  },
  {
    stepNumber: 4,
    name: 'Agitation',
    sanskrit: 'Krodha (क्रोध)',
    description: 'Inner friction, frustration & restlessness',
  },
  {
    stepNumber: 5,
    name: 'Delusion',
    sanskrit: 'Sammoha (सम्मोह)',
    description: 'Attentional trance & loss of time awareness',
  },
  {
    stepNumber: 6,
    name: 'Memory Loss',
    sanskrit: 'Smṛti-vibhrama (स्मृतिविभ्रम)',
    description: 'Lapse of core Sankalpa & mindfulness',
  },
  {
    stepNumber: 7,
    name: 'Loss of Intellect',
    sanskrit: 'Buddhi-nāśa (बुद्धिनाश)',
    description: 'Collapse of conscious executive governance',
  },
];

export interface CascadeVisualizerProps {
  /** Optional active step index (1-7), defaults to 3 (Kama / Craving) */
  activeStep?: number;
  /** Optional urge intensity (1-5) mapped to step index */
  intensity?: number;
  className?: string;
  onOpenShastra?: () => void;
  /** Whether to render the internal card header. Set false when embedded in a parent card. */
  showHeader?: boolean;
}

/**
 * Mobile-first horizontal scrollable visualizer for the 7-step psychological
 * descent cascade from Bhagavad Gita 2.62-63.
 *
 * Visually highlights the active step based on urge intensity, renders a subtle
 * warm trail for preceding steps, and displays a dynamic multi-tier diagnostic banner.
 */
export const CascadeVisualizer: React.FC<CascadeVisualizerProps> = ({
  activeStep,
  intensity,
  className = '',
  onOpenShastra,
  showHeader = true,
}) => {
  const effectiveStep = activeStep ?? (intensity ? Math.min(Math.max(intensity + 1, 1), 7) : 3);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  // Smoothly scroll ONLY the horizontal timeline to keep active card centered (never scrolls page vertically)
  useEffect(() => {
    if (scrollContainerRef.current && activeCardRef.current) {
      const container = scrollContainerRef.current;
      const card = activeCardRef.current;
      const scrollTarget = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    }
  }, [effectiveStep]);

  // Find active step data
  const currentStep = useMemo(() => {
    return (
      GITA_CASCADE_SEVEN_STEPS.find((s) => s.stepNumber === effectiveStep) ??
      GITA_CASCADE_SEVEN_STEPS[2]
    );
  }, [effectiveStep]);

  // Compute dynamic diagnostic banner content across 3 severity tiers
  const tierConfig = useMemo(() => {
    if (effectiveStep <= 2) {
      return {
        containerClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        iconBg: 'bg-emerald-200 text-emerald-800',
        icon: '✓',
        badgeText: '✓ Early Interception Window',
        badgeColor: 'text-emerald-900',
        message: `You are at Step ${currentStep.stepNumber}: ${currentStep.name} (${currentStep.sanskrit.split(' ')[0]}). The sensory loop is only a surface ripple. A single conscious breath right now effortlessly dissolves the attachment.`,
      };
    }
    if (effectiveStep === 3 || effectiveStep === 4) {
      return {
        containerClass: 'bg-amber-50 text-amber-950 border-amber-200',
        iconBg: 'bg-amber-200 text-amber-800',
        icon: '⚡',
        badgeText: '⚡ Active Friction — Buddhi Awake',
        badgeColor: 'text-amber-900',
        message: `You are experiencing Step ${currentStep.stepNumber}: ${currentStep.name} (${currentStep.sanskrit.split(' ')[0]}). Dopamine craving and agitation are pulling at the reins, but your discriminative intellect (Buddhi) is still in command. Deploy a Pratipaksha reframe now.`,
      };
    }
    return {
      containerClass: 'bg-rose-50 text-rose-950 border-rose-200',
      iconBg: 'bg-rose-200 text-rose-800',
      icon: '⚠',
      badgeText: '⚠ Critical Descent — Immediate Circuit Break Needed',
      badgeColor: 'text-rose-900',
      message: `You have reached Step ${currentStep.stepNumber}: ${currentStep.name} (${currentStep.sanskrit.split(' ')[0]}). Attentional trance is overriding working memory. Do not negotiate with the screen—execute a physical Shreyas Micro-Swap immediately to reclaim the reins.`,
    };
  }, [activeStep, currentStep]);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Header Info */}
      {showHeader && (
        <div className="flex items-center justify-between px-0.5">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Bhagavad Gita 2.62–63 Cascade
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Psychological Descent &amp; Early Interception
            </h3>
          </div>
          {onOpenShastra && <ShastraLensButton onClick={onOpenShastra} />}
        </div>
      )}

      {/* Horizontal Scrollable Visualizer Container */}
      <div ref={scrollContainerRef} className="w-full overflow-x-auto pb-2 pt-1 scroll-smooth">
        <div className="flex items-stretch gap-3 min-w-max pr-2">
          {GITA_CASCADE_SEVEN_STEPS.map((step) => {
            const isTargetActive = step.stepNumber === effectiveStep;
            const isPastStep = step.stepNumber < effectiveStep;

            return (
              <div
                key={step.stepNumber}
                ref={isTargetActive ? activeCardRef : null}
                className={`w-36 sm:w-40 p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between flex-shrink-0 ${
                  isTargetActive
                    ? 'border-orange-500 bg-orange-50 shadow-sm ring-1 ring-orange-400/40'
                    : isPastStep
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Step Number & Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isTargetActive
                        ? 'bg-orange-500 text-white'
                        : isPastStep
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Step {step.stepNumber}
                  </span>
                  {isTargetActive && (
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">
                      Active
                    </span>
                  )}
                </div>

                {/* English Name & Sanskrit Trait */}
                <div className="space-y-0.5 mb-2">
                  <h4
                    className={`text-sm font-bold leading-tight ${
                      isTargetActive
                        ? 'text-orange-950'
                        : isPastStep
                          ? 'text-slate-800'
                          : 'text-slate-900'
                    }`}
                  >
                    {step.stepNumber}. {step.name}
                  </h4>
                  <p
                    className={`text-[11px] font-medium leading-tight ${
                      isTargetActive
                        ? 'text-orange-700 font-semibold'
                        : isPastStep
                          ? 'text-amber-700/80 font-medium'
                          : 'text-slate-500'
                    }`}
                  >
                    {step.sanskrit.split(' ')[0]}
                  </p>
                </div>

                {/* Micro Description */}
                <p
                  className={`text-[11px] leading-snug mt-auto pt-2 border-t ${
                    isTargetActive
                      ? 'text-orange-800/90 border-orange-200/80'
                      : isPastStep
                        ? 'text-slate-500 border-amber-100/80'
                        : 'text-slate-400 border-slate-100'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Diagnostic Severity Banner */}
      <div
        className={`${tierConfig.containerClass} p-4 rounded-xl border shadow-2xs space-y-1.5 animate-fadeIn`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${tierConfig.iconBg} font-bold text-xs`}
          >
            {tierConfig.icon}
          </span>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${tierConfig.badgeColor}`}
          >
            {tierConfig.badgeText}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed pl-7">
          {tierConfig.message}
        </p>
      </div>
    </div>
  );
};

export default CascadeVisualizer;
