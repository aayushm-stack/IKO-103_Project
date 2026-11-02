import React, { useState, useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { estimateCascadeStage } from '../../engine/cascadeEngine';
import { getPRQBreakdown, isInterceptionSuccessful } from '../../engine/interceptorEngine';
import { TriggerCategory } from '../../types/iks';
import { SpeechRestraintProtocol } from '../../types/trayopastambha';
import { CascadeVisualizer } from '../Features/CascadeVisualizer';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
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

interface SentinelTriggerOption {
  id: string;
  label: string;
  category: TriggerCategory;
  icon: string;
  subtext: string;
}

const SENTINEL_TRIGGERS: SentinelTriggerOption[] = [
  {
    id: 'command_friction',
    label: 'Command / Hierarchy Friction',
    category: 'Social Comparison',
    icon: '⚡',
    subtext: 'Swallowed anger from harsh orders, rank tension, or chain-of-command friction',
  },
  {
    id: 'homefront_worry',
    label: 'Homefront Worry & Leave Stress',
    category: 'Academic Anxiety / Professional Workload',
    icon: '🏡',
    subtext: 'Distance anxiety, delayed leave, family emergency, or helplessness from afar',
  },
  {
    id: 'post_watch_vigilance',
    label: 'Post-Watch Hyper-Vigilance',
    category: 'Cheap Dopamine / Junk Stimulation',
    icon: '👁️',
    subtext: 'Adrenaline spike after duty, persistent threat-scanning, unable to down-shift nervous system',
  },
  {
    id: 'barracks_boredom',
    label: 'Barracks Boredom & Digital Drift',
    category: 'Doomscrolling',
    icon: '📱',
    subtext: 'Compulsive reel scrolling, digital escapism, bunk isolation during downtime',
  },
  {
    id: 'deployment_fatigue',
    label: 'Deployment Fatigue & Numbing',
    category: 'Lethargy',
    icon: '🛡️',
    subtext: 'Emotional numbness, field burnout, cynicism, or checking out of awareness',
  },
];

interface IntensityMetadata {
  title: string;
  desc: string;
  badge: string;
}

const INTENSITY_METADATA: Record<number, IntensityMetadata> = {
  1: {
    title: 'Subtle Distraction',
    desc: 'Fleeting sensory spark or momentary irritation. Early interruptible.',
    badge: '✓ Early Intercept',
  },
  2: {
    title: 'Building Tension',
    desc: 'Mind circling the friction; emotional affinity forming.',
    badge: '✓ Early Intercept',
  },
  3: {
    title: 'Visceral Flash',
    desc: 'Acute urge peak or adrenaline surge. Compulsion seeking expression.',
    badge: '⚡ Peak Urge',
  },
  4: {
    title: 'Heavy Pressure',
    desc: 'Swallowed krodha or intense craving demanding immediate discharge.',
    badge: '⚠️ Critical Stage',
  },
  5: {
    title: 'Total Hijack Imminent',
    desc: 'Discriminative intellect (Buddhi) collapsing; blind impulse imminent.',
    badge: '🚨 Critical Stage',
  },
};

const QUICK_FILL_REFRAMES = [
  {
    id: 'bg_2_56',
    ref: 'BG 2.56 • Sthitaprajña',
    text: 'Unshaken by adversity, free from craving in pleasure, detached from rage and fear.',
  },
  {
    id: 'bg_2_14',
    ref: 'BG 2.14 • Titikṣā',
    text: 'These sensations of heat, cold, praise, and blame are fleeting contact of the senses. Endure them.',
  },
  {
    id: 'bg_6_26',
    ref: 'BG 6.26 • Chariot Hold',
    text: 'From wherever the restless and unsteady mind wanders, rein it back under the control of the Self.',
  },
];

interface SpeechProtocolOption {
  id: SpeechRestraintProtocol;
  label: string;
  badge: string;
  shastraRef: string;
  description: string;
  icon: typeof VolumeX;
}

const SPEECH_PROTOCOLS: SpeechProtocolOption[] = [
  {
    id: 'mauna_hold_10m',
    label: 'Hold Fire (10-Min Mauna Silence Before Replying)',
    badge: '🛡️ Hold Fire',
    shastraRef: 'BG 17.15 Mauna',
    description: 'Commit to 10 minutes of complete silence before responding to provocation or sending messages.',
    icon: VolumeX,
  },
  {
    id: 'suhrda_measured_speech',
    label: 'Suhṛda Speech (Speak Calmly Without Heat or Blame)',
    badge: '🗣️ Suhṛda Speech',
    shastraRef: 'BG 17.15 Anudvegakara',
    description: 'Speak words that cause no agitation, truthful, pleasant, and beneficial without sarcasm or rage.',
    icon: MessageSquare,
  },
  {
    id: 'sahyog_buddy_debrief',
    label: 'Sahyog Reset (Step Aside & Debrief with Unit Buddy)',
    badge: '🤝 Sahyog Reset',
    shastraRef: 'BG 17.15 Hita-Bhashana',
    description: 'Step away from the friction zone and de-escalate through a grounded conversation with your unit buddy.',
    icon: Users,
  },
];

interface BarracksMicroSwap {
  id: string;
  title: string;
  sanskrit: string;
  duration: string;
  desc: string;
}

const BARRACKS_MICRO_SWAPS: BarracksMicroSwap[] = [
  {
    id: 'extended_exhale',
    title: 'Extended Exhale (4s In, 8s Out)',
    sanskrit: 'Prāṇāyāma Langhana',
    duration: '2 Mins',
    desc: 'Down-shifts autonomic nervous system and cools internal adrenaline spikes.',
  },
  {
    id: 'kurma_palming',
    title: 'Kūrma Eye-Palming (60s Pitch Dark)',
    sanskrit: 'Kūrma Pratyāhāra',
    duration: '1 Min',
    desc: 'Rests overstimulated optic nerves and resets sensory perception after duty.',
  },
  {
    id: 'jala_reset',
    title: 'Jala Cold Water Face Reset',
    sanskrit: 'Jala Śamana',
    duration: '90 Secs',
    desc: 'Triggers the mammalian dive reflex to immediately decelerate heart rate.',
  },
  {
    id: 'tactical_grounding',
    title: '5-4-3-2-1 Tactical Grounding',
    sanskrit: 'Pañca Indriya Dhāraṇā',
    duration: '2 Mins',
    desc: '5 sight, 4 touch, 3 sound, 2 scent, 1 breath to ground wandering consciousness.',
  },
  {
    id: 'shoulder_neck_release',
    title: 'Post-Watch Shoulder & Neck Release',
    sanskrit: 'Kāya Śithilīkaraṇa',
    duration: '3 Mins',
    desc: 'Releases somatic armoring in trapezius, jaw, and neck from heavy kit and vigilance.',
  },
  {
    id: 'lock_phone_kitbag',
    title: 'Lock Phone in Kitbag / Locker',
    sanskrit: 'Viṣaya Tyāga',
    duration: 'Immediate',
    desc: 'Enforces tactical separation from screens and notifications in barracks bunks.',
  },
];

/**
 * Mobile-first Sentinel Impulse & Krodha Pause Gate.
 * Rooted in Bhagavad Gita 2.62-63 & 17.15 (Vāṅ-maya Tapas).
 * Serves defense personnel with operational triggers, speech de-escalation, and micro-swaps.
 */
export const SentinelPauseGate: React.FC<SentinelPauseGateProps> = ({ className = '' }) => {
  const {
    logInterception,
    interceptions,
    openShastraLens,
    resolveInterceptionById,
    toggleInterceptionResolution,
  } = useBrahmaPath();

  // Component State
  const [selectedTrigger, setSelectedTrigger] = useState<SentinelTriggerOption | null>(null);
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [vitarkaText, setVitarkaText] = useState<string>('');
  const [pratipakshaText, setPratipakshaText] = useState<string>('');
  const [selectedProtocol, setSelectedProtocol] = useState<SpeechRestraintProtocol>('mauna_hold_10m');
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

  // Toggle trigger selection
  const handleTriggerSelect = (option: SentinelTriggerOption) => {
    setSelectedTrigger((prev) => (prev?.id === option.id ? null : option));
    if (gateFeedback?.isError) setGateFeedback(null);
  };

  // Toggle micro-swap selection
  const handleSwapSelect = (title: string) => {
    setSelectedSwap((prev) => (prev === title ? '' : title));
  };

  // Quick-fill reframe
  const handleQuickFill = (text: string) => {
    setPratipakshaText(text);
    if (gateFeedback?.isError) setGateFeedback(null);
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
        text: 'Recorded as mindful observation (Svādhyāya). Tap "Resolve" anytime to restore composure.',
        isError: false,
        isAmber: true,
      });
    }
  };

  // Estimated stage for current selection
  const currentStageInfo = useMemo(() => {
    const category = selectedTrigger?.category ?? 'Social Comparison';
    return estimateCascadeStage(category, urgeIntensity);
  }, [selectedTrigger, urgeIntensity]);

  // Step 1 to 7 for visualizer
  const cascadeStep = useMemo(() => {
    if (selectedTrigger) {
      return currentStageInfo.stepNumber || 3;
    }
    return urgeIntensity <= 1 ? 1 : urgeIntensity === 2 ? 2 : urgeIntensity === 3 ? 3 : urgeIntensity === 4 ? 5 : 7;
  }, [selectedTrigger, currentStageInfo, urgeIntensity]);

  // --- SUBMISSION HANDLER 1: PRIMARY INTERCEPTION ---
  const handleCommitInterception = () => {
    if (!selectedTrigger) {
      setGateFeedback({
        text: 'Please select an active frontline trigger above before engaging the pause gate.',
        isError: true,
      });
      return;
    }

    const trimmedVitarka = vitarkaText.trim();
    const trimmedPratipaksha = pratipakshaText.trim();

    if (trimmedVitarka.length < 5) {
      setGateFeedback({
        text: 'Please write down the compulsive impulse (Vitarka) with at least 5 characters before logging your interception.',
        isError: true,
      });
      return;
    }

    if (trimmedPratipaksha.length < 8) {
      setGateFeedback({
        text: 'Please formulate a conscious opposing reframe (Pratipaksha) with at least 8 characters or select a Quick-Fill reframe below.',
        isError: true,
      });
      return;
    }

    const selectedProtocolObj = SPEECH_PROTOCOLS.find((p) => p.id === selectedProtocol);
    const protocolSuffix = selectedProtocolObj ? ` [Protocol: ${selectedProtocolObj.label}]` : '';
    const finalPratipaksha = `${trimmedPratipaksha}${protocolSuffix}`;
    const microSwapVal = selectedSwap || 'Extended Exhale (4s In, 8s Out)';

    logInterception({
      triggerCategory: selectedTrigger.category,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText: trimmedVitarka,
      pratipakshaText: finalPratipaksha,
      selectedMicroSwap: microSwapVal,
      microSwapAction: microSwapVal,
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: 'Sattva',
      interactionType: 'resolved_negative_friction',
      isResolved: true,
      isPositive: false,
    });

    setIsSuccessFeedback(true);
    setGateFeedback({
      text: `🛡️ Pause Gate Engaged! Impulse intercepted at Step ${currentStageInfo.stepNumber} (${currentStageInfo.englishTitle}). Buddhi holds the reins of the Chariot.`,
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

  // --- SUBMISSION HANDLER 2: SECONDARY MINDFUL SLIP ---
  const handleLogSlip = () => {
    if (!selectedTrigger) {
      setGateFeedback({
        text: 'Please select an active frontline trigger above before logging a slip.',
        isError: true,
      });
      return;
    }

    const trimmedVitarka = vitarkaText.trim();
    const slipVitarka =
      trimmedVitarka ||
      `Yielded to ${selectedTrigger.label} impulse (Intensity ${urgeIntensity}/5)`;

    const selectedProtocolObj = SPEECH_PROTOCOLS.find((p) => p.id === selectedProtocol);
    const protocolSuffix = selectedProtocolObj ? `[Protocol: ${selectedProtocolObj.label}]` : '';
    const microSwapVal = selectedSwap || 'None (Yielded to impulse)';

    logInterception({
      triggerCategory: selectedTrigger.category,
      cascadeStageReached: currentStageInfo.stage,
      urgeIntensity,
      vitarkaText: slipVitarka,
      pratipakshaText: protocolSuffix,
      selectedMicroSwap: microSwapVal,
      initialGuna: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      resolvedGunaState: urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
      interactionType: 'unresolved_negative_friction',
      isResolved: false,
      isPositive: false,
    });

    setGateFeedback({
      text: '⚠️ Honest frontline observation recorded (Svādhyāya). Your Resilience Score reflects the event without judgment. Tap "Resolve" anytime in history below to reclaim composure.',
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
      {/* 1. MASTER HEADER & TELEMETRY CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Header Row */}
        <div className="flex items-start justify-between border-b border-slate-200/90 pb-4 gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-900 border border-amber-200/80">
              <Zap className="w-3 h-3 text-amber-700" />
              Bhagavad Gita 2.62–63 &amp; 17.15 • Tactical Circuit-Breaker
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Impulse &amp; Krodha Pause Gate
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Intercept swallowed command anger, homefront agitation, or late-night bunk urges before they hijack your Chariot.
            </p>
          </div>
          <ShastraLensButton
            onClick={() => openShastraLens('pratipaksha')}
            className="flex-shrink-0 mt-1"
          />
        </div>

        {/* 3-Column Live PRQ Telemetry Strip */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              PRQ Score
            </span>
            <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
              {todayInterceptions.length === 0 ? '0/100' : `${prq.gateScore}/100`}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Intercepted
            </span>
            <span className="font-extrabold text-emerald-700 font-mono text-xs sm:text-sm">
              {successfulCount}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Honest Slips
            </span>
            <span className="font-extrabold text-amber-700 font-mono text-xs sm:text-sm">
              {slipCount}
            </span>
          </div>
        </div>

        {/* STEP 1: 5 Sentinel Trigger Categories */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Step 1 • Select Active Frontline Trigger:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SENTINEL_TRIGGERS.map((trigger) => {
              const isSelected = selectedTrigger?.id === trigger.id;
              return (
                <button
                  key={trigger.id}
                  type="button"
                  onClick={() => handleTriggerSelect(trigger)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-semibold'
                      : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{trigger.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {trigger.label}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {trigger.subtext}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Urge Intensity Slider (1–5) & Cascade Visualizer */}
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-950">
              Step 2 • Urge Intensity ({urgeIntensity} / 5)
            </span>
            <span className="text-amber-800 font-semibold bg-amber-100/90 px-2.5 py-0.5 rounded-full text-[11px] border border-amber-200/80">
              {INTENSITY_METADATA[urgeIntensity].badge}
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

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-amber-950">
              <span>{INTENSITY_METADATA[urgeIntensity].title}</span>
              <span className="text-[11px] font-mono text-amber-900/80">
                Step {currentStageInfo.stepNumber}: {currentStageInfo.englishTitle}
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed font-normal">
              {INTENSITY_METADATA[urgeIntensity].desc}
            </p>
          </div>

          {/* Cascade Visualizer */}
          <div className="pt-2 border-t border-amber-200/60">
            <CascadeVisualizer
              activeStep={cascadeStep}
              showHeader={false}
              {...({ intensity: urgeIntensity } as any)}
            />
          </div>
        </div>
      </div>

      {/* 2. STEP 3: VITARKA & PRATIPAKSHA BHĀVANĀ CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Compass className="w-4 h-4 text-emerald-800" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            Step 3 • Vitarka &amp; Pratipaksha Bhāvanā (Tactical Reframe)
          </h3>
        </div>

        {/* Vitarka Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">
            Vitarka • Unfiltered Thought / Spike (Swallowed Anger, Cynicism, Urge)
          </label>
          <textarea
            rows={3}
            value={vitarkaText}
            onChange={(e) => {
              setVitarkaText(e.target.value);
              if (gateFeedback?.isError) setGateFeedback(null);
            }}
            placeholder="What intrusive thought, swallowed anger, or compulsive reaction is spiking right now? (e.g., 'I want to snap at command / check out completely')"
            className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>

        {/* Pratipaksha Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">
            Pratipaksha • Tactical Reframe (Duty, Composure, Higher Purpose)
          </label>
          <textarea
            rows={3}
            value={pratipakshaText}
            onChange={(e) => {
              setPratipakshaText(e.target.value);
              if (gateFeedback?.isError) setGateFeedback(null);
            }}
            placeholder="Reframe this impulse: What does duty (Dharma), honor, and higher purpose demand in this exact moment?"
            className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>

        {/* 3 Quick-Fill Reframes */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Quick-Fill Sentinel Reframes (Tap to Apply):
          </span>
          <div className="space-y-1.5">
            {QUICK_FILL_REFRAMES.map((chip) => {
              const isApplied = pratipakshaText.includes(chip.text);
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleQuickFill(chip.text)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-start gap-2 ${
                    isApplied
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium ring-1 ring-emerald-500/20'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-amber-50/50 hover:border-amber-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 border border-amber-200/60">
                    {chip.ref}
                  </span>
                  <p className="min-w-0 flex-1 text-[11px] leading-relaxed italic">
                    &ldquo;{chip.text}&rdquo;
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. STEP 4: VĀṄ-MAYA TAPAS (SPEECH PROTOCOL) CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <VolumeX className="w-4 h-4 text-amber-700" />
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 4 • Vāṅ-maya Tapas (BG 17.15 Speech Protocol)
            </h3>
            <p className="text-[11px] text-slate-500">
              Discipline of speech before reacting, messaging, or confronting in heat
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {SPEECH_PROTOCOLS.map((proto) => {
            const isSelected = selectedProtocol === proto.id;
            const Icon = proto.icon;
            return (
              <button
                key={proto.id}
                type="button"
                onClick={() => setSelectedProtocol(proto.id)}
                className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 text-amber-950'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      {proto.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/80">
                      {proto.shastraRef}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {proto.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. STEP 5: 6 BARRACKS MICRO-SWAPS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 5 • 6 Barracks Micro-Swaps (Selectable)
            </h3>
            <p className="text-[11px] text-slate-500">
              Immediate somatic and tactical substitutions to neutralize adrenaline spikes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BARRACKS_MICRO_SWAPS.map((swap) => {
            const isSelected = selectedSwap === swap.title;
            return (
              <button
                key={swap.id}
                type="button"
                onClick={() => handleSwapSelect(swap.title)}
                className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-600 ring-2 ring-emerald-500/30 text-emerald-950 font-medium'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block leading-snug">
                      {swap.title}
                    </span>
                    <span className="text-[10px] text-slate-500 italic block">
                      {swap.sanskrit}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200/80 flex-shrink-0">
                    {swap.duration}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {swap.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. DYNAMIC FEEDBACK BANNER */}
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

      {/* 6. DUAL ACTION BUTTONS */}
      <div className="space-y-2.5 pt-1">
        {/* Primary Interception Button */}
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
              <span className="tracking-wide">Pause Gate Engaged &amp; Impulse Intercepted!</span>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
              <span className="tracking-wide">🛡️ Engage Pause Gate &amp; Intercept Impulse</span>
            </div>
          )}
        </button>

        {/* Secondary Mindful Slip Button */}
        <button
          type="button"
          onClick={handleLogSlip}
          className="w-full py-3 px-5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-amber-50/50 hover:border-amber-300/80 text-slate-700 hover:text-amber-950 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98] group"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <span>⚠️ Acted on Impulse — Log Honest Slip (No Guilt)</span>
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-amber-800 bg-white group-hover:bg-amber-100/70 px-2 py-0.5 rounded-full border border-slate-200/80 group-hover:border-amber-300 transition-colors">
              Svādhyāya
            </span>
          </div>
        </button>
      </div>

      {/* 7. TODAY'S SENTINEL INTERCEPTION ACTIVITY LOG */}
      {todayInterceptions.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Today&apos;s Sentinel Interception Log ({todayInterceptions.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 font-mono">
              PRQ Score: {prq.gateScore}/100
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
                    {item.pratipakshaText && (
                      <p className="text-[11px] text-emerald-800 truncate" title={item.pratipakshaText}>
                        ↳ {item.pratipakshaText}
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

export default SentinelPauseGate;
