import React, { useState, useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { estimateCascadeStage } from '../../engine/cascadeEngine';
import { getPRQBreakdown, isInterceptionSuccessful } from '../../engine/interceptorEngine';
import { SpeechRestraintProtocol } from '../../types/trayopastambha';
import { CascadeVisualizer } from '../Features/CascadeVisualizer';
import { PostingEnvironmentBar } from './PostingEnvironmentBar';
import {
  SENTINEL_INTERCEPTOR_TRIGGERS,
  PAUSE_GATE_FIELD_TRIGGERS,
  TERRAIN_MICRO_SWAPS,
  PauseGateFieldTrigger,
  FieldReframePair,
  DetailedMicroSwap,
} from '../../data/sentinelShastraData';
import { useEffect } from 'react';
import { DeploymentEnvironment } from '../../types/shastra';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  VolumeX,
  MessageSquare,
  Users,
  Check,
  Compass,
} from 'lucide-react';

export interface SentinelPauseGateProps {
  className?: string;
}

interface IntensityMetadata {
  title: string;
  desc: string;
  badge: string;
}

const INTENSITY_METADATA: Record<number, IntensityMetadata> = {
  1: {
    title: 'Subtle Sensory Spark',
    desc: 'Fleeting irritation or passing urge. Easily interruptible.',
    badge: 'Early Intercept',
  },
  2: {
    title: 'Building Tension',
    desc: 'Mind circling the friction; emotional affinity forming.',
    badge: 'Early Intercept',
  },
  3: {
    title: 'Visceral Heat Flash',
    desc: 'Acute urge peak or adrenaline surge. Compulsion seeking discharge.',
    badge: 'Peak Urge',
  },
  4: {
    title: 'Swallowed Anger / Pressure',
    desc: 'Swallowed krodha demanding immediate verbal or physical release.',
    badge: 'Critical Stage',
  },
  5: {
    title: 'Total Cognitive Hijack',
    desc: 'Discriminative intellect (Buddhi) collapsing; blind impulse imminent.',
    badge: 'Urgent Intercept',
  },
};

interface SpeechProtocolOption {
  id: SpeechRestraintProtocol;
  label: string;
  badge: string;
  desc: string;
  icon: typeof VolumeX;
}

const SPEECH_PROTOCOLS: SpeechProtocolOption[] = [
  {
    id: 'mauna_hold_10m',
    label: 'Hold Phone & Tongue for 10 Mins (Do not reply while blood is hot)',
    badge: 'BG 17.15 Mauna',
    desc: 'Commit to 10 minutes of complete radio/verbal silence before sending messages or reacting to provocation.',
    icon: VolumeX,
  },
  {
    id: 'suhrda_measured_speech',
    label: 'Use the 2-Line Warmth Anchor (Speak softly without blame)',
    badge: 'BG 17.15 Anudvegam',
    desc: 'Speak only essential, calm words that cause no agitation—gentle, truthful, and supportive.',
    icon: MessageSquare,
  },
  {
    id: 'sahyog_buddy_debrief',
    label: 'Step Aside with Unit Buddy for 5 Mins',
    badge: 'BG 17.15 Sahyog',
    desc: 'De-escalate autonomic heat through quiet, grounded contact with a trusted unit buddy.',
    icon: Users,
  },
];

const TERRAIN_LABELS: Record<DeploymentEnvironment, string> = {
  high_altitude: 'High-Altitude & Cold Post',
  active_border: 'Active Border & Picket Grid',
  cantonment: 'Cantonment & Peace Station',
};

/**
 * Mobile-first Sentinel Tactical Impulse & Krodha Interceptor.
 * Rooted in Bhagavad Gita 2.62–63 & 17.15 (Vāṅ-maya Tapas).
 * Provides defense personnel with field triggers, 1-tap Battle-Buddy reframes,
 * speech restraint protocols, and terrain-smart micro-swaps.
 */
