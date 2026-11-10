import React from 'react';

export interface GunaDistribution {
  sattva: number;
  rajas: number;
  tamas: number;
}

interface GunaProgressBarProps {
  distribution?: GunaDistribution;
  sattva?: number;
  rajas?: number;
  tamas?: number;
  title?: string;
  className?: string;
}

export const GunaProgressBar: React.FC<GunaProgressBarProps> = ({
  distribution,
  sattva: propSattva,
  rajas: propRajas,
  tamas: propTamas,
  title = 'Guna Spectrum Distribution',
  className = '',
}) => {
  // Support both object prop and direct values with sensible defaults
  const rawSattva = distribution?.sattva ?? propSattva ?? 60;
  const rawRajas = distribution?.rajas ?? propRajas ?? 30;
  const rawTamas = distribution?.tamas ?? propTamas ?? 10;

  const total = rawSattva + rawRajas + rawTamas || 100;
  const sattvaPct = Math.round((rawSattva / total) * 100);
  const rajasPct = Math.round((rawRajas / total) * 100);
  const tamasPct = Math.max(0, 100 - sattvaPct - rajasPct);

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] ${className}`}
    >
      {/* Title & Total Overview */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif text-sm font-semibold text-charcoal">
          {title}
        </h4>
      </div>

      {/* Legend Text Labels Above the Bar */}
      <div className="flex items-center justify-between text-xs font-medium mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sage inline-block" />
          <span className="text-charcoal/80">Sattva</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta inline-block" />
          <span className="text-charcoal/80">Rajas</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
          <span className="text-charcoal/80">Tamas</span>
        </div>
      </div>

      {/* Horizontal Stacked Progress Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {sattvaPct > 0 && (
          <div
            style={{ width: `${sattvaPct}%` }}
            className="bg-sage h-full transition-all duration-500 flex items-center justify-center text-[10px] font-semibold text-white select-none"
            title={`Sattva: ${sattvaPct}%`}
          >
            {sattvaPct >= 8 && `${sattvaPct}%`}
          </div>
        )}

        {rajasPct > 0 && (
          <div
            style={{ width: `${rajasPct}%` }}
            className="bg-terracotta h-full transition-all duration-500 flex items-center justify-center text-[10px] font-semibold text-white select-none"
            title={`Rajas: ${rajasPct}%`}
          >
            {rajasPct >= 8 && `${rajasPct}%`}
          </div>
        )}

        {tamasPct > 0 && (
          <div
            style={{ width: `${tamasPct}%` }}
            className="bg-slate-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-semibold text-white select-none"
            title={`Tamas: ${tamasPct}%`}
          >
            {tamasPct >= 8 && `${tamasPct}%`}
          </div>
        )}
      </div>

      {/* Subtle Explanatory Footer */}
      <p className="text-[11px] text-charcoal/55 mt-2.5 leading-relaxed">
        {sattvaPct >= 50
          ? 'Primary energetic tone is Sattva (Clarity & Serenity).'
          : rajasPct >= 40
          ? 'Elevated Rajas detected; recommend restorative Pranayama.'
          : 'Elevated Tamas detected; recommend energizing movement.'}
      </p>
    </div>
  );
};

export default GunaProgressBar;
