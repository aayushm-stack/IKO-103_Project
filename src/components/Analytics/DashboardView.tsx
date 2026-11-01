import React from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import GunaProgressBar, { GunaDistribution } from './GunaProgressBar';
import { Flame, Brain, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export interface TriggerItem {
  id: string;
  name: string;
  category: string;
  count: number;
  reframedWith: string;
  percentage: number;
}

interface DashboardViewProps {
  gunaDistribution?: GunaDistribution;
  topTriggers?: TriggerItem[];
  onInspectShastra?: () => void;
  className?: string;
}

const defaultTriggers: TriggerItem[] = [
  {
    id: '1',
    name: 'Social Media Comparison',
    category: 'Social Envy',
    count: 14,
    reframedWith: 'Muditā (Joy for Others)',
    percentage: 42,
  },
  {
    id: '2',
    name: 'Late-Night Doomscrolling',
    category: 'Sensory Ahara',
    count: 10,
    reframedWith: 'Nidra Sleep Discipline',
    percentage: 30,
  },
  {
    id: '3',
    name: 'Academic Perfectionism',
    category: 'Rajasic Anxiety',
    count: 6,
    reframedWith: 'Buddhi Discriminative Calm',
    percentage: 18,
  },
  {
    id: '4',
    name: 'Afternoon Screen Lethargy',
    category: 'Tamasic Inertia',
    count: 3,
    reframedWith: 'Surya Namaskar & Light',
    percentage: 10,
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  gunaDistribution = { sattva: 65, rajas: 25, tamas: 10 },
  topTriggers = defaultTriggers,
  onInspectShastra,
  className = '',
}) => {
  return (
    <div className={`space-y-6 pb-24 overflow-y-auto px-4 pt-4 ${className}`}>
      {/* Title & Section Header */}
      <div>
        <span className="text-[11px] uppercase tracking-widest text-charcoal/50 font-semibold block mb-1">
          Cognitive Reflection
        </span>
        <h2 className="font-serif text-2xl font-bold text-charcoal tracking-tight">
          Equilibrium Analytics
        </h2>
        <p className="text-xs text-charcoal/70 mt-1">
          Longitudinal insights into your mental residue and habit triggers.
        </p>
      </div>

      {/* Guna Spectrum Stacked Progress Bar */}
      <GunaProgressBar
        distribution={gunaDistribution}
        title="Weekly Guna Spectrum"
      />

      {/* Quick Summary Stat Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sage">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-charcoal/60">
              Interceptions
            </span>
          </div>
          <p className="text-2xl font-semibold text-charcoal">33</p>
          <p className="text-[11px] text-sage font-medium mt-0.5">
            +18% Sattvic resolution
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-terracotta">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-charcoal/60">
              Primary Habit
            </span>
          </div>
          <p className="text-base font-semibold text-charcoal truncate">
            Sama Vritti
          </p>
          <p className="text-[11px] text-terracotta font-medium mt-0.5">
            4-4-4-4 rhythm
          </p>
        </div>
      </div>

      {/* Top Triggers Section */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-base font-semibold text-charcoal">
              Top Intercepted Triggers
            </h3>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Root causes identified during distraction cascades
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-charcoal/70 font-medium">
            Past 7 Days
          </span>
        </div>

        {/* Clean, Modern List Items with Subtle Borders */}
        <div className="divide-y divide-[#E2E8F0]/70">
          {topTriggers.map((item, index) => (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-[11px] font-semibold text-charcoal/70 flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-charcoal truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-charcoal/60 mt-0.5">
                    <span className="text-terracotta font-medium">
                      {item.category}
                    </span>
                    <span>&bull;</span>
                    <span className="text-sage font-medium truncate">
                      {item.reframedWith}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-charcoal">
                  {item.count} loops
                </span>
                <span className="block text-[10px] text-charcoal/50">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Shastra Lens Action */}
        {onInspectShastra && (
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex justify-end">
            <ShastraLensButton onClick={onInspectShastra} />
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardView;
