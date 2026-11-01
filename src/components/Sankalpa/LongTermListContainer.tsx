import React from 'react';
import {
  Target,
  Trash2,
  MinusCircle,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Goal } from './types';

export interface LongTermListContainerProps {
  goals: Goal[];
  isEditing?: boolean;
  onUpdateGoalText?: (id: string, text: string) => void;
  onTogglePendingDelete?: (id: string) => void;
  className?: string;
}

/**
 * LongTermListContainer: Displays enduring, strategic Vedic horizon resolves.
 * Adheres strictly to W3C WCAG 2.2 Level AA accessibility guidelines:
 * - Uses multiple non-color visual indicators (strikethrough + destructive shape / bold + constructive shape).
 * - Minimum 3:1 contrast ratio against light backgrounds (red-800 #991B1B at 7.89:1, emerald-800 #065F46 at 7.09:1).
 */
export const LongTermListContainer: React.FC<LongTermListContainerProps> = ({
  goals,
  isEditing = false,
  onUpdateGoalText,
  onTogglePendingDelete,
  className = '',
}) => {
  return (
    <section
      aria-label="Horizon Goals"
      className={`space-y-3 pt-2 ${className}`}
    >
      {/* Primary Heading: Horizon Goals */}
      <div className="pb-2 border-b border-[#E2E8F0]">
        <h2 className="font-serif text-lg font-bold text-charcoal tracking-wide">
          Horizon Goals
        </h2>
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="p-4 text-center rounded-xl border border-dashed border-[#E2E8F0] text-xs text-charcoal/50">
            No horizon goals defined yet.
          </div>
        ) : (
          goals.map((goal, index) => {
            const isPendingDelete = Boolean(goal.pendingDelete);
            const isPendingAdd = Boolean(goal.pendingAdd);

            return (
              <div
                key={goal.id}
                className={`p-4 rounded-xl border transition-all duration-150 space-y-2 shadow-2xs ${
                  isPendingDelete
                    ? 'border-red-400 bg-red-50/80 ring-1 ring-red-400/40'
                    : isPendingAdd
                    ? 'border-emerald-400 bg-emerald-50/70 ring-1 ring-emerald-500/30'
                    : isEditing
                    ? 'border-sage/40 bg-emerald-50/20'
                    : 'border-sage/20 bg-gradient-to-br from-white/95 to-emerald-50/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Left Shape Indicator */}
                  <div className="mt-1 flex-shrink-0">
                    {isPendingDelete ? (
                      // Destructive shape: MinusCircle in high-contrast red-800 (#991B1B)
                      <div
                        title="Marked for deletion"
                        className="text-red-800 flex items-center justify-center"
                      >
                        <MinusCircle className="w-5 h-5 stroke-[2.2]" />
                      </div>
                    ) : isPendingAdd ? (
                      // Constructive shape: PlusCircle in high-contrast emerald-800 (#065F46)
                      <div
                        title="New pending horizon goal"
                        className="text-emerald-800 flex items-center justify-center"
                      >
                        <PlusCircle className="w-5 h-5 stroke-[2.2]" />
                      </div>
                    ) : isEditing ? (
                      <div className="w-6 h-6 rounded-lg bg-sage/15 text-sage flex items-center justify-center">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-sage/10 text-sage flex items-center justify-center mt-0.5">
                        <Target className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={`lt-goal-input-${goal.id}`}
                            className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60"
                          >
                            Horizon Vision #{index + 1}
                          </label>

                          {/* Non-color accessibility badges */}
                          {isPendingDelete && (
                            <span className="text-[10px] font-bold text-red-800 bg-red-100/90 px-2 py-0.5 rounded border border-red-300">
                              Marked for Removal
                            </span>
                          )}
                          {isPendingAdd && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300">
                              New Horizon (Pending)
                            </span>
                          )}
                        </div>

                        {/* Strikethrough visual indicator applied when pendingDelete */}
                        <input
                          id={`lt-goal-input-${goal.id}`}
                          type="text"
                          disabled={isPendingDelete}
                          value={goal.text}
                          onChange={(e) => onUpdateGoalText?.(goal.id, e.target.value)}
                          placeholder="e.g. I embody calm mental equanimity..."
                          className={`w-full px-3 py-1.5 text-sm rounded-lg border transition shadow-2xs focus:outline-none focus:ring-2 ${
                            isPendingDelete
                              ? 'line-through decoration-red-800 decoration-2 text-red-900 bg-red-100/50 border-red-300 cursor-not-allowed'
                              : isPendingAdd
                              ? 'font-bold text-emerald-950 bg-white border-emerald-400 focus:ring-emerald-600/40'
                              : 'font-medium text-charcoal bg-white border-[#E2E8F0] focus:ring-sage/40'
                          }`}
                        />
                      </div>
                    ) : (
                      <p className="text-sm leading-snug font-medium text-charcoal">
                        {goal.text}
                      </p>
                    )}
                  </div>

                  {/* Delete / Undo Action in edit mode */}
                  {isEditing && (
                    <div className="flex items-center gap-1 mt-4 flex-shrink-0">
                      {isPendingDelete ? (
                        <button
                          type="button"
                          onClick={() => onTogglePendingDelete?.(goal.id)}
                          aria-label={`Restore horizon goal: ${goal.text}`}
                          title="Restore horizon goal"
                          className="p-1.5 text-xs font-semibold text-charcoal bg-white hover:bg-slate-100 rounded-lg border border-slate-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-charcoal" />
                          <span className="text-[10px]">Undo</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onTogglePendingDelete?.(goal.id)}
                          aria-label={`Mark horizon goal for deletion: ${goal.text}`}
                          title="Mark for deletion"
                          className="p-1.5 text-red-800 hover:text-red-900 hover:bg-red-100/70 rounded-lg border border-transparent hover:border-red-300 transition-colors cursor-pointer"
                        >
                          {/* Destructive shape icon */}
                          <Trash2 className="w-4 h-4 text-red-800" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Read-only metadata pill */}
                {!isEditing && (
                  <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]/50 text-[10px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      Long-Term Sankalpa
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default LongTermListContainer;
