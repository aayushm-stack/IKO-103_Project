import React from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';

export type BhavaKey = 'maitri' | 'karuna' | 'mudita' | 'upeksha';

export interface BhavaItem {
  key: BhavaKey;
  sanskrit: string;
  translation: string;
  triggerScenario: string;
  antidoteDescription: string;
  iconSymbol: string;
}

export const bhavaList: BhavaItem[] = [
  {
    key: 'maitri',
    sanskrit: 'Maitrī (मैत्री)',
    translation: 'Friendliness',
    triggerScenario: 'Someone Happy/Successful',
    antidoteDescription: 'Cultivate goodwill and warmth; dissolve silent envy toward another’s fortune.',
    iconSymbol: '☀️',
  },
  {
    key: 'karuna',
    sanskrit: 'Karuṇā (करुणा)',
    translation: 'Compassion',
    triggerScenario: 'Someone Suffering',
    antidoteDescription: 'Respond with gentle tenderness; counter judgment with active empathy.',
    iconSymbol: '🌧️',
  },
  {
    key: 'mudita',
    sanskrit: 'Muditā (मुदिता)',
    translation: 'Joy for Others',
    triggerScenario: 'Someone Virtuous',
    antidoteDescription: 'Celebrate their noble character and efforts without self-diminishment.',
    iconSymbol: '🌿',
  },
  {
    key: 'upeksha',
    sanskrit: 'Upekṣā (उपेक्षा)',
    translation: 'Equanimity',
    triggerScenario: 'Someone Toxic/Unfair',
    antidoteDescription: 'Practice calm, detached equanimity; preserve energy from malicious provocations.',
    iconSymbol: '🪨',
  },
];

interface BhavaCompassGridProps {
  onSelect: (item: BhavaItem) => void;
  selectedKey?: BhavaKey | null;
  onInspectShastra?: () => void;
}

export const BhavaCompassGrid: React.FC<BhavaCompassGridProps> = ({
  onSelect,
  selectedKey,
  onInspectShastra,
}) => {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4">
        <span className="text-[11px] uppercase tracking-widest text-charcoal/50 font-semibold block mb-1">
          Chitta Prasadanam · Yoga Sutra 1.33
        </span>
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal leading-snug">
          Who is disturbing your peace?
        </h2>
        <p className="text-xs text-charcoal/70 mt-1">
          Select the relationship dynamic causing friction to apply its classical counter-attitude.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {bhavaList.map((item) => {
          const isSelected = selectedKey === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/60 border-terracotta shadow-sm ring-1 ring-terracotta/30'
                  : 'bg-white border-[#E2E8F0] shadow-sm hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl" role="img" aria-label={item.translation}>
                    {item.iconSymbol}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-charcoal/80">
                    {item.sanskrit}
                  </span>
                </div>

                <h3 className="font-medium text-sm text-charcoal mb-1">
                  {item.triggerScenario}
                </h3>

                <p className="text-xs text-charcoal/65 leading-relaxed">
                  {item.antidoteDescription}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-terracotta">
                  Practice {item.translation}
                </span>
                <span className="text-charcoal/40 group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional Shastra Lens toggle button */}
      {onInspectShastra && (
        <div className="mt-4 flex justify-end">
          <ShastraLensButton onClick={onInspectShastra} />
        </div>
      )}
    </section>
  );
};

export default BhavaCompassGrid;
