import React from 'react';
import { BookOpen, Briefcase, Home } from 'lucide-react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { LIFE_RHYTHMS } from '../../data/seekerShastraData';
import { LifeRhythm } from '../../types/shastra';

export interface LifeRhythmBarProps {
  className?: string;
}

const RHYTHM_ICONS: Record<LifeRhythm, React.ElementType> = {
  learning_study: BookOpen,
  work_enterprise: Briefcase,
  home_quiet: Home,
};

/**
 * Clean, read-only depiction of the currently active Life Rhythm (Stage 1 Seeker).
 * Portrays the user's active field of focus clearly on the Features page without interactive toggles.
 * Field of focus selection is managed centrally in Settings.
 */
export const LifeRhythmBar: React.FC<LifeRhythmBarProps> = ({
  className = '',
}) => {
  const { preferences, setActiveView } = useBrahmaPath();
  const currentRhythm: LifeRhythm = preferences?.lifeRhythm ?? 'learning_study';

  const activeRhythmInfo =
    LIFE_RHYTHMS.find((r) => r.id === currentRhythm) ?? LIFE_RHYTHMS[0];

  const IconComponent = RHYTHM_ICONS[currentRhythm] ?? BookOpen;

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Current Life Rhythm
        </span>
      </div>

      {/* Prominent Active Field Depiction (Read-Only) */}
      <div className="bg-emerald-50/70 border border-emerald-700/20 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-700/20 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
          <IconComponent className="w-5 h-5 text-emerald-800" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {activeRhythmInfo.label}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeRhythmInfo.summary}
          </p>
        </div>
      </div>

      {/* Bottom Context & Navigation Hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 border-t border-slate-100">
        <span>Adapts all focus prompts, triggers, and micro-swaps</span>
        <button
          type="button"
          onClick={() => setActiveView('settings')}
          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
        >
          Change in Settings &rarr;
        </button>
      </div>
    </div>
  );
};

export default LifeRhythmBar;
