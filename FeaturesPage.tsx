import React, { useState, useEffect } from 'react';
import { SadhanaMobile, SadhanaDropdown } from './SadhanaMobile';
import { InterceptorMobile } from './InterceptorMobile';
import { CompassMobile } from './CompassMobile';
import { CascadeVisualizer } from './CascadeVisualizer';
import { ReframeInputs } from './ReframeInputs';

export {
  SadhanaMobile,
  InterceptorMobile,
  CompassMobile,
  CascadeVisualizer,
  ReframeInputs,
};

export type FeatureTab = 'sadhana' | 'interceptor' | 'compass';

export interface FeaturesPageProps {
  className?: string;
}

/**
 * Shell component for the Features view with responsive proportional 3-step toggle menu.
 * - Zero horizontal scroll.
 * - Zero truncation/ellipses: middle tab is allocated proportional width (flex-[1.38] on mobile),
 *   and all tabs use inline-block word wrapping with leading-tight so labels never clip on any phone width.
 * - Standard 44px min-height for touch targets (iOS & Android HIG compliant).
 * - Symmetrical equal width on tablets/desktops (sm:flex-1).
 * - Orange active state (#D97706).
 */
export const FeaturesPage: React.FC<FeaturesPageProps> = ({ className = '' }) => {
  const [activeFeature, setActiveFeature] = useState<'sadhana' | 'interceptor' | 'compass'>('sadhana');

  const handleFeatureChange = (tab: 'sadhana' | 'interceptor' | 'compass') => {
    setActiveFeature(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  // Scroll to top whenever switching between Sadhana Hub, Impulse Interceptor, and Bhava Compass
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [activeFeature]);

  return (
    <div
      style={{
        backgroundColor: '#FDFBF7',
        color: '#1E293B',
      }}
      className={`w-full min-h-full pb-8 space-y-4 ${className}`}
    >
      {/* 3-Step Toggle Menu (Responsive Proportional Widths, Zero Missing Words, Industry-Standard Mobile Alignment) */}
      <div className="flex items-stretch gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs w-full max-w-lg mx-auto">
        {/* Tab 1: Sadhana Hub */}
        <button
          type="button"
          onClick={() => handleFeatureChange('sadhana')}
          className={`flex-1 sm:flex-1 min-w-0 py-2 px-1 sm:px-2.5 min-h-[44px] flex items-center justify-center text-center text-[11px] min-[360px]:text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            activeFeature === 'sadhana'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span className="leading-tight">
            <span className="inline-block">Sadhana</span>{' '}
            <span className="inline-block">Hub</span>
          </span>
        </button>

        {/* Tab 2: Impulse Interceptor (Allocated ~38% extra space on mobile so full label fits cleanly across phones, wrapping gracefully without any cut-offs on narrow viewports) */}
        <button
          type="button"
          onClick={() => handleFeatureChange('interceptor')}
          className={`flex-[1.38] sm:flex-1 min-w-0 py-2 px-1 sm:px-2.5 min-h-[44px] flex items-center justify-center text-center text-[11px] min-[360px]:text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            activeFeature === 'interceptor'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span className="leading-tight">
            <span className="inline-block">Impulse</span>{' '}
            <span className="inline-block">Interceptor</span>
          </span>
        </button>

        {/* Tab 3: Bhāva Compass */}
        <button
          type="button"
          onClick={() => handleFeatureChange('compass')}
          className={`flex-[1.08] sm:flex-1 min-w-0 py-2 px-1 sm:px-2.5 min-h-[44px] flex items-center justify-center text-center text-[11px] min-[360px]:text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            activeFeature === 'compass'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span className="leading-tight">
            <span className="inline-block">Bhāva</span>{' '}
            <span className="inline-block">Compass</span>
          </span>
        </button>
      </div>

      {/* Feature Content Views */}
      <div className="transition-all duration-200">
        {activeFeature === 'sadhana' && <SadhanaMobile />}
        {activeFeature === 'interceptor' && <InterceptorMobile />}
        {activeFeature === 'compass' && <CompassMobile />}
      </div>
    </div>
  );
};

export default FeaturesPage;
