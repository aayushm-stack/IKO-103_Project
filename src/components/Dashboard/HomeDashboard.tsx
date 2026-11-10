import React, { useMemo } from 'react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { ChariotHome } from '../Chariot/ChariotHome';
import { DailyVerseCard } from '../SadhanaHub/DailyVerseCard';
import { DoshaBalancingCard, type GunaType } from '../Harmonizer/DoshaBalancingCard';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { FOUNDATIONAL_SEEKER_SANKALPA } from '../Onboarding/OnboardingFlow';

export interface HomeDashboardProps {
  className?: string;
  onOpenShastraLens?: (key?: any) => void;
}

/**
 * Clean, minimalist Home Dashboard focused on classical IKS cognitive frameworks:
 * 1. Katha Upanishad Chariot (Sensory Composure & Intellect Alignment)
 * 2. Foundational Sankalpa (Inner Pledge of Self-Mastery - Non-editable Anchored Intention)
 * 3. Daily Bhagavad Gita Quote (Daily Contemplative Wisdom Anchor)
 * 4. Triguna System & What Sattvic Feels Like (Sattva, Rajas, Tamas Proportions)
 */
export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  className = '',
  onOpenShastraLens,
}) => {
  const { preferences, gunaDistribution, openShastraLens } = useBrahmaPath();

  const handleOpenLens = onOpenShastraLens ?? openShastraLens;

  const activePledge = preferences?.sankalpa || FOUNDATIONAL_SEEKER_SANKALPA;

  // Derive dominant Guna state with default to Sattva
  const dominantGunaType: GunaType = useMemo(() => {
    if (gunaDistribution.sattva >= 50) return 'Sattva';
    if (gunaDistribution.rajas >= gunaDistribution.tamas) return 'Rajas';
    return 'Tamas';
  }, [gunaDistribution]);

  return (
    <div className={`space-y-6 pb-24 ${className}`}>
      {/* 1. Katha Upanishad Chariot Allegory */}
      <ChariotHome onInspectShastra={() => handleOpenLens('chariot')} />

      {/* 2. Foundational Inner Pledge Card (Directly Above Daily Shloka) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6"
      >
        <div className="p-4 sm:p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
          {/* Header Row Inside Grey Box */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                YOUR SANKALPA (INNER PLEDGE)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                The foundational intention you anchored when initiating BrahmaPath.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ShastraLensButton
                onClick={() => handleOpenLens('sankalpa')}
                className="flex-shrink-0"
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
            {activePledge}
          </div>
        </div>
      </div>

      {/* 3. Daily Bhagavad Gita Quote (Complete UI Card Mapping & Decoupled Static Shastra Lens) */}
      <DailyVerseCard onOpenShastraLens={() => handleOpenLens('svadhyaya')} />

      {/* 4. Triguna System / Energetic Balance (Sattva, Rajas, Tamas Proportions) */}
      <DoshaBalancingCard
        currentGuna={dominantGunaType}
        distribution={gunaDistribution}
        onInspectShastra={() => handleOpenLens('gunas')}
      />
    </div>
  );
};
