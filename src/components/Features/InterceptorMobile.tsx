import React, { useState, useMemo, useEffect } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { estimateCascadeStage } from '../../engine/cascadeEngine';
import { validatePratipakshaReframe } from '../../engine/pratipakshaEngine';
import { getPRQBreakdown, isInterceptionSuccessful } from '../../engine/interceptorEngine';
import { CascadeVisualizer } from './CascadeVisualizer';
import { LifeRhythmBar } from '../Chariot/LifeRhythmBar';
import {
  SEEKER_INTERCEPTOR_TRIGGERS,
  SEEKER_MICRO_SWAPS,
  SeekerInterceptorTrigger,
  SeekerReframePair,
  DetailedMicroSwap,
} from '../../data/seekerShastraData';
import { LifeRhythm } from '../../types/shastra';
import { TriggerCategory } from '../../types/interceptor';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Check,
} from 'lucide-react';

export interface InterceptorMobileProps {
  className?: string;
}

/**
 * Mobile-first master Impulse Interceptor component (Stage 1 - Path of the Seeker).
 *
 * Implements:
 * - Dynamic 3-mode LifeRhythm adaptation (Learning & Study, Work & Enterprise, Home & Quiet Living)
 * - 5 Rhythm-adaptive Triggers with 1-Tap Pratipaksha Quick-Fill Reframe Pairs
 * - 3-Column PRQ Telemetry Strip (PRQ Score, Intercepted, Honest Slips)
 * - 1 to 5 Urge Intensity Slider with 7-Step Cascade Visualizer
 * - 6 Curated Somatic Micro-Swaps adapted to the active life rhythm
 * - Dual action pathways:
 *   1. [ 🛡️ Engage Impulse Interceptor & Reframe ] (Full Pratipaksha Sattvic reframe)
 *   2. [ ⚠️ Yielded to Impulse — Log Honest Slip (No Guilt) ] (Svādhyāya without guilt)
 * - Today's Interception Activity list with 1-tap resolution recovery
 */
