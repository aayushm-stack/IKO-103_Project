import React from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBreathingEngine } from '../../hooks/useBreathingEngine';
import { useBrahmaPath } from '../../context/BrahmaPathContext';

export interface BreathePageProps {
  className?: string;
}

/**
 * Standalone mobile Breathing Sanctum page replicating the exact
 * engine logic, visual concentric circles, and Shastra controls
 * from the Judge / Dev Harness.
 */
export const BreathePage: React.FC<BreathePageProps> = ({ className = '' }) => {
  const { openShastraLens } = useBrahmaPath();
  const breathing = useBreathingEngine('SamaVritti');

  // Dynamic visual phase state: Hold and Pause use a warm yellow/amber tone;
  // Inhale, Exhale, and Ready use a subtle, calming sattvic green.
  const isHold = breathing.actionText === 'HOLD' || breathing.actionText === 'PAUSED';

  return (
    <div
      style={{
        backgroundColor: '#FDFBF7',
        color: '#1E293B',
      }}
      className={`w-full min-h-full pb-8 ${className}`}
    >
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-6 text-center">
        {/* Header with Title and Shastra Lens Trigger */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-left">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Breathing Sanctum
            </h2>
            <p className="text-xs text-slate-500">
              Naturally calm your mind and nervous system through guided, rhythmic breathing.
            </p>
          </div>
          <ShastraLensButton
            onClick={() => openShastraLens('breathing')}
          />
        </div>

        {/* 3-Step Toggle Mode Selection (Orange Active Pill, matching Features and Gunas) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs w-full max-w-md mx-auto">
          {(
            [
              { key: 'SamaVritti', title: 'Samavritti', cycle: '4-4-4-4 Box' },
              { key: 'Relaxation478', title: 'Relaxation', cycle: '4-7-8 Box' },
              { key: 'NadiShodhana', title: 'Nadi Shodhana', cycle: '4-4-6 Box' },
            ] as const
          ).map((m) => {
            const isActive =
              breathing.mode === m.key ||
              (m.key === 'SamaVritti' && breathing.mode === 'Samavritti') ||
              (m.key === 'Relaxation478' && (breathing.mode === 'relaxation' || breathing.mode === 'Relaxation')) ||
              (m.key === 'NadiShodhana' && breathing.mode === 'Nadi Shodhana');
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => breathing.setMode(m.key)}
                className={`min-w-0 min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={`text-[11px] min-[360px]:text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {m.title}
                </span>
                <span
                  className={`text-[9px] min-[360px]:text-[10px] font-medium leading-tight mt-0.5 ${isActive ? 'text-amber-100' : 'text-slate-500'}`}
                >
                  {m.cycle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Concentric Animated Circle Bound to visualScale with anti-overlap container */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
          {/* Reserved height container guarantees 1.45x scaled circle never overlaps surrounding content */}
          <div className="w-full h-80 flex items-center justify-center">
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: isHold ? '#FEF3C7' : '#ECFDF5',
                borderColor: isHold ? '#D97706' : '#059669',
                borderWidth: 4,
                borderStyle: 'solid',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${breathing.visualScale})`,
                transition: 'transform 100ms linear, background-color 400ms ease, border-color 400ms ease, box-shadow 400ms ease',
                boxShadow: isHold
                  ? '0 10px 25px -5px rgba(217, 119, 6, 0.25)'
                  : '0 10px 25px -5px rgba(5, 150, 105, 0.25)',
              }}
            >
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  backgroundColor: isHold ? '#D97706' : '#059669',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  transition: 'background-color 400ms ease',
                }}
              >
                <span className="text-3xl font-extrabold tracking-tight">
                  {breathing.secondsRemainingInPhase}s
                </span>
                <span
                  className={`text-xs mt-1 uppercase tracking-wider font-bold transition-colors duration-300 ${
                    isHold ? 'text-amber-100' : 'text-emerald-100'
                  }`}
                >
                  {breathing.actionText}
                </span>
              </div>
            </div>
          </div>

          {/* Phase Guidance & Cycles with comfortable spacing */}
          <div className="mt-4 space-y-1">
            <p className="text-base font-bold text-slate-800">
              {breathing.phaseLabel}
            </p>
            <p
              className={`text-xs font-semibold transition-colors duration-300 ${
                isHold ? 'text-amber-800' : 'text-emerald-700'
              }`}
            >
              {breathing.sanskritLabel}
            </p>
            <p className="text-xs text-slate-400">
              Completed Cycles: {breathing.completedCycles}
            </p>
          </div>
        </div>

        {/* Playback & Reset Controls */}
        <div className="flex justify-center gap-3 pt-2">
          {!breathing.isActive ? (
            <button
              type="button"
              onClick={breathing.start}
              style={{ backgroundColor: '#059669', color: '#FFFFFF' }}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-95 transition shadow-xs cursor-pointer"
            >
              Start Pranayama
            </button>
          ) : (
            <button
              type="button"
              onClick={breathing.pause}
              style={{ backgroundColor: '#D97706', color: '#FFFFFF' }}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-95 transition shadow-xs cursor-pointer"
            >
              Pause
            </button>
          )}
          <button
            type="button"
            onClick={breathing.reset}
            style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              borderColor: '#CBD5E1',
            }}
            className="px-4 py-2.5 rounded-xl border text-sm font-medium hover:bg-slate-200 transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreathePage;
