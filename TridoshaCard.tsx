import React, { useState, useEffect } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { DoshaType } from '../../types/iks';
import { DoshaDiagnosisResult } from '../../engine/gunaDoshaEngine';
import { HeartHandshake, Wind, Flame, Droplets } from 'lucide-react';

export interface TridoshaCardProps {
  diagnosis?: DoshaDiagnosisResult;
  onInspectShastra?: () => void;
  className?: string;
}

interface DoshaConfig {
  label: string;
  sanskritSub: string;
  headerBg: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  elementSubtitle: string;
  defaultActionText: string;
  defaultDietTip: string;
  defaultLifestyleTip: string;
  cognitiveStudyTip: string;
}

const doshaConfigs: Record<DoshaType, DoshaConfig> = {
  Vata: {
    label: 'Vāta Balance',
    sanskritSub: 'Vāyu & Ākāśa • Kinetic Movement & Nervous Transmission',
    headerBg: 'bg-gradient-to-r from-slate-100 to-sky-50',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    icon: Wind,
    headline: 'What Elevated Vāta Feels Like',
    elementSubtitle: 'Air & Ether (Mobility, Dryness & Agility)',
    defaultActionText:
      'Scattered attention, racing thoughts, restlessness, anxiety or imposter doubt, dry skin, and irregular circadian rhythm.',
    defaultDietTip:
      'Warm, grounding, freshly cooked foods enriched with healthy fats (ghee, hot soups, whole grains, warm spiced milk); avoid cold, dry, raw foods.',
    defaultLifestyleTip:
      'Step away from digital screens for 10 minutes, sip warm water, establish unwavering sleep timing, and practice grounding Nadi Shodhana pranayama.',
    cognitiveStudyTip:
      'Anchor fragmented attention by committing to a single micro-task for 25 minutes. Eliminate open browser tabs and ground your workspace before studying.',
  },
  Pitta: {
    label: 'Pitta Balance',
    sanskritSub: 'Tejas & Jala • Metabolic Fire & Acute Discernment',
    headerBg: 'bg-gradient-to-r from-orange-50 to-amber-50',
    badgeBg: 'bg-orange-100 text-amber-900 border-orange-200',
    textColor: 'text-amber-800',
    borderColor: 'border-orange-200',
    icon: Flame,
    headline: 'What Elevated Pitta Feels Like',
    elementSubtitle: 'Fire & Water (Transformation, Heat & Intensity)',
    defaultActionText:
      'Mental overheating, sharp irritability, competitive envy, critical perfectionism, hyper-focus leading to burnout, and inflammatory tension.',
    defaultDietTip:
      'Prioritize cooling, sweet, and bitter foods (fresh coconut water, sweet juicy fruits, mint infusion, leafy greens); avoid excessively pungent/spicy snacks.',
    defaultLifestyleTip:
      'Cool mental heat with 3 minutes of Sheetali / Sitkari breathing, step away from midday solar peak, and cultivate Upeksha (serene equanimity).',
    cognitiveStudyTip:
      'Release competitive comparison and perfectionistic urgency. Shift from aggressive striving to receptive clarity—wisdom deepens through calm discernment, not mental friction.',
  },
  Kapha: {
    label: 'Kapha Balance',
    sanskritSub: 'Pṛthvī & Jala • Structural Stability & Somatic Poise',
    headerBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    icon: Droplets,
    headline: 'What Elevated Kapha Feels Like',
    elementSubtitle: 'Earth & Water (Cohesion, Density & Endurance)',
    defaultActionText:
      'Physical lethargy, procrastination, mental heaviness, brain fog, reluctance to initiate deep work, and heavy withdrawal or isolation.',
    defaultDietTip:
      'Consume warm, light, freshly prepared meals seasoned with black pepper, dry ginger, and cinnamon; eliminate heavy dairy and sugary sweets.',
    defaultLifestyleTip:
      'Counter physical stagnation with 10 brisk Surya Namaskars, awaken before 6:00 AM, eliminate post-lunch naps, and practice energizing Bhastrika breath.',
    cognitiveStudyTip:
      'Overcome inertia by setting an immediate 2-minute starting threshold. Movement precedes motivation—stand up, stretch, and initiate the hardest problem first.',
  },
};

/**
 * Tridosha Biological Balance Card.
 * Matches the visual design, interactive pills, and stacked spectrum bar of the Triguna cell.
 * Grounded in Charaka Samhita Sutrasthana biological humor theory.
 */
