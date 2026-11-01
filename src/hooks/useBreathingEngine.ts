import { useState, useEffect, useCallback } from 'react';
import { BreathingMode, BreathPhase } from '../types/iks';

/**
 * Phase timing specification in seconds along with classical and modern labels.
 */
export interface PhaseConfig {
  phase: BreathPhase;
  duration: number; // Duration in seconds
  actionText: 'INHALE' | 'HOLD' | 'EXHALE';
  phaseLabel: string;
  sanskritLabel: string;
}

/**
 * Canonical normalized mode keys.
 */
export type CanonicalBreathingMode = 'SamaVritti' | 'Relaxation478' | 'NadiShodhana';

export function normalizeBreathingMode(mode: BreathingMode): CanonicalBreathingMode {
  const normalized = mode.toLowerCase().replace(/[\s\-_]/g, '');
  if (normalized.includes('relax')) return 'Relaxation478';
  if (normalized.includes('nadi') || normalized.includes('shodhana')) return 'NadiShodhana';
  return 'SamaVritti';
}

/**
 * Pranayama timings rooted in traditional texts and modern autonomic modulation:
 * - Samavritti (Patañjali Yoga Sūtra 2.49-50): Equal 4-4-4-4 box pacing
 *   (Inhale 4s -> Full Hold 4s -> Exhale 4s -> Empty Hold 4s).
 * - Relaxation 4-7-8 (Dr. Weil / Parasympathetic Vagal Brake): 4-7-8 pacing
 *   (Inhale 4s -> Full Hold 7s -> Exhale 8s).
 * - Nadi Shodhana (Haṭha Yoga Pradīpikā 2.7-10): 4-4-6 alternating nostril purification
 *   (Ida Inhale 4s -> Hold 4s -> Pingala Exhale 6s -> Pingala Inhale 4s -> Hold 4s -> Ida Exhale 6s).
 */
export const MODE_CONFIGS: Record<CanonicalBreathingMode, PhaseConfig[]> = {
  SamaVritti: [
    {
      phase: 'Puraka_Inhale',
      duration: 4,
      actionText: 'INHALE',
      phaseLabel: 'Inhale steadily through nose',
      sanskritLabel: 'Pūraka (पूरक)',
    },
    {
      phase: 'Antara_Kumbhaka_Hold',
      duration: 4,
      actionText: 'HOLD',
      phaseLabel: 'Retain with lungs full',
      sanskritLabel: 'Antara Kumbhaka (अन्तर कुम्भक)',
    },
    {
      phase: 'Rechaka_Exhale',
      duration: 4,
      actionText: 'EXHALE',
      phaseLabel: 'Exhale smoothly and completely',
      sanskritLabel: 'Recaka (रेचक)',
    },
    {
      phase: 'Bahya_Kumbhaka_Hold',
      duration: 4,
      actionText: 'HOLD',
      phaseLabel: 'Hold empty pause in stillness',
      sanskritLabel: 'Bāhya Kumbhaka (बाह्य कुम्भक)',
    },
  ],
  Relaxation478: [
    {
      phase: 'Puraka_Inhale',
      duration: 4,
      actionText: 'INHALE',
      phaseLabel: 'Inhale quietly through nose',
      sanskritLabel: 'Pūraka (पूरक)',
    },
    {
      phase: 'Antara_Kumbhaka_Hold',
      duration: 7,
      actionText: 'HOLD',
      phaseLabel: 'Retain breath gently',
      sanskritLabel: 'Antara Kumbhaka (अन्तर कुम्भक)',
    },
    {
      phase: 'Rechaka_Exhale',
      duration: 8,
      actionText: 'EXHALE',
      phaseLabel: 'Slow, audible exhalation through mouth',
      sanskritLabel: 'Recaka (रेचक)',
    },
  ],
  NadiShodhana: [
    {
      phase: 'Puraka_Inhale',
      duration: 4,
      actionText: 'INHALE',
      phaseLabel: 'Inhale through Left nostril (Iḍā)',
      sanskritLabel: 'Pūraka (पूरक - इडा)',
    },
    {
      phase: 'Antara_Kumbhaka_Hold',
      duration: 4,
      actionText: 'HOLD',
      phaseLabel: 'Retain breath, close both nostrils',
      sanskritLabel: 'Antara Kumbhaka (अन्तर कुम्भक)',
    },
    {
      phase: 'Rechaka_Exhale',
      duration: 6,
      actionText: 'EXHALE',
      phaseLabel: 'Exhale through Right nostril (Piṅgalā)',
      sanskritLabel: 'Recaka (रेचक - पिंगला)',
    },
    {
      phase: 'Puraka_Inhale',
      duration: 4,
      actionText: 'INHALE',
      phaseLabel: 'Inhale through Right nostril (Piṅgalā)',
      sanskritLabel: 'Pūraka (पूरक - पिंगला)',
    },
    {
      phase: 'Antara_Kumbhaka_Hold',
      duration: 4,
      actionText: 'HOLD',
      phaseLabel: 'Retain breath, close both nostrils',
      sanskritLabel: 'Antara Kumbhaka (अन्तर कुम्भक)',
    },
    {
      phase: 'Rechaka_Exhale',
      duration: 6,
      actionText: 'EXHALE',
      phaseLabel: 'Exhale through Left nostril (Iḍā)',
      sanskritLabel: 'Recaka (रेचक - इडा)',
    },
  ],
};

