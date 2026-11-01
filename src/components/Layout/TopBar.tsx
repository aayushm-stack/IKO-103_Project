import React from 'react';
import { Target, Settings } from 'lucide-react';
import appLogo from '../../assets/logo.png';

export interface TopBarProps {
  onSankalpaClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  isSankalpaActive?: boolean;
  isSettingsActive?: boolean;
  className?: string;
}

/**
 * TopBar navigation component for BrahmaPath.
 *
 * Features:
 * 1. Personalised Sankalpa & Goal Centre quick access (Target icon)
 * 2. Pure, secure offline branding and title header (no hidden data injections)
 * 3. Settings modal trigger with reactive hover box and rotational feedback.
 */
export const TopBar: React.FC<TopBarProps> = ({
  onSankalpaClick,
  onProfileClick,
  onSettingsClick,
  isSankalpaActive = false,
  isSettingsActive = false,
  className = '',
}) => {
  const handleSankalpaClick = onSankalpaClick || onProfileClick;

  return (
    <header className={`sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-3 shadow-2xs transition-colors duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Personalised Centre / Culturally aligned Sankalpa (Intent & Focus) Action */}
        <button
          type="button"
          onClick={() => {
            handleSankalpaClick?.();
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              if (document.documentElement) document.documentElement.scrollTop = 0;
              if (document.body) document.body.scrollTop = 0;
            }
          }}
          aria-label="Personalised Sankalpa & Goal Centre"
          title="Personalised Sankalpa & Goal Centre"
          className={`group p-2 rounded-xl text-terracotta transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
            isSankalpaActive
              ? 'bg-orange-200/90 border border-terracotta ring-2 ring-terracotta/30 scale-105'
              : 'bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200/60 hover:border-orange-300 hover:scale-105 active:scale-95'
          }`}
        >
          <Target className="w-5 h-5 text-terracotta transition-transform duration-300 group-hover:scale-110" />
        </button>

        {/* Center: Main "BrahmaPath" Logo */}
        <div
          className="flex items-center gap-2 select-none group"
          title="BrahmaPath Inner Equilibrium"
        >
          <img
            src={appLogo}
            alt="BrahmaPath Logo"
            className="w-8 h-8 object-contain rounded-lg drop-shadow-2xs select-none"
          />
          <div className="text-left">
            <h1 className="font-serif text-lg sm:text-xl font-semibold tracking-wide text-charcoal leading-tight">
              BrahmaPath
            </h1>
            <p className="text-[8px] sm:text-[8.5px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-charcoal/60 font-semibold -mt-0.5 whitespace-nowrap">
              Inner Equilibrium
            </p>
          </div>
        </div>

        {/* Settings Gear Icon / Action with Matching Orange Box & Rotation */}
        <button
          type="button"
          onClick={() => {
            onSettingsClick?.();
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              if (document.documentElement) document.documentElement.scrollTop = 0;
              if (document.body) document.body.scrollTop = 0;
            }
          }}
          aria-label="Settings"
          title="Settings & Mindful Check-ins"
          className={`group p-2 rounded-xl text-terracotta transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/40 ${
            isSettingsActive
              ? 'bg-orange-200/90 border border-terracotta ring-2 ring-terracotta/30 scale-105'
              : 'bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200/60 hover:border-orange-300 hover:scale-105 active:scale-95'
          }`}
        >
          <Settings
            className={`w-5 h-5 text-terracotta transition-transform duration-500 ease-out ${
              isSettingsActive
                ? 'rotate-90 scale-110'
                : 'group-hover:rotate-90 group-hover:scale-110'
            }`}
          />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
