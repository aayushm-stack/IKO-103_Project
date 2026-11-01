import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import appLogo from '../../assets/logo.png';

export interface OnboardingFlowProps {
  onComplete?: (name: string) => void;
  className?: string;
}

/**
 * Geometric element description for the Page 1 corner grid.
 */
interface GeometricItem {
  key: string;
  type: 'cross' | 'dot';
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}

/**
 * Two-Page First-Launch Onboarding Flow for BrahmaPath.
 *
 * Page 1: The Mood-Setting Splash Screen (step === 1)
 *  - Oval-masked terracotta crosses-to-dots canvas background.
 *  - 3-stage staggered smooth entrance animation (Logo -> Typography -> Continue).
 *
 * Page 2: The Grounded Greeting, Name & Sankalpa Pledge (step === 2)
 *  - Strict zero-animation instantaneous display.
 *  - Warm sanctuary greeting, name entry with offline reassurance,
 *    and Bhagavad Gita 6.5 Sankalpa sacred pledge.
 */
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  className = '',
}) => {
  const { setUserName, updatePreferences, setActiveView } = useBrahmaPath();

  // Step state: 1 = Splash Screen, 2 = Greeting & Sankalpa Pledge
  const [step, setStep] = useState<1 | 2>(1);

  // Stage state for Page 1 staggered entrance: 0 -> 1 -> 2 -> 3
  const [stage, setStage] = useState<number>(0);

  // Form states for Page 2
  const [nameInput, setNameInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // 3-Stage Staggered Load Animation for Page 1
  useEffect(() => {
    if (step !== 1) return;

    // Stage 1: 0ms -> 700ms (Logo appears)
    const t1 = window.setTimeout(() => setStage(1), 50);
    // Stage 2: 650ms -> 1350ms (Typography appears)
    const t2 = window.setTimeout(() => setStage(2), 650);
    // Stage 3: 1300ms -> 1900ms (Continue button appears)
    const t3 = window.setTimeout(() => setStage(3), 1300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [step]);

  // Precompute the subtle geometric field of crosses and dots for Page 1
  const geometricItems: GeometricItem[] = useMemo(() => {
    const items: GeometricItem[] = [];
    // Richer, darker terracotta and warm amber shades
    const colors = ['#C2410C', '#9A3412'];

    // Top-Left and Bottom-Right corners in a 1000x1200 coordinate space
    const corners: Array<{ corner: 'tl' | 'br'; originX: number; originY: number }> = [
      { corner: 'tl', originX: 0, originY: 0 },
      { corner: 'br', originX: 1000, originY: 1200 },
    ];

    corners.forEach(({ corner }) => {
      for (let r = 0; r < 18; r++) {
        for (let c = 0; c < 18; c++) {
          const diag = r + c;
          // Extended inward towards the center
          if (diag > 20) continue;

          const x = corner === 'tl' ? c * 36 + 28 : 1000 - (c * 36 + 28);
          const y = corner === 'tl' ? r * 36 + 28 : 1200 - (r * 36 + 28);
          const color = colors[(r + c) % 2];

          if (diag <= 5) {
            // Darker, prominent crosses closest to corners
            items.push({
              key: `${corner}-cross-lg-${r}-${c}`,
              type: 'cross',
              x,
              y,
              size: 13,
              color,
              opacity: 0.52,
            });
          } else if (diag <= 10) {
            // Mid-sized defined crosses
            items.push({
              key: `${corner}-cross-sm-${r}-${c}`,
              type: 'cross',
              x,
              y,
              size: 8,
              color,
              opacity: 0.36,
            });
          } else if (diag <= 14) {
            // Delicate transitioning crosses
            items.push({
              key: `${corner}-cross-xs-${r}-${c}`,
              type: 'cross',
              x,
              y,
              size: 5,
              color,
              opacity: 0.24,
            });
          } else {
            // Fine geometric dots extending closer to the center
            items.push({
              key: `${corner}-dot-${r}-${c}`,
              type: 'dot',
              x,
              y,
              size: 2.2,
              color,
              opacity: 0.16,
            });
          }
        }
      }
    });

    return items;
  }, []);

  // Oval radial gradient mask for Page 1 background (tighter center so gradient comes closer inward)
  const ovalMaskStyle: React.CSSProperties = {
    maskImage:
      'radial-gradient(ellipse 54% 46% at 50% 48%, transparent 20%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 95%)',
    WebkitMaskImage:
      'radial-gradient(ellipse 54% 46% at 50% 48%, transparent 20%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 95%)',
  };

  // Final submission on Page 2
  const handleFinalSubmit = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setValidationError('Please enter your name to begin your journey.');
      return;
    }
    setValidationError('');

    const sankalpaText =
      'I choose to hold the reins of my own mind as my own gentlest guide and truest friend.';

    // 1. Context updates
    setUserName(trimmed);
    updatePreferences({
      name: trimmed,
      sankalpa: sankalpaText,
      onboardingCompleted: true,
    });

    // 2. Persistent storage sync
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('brahmapath_onboarding_completed', 'true');
        if (!window.localStorage.getItem('brahmapath_sadhana_logs')) {
          window.localStorage.setItem('brahmapath_sadhana_logs', JSON.stringify([]));
        }
      }
    } catch (e) {
      console.warn('Storage sync warning:', e);
    }

    // 3. Routing
    setActiveView('home');

    // 4. Callback
    if (onComplete) {
      onComplete(trimmed);
    }
  };

  // =========================================================================
  // PAGE 1: The Mood-Setting Splash Screen
  // =========================================================================
  if (step === 1) {
    return (
      <div
        style={{ backgroundColor: '#FDFBF7' }}
        className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-between py-16 px-6 select-none ${className}`}
      >
        {/* Absolute Oval-Masked Terracotta Geometric Layer */}
        <div
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          style={ovalMaskStyle}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1000 1200"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            {geometricItems.map((item) => {
              if (item.type === 'cross') {
                const half = item.size / 2;
                return (
                  <g key={item.key} opacity={item.opacity}>
                    <line
                      x1={item.x - half}
                      y1={item.y}
                      x2={item.x + half}
                      y2={item.y}
                      stroke={item.color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1={item.x}
                      y1={item.y - half}
                      x2={item.x}
                      y2={item.y + half}
                      stroke={item.color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              }
              return (
                <circle
                  key={item.key}
                  cx={item.x}
                  cy={item.y}
                  r={item.size}
                  fill={item.color}
                  opacity={item.opacity}
                />
              );
            })}
          </svg>
        </div>

        {/* Top spacer anchor */}
        <div className="w-full h-2" />

        {/* Center Stage: Upper-Middle Logo & Centered Typography */}
        <div className="flex flex-col items-center text-center my-auto z-10 space-y-7 max-w-sm w-full">
          {/* Stage 1: The Official BrahmaPath Logo (0ms -> 700ms) */}
          <div
            className={`transition-all duration-700 ease-out transform ${
              stage >= 1
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95'
            }`}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-sm border border-amber-200/60 bg-white/95 p-3 flex items-center justify-center">
              <img
                src={appLogo}
                alt="BrahmaPath Logo"
                className="w-full h-full object-contain select-none drop-shadow-2xs"
              />
            </div>
          </div>

          {/* Stage 2: Typography directly on background (650ms -> 1350ms) */}
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ease-out transform ${
              stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight text-center">
              BrahmaPath
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.20em] text-slate-500 font-semibold mt-1 whitespace-nowrap text-center">
              Inner Equilibrium
            </p>
          </div>
        </div>

        {/* Stage 3: Premium Orange Continue button (1300ms -> 1900ms) */}
        <div
          className={`flex justify-center w-full z-10 pb-6 sm:pb-8 transition-all duration-600 ease-out transform ${
            stage >= 3
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full max-w-[280px] sm:max-w-[300px] py-3.5 px-6 rounded-2xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm tracking-wide shadow-md shadow-orange-950/15 hover:shadow-lg hover:shadow-orange-950/20 border border-amber-400/40 active:scale-[0.98] transition-all duration-200 cursor-pointer text-center"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PAGE 2: The Grounded Greeting, Name & Sankalpa Pledge
  // STRICT RULE — ZERO ANIMATIONS ON PAGE 2
  // =========================================================================
  return (
    <div
      style={{ backgroundColor: '#FDFBF7' }}
      className={`min-h-screen w-full bg-[#FDFBF7] text-[#1E293B] flex items-center justify-center p-4 sm:p-6 ${className}`}
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 max-w-md w-full">
        {/* Box 1 — Warm Sanctuary Greeting */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Welcome to Your Quiet Sanctuary
            </h2>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Take one slow, unhurried breath. In a world that constantly demands more of your speed and attention, this space asks only for your honesty. BrahmaPath is not here to judge your slips—it is here to stand beside you as a calm, steady guide while you reclaim command over your mind, rest, and focus.
          </div>
        </div>

        {/* Box 2 — Name Input (Grey Box Style matching App Forms) */}
        <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2.5">
          <div>
            <label
              htmlFor="onboarding-name-input"
              className="text-xs font-bold text-slate-800 uppercase tracking-wider block"
            >
              How shall we address you on this path?
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Your name stays strictly on this device, completely offline.
            </p>
          </div>

          <input
            id="onboarding-name-input"
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (validationError && e.target.value.trim().length > 0) {
                setValidationError('');
              }
            }}
            placeholder="Enter your name"
            className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />

          {validationError && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span>{validationError}</span>
            </p>
          )}
        </div>

        {/* Box 3 — The Sankalpa (Heart-Touching Pledge to Oneself) */}
        <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Your Sankalpa (Inner Pledge of Self-Mastery)
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              Bhagavad Gita 6.5
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
            &ldquo;I step onto this path not to punish myself into perfection, but to elevate myself by my own mind. When my attention wanders into distraction, I will pause without guilt. When my body is tired, I will honor its rest. Day by day, breath by breath, I choose to hold the reins of my own mind—acting as my own gentlest guide and truest friend.&rdquo;
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            By continuing, you anchor this intention (Sankalpa) as the foundation of your daily practice.
          </p>
        </div>

        {/* Continue Button (No Animation) */}
        <button
          type="button"
          onClick={handleFinalSubmit}
          style={{ backgroundColor: '#065F46', color: '#FFFFFF' }}
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm cursor-pointer shadow-md active:scale-[0.99] transition hover:opacity-95"
        >
          Accept Sankalpa &amp; Continue to BrahmaPath
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
