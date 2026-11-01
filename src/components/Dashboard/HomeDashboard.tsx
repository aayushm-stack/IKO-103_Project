import React, { useMemo } from 'react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { ChariotHome } from '../Chariot/ChariotHome';
import { DailyVerseCard } from '../SadhanaHub/DailyVerseCard';
import { DoshaBalancingCard, type GunaType } from '../Harmonizer/DoshaBalancingCard';
import { TridoshaCard } from '../Harmonizer/TridoshaCard';

export interface HomeDashboardProps {
  className?: string;
  onOpenShastraLens?: (key?: any) => void;
}

/**
 * Clean, minimalist Home Dashboard focused on classical IKS cognitive and biological frameworks:
 * 1. Katha Upanishad Chariot (Sensory Composure & Intellect Alignment)
 * 2. Daily Gita Quote (Student Discipline Anchor with Zero-Repeat Session Randomizer)
 * 3. Guna Spectrum Distribution & What Sattvic Feels Like (Sattva, Rajas, Tamas Proportions)
 * 4. Tridosha Biological Balance & Ayurvedic Harmonizer (Charaka Samhita Normalized Vata, Pitta, Kapha)
 */
export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  className = '',
  onOpenShastraLens,
}) => {
  const { gunaDistribution, doshaDiagnosis, openShastraLens } = useBrahmaPath();

  const handleOpenLens = onOpenShastraLens ?? openShastraLens;

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

      {/* 2. Daily Gita Quote (Complete UI Card Mapping & Decoupled Static Shastra Lens) */}
      <DailyVerseCard onOpenShastraLens={() => handleOpenLens('svadhyaya')} />

      {/* 3. What Sattvic Feels Like & Triguna Harmonizer with Spectrum Bar (Merged) */}
      <DoshaBalancingCard
        currentGuna={dominantGunaType}
        distribution={gunaDistribution}
        onInspectShastra={() => handleOpenLens('gunas')}
      />

      {/* 4. Tridosha Biological Balance & Ayurvedic Harmonizer */}
      <TridoshaCard
        diagnosis={doshaDiagnosis}
        onInspectShastra={() => handleOpenLens('tridosha')}
      />
    </div>
  );
};

export default HomeDashboard;