export const SentinelPauseGate: React.FC<SentinelPauseGateProps> = ({ className = '' }) => {
  const {
    logInterception,
    interceptions,
    openShastraLens,
    resolveInterceptionById,
    toggleInterceptionResolution,
    preferences,
  } = useBrahmaPath();

  const env: DeploymentEnvironment = preferences?.deploymentEnvironment ?? 'active_border';
  const triggers = SENTINEL_INTERCEPTOR_TRIGGERS[env] ?? PAUSE_GATE_FIELD_TRIGGERS;
  const swaps = TERRAIN_MICRO_SWAPS[env] ?? TERRAIN_MICRO_SWAPS.active_border;

  // Component State
  const [selectedTrigger, setSelectedTrigger] = useState<PauseGateFieldTrigger>(
    triggers[0]
  );
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [vitarkaText, setVitarkaText] = useState<string>(
    triggers[0]?.pairs[0]?.vitarka ?? ''
  );
  const [pratipakshaText, setPratipakshaText] = useState<string>(
    triggers[0]?.pairs[0]?.pratipaksha ?? ''
  );

  // When posting environment changes, automatically select the first trigger of that terrain
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
  }, [env]);
  const [selectedProtocol, setSelectedProtocol] =
    useState<SpeechRestraintProtocol>('mauna_hold_10m');
  const [selectedSwap, setSelectedSwap] = useState<string>('');
  const [gateFeedback, setGateFeedback] = useState<{
    text: string;
    isError?: boolean;
    isAmber?: boolean;
  } | null>(null);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);

  // Compute today's interceptions
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

  const successfulCount = useMemo(
    () => todayInterceptions.filter(isInterceptionSuccessful).length,
    [todayInterceptions]
  );

  const slipCount = useMemo(
    () => todayInterceptions.filter((i) => !isInterceptionSuccessful(i)).length,
    [todayInterceptions]
  );

  const currentStageInfo = useMemo(() => {
    return estimateCascadeStage(selectedTrigger.category, urgeIntensity);
  }, [selectedTrigger.category, urgeIntensity]);

  // Select trigger pill
  const handleTriggerSelect = (trigger: PauseGateFieldTrigger) => {
    setSelectedTrigger(trigger);
    // Pre-populate with first reframe pair of the newly selected trigger
    if (trigger.pairs && trigger.pairs.length > 0) {
      setVitarkaText(trigger.pairs[0].vitarka);
      setPratipakshaText(trigger.pairs[0].pratipaksha);
    }
    if (gateFeedback?.isError) setGateFeedback(null);
  };

  // 1-Tap Battle-Buddy quick-fill
  const handleSelectReframePair = (pair: FieldReframePair) => {
    setVitarkaText(pair.vitarka);
    setPratipakshaText(pair.pratipaksha);
    if (gateFeedback?.isError) setGateFeedback(null);
  };

  // Toggle micro-swap selection
  const handleSwapSelect = (title: string) => {
    setSelectedSwap((prev) => (prev === title ? '' : title));
  };

  // Toggle slip/resolution in history list
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
    if (!selectedTrigger) {
      setGateFeedback({
        text: 'Please select what triggered your mind above before logging.',
        isError: true,
      });
      return;
    }

    const trimmedVitarka = vitarkaText.trim();
    const trimmedPratipaksha = pratipakshaText.trim();

    if (trimmedVitarka.length === 0) {
      setGateFeedback({
        text: 'Please write down or tap a raw thought (Vitarka) before logging your interception.',
        isError: true,
      });
      return;
    }

    if (trimmedPratipaksha.length === 0) {
      setGateFeedback({
        text: 'Please formulate or tap your Battle-Buddy reframe (Pratipaksha) to redirect your attention.',
        isError: true,
      });
      return;
    }

    logInterception({
      triggerCategory: selectedTrigger.category,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText: trimmedVitarka,
      pratipakshaText: trimmedPratipaksha,
      selectedMicroSwap: selectedSwap || swaps[0]?.title || 'Pranayama - Slow Nasal Extended Exhale',
      microSwapAction: selectedSwap || swaps[0]?.title || 'Pranayama - Slow Nasal Extended Exhale',
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: 'Sattva',
      interactionType: 'resolved_negative_friction',
      isResolved: true,
      isSuccessful: true,
      isPositive: false,
    });

    setIsSuccessFeedback(true);
    setGateFeedback({
      text: 'Circuit-Breaker Engaged! Buddhi holds the reins. Composure logged successfully.',
      isError: false,
    });

    setTimeout(() => {
      setIsSuccessFeedback(false);
    }, 2800);
  };

  // 2. Submit Honest Slip (Svādhyāya)
  const handleLogSlip = () => {
    if (!selectedTrigger) {
      setGateFeedback({
        text: 'Please select what triggered your mind above before logging a slip.',
        isError: true,
      });
      return;
    }

    const slipVitarka =
      vitarkaText.trim() ||
      `Reacted under ${selectedTrigger.label} (Intensity ${urgeIntensity}/5)`;

    logInterception({
      triggerCategory: selectedTrigger.category,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText: slipVitarka,
      pratipakshaText: '',
      selectedMicroSwap: selectedSwap || 'None (Yielded in heat)',
      microSwapAction: selectedSwap || 'None (Yielded in heat)',
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      interactionType: 'unresolved_negative_friction',
      isResolved: false,
      isSuccessful: false,
      isPositive: false,
    });

    setGateFeedback({
      text: 'Honest observation logged (Svādhyāya). Zero shame—reclaim composure anytime by tapping "Resolve" below.',
      isError: false,
      isAmber: true,
    });
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* ================= TOP POSTING ENVIRONMENT SWITCHER ================= */}
      <PostingEnvironmentBar />

      {/* ================= MASTER IMPULSE INTERCEPTOR CARD ================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-6"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Tactical Impulse &amp; Krodha Interceptor
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Stop the &apos;last straw&apos; surge before heat turns into words or actions that hurt you, your unit, or your family.
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
          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Intercepted
            </span>
            <span className="font-extrabold text-slate-900 font-mono text-sm sm:text-base">
              {successfulCount}
            </span>
          </div>
          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Honest Slips
            </span>
            <span className="font-extrabold text-amber-700 font-mono text-sm sm:text-base">
              {slipCount}
            </span>
          </div>
        </div>

        {/* ================= STEP 1: WHAT JUST HIT YOUR MIND ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
              Step 1 — What Just Hit Your Mind, Brother?
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              Field Triggers
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select the operational spark causing acute tension right now to unlock matching Battle-Buddy reframes:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {triggers.map((trigger) => {
              const isSelected = selectedTrigger?.id === trigger.id;
              return (
                <button
                  key={trigger.id}
                  type="button"
                  onClick={() => handleTriggerSelect(trigger)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left cursor-pointer flex items-center gap-2 select-none ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-700/20'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span>{trigger.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 2: AGITATION & HEAT METER ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
                Step 2 — Agitation / Heat Meter (1 to 5)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate the adrenaline surge or internal urge demanding expression:
              </p>
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 whitespace-nowrap ml-2">
              Level {urgeIntensity} / 5
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={urgeIntensity}
            onChange={(e) => setUrgeIntensity(Number(e.target.value))}
            className="w-full accent-[#D97706] cursor-pointer"
          />

          <div className="grid grid-cols-3 items-center text-[11px] px-0.5">
            <span className="text-left text-slate-500 font-medium">1 (Subtle Spark)</span>
            <div className="text-center">
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shadow-2xs inline-block">
                {INTENSITY_METADATA[urgeIntensity].badge}
              </span>
            </div>
            <span className="text-right text-slate-700 font-semibold">5 (Total Hijack)</span>
          </div>

          {/* Live Stage Guidance */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              Stage 3–4 (Krodha / Heat) is where we lock the brakes—before Stage 5 (Smṛti-Bhramśa) makes you say something you regret.
            </p>
          </div>

          {/* 7-Step Cascade Visualization Engine */}
          <CascadeVisualizer
            activeStep={currentStageInfo.stepNumber}
            showHeader={false}
          />
        </div>

        {/* ================= STEP 3: INTERACTIVE BATTLE-BUDDY REFRAME ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
                Step 3 — Interactive Battle-Buddy Reframe
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vitarka (Raw Compulsive Surge) vs Pratipaksha (Sattvic Buddhi Counter-Voice)
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              YS 2.33
            </span>
          </div>

          {/* Quick-Tap Battle-Buddy Cards for Selected Trigger */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
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
                    key={pair.id || idx}
                    type="button"
                    onClick={() => handleSelectReframePair(pair)}
                    className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer space-y-2 flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-50/90 border-emerald-700 ring-2 ring-emerald-700/20 text-emerald-950 font-medium shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 text-slate-700'
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

          {/* Textarea 1: Vitarka */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. The Raw Knot Inside — Vitarka
            </label>
            <p className="text-[11px] text-slate-500">
              What is your mind yelling right now? (harsh words, swallowed frustration, urgent craving)
            </p>
            <textarea
              rows={2}
              value={vitarkaText}
              onChange={(e) => setVitarkaText(e.target.value)}
              placeholder="e.g. My blood is boiling after that order and I feel like snapping..."
              className="w-full p-3 border border-slate-300 rounded-xl bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none transition shadow-2xs leading-relaxed"
            />
          </div>

          {/* Textarea 2: Pratipaksha */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Your Battle-Buddy Counter-Voice — Pratipaksha
            </label>
            <p className="text-[11px] text-slate-500">
              What would a steady, senior comrade tell you right now? (BG 2.56 / BG 6.5)
            </p>
            <textarea
              rows={2}
              value={pratipakshaText}
              onChange={(e) => setPratipakshaText(e.target.value)}
              placeholder="e.g. Saluting the rank is discipline; letting harsh words live in my head tonight is optional..."
              className="w-full p-3 border border-slate-300 rounded-xl bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none transition shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* ================= STEP 4: 10-MIN VĀṄ-MAYA TAPAS SHIELD ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
              Step 4 — The 10-Minute Vāṅ-maya Tapas Shield (BG 17.15 Speech Protocol)
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              Discipline of Speech
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Before sending that voice note, making that call, or responding to provocation, anchor your speech:
          </p>

          <div className="space-y-2 pt-1">
            {SPEECH_PROTOCOLS.map((protocol) => {
              const isSelected = selectedProtocol === protocol.id;
              const IconComp = protocol.icon;
              return (
                <button
                  key={protocol.id}
                  type="button"
                  onClick={() => setSelectedProtocol(protocol.id)}
                  className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-700 ring-2 ring-emerald-700/20 text-emerald-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-900">{protocol.label}</span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {protocol.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                      {protocol.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP 5: TERRAIN-SMART PHYSICAL RESETS ================= */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">
              Step 5 — Terrain-Smart Physical Resets
            </h3>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {TERRAIN_LABELS[env]}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pick 1 physical reset engineered for your current terrain to discharge adrenaline from your body:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {swaps.map((swap, idx) => {
              const isSelected = selectedSwap === swap.title;
              return (
                <button
                  key={swap.id || idx}
                  type="button"
                  onClick={() => handleSwapSelect(swap.title)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-amber-50/60 border-[#D97706] ring-1 ring-[#D97706]/20 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {swap.title}
                    </h4>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-md bg-[#D97706] text-white flex items-center justify-center shrink-0">
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
            <span>Engage Impulse Interceptor &amp; Hold Reins</span>
          </button>

          <button
            type="button"
            onClick={handleLogSlip}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 transition shadow-2xs active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Reacted in Heat — Log Honest Slip (Zero Guilt)</span>
          </button>
        </div>

        {/* ================= TODAY'S ACTIVITY & RESOLUTION ================= */}
        {todayInterceptions.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                Today&apos;s Interceptions ({todayInterceptions.length})
              </span>
              <span className="text-[10px] text-slate-400 font-medium">1-Tap Recovery</span>
            </div>

            <div className="space-y-2">
              {todayInterceptions.slice(0, 5).map((item) => {
                const isSuccessful = isInterceptionSuccessful(item);
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isSuccessful ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-bold text-slate-900 truncate">
                          {item.triggerCategory}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate italic pl-4">
                        {item.vitarkaText}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSlip(item.id, isSuccessful)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex-shrink-0 cursor-pointer ${
                        isSuccessful
                          ? 'bg-emerald-100/70 text-emerald-800 hover:bg-amber-100 hover:text-amber-900'
                          : 'bg-amber-100 text-amber-900 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      {isSuccessful ? 'Intercepted' : 'Resolve Slip'}
                    </button>
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

export default SentinelPauseGate;
