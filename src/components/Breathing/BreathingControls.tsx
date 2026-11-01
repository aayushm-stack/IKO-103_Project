import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export type BreathPhaseText = 'Inhale Prana' | 'Retain' | 'Exhale' | string;

interface BreathingControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentPhase?: BreathPhaseText;
  currentCycle?: number;
  totalCycles?: number;
  onReset?: () => void;
}

export const BreathingControls: React.FC<BreathingControlsProps> = ({
  isPlaying,
  onTogglePlay,
  currentPhase = 'Inhale Prana',
  currentCycle = 1,
  totalCycles = 5,
  onReset,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col items-center text-center">
      {/* Current Breath Phase Display */}
      <div className="mb-3">
        <span className="text-[11px] uppercase tracking-widest text-charcoal/50 font-semibold block mb-1">
          Current Phase
        </span>
        <h3 className="font-serif text-2xl font-semibold text-charcoal">
          {currentPhase}
        </h3>
      </div>

      {/* Cycle Progress Counter */}
      <div className="mb-6 w-full flex flex-col items-center">
        <p className="text-xs text-charcoal/70 font-medium">
          Cycle <span className="text-sage font-semibold">{currentCycle}</span> of{' '}
          <span className="text-charcoal font-semibold">{totalCycles}</span>
        </p>
        <div className="w-36 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-sage rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (currentCycle / totalCycles) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-4">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset session"
            className="p-3 rounded-full text-charcoal/60 hover:text-charcoal hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        {/* Large Play/Pause Icon Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause Breathing' : 'Start Breathing'}
          className="w-16 h-16 rounded-full bg-terracotta hover:bg-terracotta-dark text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-terracotta/25 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-white" />
          ) : (
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          )}
        </button>

        {onReset && <div className="w-11" aria-hidden="true" />}
      </div>
    </div>
  );
};

export default BreathingControls;
