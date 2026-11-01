import React, { useState, useEffect } from 'react';

export type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty';
export type BreathMode = 'Samavritti (4-4-4-4)' | 'Relaxation (4-7-8)' | 'Nadi Shodhana (4-4-6)';

interface BreathingCircleProps {
  mode?: BreathMode;
  onCycleComplete?: (completedCycles: number) => void;
  className?: string;
}

interface PhaseStep {
  name: BreathPhase;
  duration: number;
  instruction: string;
}

const MODE_STEPS: Record<BreathMode, PhaseStep[]> = {
  'Samavritti (4-4-4-4)': [
    { name: 'Inhale', duration: 4, instruction: 'Inhale Prana' },
    { name: 'Hold', duration: 4, instruction: 'Retain Fullness' },
    { name: 'Exhale', duration: 4, instruction: 'Exhale Agitation' },
    { name: 'Hold Empty', duration: 4, instruction: 'Retain Stillness' },
  ],
  'Relaxation (4-7-8)': [
    { name: 'Inhale', duration: 4, instruction: 'Inhale Quietly Through Nose' },
    { name: 'Hold', duration: 7, instruction: 'Retain Breath Gently' },
    { name: 'Exhale', duration: 8, instruction: 'Exhale Audible Through Mouth' },
  ],
  'Nadi Shodhana (4-4-6)': [
    { name: 'Inhale', duration: 4, instruction: 'Inhale Left Nostril (Iḍā)' },
    { name: 'Hold', duration: 4, instruction: 'Retain Breath Both Nostrils' },
    { name: 'Exhale', duration: 6, instruction: 'Exhale Right Nostril (Piṅgalā)' },
    { name: 'Inhale', duration: 4, instruction: 'Inhale Right Nostril (Piṅgalā)' },
    { name: 'Hold', duration: 4, instruction: 'Retain Breath Both Nostrils' },
    { name: 'Exhale', duration: 6, instruction: 'Exhale Left Nostril (Iḍā)' },
  ],
};

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  mode = 'Samavritti (4-4-4-4)',
  onCycleComplete,
  className = '',
}) => {
  const [selectedMode, setSelectedMode] = useState<BreathMode>(mode);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  const steps = MODE_STEPS[selectedMode];
  const currentStep = steps[Math.min(phaseIndex, steps.length - 1)];

  useEffect(() => {
    if (!isActive) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase step
        setPhaseIndex((currIdx) => {
          const nextIdx = currIdx + 1;
          if (nextIdx >= steps.length) {
            setCycleCount((c) => {
              const updated = c + 1;
              onCycleComplete?.(updated);
              return updated;
            });
            return 0;
          }
          return nextIdx;
        });

        // Set next duration
        const nextIdx = (phaseIndex + 1) % steps.length;
        return steps[nextIdx].duration;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isActive, phaseIndex, steps, onCycleComplete]);

  // Determine scale based on phase
  const isExpanded = currentStep.name === 'Inhale' || currentStep.name === 'Hold';

  const handleReset = () => {
    setPhaseIndex(0);
    setSecondsLeft(steps[0].duration);
    setCycleCount(0);
    setIsActive(true);
  };

  const handleModeChange = (newMode: BreathMode) => {
    setSelectedMode(newMode);
    setPhaseIndex(0);
    setSecondsLeft(MODE_STEPS[newMode][0].duration);
    setIsActive(true);
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      {/* Mode Selector Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-8 shadow-inner">
        {(
          [
            'Samavritti (4-4-4-4)',
            'Relaxation (4-7-8)',
            'Nadi Shodhana (4-4-6)',
          ] as BreathMode[]
        ).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedMode === m
                ? 'bg-white text-sage font-semibold shadow-xs'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Centered Concentric Breathing Visualizer */}
      <div className="relative w-72 h-72 flex items-center justify-center my-4">
        {/* Outermost Translucent Aura Ring */}
        <div
          style={{
            transitionDuration: `${currentStep.duration}s`,
          }}
          className={`absolute w-64 h-64 rounded-full bg-sage/10 transition-transform ease-in-out ${
            isExpanded ? 'scale-[1.5]' : 'scale-100'
          }`}
        />

        {/* Middle Translucent Aura Ring */}
        <div
          style={{
            transitionDuration: `${currentStep.duration}s`,
          }}
          className={`absolute w-52 h-52 rounded-full bg-sage/20 transition-transform ease-in-out ${
            isExpanded ? 'scale-[1.35]' : 'scale-100'
          }`}
        />

        {/* Core Glowing Sage Circle */}
        <div
          style={{
            transitionDuration: `${currentStep.duration}s`,
          }}
          className={`relative z-10 w-36 h-36 rounded-full bg-sage text-parchment flex flex-col items-center justify-center transition-transform ease-in-out shadow-[0_0_50px_rgba(6,95,70,0.4)] ${
            isExpanded ? 'scale-[1.5]' : 'scale-100'
          }`}
        >
          <span className="font-serif tracking-wide text-xs uppercase font-medium opacity-90">
            {currentStep.name}
          </span>
          <span className="text-3xl font-light tracking-tight my-0.5">
            {secondsLeft}s
          </span>
          <span className="text-[10px] opacity-75 font-serif italic">
            {selectedMode.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Synchronized Verbal Guidance */}
      <div className="text-center mt-10">
        <h4 className="font-serif text-lg font-medium text-sage">
          {currentStep.instruction}
        </h4>
        <p className="text-xs text-charcoal/60 mt-1">
          Cycle count: <span className="font-semibold text-charcoal">{cycleCount}</span>
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className="px-5 py-2 text-xs font-semibold rounded-xl bg-sage text-parchment hover:bg-sage/90 shadow-sm transition-colors"
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 text-charcoal/70 hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BreathingCircle;