interface EngineState {
  phaseIndex: number;
  elapsedInPhaseMs: number;
  completedCycles: number;
}

/**
 * Custom React hook powering the Breathing Sanctum visual pacer.
 * Manages atomic 100ms interval cycles, deterministic state updates,
 * phase progress, and smooth scale interpolation for circular animations.
 */
export function useBreathingEngine(initialMode: BreathingMode = 'SamaVritti') {
  const [mode, setModeState] = useState<BreathingMode>(initialMode);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [engineState, setEngineState] = useState<EngineState>({
    phaseIndex: 0,
    elapsedInPhaseMs: 0,
    completedCycles: 0,
  });

  const canonical = normalizeBreathingMode(mode);
  const phases = MODE_CONFIGS[canonical];

  // Atomic 100ms interval timer running purely via state updater callback
  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      setEngineState((prev) => {
        const safeIndex = Math.min(prev.phaseIndex, phases.length - 1);
        const currentConfig = phases[safeIndex];
        const phaseDurationMs = currentConfig.duration * 1000;
        const nextElapsed = prev.elapsedInPhaseMs + 100;

        if (nextElapsed >= phaseDurationMs) {
          const nextIndex = safeIndex + 1;
          if (nextIndex >= phases.length) {
            // Completed a full pranayama cycle
            return {
              phaseIndex: 0,
              elapsedInPhaseMs: 0,
              completedCycles: prev.completedCycles + 1,
            };
          }
          return {
            phaseIndex: nextIndex,
            elapsedInPhaseMs: 0,
            completedCycles: prev.completedCycles,
          };
        }

        return {
          ...prev,
          phaseIndex: safeIndex,
          elapsedInPhaseMs: nextElapsed,
        };
      });
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [isActive, phases]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setEngineState({
      phaseIndex: 0,
      elapsedInPhaseMs: 0,
      completedCycles: 0,
    });
  }, []);

  const setMode = useCallback((newMode: BreathingMode) => {
    setModeState(newMode);
    setIsActive(false);
    setEngineState({
      phaseIndex: 0,
      elapsedInPhaseMs: 0,
      completedCycles: 0,
    });
  }, []);

  // Compute derived values safely
  const safePhaseIndex = Math.min(engineState.phaseIndex, phases.length - 1);
  const currentPhaseConfig = phases[safePhaseIndex];

  const phase: BreathPhase = isActive ? currentPhaseConfig.phase : 'Idle';
  const phaseDuration = currentPhaseConfig.duration;

  const phaseProgress =
    phaseDuration > 0
      ? Math.min(1, Math.max(0, engineState.elapsedInPhaseMs / (phaseDuration * 1000)))
      : 0;

  // Countdown in whole seconds (always at least 1 while active)
  const secondsRemainingInPhase =
    phaseDuration > 0
      ? Math.max(1, Math.ceil((phaseDuration * 1000 - engineState.elapsedInPhaseMs) / 1000))
      : 0;

  // Smooth visual scale interpolation: 1.0 (min) to 1.45 (max)
  // - Puraka (Inhale): rises 1.0 -> 1.45
  // - Antara Kumbhaka (Full Hold): stays at 1.45
  // - Rechaka (Exhale): falls 1.45 -> 1.0
  // - Bahya Kumbhaka (Empty Hold): stays at 1.0
  let visualScale = 1.0;
  const isHoldingScale = isActive || engineState.elapsedInPhaseMs > 0;
  if (isHoldingScale) {
    if (currentPhaseConfig.phase === 'Puraka_Inhale') {
      visualScale = 1.0 + phaseProgress * 0.45;
    } else if (currentPhaseConfig.phase === 'Antara_Kumbhaka_Hold') {
      visualScale = 1.45;
    } else if (currentPhaseConfig.phase === 'Rechaka_Exhale') {
      visualScale = 1.45 - phaseProgress * 0.45;
    } else if (currentPhaseConfig.phase === 'Bahya_Kumbhaka_Hold') {
      visualScale = 1.0;
    }
  } else {
    visualScale = 1.0;
  }

  // Clear action text for inner bubble display
  let actionText: string = 'READY';
  if (isActive) {
    actionText = currentPhaseConfig.actionText;
  } else if (engineState.elapsedInPhaseMs > 0) {
    actionText = 'PAUSED';
  } else {
    actionText = 'READY';
  }

  const phaseLabel = isActive
    ? currentPhaseConfig.phaseLabel
    : engineState.elapsedInPhaseMs > 0
    ? `Paused: ${currentPhaseConfig.phaseLabel}`
    : 'Ready to begin Pranayama';

  const sanskritLabel = isActive || engineState.elapsedInPhaseMs > 0
    ? currentPhaseConfig.sanskritLabel
    : 'Sthiti (स्थिति)';

  return {
    mode,
    setMode,
    isActive,
    start,
    pause,
    reset,
    phase,
    actionText,
    phaseLabel,
    sanskritLabel,
    secondsRemainingInPhase,
    phaseProgress,
    visualScale,
    completedCycles: engineState.completedCycles,
  };
}