export const InterceptorMobile: React.FC<InterceptorMobileProps> = ({
  className = '',
}) => {
  const {
    logInterception,
    interceptions,
    openShastraLens,
    resolveInterceptionById,
    toggleInterceptionResolution,
    preferences,
  } = useBrahmaPath();

  const rhythm: LifeRhythm = preferences?.lifeRhythm ?? 'learning_study';
  const triggers = SEEKER_INTERCEPTOR_TRIGGERS[rhythm] ?? SEEKER_INTERCEPTOR_TRIGGERS.learning_study;
  const microSwaps = SEEKER_MICRO_SWAPS[rhythm] ?? SEEKER_MICRO_SWAPS.learning_study;

  // --- COMPONENT STATE ---
  const [selectedTrigger, setSelectedTrigger] = useState<SeekerInterceptorTrigger>(
    triggers[0]
  );
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [vitarkaText, setVitarkaText] = useState<string>(
    triggers[0]?.pairs[0]?.vitarka ?? ''
  );
  const [pratipakshaText, setPratipakshaText] = useState<string>(
    triggers[0]?.pairs[0]?.pratipaksha ?? ''
  );
  const [selectedSwap, setSelectedSwap] = useState<string>('');
  const [gateFeedback, setGateFeedback] = useState<{
    text: string;
    isError?: boolean;
    isAmber?: boolean;
  } | null>(null);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);

  // When rhythm changes, automatically select the first trigger of that rhythm
  useEffect(() => {
    if (triggers && triggers.length > 0) {
      setSelectedTrigger(triggers[0]);
      if (triggers[0].pairs && triggers[0].pairs.length > 0) {
        setVitarkaText(triggers[0].pairs[0].vitarka);
        setPratipakshaText(triggers[0].pairs[0].pratipaksha);
      }
      setSelectedSwap('');
      if (gateFeedback?.isError) setGateFeedback(null);
    }
  }, [rhythm]);

  // Map trigger ID to canonical TriggerCategory for cascade evaluation
  const resolveTriggerCategory = (id: string): TriggerCategory => {
    switch (id) {
      case 'academic_anxiety':
      case 'work_overload':
        return 'Academic Anxiety / Professional Workload';
      case 'social_comparison':
      case 'feeling_unnoticed':
        return 'Social Comparison';
      case 'procrastination':
      case 'heavy_mood':
        return 'Lethargy';
      case 'late_night_bingeing':
      case 'phone_checking':
      case 'habitual_drift':
        return 'Cheap Dopamine / Junk Stimulation';
      case 'doomscrolling':
      default:
        return 'Doomscrolling';
    }
  };

  // Filter today's interceptions using local calendar date
  const todayInterceptions = useMemo(() => {
    const now = new Date();
    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return (interceptions || []).filter((item) => {
      if (!item || !item.timestamp) return false;
      try {
        const d = new Date(item.timestamp);
        if (isNaN(d.getTime())) return item.timestamp.slice(0, 10) === todayLocal;
        const itemDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return itemDate === todayLocal;
      } catch {
        return false;
      }
    });
  }, [interceptions]);

  // Compute live PRQ Breakdown metrics
  const prq = useMemo(() => getPRQBreakdown(todayInterceptions), [todayInterceptions]);

  // Count successfully intercepted urges today
  const successfulCount = useMemo(
    () => todayInterceptions.filter(isInterceptionSuccessful).length,
    [todayInterceptions]
  );

  // Count mindful slips today
  const slipCount = useMemo(
    () => todayInterceptions.filter((i) => !isInterceptionSuccessful(i)).length,
    [todayInterceptions]
  );

  // Handle trigger selection
  const handleTriggerSelect = (trigger: SeekerInterceptorTrigger) => {
    setSelectedTrigger(trigger);
    if (trigger.pairs && trigger.pairs.length > 0) {
      setVitarkaText(trigger.pairs[0].vitarka);
      setPratipakshaText(trigger.pairs[0].pratipaksha);
    }
    if (gateFeedback?.isError) setGateFeedback(null);
  };

  // Handle 1-tap reframe suggestion card selection
  const handleSelectReframePair = (pair: SeekerReframePair) => {
    setVitarkaText(pair.vitarka);
    setPratipakshaText(pair.pratipaksha);
    if (gateFeedback?.isError) setGateFeedback(null);
  };

  // Handle interactive toggle or resolution of a slip or interception record
  const handleToggleSlip = (id: string, currentlySuccessful: boolean) => {
    if (toggleInterceptionResolution) {
      toggleInterceptionResolution(id);
    } else if (resolveInterceptionById) {
      resolveInterceptionById(id);
    }

    if (!currentlySuccessful) {
      setGateFeedback({
        text: 'Slip resolved! Your Resilience Score and Chariot balance have updated.',
        isError: false,
      });
    } else {
      setGateFeedback({
        text: 'Recorded as mindful slip (Svādhyāya). Tap "Resolve" anytime to restore composure.',
        isError: false,
        isAmber: true,
      });
    }
  };

  // 1. Submit Successful Pratipaksha Interception
  const handleCommitInterception = () => {
    const trimmedVitarka = vitarkaText.trim();
    const trimmedPratipaksha = pratipakshaText.trim();

    // Validation: Require vitarka >= 5 chars
    if (trimmedVitarka.length < 5) {
      setGateFeedback({
        text: 'Please write down the compulsive impulse (Vitarka) with at least 5 characters.',
        isError: true,
      });
      return;
    }

    // Validation: Require pratipaksha >= 8 chars
    if (trimmedPratipaksha.length < 8) {
      setGateFeedback({
        text: 'Please formulate a conscious opposing reframe (Pratipaksha) with at least 8 characters to redirect your attention.',
        isError: true,
      });
      return;
    }

    // Validate Pratipaksha reframe quality (YS 2.33)
    const validation = validatePratipakshaReframe(trimmedVitarka, trimmedPratipaksha);
    if (!validation.isValid) {
      setGateFeedback({ text: validation.feedback, isError: true });
      return;
    }

    const triggerCat = resolveTriggerCategory(selectedTrigger.id);
    const currentStageInfo = estimateCascadeStage(triggerCat, urgeIntensity);

    logInterception({
      triggerCategory: triggerCat,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText: trimmedVitarka,
      pratipakshaText: trimmedPratipaksha,
      selectedMicroSwap: selectedSwap || microSwaps[0]?.title || 'Pranayama - Extended Exhale',
      microSwapAction: selectedSwap || microSwaps[0]?.title || 'Pranayama - Extended Exhale',
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: validation.resultingGuna,
      interactionType: 'resolved_negative_friction',
      isResolved: true,
      isPositive: false,
    });

    setIsSuccessFeedback(true);
    setGateFeedback({
      text: `Urge Intercepted! Logged at Step ${currentStageInfo.stepNumber} (${currentStageInfo.englishTitle}). Your discriminative intellect (Buddhi) has regained the reins.`,
      isError: false,
    });

    setTimeout(() => {
      setIsSuccessFeedback(false);
      setGateFeedback(null);
    }, 2800);
  };

  // 2. Submit Compassionate Honest Slip (Svādhyāya - Non-judgmental awareness)
  const handleLogSlip = () => {
    const triggerCat = resolveTriggerCategory(selectedTrigger.id);
    const slipVitarka =
      vitarkaText.trim() ||
      `Yielded to ${selectedTrigger.label} impulse (Intensity ${urgeIntensity} of 5)`;

    const slipStage = estimateCascadeStage(triggerCat, urgeIntensity);

    logInterception({
      triggerCategory: triggerCat,
      cascadeStageReached: slipStage.stage,
      urgeIntensity,
      vitarkaText: slipVitarka,
      pratipakshaText: '',
      selectedMicroSwap: 'None (Yielded to impulse)',
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      interactionType: 'unresolved_negative_friction',
      isResolved: false,
      isPositive: false,
    });

    setGateFeedback({
      text: 'Honest observation recorded (Svādhyāya). Your Resilience Score reflects the truth without guilt. You can reclaim composure anytime by tapping "Resolve" below.',
      isError: false,
      isAmber: true,
    });
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Top Life Rhythm Switcher */}
      <LifeRhythmBar />

      {/* Main Unified Master Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="rounded-3xl p-6 border shadow-xs space-y-5"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                The Impulse Interceptor
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Interrupt compulsive triggers and emotional friction before attention slips into regret.
            </p>
          </div>
          <ShastraLensButton
            onClick={() => openShastraLens('pratipaksha')}
            className="ml-2 flex-shrink-0"
          />
        </div>

        {/* 3-Column PRQ Telemetry Strip */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              PRQ Score
            </span>
            <span className="font-extrabold text-emerald-800 font-mono text-sm sm:text-base">
              {prq.gateScore}%
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Intercepted
            </span>
            <span className="font-extrabold text-emerald-700 font-mono text-sm sm:text-base">
              {successfulCount}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Honest Slips
            </span>
            <span className="font-extrabold text-amber-700 font-mono text-sm sm:text-base">
              {slipCount}
            </span>
          </div>
        </div>

        {/* ================= STEP 1: 5 RHYTHM-ADAPTIVE FIELD TRIGGERS ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
            Step 1 — What Just Hit Your Mind?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select the active friction or urge pulling at your attention right now:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {triggers.map((trigger) => {
              const isSelected = selectedTrigger?.id === trigger.id;
              return (
                <button
                  key={trigger.id}
                  type="button"
                  onClick={() => handleTriggerSelect(trigger)}
                  style={{
                    backgroundColor: isSelected ? '#065F46' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isSelected
                      ? 'border-[#065F46] font-bold shadow-xs'
                      : 'border-slate-200/90 hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  {trigger.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 2: URGE INTENSITY & CASCADE VISUALIZER ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
              Step 2 — Urge Intensity ({urgeIntensity} of 5)
            </h3>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                urgeIntensity <= 2
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : urgeIntensity === 3
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {urgeIntensity <= 2 ? 'Early Intercept' : urgeIntensity === 3 ? 'Peak Urge' : 'Critical Stage'}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={urgeIntensity}
            onChange={(e) => {
              setUrgeIntensity(Number(e.target.value));
              if (gateFeedback?.isError) setGateFeedback(null);
            }}
            className="w-full accent-[#065F46] cursor-pointer"
          />

          <div className="grid grid-cols-3 text-[11px] text-slate-400 font-medium pt-0.5">
            <span className="text-left">1 (Passing Urge)</span>
            <span className="text-center text-amber-700 font-semibold">3 (Active Pull)</span>
            <span className="text-right text-rose-700 font-semibold">5 (Surging Hijack)</span>
          </div>

          <div className="pt-2 border-t border-slate-200/70">
            <CascadeVisualizer intensity={urgeIntensity} showHeader={false} />
          </div>
        </div>

        {/* ================= STEP 3: ACTIVE COGNITIVE REFRAME ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
              Step 3 — Active Cognitive Reframe
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vitarka (Compulsive Impulse) vs Pratipaksha (Steady Counter-Thought)
            </p>
          </div>

          {/* Clean inner grey box: 2 Reframe Suggestions for Selected Trigger */}
          <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tap a matching thought below to auto-fill (or write your own):</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {(selectedTrigger?.pairs || []).map((pair, idx) => {
                const isActive =
                  vitarkaText === pair.vitarka && pratipakshaText === pair.pratipaksha;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectReframePair(pair)}
                    className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer space-y-2 flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-50/90 border-emerald-700 ring-2 ring-emerald-700/20 text-emerald-950 font-medium shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-1">
                        <span>Thought Option {idx + 1}</span>
                        {isActive && (
                          <span className="text-emerald-700 flex items-center gap-1 font-bold">
                            <Check className="w-3.5 h-3.5" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-900 leading-relaxed font-medium">
                        &ldquo;{pair.vitarka}&rdquo;
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/70">
                      <p className="text-[11px] text-emerald-800 leading-relaxed font-normal italic">
                        → {pair.pratipaksha}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Textarea 1: Vitarka */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Vitarka (Name the Impulse or Friction)
            </label>
            <p className="text-[11px] text-slate-500">
              What reactive narrative or craving is pulling at your attention?
            </p>
            <textarea
              rows={2}
              value={vitarkaText}
              onChange={(e) => {
                setVitarkaText(e.target.value);
                if (gateFeedback?.isError) setGateFeedback(null);
              }}
              placeholder="Name the impulse pulling at your mind..."
              className="w-full p-3 border border-slate-300 rounded-xl bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none transition shadow-2xs leading-relaxed"
            />
          </div>

          {/* Editable Textarea 2: Pratipaksha */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Pratipaksha (The Grounded Counter-Thought)
            </label>
            <p className="text-[11px] text-slate-500">
              What grounded truth restores your dignity and emotional composure?
            </p>
            <textarea
              rows={2}
              value={pratipakshaText}
              onChange={(e) => {
                setPratipakshaText(e.target.value);
                if (gateFeedback?.isError) setGateFeedback(null);
              }}
              placeholder="State the grounded, steady counter-thought..."
              className="w-full p-3 border border-slate-300 rounded-xl bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none transition shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* ================= STEP 4: 6 CURATED MICRO-SWAPS ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
            Step 4 — Grounding Micro-Swap
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pick 1 small physical or mental action to discharge restlessness and re-anchor your awareness:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {microSwaps.map((swap, idx) => {
              const isSelected = selectedSwap === swap.title;
              return (
                <button
                  key={swap.id || idx}
                  type="button"
                  onClick={() => setSelectedSwap((prev) => (prev === swap.title ? '' : swap.title))}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-[#065F46] ring-1 ring-[#065F46]/20 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {swap.title}
                    </h4>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-md bg-[#065F46] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-md border border-slate-300 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {swap.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {swap.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Banner */}
        {gateFeedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
              gateFeedback.isError
                ? 'bg-red-50 border-red-200 text-red-900'
                : gateFeedback.isAmber
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {gateFeedback.isError ? (
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : gateFeedback.isAmber ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            <p className="font-medium leading-relaxed">{gateFeedback.text}</p>
          </div>
        )}

        {/* ================= ACTION BUTTONS ================= */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleCommitInterception}
            style={{
              backgroundColor: isSuccessFeedback ? '#059669' : '#065F46',
              color: '#FFFFFF',
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs hover:opacity-95 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>Engage Impulse Interceptor &amp; Reframe</span>
          </button>

          <button
            type="button"
            onClick={handleLogSlip}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 transition shadow-2xs active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Yielded to Impulse — Log Honest Slip (No Guilt)</span>
          </button>
        </div>

        {/* ================= TODAY'S ACTIVITY & RESOLUTION ================= */}
        {todayInterceptions.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Today&apos;s Interceptions ({todayInterceptions.length})
              </span>
              <span className="text-[10px] text-slate-400 font-medium">1-Tap Recovery</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {todayInterceptions.map((item) => {
                const isSuccessful = isInterceptionSuccessful(item);
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 truncate">
                          {item.triggerCategory}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/70">
                          Intensity {item.urgeIntensity ?? 1} of 5
                        </span>
                        {item.selectedMicroSwap && item.selectedMicroSwap !== 'None' && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 truncate">
                            {item.selectedMicroSwap}
                          </span>
                        )}
                      </div>
                      {item.vitarkaText && (
                        <p className="text-[11px] text-slate-600 italic truncate" title={item.vitarkaText}>
                          &ldquo;{item.vitarkaText}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSuccessful ? (
                        <button
                          type="button"
                          onClick={() => handleToggleSlip(item.id, true)}
                          className="px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200/80 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 cursor-pointer transition shadow-2xs active:scale-95 shrink-0"
                          title="Intercepted (Click to toggle)"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Intercepted</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleSlip(item.id, false)}
                          className="px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-rose-100 hover:bg-emerald-100 text-rose-900 hover:text-emerald-900 border border-rose-300 hover:border-emerald-400 flex items-center gap-1.5 cursor-pointer transition shadow-2xs active:scale-95 shrink-0 group"
                          title="Mindful slip — Click to resolve and restore Resilience Score"
                        >
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600 group-hover:text-emerald-600 transition-colors" />
                            <span>Slip</span>
                          </span>
                          <span className="text-[10px] font-bold bg-white text-rose-700 group-hover:text-emerald-800 px-1.5 py-0.5 rounded-full border border-rose-200 group-hover:border-emerald-300 transition-colors">
                            Resolve
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterceptorMobile;
