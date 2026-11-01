import React, { useState, useMemo } from 'react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { MASTER_MICRO_SWAPS, MicroSwapItem } from '../../data/microSwaps';
import { Check, Heart } from 'lucide-react';

export const SHREYAS_MICRO_SWAPS = [
  'Jala (Cold Water Reset)',
  'Pratyahara (Palming eyes, 60s dark)',
  'Pranayama (Extended Exhale/Rechaka)',
  'Urge Surfing (10-minute timer)',
  'Pattern Interrupt (5-4-3-2-1 Grounding)',
  'Tapas (Lock phone, open book)',
] as const;

export type ShreyasMicroSwap = (typeof SHREYAS_MICRO_SWAPS)[number];

export interface ReframeInputsProps {
  /** Optional controlled vitarka text */
  vitarkaText?: string;
  /** Callback fired when vitarka text updates */
  onVitarkaChange?: (value: string) => void;

  /** Optional controlled pratipaksha text */
  pratipakshaText?: string;
  /** Callback fired when pratipaksha text updates */
  onPratipakshaChange?: (value: string) => void;

  /** Optional selected micro-swap */
  selectedSwap?: string | null;
  /** Callback fired when a micro-swap is selected */
  onSelectSwap?: (swap: string) => void;

  /** Optional callback to open Shastra Lens */
  onOpenShastra?: () => void;

  className?: string;
}

/**
 * Mobile-first Pratipaksha Bhavana input & action section (Patanjali Yoga Sutra 2.33).
 *
 * Implements:
 * - Clear card header with Shastra Lens trigger linked directly to Patanjali Yoga Sutra 2.33
 * - Darker bold titles with muted grey subtexts for Vitarka and Pratipaksha input areas
 * - Empty-by-default textareas with exact ghost text placeholders
 * - Dynamic Shreyas Micro-Swaps sourced from user preferences (preferences.selectedMicroSwapIds)
 * - Renders all user-configured micro-swap actions from Settings (fully rewired, no 4-item cap)
 * - Perfect active selection highlighting when tapped
 */
