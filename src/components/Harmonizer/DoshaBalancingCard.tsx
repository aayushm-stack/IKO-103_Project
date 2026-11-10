import React, { useState, useEffect } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { Flame, Moon, Sparkles } from 'lucide-react';
import { GunaDistribution } from '../Analytics/GunaProgressBar';

export type GunaType = 'Rajas' | 'Tamas' | 'Sattva';

export interface DoshaBalancingCardProps {
  currentGuna?: GunaType;
  distribution?: GunaDistribution;
  onInspectShastra?: () => void;
  className?: string;
}

interface GunaConfig {
  label: string;
  sanskritSub: string;
  headerBg: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  actionText: string;
  dietTip: string;
  lifestyleTip: string;
}

const gunaConfigs: Record<GunaType, GunaConfig> = {
  Sattva: {
    label: 'Sattvic State',
    sanskritSub: 'Prakāśam • Clarity & Inner Equilibrium',
    headerBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    icon: Sparkles,
    headline: 'What Sattvic Feels Like',
    actionText:
      'Mental lightness, effortless focus, transparent intellect (Buddhi), and freedom from anxious agitation or heavy lethargy.',
    dietTip: 'Consume fresh, light, seasonal whole foods (Mitahara) prepared with mindfulness.',
    lifestyleTip:
      'Channel this clear intellect toward deep, uninterrupted focus or contemplative reflection (Svadhyaya).',
  },
  Rajas: {
    label: 'Rajasic State',
    sanskritSub: 'Chalam • Agitation & Restlessness',
    headerBg: 'bg-gradient-to-r from-orange-50 to-amber-50',
    badgeBg: 'bg-orange-100 text-amber-900 border-orange-200',
    textColor: 'text-amber-800',
    borderColor: 'border-orange-200',
    icon: Flame,
    headline: 'What Rajasic Feels Like',
    actionText:
      'Feverish ambition, scattered attention, compulsive phone checking, irritability when interrupted, and racing thoughts.',
    dietTip: 'Avoid pungent, excessively spicy, salty, or over-stimulating caffeine drinks.',
    lifestyleTip:
      'Practice 5 minutes of paced box breathing or alternate nostril breathing to cool the restless nervous system.',
  },
  Tamas: {
    label: 'Tamasic State',
    sanskritSub: 'Guru • Inertia, Heaviness & Procrastination',
    headerBg: 'bg-gradient-to-r from-slate-100 to-slate-200/60',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    icon: Moon,
    headline: 'What Tamasic Feels Like',
    actionText:
      'Brain fog, mental fatigue, avoidance of challenging work, compulsive mindless scrolling, and feeling physically heavy.',
    dietTip: 'Avoid stale, processed, heavy, or fried foods that overload digestive Agni.',
    lifestyleTip:
      'Step outside into natural sunlight for a brisk 10-minute walk and splash cool water on your face.',
  },
};

export const DoshaBalancingCard: React.FC<DoshaBalancingCardProps> = ({
  currentGuna = 'Sattva',
  distribution,
  onInspectShastra,
  className = '',
}) => {
  // Allow user to explore all 3 states interactively, defaulting to current evaluated state
  const [selectedGuna, setSelectedGuna] = useState<GunaType>(currentGuna);

  useEffect(() => {
    setSelectedGuna(currentGuna);
  }, [currentGuna]);

  const config = gunaConfigs[selectedGuna];
  const IconComponent = config.icon;

  // Derive percentage distribution
  const rawSattva = distribution?.sattva ?? 50;
  const rawRajas = distribution?.rajas ?? 35;
  const rawTamas = distribution?.tamas ?? 15;
  const total = rawSattva + rawRajas + rawTamas || 100;
  const sattvaPct = Math.round((rawSattva / total) * 100);
  const rajasPct = Math.round((rawRajas / total) * 100);
  const tamasPct = Math.max(0, 100 - sattvaPct - rajasPct);

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
            <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Triguna Energetic Balance
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Phenomenology of mind &amp; Sattvic, Rajasic, and Tamasic proportions
          </p>
        </div>

        {onInspectShastra && (
          <ShastraLensButton
            onClick={onInspectShastra}
            className="ml-2 flex-shrink-0"
          />
        )}
      </div>

      {/* 2. Interactive Guna Exploration Pills (3-Step Toggle with Orange Active Pill) */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
        {(['Sattva', 'Rajas', 'Tamas'] as GunaType[]).map((g) => {
          const isSelected = selectedGuna === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGuna(g)}
              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center ${
                isSelected
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* 3. Selected Content Enclosed in Grey Box Common to our UI */}
      <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Centered State Badge (Enlarged and Centered, Left Text Removed) */}
        <div className="flex justify-center pb-1">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${config.badgeBg}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>

        {/* Headline & Description with Proper Breathing Room */}
        <div className="pt-1.5 space-y-1">
          <h3
            className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${config.textColor}`}
          >
            {config.headline}
          </h3>
          <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">
            {config.actionText}
          </p>
        </div>

        {/* Actionable Recommendations */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <span className="text-base select-none">🫖</span>
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-slate-900">Dietary Ahara: </strong>
              {config.dietTip}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <span className="text-base select-none">🧘</span>
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-slate-900">Pranic &amp; Focus Habit: </strong>
              {config.lifestyleTip}
            </div>
          </div>
        </div>

        {/* Guna Spectrum Distribution Section */}
        <div className="pt-3 border-t border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-slate-800">
              Guna Spectrum Distribution
            </h4>
          </div>

          {/* Legend Text Labels */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
              <span className="text-slate-700">Sattva</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              <span className="text-slate-700">Rajas</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
              <span className="text-slate-700">Tamas</span>
            </div>
          </div>

          {/* Horizontal Stacked Progress Bar */}
          <div className="w-full h-4 bg-slate-200/70 rounded-full overflow-hidden flex shadow-inner">
            {sattvaPct > 0 && (
              <div
                style={{ width: `${sattvaPct}%` }}
                className="bg-emerald-700 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                title={`Sattva: ${sattvaPct}%`}
              >
                {sattvaPct >= 8 && `${sattvaPct}%`}
              </div>
            )}

            {rajasPct > 0 && (
              <div
                style={{ width: `${rajasPct}%` }}
                className="bg-amber-600 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                title={`Rajas: ${rajasPct}%`}
              >
                {rajasPct >= 8 && `${rajasPct}%`}
              </div>
            )}

            {tamasPct > 0 && (
              <div
                style={{ width: `${tamasPct}%` }}
                className="bg-slate-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white select-none"
                title={`Tamas: ${tamasPct}%`}
              >
                {tamasPct >= 8 && `${tamasPct}%`}
              </div>
            )}
          </div>

          {/* Explanatory Note */}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {sattvaPct >= 50
              ? 'Primary energetic tone is Sattva (Clarity & Serenity).'
              : rajasPct >= 40
              ? 'Elevated Rajas detected; recommend restorative Pranayama.'
              : 'Elevated Tamas detected; recommend energizing movement.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoshaBalancingCard;
