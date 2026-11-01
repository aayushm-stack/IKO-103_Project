import React, { useState, useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { estimateCascadeStage } from '../../engine/cascadeEngine';
import { validatePratipakshaReframe } from '../../engine/pratipakshaEngine';
import { getPRQBreakdown, isInterceptionSuccessful } from '../../engine/interceptorEngine';
import { TriggerCategory } from '../../types/iks';
import { CascadeVisualizer } from './CascadeVisualizer';
import { ReframeInputs } from './ReframeInputs';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export interface InterceptorMobileProps {
  className?: string;
}

const TRIGGER_CATEGORIES: TriggerCategory[] = [
  'Doomscrolling',
  'Academic Anxiety / Professional Workload',
  'Social Comparison',
  'Lethargy',
  'Cheap Dopamine / Junk Stimulation',
];

/**
 * Mobile-first master Impulse Interceptor component.
 *
 * Implements:
 * - Live Resilience Score & Interception Telemetry Strip
 * - Dual action pathways:
 *   1. [ Commit Reframe & Intercept Urge ] (Full Pratipaksha Sattvic reframe)
 *   2. [ Yielded to Urge — Log Mindful Slip ] (Compassionate Svadhyaya without guilt)
 * - Today's Interception Activity timeline with one-tap recovery for earlier slips.
 */
export const InterceptorMobile: React.FC<InterceptorMobileProps> = ({
  className = '',
}) => {
  const {
    logInterception,
    interceptions,
    chariotStatus,
    openShastraLens,
    resolveInterceptionById,
    toggleInterceptionResolution,
  } = useBrahmaPath();

  // --- COMPONENT STATE ---
  const [selectedTrigger, setSelectedTrigger] =
    useState<TriggerCategory | null>(null);
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [vitarkaText, setVitarkaText] = useState<string>('');
  const [pratipakshaText, setPratipakshaText] = useState<string>('');
  const [selectedSwap, setSelectedSwap] = useState<string>('');
  const [gateFeedback, setGateFeedback] = useState<{
    text: string;
    isError?: boolean;
    isAmber?: boolean;
  } | null>(null);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);

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

  // Handle trigger change — clicking the already-selected trigger deselects it
  const handleTriggerSelect = (cat: TriggerCategory) => {
    setSelectedTrigger((prev) => (prev === cat ? null : cat));
    setGateFeedback(null);
  };

  const estimatedStage = selectedTrigger
    ? estimateCascadeStage(selectedTrigger, urgeIntensity)
    : null;

  // 1. Submit Successful Pratipaksha Interception
  const handleCommitInterception = () => {
    if (!selectedTrigger) {
      setGateFeedback({
        text: 'Please select an active trigger above before logging your interception.',
        isError: true,
      });
      return;
    }

    const trimmedVitarka = vitarkaText.trim();
    const trimmedPratipaksha = pratipakshaText.trim();

    // Validation: Require vitarka >= 5 chars
    if (trimmedVitarka.length < 5) {
      setGateFeedback({
        text: 'Please write down the compulsive impulse (Vitarka) with at least 5 characters before logging your interception.',
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

    const currentStageInfo = estimateCascadeStage(selectedTrigger, urgeIntensity);

    logInterception({
      triggerCategory: selectedTrigger,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText: trimmedVitarka,
      pratipakshaText: trimmedPratipaksha,
      selectedMicroSwap: selectedSwap || 'Pranayama - Extended Exhale',
      microSwapAction: selectedSwap || 'Pranayama - Extended Exhale',
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
      setVitarkaText('');
      setPratipakshaText('');
      setSelectedSwap('');
      setUrgeIntensity(3);
      setSelectedTrigger(null);
      setIsSuccessFeedback(false);
    }, 2800);
  };

  // 2. Submit Compassionate Honest Slip (Svādhyāya - Non-judgmental awareness)
  const handleLogSlip = () => {
    if (!selectedTrigger) {
      setGateFeedback({
        text: 'Please select an active trigger above before logging a slip.',
        isError: true,
      });
      return;
    }

    const slipVitarka =
      vitarkaText.trim() ||
      `Yielded to ${selectedTrigger} impulse (Intensity ${urgeIntensity}/5)`;

    const slipStage = estimateCascadeStage(selectedTrigger, urgeIntensity);

    logInterception({
      triggerCategory: selectedTrigger,
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
      text: 'Honest observation recorded (Svādhyāya). Your Resilience Score and Chariot reflect the slip without shame. You can reclaim composure anytime by tapping "Resolve" below.',
      isError: false,
      isAmber: true,
    });

    setVitarkaText('');
    setPratipakshaText('');
    setSelectedSwap('');
    setUrgeIntensity(3);
    setSelectedTrigger(null);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* 1. Unified Master Card: Early Interception, Telemetry, Trigger Selection & 7-Step Cascade */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="rounded-3xl p-6 border shadow-xs space-y-5"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Impulse Interceptor
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Map and interrupt compulsive triggers before attention slips
            </p>
          </div>
          <ShastraLensButton
            onClick={() => openShastraLens('cascade')}
            className="ml-2 flex-shrink-0"
          />
        </div>

        {/* Live Resilience & Interception Telemetry Strip (2 Metrics Only) */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-2 gap-2 text-center text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Resilience Score
            </span>
            <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
              {todayInterceptions.length === 0 ? '0/100' : `${prq.gateScore}/100`}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Resolved Urges
            </span>
            <span className="font-extrabold text-emerald-700 font-mono text-xs sm:text-sm">
              {todayInterceptions.length === 0
                ? '0 Logged'
                : `${successfulCount} / ${todayInterceptions.length} Resolved`}
            </span>
          </div>
        </div>

        {/* Thought Question & Reassurance */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What heavy thought is pulling at you right now?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Take a slow, deep breath. You are safe here, and this urge is only temporary.
          </p>
        </div>

        {/* Trigger Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Select Active Trigger:
          </label>
          <div className="flex flex-wrap gap-2">
            {TRIGGER_CATEGORIES.map((cat) => {
              const isSelected = selectedTrigger === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleTriggerSelect(cat)}
                  style={{
                    backgroundColor: isSelected ? '#D97706' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#334155',
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'ring-2 ring-amber-500/30 font-bold'
                      : 'hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Urge Intensity Slider — only shown once a trigger is selected */}
        {selectedTrigger && estimatedStage && (
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-950">
              Urge Intensity ({urgeIntensity} / 5)
            </span>
            <span className="text-amber-800 font-semibold bg-amber-100/90 px-2.5 py-0.5 rounded-full text-[11px] border border-amber-200/80">
              {estimatedStage.canInterceptEasily ? '✓ Early Intercept' : '⚠ Critical Stage'}
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
            className="w-full accent-[#D97706] cursor-pointer h-2 bg-amber-200/60 rounded-lg appearance-none"
          />

          <div className="flex justify-between text-[11px] text-amber-900/80 font-medium pt-0.5">
            <span>Observed Descent Stage:</span>
            <span className="font-bold text-amber-950">
              Step {estimatedStage.stepNumber}: {estimatedStage.englishTitle}
            </span>
          </div>
        </div>
        )}

        {/* Embedded 7-Step Cascade Visualizer & Diagnostic Banner — only when trigger selected */}
        {selectedTrigger && estimatedStage && (
        <div className="pt-2 border-t border-slate-100">
          <CascadeVisualizer
            activeStep={estimatedStage.stepNumber || 3}
            showHeader={false}
          />
        </div>
        )}
      </div>

      {/* 3. Pratipaksha Reframe Inputs & Shreyas Micro-Swap Actions Component */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
        <ReframeInputs
          vitarkaText={vitarkaText}
          onVitarkaChange={(val) => {
            setVitarkaText(val);
            if (gateFeedback?.isError) setGateFeedback(null);
          }}
          pratipakshaText={pratipakshaText}
          onPratipakshaChange={(val) => {
            setPratipakshaText(val);
            if (gateFeedback?.isError) setGateFeedback(null);
          }}
          selectedSwap={selectedSwap}
          onSelectSwap={setSelectedSwap}
          onOpenShastra={() => openShastraLens('pratipaksha')}
        />
      </div>

      {/* 4. Dynamic Visual Feedback Banner */}
      {gateFeedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 shadow-2xs transition-all duration-300 ${
            gateFeedback.isError
              ? 'bg-rose-50 border border-rose-200 text-rose-800 font-medium'
              : gateFeedback.isAmber
                ? 'bg-amber-50 border border-amber-300 text-amber-950 font-medium'
                : 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold ring-2 ring-emerald-500/20'
          }`}
        >
          {gateFeedback.isError ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          ) : gateFeedback.isAmber ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{gateFeedback.text}</span>
        </div>
      )}

      {/* 5. Dual Action Buttons: Intercept vs Mindful Slip */}
      <div className="space-y-2.5 pt-1">
        {/* Primary Premium Button: Successful Pratipaksha Intercept */}
        <button
          type="button"
          onClick={handleCommitInterception}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-orange-950/15 hover:shadow-lg hover:shadow-orange-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 relative overflow-hidden group ${
            isSuccessFeedback
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white ring-4 ring-emerald-500/30 scale-[1.01] shadow-emerald-600/20 shadow-lg'
              : 'bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white border border-amber-400/40'
          }`}
        >
          {isSuccessFeedback ? (
            <div className="relative z-10 flex items-center justify-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-200 animate-spin" />
              <span className="tracking-wide">Intellect Cleared &amp; Logged!</span>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
              <span className="tracking-wide">Commit Reframe &amp; Intercept Urge</span>
            </div>
          )}
        </button>

        {/* Secondary Premium Mindful Slip Button (Svadhyaya - Honest Witnessing) */}
        <button
          type="button"
          onClick={handleLogSlip}
          className="w-full py-3 px-5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-amber-50/50 hover:border-amber-300/80 text-slate-700 hover:text-amber-950 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98] group"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <span>Yielded to Urge — Log Mindful Slip</span>
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-amber-800 bg-white group-hover:bg-amber-100/70 px-2 py-0.5 rounded-full border border-slate-200/80 group-hover:border-amber-300 transition-colors">
              Svādhyāya
            </span>
          </div>
        </button>
      </div>

      {/* 6. Compact "Today's Interception Activity" List */}
      {todayInterceptions.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E2E8F0',
          }}
          className="rounded-3xl p-5 border shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Today&apos;s Interception Activity ({todayInterceptions.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 font-mono">
              Resilience Score: {prq.gateScore}/100
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {todayInterceptions.map((item) => {
              const isSuccessful = isInterceptionSuccessful(item);
              const stageName =
                typeof item.cascadeStageReached === 'string'
                  ? item.cascadeStageReached.replace(/_/g, ' ')
                  : 'Stage 3';

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all text-xs flex items-center justify-between gap-3 ${
                    isSuccessful
                      ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
                      : 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">
                        {item.triggerCategory}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/70">
                        Intensity {item.urgeIntensity ?? 1}/5
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {stageName}
                      </span>
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
                        title="Intercepted & resolved (Click to toggle)"
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
  );
};

export default InterceptorMobile;