export const TridoshaCard: React.FC<TridoshaCardProps> = ({
  diagnosis,
  onInspectShastra,
  className = '',
}) => {
  const context = useBrahmaPath();
  const activeDiagnosis = diagnosis ?? context.doshaDiagnosis;

  const handleInspect =
    onInspectShastra ?? (() => context.openShastraLens('tridosha'));

  const activeDominant: DoshaType = activeDiagnosis?.aggravatedDosha ?? 'Vata';

  // Interactive pill selection defaults to current active evaluated Dosha
  const [selectedDosha, setSelectedDosha] = useState<DoshaType>(activeDominant);

  useEffect(() => {
    setSelectedDosha(activeDominant);
  }, [activeDominant]);

  const config = doshaConfigs[selectedDosha];
  const IconComponent = config.icon;

  // Normalized percentages strictly summing to 100%
  const vataPct = activeDiagnosis?.normalizedPercentages?.vata ?? 33;
  const pittaPct = activeDiagnosis?.normalizedPercentages?.pitta ?? 34;
  const kaphaPct = activeDiagnosis?.normalizedPercentages?.kapha ?? 33;

  const isCurrentActiveSelected = selectedDosha === activeDominant;
  const displayCause = isCurrentActiveSelected && activeDiagnosis?.cause
    ? activeDiagnosis.cause
    : config.defaultActionText;

  const displayDiet = isCurrentActiveSelected && activeDiagnosis?.dietaryAdvice
    ? activeDiagnosis.dietaryAdvice
    : config.defaultDietTip;

  const displayPranayama = isCurrentActiveSelected && activeDiagnosis?.pranayamaSuggestion
    ? activeDiagnosis.pranayamaSuggestion
    : config.defaultLifestyleTip;

  const displayCognitiveTip = config.cognitiveStudyTip;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      className={`rounded-3xl border shadow-xs p-5 sm:p-6 space-y-5 transition-all duration-300 ${className}`}
    >
      {/* 1. Standard Feature Card Header with Icon, Heading, Lighter Subheading & Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Tridosha Biological Balance
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Phenomenology of biological humors &amp; Charaka Samhita normalized balance
          </p>
        </div>

        <ShastraLensButton
          onClick={handleInspect}
          className="ml-2 flex-shrink-0"
        />
      </div>

      {/* 2. Interactive Dosha Exploration Pills (3-Step Toggle with Orange Active Pill) */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
        {(['Vata', 'Pitta', 'Kapha'] as DoshaType[]).map((d) => {
          const isSelected = selectedDosha === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDosha(d)}
              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center ${
                isSelected
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {d === 'Vata' ? 'Vāta' : d}
            </button>
          );
        })}
      </div>

      {/* 3. Selected Content Enclosed in Grey Box Common to our UI */}
      <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Centered State Badges (Stacked vertically with center alignment) */}
        <div className="flex flex-col items-center justify-center gap-1.5 pb-1 text-center">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border flex items-center justify-center gap-1.5 shadow-2xs ${config.badgeBg}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {config.label}
          </span>
          {isCurrentActiveSelected && (
            <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs inline-block">
              Current Peak
            </span>
          )}
        </div>

        {/* Lowered Headline & Description with Proper Breathing Gap */}
        <div className="pt-2 space-y-1">
          <h3
            className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${config.textColor}`}
          >
            {config.headline}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {config.sanskritSub} • {config.elementSubtitle}
          </p>
          <p className="text-sm font-medium text-slate-700 mt-1.5 leading-relaxed">
            {displayCause}
          </p>
        </div>

        {/* Actionable Recommendations (Diet, Prana, and Cognitive Anchor) */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <span className="text-base select-none">🌿</span>
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-slate-900">Ayurvedic Dinacharya &amp; Diet: </strong>
              {displayDiet}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <span className="text-base select-none">🌬️</span>
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-slate-900">Prāṇāyāma &amp; Somatic Remedy: </strong>
              {displayPranayama}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <span className="text-base select-none">🎯</span>
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-slate-900">Cognitive &amp; Study Habit: </strong>
              {displayCognitiveTip}
            </div>
          </div>
        </div>

        {/* Tridosha Biological Balance Distribution Section (Matching Triguna Spectrum Style) */}
        <div className="pt-3 border-t border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-slate-800">
              Tridosha Biological Distribution
            </h4>
          </div>

          {/* Percentage Text Labels */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
              <span className="text-slate-700">Vāta</span>
              <span className="font-bold text-slate-700">{vataPct}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              <span className="text-slate-700">Pitta</span>
              <span className="font-bold text-amber-800">{pittaPct}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
              <span className="text-slate-700">Kapha</span>
              <span className="font-bold text-emerald-800">{kaphaPct}%</span>
            </div>
          </div>

          {/* Horizontal Stacked Progress Bar (Matching Triguna Spectrum Appearance) */}
          <div className="w-full h-4 bg-slate-200/70 rounded-full overflow-hidden flex shadow-inner">
            {vataPct > 0 && (
              <div
                style={{ width: `${vataPct}%` }}
                className="bg-slate-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                title={`Vata: ${vataPct}%`}
              >
                {vataPct >= 14 && `${vataPct}%`}
              </div>
            )}

            {pittaPct > 0 && (
              <div
                style={{ width: `${pittaPct}%` }}
                className="bg-amber-600 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                title={`Pitta: ${pittaPct}%`}
              >
                {pittaPct >= 14 && `${pittaPct}%`}
              </div>
            )}

            {kaphaPct > 0 && (
              <div
                style={{ width: `${kaphaPct}%` }}
                className="bg-emerald-700 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                title={`Kapha: ${kaphaPct}%`}
              >
                {kaphaPct >= 14 && `${kaphaPct}%`}
              </div>
            )}
          </div>

          {/* Explanatory Note */}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {activeDominant === 'Pitta'
              ? 'Elevated Pitta detected; cool mental heat with Sheetali breath and avoid competitive comparison.'
              : activeDominant === 'Vata'
              ? 'Elevated Vāta detected; ground the nervous system with consistent sleep timing and warm hydration.'
              : 'Elevated Kapha detected; stimulate circulation with morning movement and brisk deep breathing.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TridoshaCard;
