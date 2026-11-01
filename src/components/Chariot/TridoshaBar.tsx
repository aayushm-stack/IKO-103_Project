import React from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { DoshaType } from '../../types/iks';
import { HeartHandshake, Sparkles } from 'lucide-react';

export interface TridoshaBarProps {
  vata?: number;
  pitta?: number;
  kapha?: number;
  remedy?: string;
  dominantDosha?: DoshaType;
  onInspectShastra?: () => void;
  className?: string;
}

/**
 * Tridosha Biological Balance visualizer.
 * Normalizes Vata, Pitta, and Kapha to strictly equal 100%,
 * renders a soft, horizontal shifting color gradient:
 * - Slate (#64748B) for Vata (Air/Space)
 * - Terracotta (#C2410C) for Pitta (Fire/Water)
 * - Forest Green (#065F46) for Kapha (Water/Earth)
 *
 * Below the gradient, outputs a dynamic, compassionate Ayurvedic physical remedy.
 */
export const TridoshaBar: React.FC<TridoshaBarProps> = ({
  vata,
  pitta,
  kapha,
  remedy,
  dominantDosha,
  onInspectShastra,
  className = '',
}) => {
  const context = useBrahmaPath();

  // Read from props if supplied, otherwise fallback to global context diagnosis
  const diag = context.doshaDiagnosis;

  const rawVata = vata ?? diag?.doshaScores?.vata ?? 10;
  const rawPitta = pitta ?? diag?.doshaScores?.pitta ?? 10;
  const rawKapha = kapha ?? diag?.doshaScores?.kapha ?? 10;

  // Strict normalization guaranteeing vataPct + pittaPct + kaphaPct === 100%
  const total = rawVata + rawPitta + rawKapha || 1;
  let vataPct = Math.round((rawVata / total) * 100);
  let pittaPct = Math.round((rawPitta / total) * 100);
  let kaphaPct = 100 - (vataPct + pittaPct);

  // Safety bounds
  if (kaphaPct < 0) {
    pittaPct += kaphaPct;
    kaphaPct = 0;
  } else if (kaphaPct > 100) {
    kaphaPct = 100;
    vataPct = 0;
    pittaPct = 0;
  }

  // Active dominant / highest dosha
  const activeDominant: DoshaType =
    dominantDosha ??
    diag?.aggravatedDosha ??
    (vataPct >= pittaPct && vataPct >= kaphaPct
      ? 'Vata'
      : pittaPct >= vataPct && pittaPct >= kaphaPct
      ? 'Pitta'
      : 'Kapha');

  // Dynamic compassionate physical remedy based on the highest Dosha
  let physicalRemedy = remedy ?? diag?.physicalRemedy;
  if (!physicalRemedy) {
    if (activeDominant === 'Vata') {
      physicalRemedy =
        'High Vata detected: Step away from screens for 10 minutes and sip warm water.';
    } else if (activeDominant === 'Pitta') {
      physicalRemedy =
        'High Pitta detected: Cool mental heat with 3 minutes of Sheetali breathing and splash cold water on your face and eyes.';
    } else {
      physicalRemedy =
        'High Kapha detected: Counter physical stagnation with 10 brisk Surya Namaskars or a 10-minute brisk walk in fresh air.';
    }
  }

  const handleInspect =
    onInspectShastra ?? (() => context.openShastraLens('tridosha'));

  // Soft blend feathering between color zones for smooth horizontal shifting gradient
  const feather = 6;
  const vataEnd = vataPct;
  const pittaEnd = vataPct + pittaPct;

  const vStop1 = Math.max(0, vataEnd - feather);
  const vStop2 = Math.min(100, vataEnd + feather);
  const pStop1 = Math.max(vStop2, pittaEnd - feather);
  const pStop2 = Math.min(100, pittaEnd + feather);

  const gradientBackground = `linear-gradient(90deg, 
    #64748B 0%, 
    #64748B ${vStop1}%, 
    #C2410C ${vStop2}%, 
    #C2410C ${pStop1}%, 
    #065F46 ${pStop2}%, 
    #065F46 100%)`;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      className={`rounded-2xl border shadow-xs p-5 sm:p-6 space-y-4 ${className}`}
    >
      {/* Header with Title and Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">
              Tridosha Biological Balance
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic biological humor diagnosis normalized to 100%
          </p>
        </div>

        <ShastraLensButton
          onClick={handleInspect}
          className="ml-2"
        />
      </div>

      {/* Numerical Proportional Badges */}
      <div className="grid grid-cols-3 gap-2">
        {/* Vata Badge (Slate) */}
        <div
          style={{
            backgroundColor: activeDominant === 'Vata' ? '#F1F5F9' : '#F8FAFC',
            borderColor: activeDominant === 'Vata' ? '#64748B' : '#E2E8F0',
          }}
          className={`p-2.5 rounded-xl border text-center transition-all ${
            activeDominant === 'Vata' ? 'ring-2 ring-slate-400/40 shadow-xs' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#64748B]" />
            <span className="text-[11px] font-bold text-slate-700">Vata</span>
          </div>
          <span className="text-base font-extrabold text-slate-800">{vataPct}%</span>
          <span className="text-[10px] text-slate-400 block">Air &amp; Space</span>
        </div>

        {/* Pitta Badge (Terracotta) */}
        <div
          style={{
            backgroundColor: activeDominant === 'Pitta' ? '#FFF7ED' : '#F8FAFC',
            borderColor: activeDominant === 'Pitta' ? '#C2410C' : '#E2E8F0',
          }}
          className={`p-2.5 rounded-xl border text-center transition-all ${
            activeDominant === 'Pitta' ? 'ring-2 ring-orange-500/40 shadow-xs' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
            <span className="text-[11px] font-bold text-orange-950">Pitta</span>
          </div>
          <span className="text-base font-extrabold text-[#C2410C]">{pittaPct}%</span>
          <span className="text-[10px] text-slate-400 block">Fire &amp; Water</span>
        </div>

        {/* Kapha Badge (Forest Green) */}
        <div
          style={{
            backgroundColor: activeDominant === 'Kapha' ? '#DEF7EC' : '#F8FAFC',
            borderColor: activeDominant === 'Kapha' ? '#065F46' : '#E2E8F0',
          }}
          className={`p-2.5 rounded-xl border text-center transition-all ${
            activeDominant === 'Kapha' ? 'ring-2 ring-emerald-600/40 shadow-xs' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#065F46]" />
            <span className="text-[11px] font-bold text-emerald-950">Kapha</span>
          </div>
          <span className="text-base font-extrabold text-[#065F46]">{kaphaPct}%</span>
          <span className="text-[10px] text-slate-400 block">Water &amp; Earth</span>
        </div>
      </div>

      {/* Soft Horizontal Shifting Color Gradient */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-0.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#64748B]" />
            Slate (Vata: {vataPct}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
            Terracotta (Pitta: {pittaPct}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#065F46]" />
            Forest Green (Kapha: {kaphaPct}%)
          </span>
        </div>

        {/* Continuous Soft Shifting Gradient Track */}
        <div className="relative w-full h-5 sm:h-6 rounded-full overflow-hidden shadow-inner bg-slate-100 p-0.5 border border-slate-200">
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '9999px',
              background: gradientBackground,
              transition: 'background 700ms ease-in-out',
            }}
            className="transition-all duration-700 ease-out shadow-xs"
          />
        </div>
      </div>

      {/* Dynamic Compassionate Remedy Based on Highest Dosha */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-start gap-3 shadow-xs">
        <HeartHandshake className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Ayurvedic Biological Remedy
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Highest: {activeDominant}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
            {physicalRemedy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TridoshaBar;