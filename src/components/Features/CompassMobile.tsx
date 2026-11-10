import React, { useState } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { BhavaCardData } from '../../types/iks';
import { LifeRhythmBar } from '../Chariot/LifeRhythmBar';
import {
  SEEKER_BHAVA_CARDS,
  SeekerPositiveBuffer,
  SeekerNegativeFriction,
} from '../../data/seekerShastraData';
import { LifeRhythm } from '../../types/shastra';
import {
  Compass,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';

import { BHAVA_CARDS } from '../../engine/bhavaEngine';

export { BHAVA_CARDS, SEEKER_BHAVA_CARDS };

export interface CompassMobileProps {
  className?: string;
}

const toPositiveCardData = (c: SeekerPositiveBuffer): BhavaCardData => ({
  id: c.id,
  title: c.title,
  sanskritTrait: c.badge,
  isPositive: true,
  appreciationMessage: c.note,
});

const toNegativeCardData = (c: SeekerNegativeFriction): BhavaCardData => ({
  id: c.id,
  title: c.title,
  sanskritTrait: c.badge,
  isPositive: false,
  explanationText: c.reflection,
  actionSteps: c.steps,
});

/**
 * Mobile-first Seeker Bhāva Compass (Yoga Sutra 1.33 Chitta Prasādanam).
 * Fully rhythm-adaptive emotional equilibrium tool for Stage 1.
 * Dynamically renders 3 Positive Buffer and 5 Negative Friction cards
 * tailored to Learning & Study, Work & Enterprise, or Home & Quiet Living.
 */
export const CompassMobile: React.FC<CompassMobileProps> = ({ className = '' }) => {
  const {
    openShastraLens,
    todayBhavaLogs,
    togglePositiveBhava,
    logNegativeBhavaEncounter,
    toggleNegativeBhavaResolution,
    clearBhavaCardToday,
    chariotStatus,
    preferences,
  } = useBrahmaPath();

  const rhythm: LifeRhythm = preferences?.lifeRhythm ?? 'learning_study';
  const cardSet = SEEKER_BHAVA_CARDS[rhythm] ?? SEEKER_BHAVA_CARDS.learning_study;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  // Compute live telemetry counts from todayBhavaLogs
  const positiveCount =
    todayBhavaLogs?.filter(
      (l) => l.isPositive || l.interactionType === 'positive_buffer'
    ).length || 0;

  const negativeLogs =
    todayBhavaLogs?.filter(
      (l) => !l.isPositive && l.interactionType !== 'positive_buffer'
    ) || [];
  const totalNegCount = negativeLogs.length;
  const resolvedNegCount = negativeLogs.filter((l) => Boolean(l.isResolved)).length;

  const handleToggleExpand = (cardId: string) => {
    setExpandedId((prev) => (prev === cardId ? null : cardId));
  };

  const toggleStepCheck = (stepKey: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Top Life Rhythm Switcher */}
      <LifeRhythmBar />

      {/* Main Master Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6"
      >
        {/* Header with Title, Badge, and Shastra Lens Trigger */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-800 flex-shrink-0 animate-spin-slow" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Bhāva Compass
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Restore inner serenity and emotional poise through the four classical attitudes.
            </p>
          </div>

          {openShastraLens && (
            <ShastraLensButton
              onClick={() => openShastraLens('chitta_prasadanam')}
              className="ml-2 flex-shrink-0"
            />
          )}
        </div>

        {/* 3-Column Live Bhāva Telemetry Strip */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Net Balance
            </span>
            <span className="font-extrabold text-emerald-800 font-mono text-sm sm:text-base">
              {chariotStatus?.bhavaScore ?? 0}/100
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Positive Buffers
            </span>
            <span className="font-extrabold text-slate-900 font-mono text-sm sm:text-base">
              {positiveCount} Logged
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Resolved Frictions
            </span>
            <span className="font-extrabold text-emerald-700 font-mono text-sm sm:text-base">
              {totalNegCount === 0 ? '0 Logged' : `${resolvedNegCount} of ${totalNegCount} Resolved`}
            </span>
          </div>
        </div>

        {/* Accordions Container */}
        <div className="space-y-6">
          {/* SECTION 1: 3 POSITIVE BUFFER ACCORDION CARDS (+20 Bhāva Surplus each) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Positive Buffers
              </h3>
            </div>

            <div className="space-y-3">
              {cardSet.positive.map((card) => {
                const isExpanded = expandedId === card.id;
                const positiveLoggedItem = todayBhavaLogs?.find(
                  (l) =>
                    (l.cardId === card.id || l.id === card.id) &&
                    (l.isPositive || l.interactionType === 'positive_buffer')
                );
                const isPositiveActive = Boolean(positiveLoggedItem);
                const cardData = toPositiveCardData(card);

                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border transition-all duration-300 shadow-2xs ${
                      isExpanded
                        ? isPositiveActive
                          ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                          : 'border-green-300 bg-green-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Accordion Card Header */}
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(card.id)}
                      className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex flex-col space-y-1 pr-3 min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
                          {card.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {card.badge}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {isPositiveActive ? (
                          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            ✓ Buffer Logged
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            Positive Buffer
                          </span>
                        )}

                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                            isExpanded ? 'rotate-180 text-emerald-700' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-4 pt-1 pb-5 border-t border-slate-100/90 space-y-3.5">
                        <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed font-medium">
                          {card.note}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePositiveBhava(cardData);
                          }}
                          className={`w-full py-3 px-4 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] ${
                            isPositiveActive
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                          {isPositiveActive ? (
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">
                                ✓ Buffer Active Today
                              </span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-emerald-100">
                                Tap to undo
                              </span>
                            </div>
                          ) : (
                            <span>Log Positive Buffer</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: 5 NEGATIVE FRICTION ACCORDION CARDS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Emotional Frictions &amp; Grounding Antidotes
              </h3>
            </div>

            <div className="space-y-3">
              {cardSet.negative.map((card) => {
                const isExpanded = expandedId === card.id;

                const negativeLoggedItem = todayBhavaLogs?.find(
                  (l) =>
                    (l.cardId === card.id || l.id === card.id) &&
                    !l.isPositive &&
                    l.interactionType !== 'positive_buffer'
                );
                const isEncountered = Boolean(negativeLoggedItem);
                const isCardResolved = Boolean(negativeLoggedItem?.isResolved);
                const cardData = toNegativeCardData(card);

                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border transition-all duration-300 shadow-2xs ${
                      isExpanded
                        ? isEncountered && isCardResolved
                          ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                          : isEncountered
                          ? 'border-amber-400 bg-amber-50/20 shadow-xs'
                          : 'border-orange-300 bg-orange-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Accordion Card Header */}
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(card.id)}
                      className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex flex-col space-y-1 pr-3 min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
                          {card.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {card.badge}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {isEncountered && !isCardResolved ? (
                          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            Active Friction
                          </span>
                        ) : isEncountered && isCardResolved ? (
                          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            ✓ Resolved
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-orange-100 text-orange-900 border border-orange-200 shadow-2xs">
                            Negative Friction
                          </span>
                        )}

                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                            isExpanded ? 'rotate-180 text-amber-700' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-4 pt-1 pb-5 border-t border-slate-100/90 space-y-4">
                        {/* Reflection Box */}
                        <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-950 leading-relaxed font-medium">
                          <span className="font-bold block pb-1 text-amber-900 uppercase text-[10px] tracking-wider">
                            Psychological Root &amp; Reflection
                          </span>
                          {card.reflection}
                        </div>

                        {/* Interactive 3-Step Grounding Antidotes Checklist */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                              Grounding Antidotes (Check as you practice)
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              3 steps
                            </span>
                          </div>

                          <div className="space-y-2">
                            {card.steps.map((step, idx) => {
                              const stepKey = `${card.id}_step_${idx}`;
                              const isChecked = Boolean(checkedSteps[stepKey]);

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStepCheck(stepKey);
                                  }}
                                  className={`w-full flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all duration-200 cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50/70 border-emerald-200/90 text-slate-800'
                                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border flex-shrink-0 transition-colors ${
                                      isChecked
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span
                                    className={`leading-relaxed font-medium ${
                                      isChecked ? 'line-through text-slate-400' : ''
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive Action Controls */}
                        {!isEncountered && (
                          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                logNegativeBhavaEncounter(cardData);
                              }}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
                              <span>Experiencing This Friction</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNegativeBhavaResolution(cardData);
                              }}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-emerald-700 hover:bg-emerald-800 text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                              <span>✓ Mark as Resolved</span>
                            </button>
                          </div>
                        )}

                        {isEncountered && !isCardResolved && (
                          <div className="space-y-3 pt-1">
                            <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2 shadow-2xs">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>
                                Active Unresolved Friction — Practice the 3 grounding antidotes above, then mark resolved to restore serenity.
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNegativeBhavaResolution(cardData);
                                }}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-emerald-700 hover:bg-emerald-800 text-white"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                                <span>✓ Mark as Resolved</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearBhavaCardToday(card.id);
                                }}
                                className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                                title="Remove from today's logs"
                              >
                                Remove from Logs
                              </button>
                            </div>
                          </div>
                        )}

                        {isEncountered && isCardResolved && (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNegativeBhavaResolution(cardData);
                              }}
                              className="flex-1 py-3 px-4 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                              <div className="flex flex-col text-center leading-tight">
                                <span className="font-bold text-xs sm:text-sm">
                                  ✓ Friction Resolved
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-normal text-emerald-100">
                                  Tap to reopen
                                </span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearBhavaCardToday(card.id);
                              }}
                              className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                              title="Clear from today's logs"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompassMobile;
