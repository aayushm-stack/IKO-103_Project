import React, { useState } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { BhavaCardData } from '../../types/iks';
import { BHAVA_CARDS } from '../../engine/bhavaEngine';
import { Compass, ChevronDown, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';

export { BHAVA_CARDS };

export interface CompassMobileProps {
  className?: string;
}

/**
 * Mobile-first Bhāva Compass (Yoga Sutra 1.33 Chitta Prasādanam).
 * Interactive accordion of 8 Bhāva cards with positive appreciation buffers
 * and resolvable negative friction antidotes directly wired to BrahmaPathContext.
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
  } = useBrahmaPath();

  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      className={`p-5 sm:p-6 rounded-3xl border shadow-xs overflow-y-auto pb-12 space-y-6 ${className}`}
    >
      {/* Header with Title and Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-700 flex-shrink-0 animate-spin-slow" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Bhāva Compass
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Restore inner serenity through the four classical attitudes
          </p>
        </div>

        {openShastraLens && (
          <ShastraLensButton
            onClick={() => openShastraLens('chitta_prasadanam')}
            className="ml-2 flex-shrink-0"
          />
        )}
      </div>

      {/* 2-Cell Live Bhāva Telemetry Strip */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-2 gap-2 text-center text-xs shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Bhāva Score
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
            {chariotStatus?.bhavaScore ?? 0}/100
          </span>
        </div>

        <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Harmonized Bhāvas
          </span>
          <span className="font-extrabold text-emerald-700 font-mono text-xs sm:text-sm">
            {(todayBhavaLogs || []).length === 0
              ? '0 Logged'
              : `${positiveCount + resolvedNegCount} / ${todayBhavaLogs.length} Harmonized`}
          </span>
        </div>
      </div>

      {/* Accordion List for the 8 BHAVA_CARDS */}
      <div className="space-y-3">
        {BHAVA_CARDS.map((card) => {
          const isExpanded = expandedId === card.id;

          // Check positive log status
          const positiveLoggedItem = card.isPositive
            ? todayBhavaLogs?.find(
                (l) =>
                  (l.cardId === card.id || l.id === card.id) &&
                  (l.isPositive || l.interactionType === 'positive_buffer')
              )
            : undefined;
          const isPositiveActive = Boolean(positiveLoggedItem);

          // Check negative log status
          const negativeLoggedItem = !card.isPositive
            ? todayBhavaLogs?.find(
                (l) =>
                  (l.cardId === card.id || l.id === card.id) &&
                  !l.isPositive &&
                  l.interactionType !== 'positive_buffer'
              )
            : undefined;
          const isEncountered = Boolean(negativeLoggedItem);
          const isCardResolved = Boolean(negativeLoggedItem?.isResolved);

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all duration-300 shadow-2xs ${
                isExpanded
                  ? card.isPositive
                    ? isPositiveActive
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                      : 'border-green-300 bg-green-50/20 shadow-xs'
                    : isEncountered && isCardResolved
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                      : isEncountered
                        ? 'border-amber-400 bg-amber-50/20 shadow-xs'
                        : 'border-orange-300 bg-orange-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Accordion Card Header / Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggleExpand(card.id)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
                aria-expanded={isExpanded}
              >
                <div className="flex flex-col space-y-1 pr-3 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {card.sanskritTrait}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {/* Status Badge */}
                  {card.isPositive ? (
                    isPositiveActive ? (
                      <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                        Buffer Logged
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                        Positive Buffer
                      </span>
                    )
                  ) : isEncountered && !isCardResolved ? (
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                      Unresolved Friction
                    </span>
                  ) : isEncountered && isCardResolved ? (
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                      Resolved
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-orange-100 text-orange-900 border border-orange-200 shadow-2xs">
                      Negative Friction
                    </span>
                  )}

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                      isExpanded
                        ? card.isPositive
                          ? 'rotate-180 text-emerald-700'
                          : 'rotate-180 text-orange-700'
                        : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Content Shell with Smooth Max-Height Animation */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-2 pb-5 border-t border-slate-100/90">
                  {/* POSITIVE CARD: Appreciation message and Action Button */}
                  {card.isPositive && (
                    <div className="space-y-3">
                      {card.appreciationMessage && (
                        <div className="bg-green-50/90 border border-green-200/90 rounded-2xl p-4 sm:p-5 text-green-900 shadow-2xs space-y-2">
                          <div className="flex items-center gap-2 text-green-800 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-green-600" />
                            <span>Appreciation & Inner Serenity</span>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed text-green-800 font-serif italic">
                            &ldquo;{card.appreciationMessage}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Full-width action button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePositiveBhava(card);
                        }}
                        className={`w-full py-3 px-4 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] ${
                          isPositiveActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm'
                        }`}
                      >
                        {isPositiveActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">Positive Buffer Logged</span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-emerald-100">Tap to undo</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                            <span>Log Positive Buffer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* NEGATIVE CARD: Explanation, Action Steps, and Controls */}
                  {!card.isPositive && (
                    <div className="space-y-4 pt-1">
                      {/* Explanation of what they are experiencing */}
                      {card.explanationText && (
                        <div className="space-y-1.5">
                          <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                            What you are experiencing:
                          </h4>
                          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                            {card.explanationText}
                          </div>
                        </div>
                      )}

                      {/* Action Steps Bulleted List */}
                      {card.actionSteps && card.actionSteps.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                            Actionable Antidotes:
                          </h4>
                          <ul className="space-y-2">
                            {card.actionSteps.map((step, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] mt-1.5 flex-shrink-0" />
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Explicit Negative Card Controls */}
                      {!isEncountered && (
                        // Case 1: Card is expanded for reading, not yet logged today
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              logNegativeBhavaEncounter(card);
                            }}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <AlertTriangle className="w-4 h-4 text-white" />
                            <span>I Am Experiencing This Friction</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNegativeBhavaResolution(card);
                            }}
                            className="flex-1 py-3 px-4 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-[#C85A32] hover:bg-[#B24D28] text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">Practiced Antidote</span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-amber-100">Mark resolved</span>
                            </div>
                          </button>
                        </div>
                      )}

                      {isEncountered && !isCardResolved && (
                        // Case 2: Currently experiencing unresolved friction
                        <div className="space-y-3 pt-1">
                          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2 shadow-2xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              Active Unresolved Friction — Pulling Composure Score down. Practice the antidotes above, then mark resolved.
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNegativeBhavaResolution(card);
                              }}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-[#C85A32] hover:bg-[#B24D28] text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>Mark as Resolved (Restore Sattva)</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearBhavaCardToday(card.id);
                              }}
                              className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                              title="Undo / Remove from today's logs"
                            >
                              Undo / Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {isEncountered && isCardResolved && (
                        // Case 3: Friction resolved
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNegativeBhavaResolution(card);
                            }}
                            className="flex-1 py-3 px-4 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">Intellect Resolved</span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-emerald-100">Tap to reopen</span>
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
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompassMobile;