export const ReframeInputs: React.FC<ReframeInputsProps> = ({
  vitarkaText: controlledVitarka,
  onVitarkaChange,
  pratipakshaText: controlledPratipaksha,
  onPratipakshaChange,
  selectedSwap: controlledSwap,
  onSelectSwap,
  onOpenShastra,
  className = '',
}) => {
  const { preferences, openShastraLens } = useBrahmaPath();

  const handleOpenShastra = onOpenShastra ?? (() => openShastraLens('pratipaksha'));

  // Internal state fallback for uncontrolled usage
  const [internalVitarka, setInternalVitarka] = useState<string>('');
  const [internalPratipaksha, setInternalPratipaksha] = useState<string>('');
  const [internalSwap, setInternalSwap] = useState<string | null>(null);

  const vitarka = controlledVitarka !== undefined ? controlledVitarka : internalVitarka;
  const pratipaksha = controlledPratipaksha !== undefined ? controlledPratipaksha : internalPratipaksha;
  const activeSwap = controlledSwap !== undefined ? controlledSwap : internalSwap;

  // 1. Filter MASTER_MICRO_SWAPS to keep only objects whose id exists in selectedMicroSwapIds
  const selectedIds: string[] = useMemo(() => {
    return Array.isArray(preferences?.selectedMicroSwapIds) &&
      preferences.selectedMicroSwapIds.length > 0
      ? preferences.selectedMicroSwapIds
      : MASTER_MICRO_SWAPS.map((item) => item.id);
  }, [preferences?.selectedMicroSwapIds]);

  const filteredSwaps: MicroSwapItem[] = useMemo(() => {
    const set = new Set(selectedIds);
    const matches = MASTER_MICRO_SWAPS.filter((item) => set.has(item.id));
    return matches.length > 0 ? matches : MASTER_MICRO_SWAPS;
  }, [selectedIds]);

  // 2. All user-configured swaps from Settings are displayed and fully available
  const displaySwaps: MicroSwapItem[] = filteredSwaps;

  const handleVitarkaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (onVitarkaChange) {
      onVitarkaChange(val);
    } else {
      setInternalVitarka(val);
    }
  };

  const handlePratipakshaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (onPratipakshaChange) {
      onPratipakshaChange(val);
    } else {
      setInternalPratipaksha(val);
    }
  };

  const handleSwapClick = (formattedSwap: string) => {
    if (onSelectSwap) {
      onSelectSwap(formattedSwap);
    } else {
      setInternalSwap(formattedSwap);
    }
  };

  return (
    <div className={`w-full space-y-5 ${className}`}>
      {/* Card Header with Title, Subtitle and Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Pratipaksha Bhāvana Reframe
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Transform unwholesome impulses into conscious antidotes
          </p>
        </div>

        <ShastraLensButton
          onClick={handleOpenShastra}
          className="ml-2 flex-shrink-0"
        />
      </div>

      {/* Heartfelt Reassurance & Psychological Grounding Box */}
      <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <h4 className="text-xs sm:text-sm font-bold text-amber-950">
            Pause and take a gentle breath. You are safe here.
          </h4>
        </div>
        <p className="text-xs text-amber-900/85 leading-relaxed font-normal pl-6">
          Every human mind experiences restless cravings and unwholesome impulses (Vitarka). You do not need to fight, judge, or hide what you feel. Simply putting honest words to the urge weakens its unconscious hold—giving your intellect (Buddhi) room to breathe and naturally cultivate a calm, wholesome antidote (Pratipaksha).
        </p>
      </div>

      {/* 1. Vitarka Input Box */}
      <div className="space-y-1.5">
        <div className="space-y-0.5">
          <label
            htmlFor="vitarka-textarea"
            className="text-xs sm:text-sm font-bold text-slate-900 block"
          >
            Vitarka (The Impulsive Narrative)
          </label>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
            Acknowledge the restless thought or craving pulling at your attention
          </p>
        </div>
        <textarea
          id="vitarka-textarea"
          rows={3}
          value={vitarka}
          onChange={handleVitarkaChange}
          placeholder="e.g., I feel like scrolling reels for 5 minutes because I am dreading this assignment..."
          className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed resize-none transition shadow-2xs"
        />
      </div>

      {/* 2. Pratipaksha Input Box */}
      <div className="space-y-1.5">
        <div className="space-y-0.5">
          <label
            htmlFor="pratipaksha-textarea"
            className="text-xs sm:text-sm font-bold text-slate-900 block"
          >
            Pratipaksha (The Wholesome Counter-Reframe)
          </label>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
            Cultivate the deliberate opposite thought to dissolve the negative loop
          </p>
        </div>
        <textarea
          id="pratipaksha-textarea"
          rows={3}
          value={pratipaksha}
          onChange={handlePratipakshaChange}
          placeholder="e.g., Scrolling will only make me more tired. Protecting my focus now will give me true free time tonight."
          className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 leading-relaxed resize-none transition shadow-2xs"
        />
      </div>

      {/* 3. Shreyas Micro-Swap Actions Grid */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 block">
              Shreyas Micro-Swap Actions
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
              Deploy a physical circuit-breaker to intercept sensory momentum
            </p>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full flex-shrink-0 shadow-2xs">
            Choose 1 ({displaySwaps.length} available)
          </span>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 items-stretch">
          {displaySwaps.map((swap: MicroSwapItem) => {
            const formattedName = swap.title;
            const isSelected =
              activeSwap === formattedName ||
              activeSwap === swap.id ||
              activeSwap === swap.title ||
              (typeof activeSwap === 'string' &&
                (activeSwap.includes(swap.title) || activeSwap.includes(swap.id)));

            return (
              <button
                key={swap.id}
                type="button"
                onClick={() => handleSwapClick(formattedName)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between h-full relative group shadow-2xs hover:shadow-xs ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-2 w-full">
                  {/* Header Row: Title on Left, Custom Checkbox on Right (No Emojis) */}
                  <div className="flex items-start justify-between w-full gap-2.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {swap.title}
                    </span>

                    {/* Custom Checkbox Indicator Box at Top-Right */}
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Gray Line Below the Heading */}
                  <div className="border-b border-slate-200/80" />

                  {/* Explanatory Rule & Instructions (2-3 lines) */}
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                    {swap.description}
                  </p>
                </div>

                {/* Bottom Category & Selected Indicator */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] w-full">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">
                    {swap.category}
                  </span>
                  {isSelected && (
                    <span className="text-orange-700 font-bold uppercase tracking-wider text-[9px] bg-orange-100/90 px-2 py-0.5 rounded-full border border-orange-200">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReframeInputs;
