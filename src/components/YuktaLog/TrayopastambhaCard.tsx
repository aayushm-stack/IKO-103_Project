import React from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';

interface TrayopastambhaCardProps {
  value?: number;
  onValueChange?: (value: number) => void;
  onInspectShastra?: () => void;
}

export const TrayopastambhaCard: React.FC<TrayopastambhaCardProps> = ({
  value = 3,
  onValueChange = () => {},
  onInspectShastra,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(Number(e.target.value));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            Ahara (Sensory Intake)
          </h3>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Monitor modern digital & sensory consumption
          </p>
        </div>
        <span className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xs font-semibold text-terracotta">
          {value}
        </span>
      </div>

      {/* Slider Control */}
      <div className="space-y-3 py-2">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={handleChange}
          aria-label="Ahara sensory intake slider"
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        />

        {/* Labels at the ends */}
        <div className="flex justify-between items-center text-xs font-medium text-charcoal/70">
          <span className="text-sage font-semibold">1 · Mindful</span>
          <span className="text-charcoal/50">3 · Moderate</span>
          <span className="text-terracotta-dark font-semibold">5 · Overwhelmed</span>
        </div>
      </div>

      {/* Optional Shastra Lens trigger */}
      {onInspectShastra && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <ShastraLensButton onClick={onInspectShastra} />
        </div>
      )}
    </div>
  );
};

export default TrayopastambhaCard;
