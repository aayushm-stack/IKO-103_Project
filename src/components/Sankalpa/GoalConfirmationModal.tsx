import React, { useEffect } from 'react';
import {
  AlertTriangle,
  MinusCircle,
  PlusCircle,
  Edit,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Goal } from './types';

export interface GoalConfirmationModalProps {
  isOpen: boolean;
  draftState: Goal[];
  committedGoals: Goal[];
  onReturnToEditing: () => void;
  onConfirmChanges: () => void;
}

/**
 * Transactional Confirmation Modal: Provides intentional friction before committing
 * irreversible destructive modifications to the master Sankalpa state.
 */
export const GoalConfirmationModal: React.FC<GoalConfirmationModalProps> = ({
  isOpen,
  draftState,
  committedGoals,
  onReturnToEditing,
  onConfirmChanges,
}) => {
  // Dismiss with Escape key -> returns to editing
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onReturnToEditing();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onReturnToEditing]);

  if (!isOpen) return null;

  // Extract mutations
  const deletedGoals = draftState.filter((g) => g.pendingDelete);
  const addedGoals = draftState.filter((g) => g.pendingAdd && !g.pendingDelete);
  const modifiedGoals = draftState.filter(
    (g) =>
      !g.pendingDelete &&
      !g.pendingAdd &&
      committedGoals.some((c) => c.id === g.id && c.text !== g.text)
  );

  const deletionsCount = deletedGoals.length;
  const additionsCount = addedGoals.length;
  const modificationsCount = modifiedGoals.length;

  // Build the explicit summary statement
  const parts: string[] = [];
  if (deletionsCount > 0) {
    parts.push(
      `permanently delete ${deletionsCount} ${
        deletionsCount === 1 ? 'goal' : 'goals'
      }`
    );
  }
  if (additionsCount > 0) {
    parts.push(
      `add ${additionsCount} new ${additionsCount === 1 ? 'goal' : 'goals'}`
    );
  }
  if (modificationsCount > 0) {
    parts.push(
      `update ${modificationsCount} existing ${
        modificationsCount === 1 ? 'goal' : 'goals'
      }`
    );
  }

  const summaryMessage =
    parts.length > 0
      ? `You are about to ${parts.join(' and ')}.`
      : 'You are about to commit your updated Sankalpa intentions.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-200">
      {/* Dark backdrop overlay dismiss */}
      <div
        className="absolute inset-0"
        onClick={onReturnToEditing}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative z-10 w-full max-w-md bg-parchment rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Intentional Friction Alert Icon */}
        <div className="flex items-start gap-3 pb-3 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-terracotta flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h2
              id="confirm-modal-title"
              className="font-serif text-base font-bold text-charcoal tracking-wide"
            >
              Confirm Intention Changes
            </h2>
            <p className="text-[11px] text-charcoal/60 leading-relaxed mt-0.5">
              Intentional verification required to prevent accidental data loss.
            </p>
          </div>
        </div>

        {/* Explicit Change Summary Statement */}
        <div className="p-3.5 bg-white/90 border border-[#E2E8F0] rounded-xl space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
            <ShieldAlert className="w-4 h-4 text-terracotta flex-shrink-0" />
            <span>Summary of Changes:</span>
          </div>
          <p className="text-sm font-medium text-charcoal leading-snug">
            {summaryMessage}
          </p>
        </div>

        {/* Detailed Visual Breakdown of Mutations */}
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
          {/* Deletions Breakdown */}
          {deletedGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-2.5 rounded-lg bg-red-50/80 border border-red-200 flex items-start gap-2 text-xs"
            >
              <MinusCircle className="w-4 h-4 text-red-800 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider block">
                  To Be Deleted ({goal.type})
                </span>
                <p className="line-through text-red-900/80 font-medium truncate">
                  {goal.text}
                </p>
              </div>
            </div>
          ))}

          {/* Additions Breakdown */}
          {addedGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 flex items-start gap-2 text-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  New Goal ({goal.type})
                </span>
                <p className="font-bold text-emerald-950 truncate">
                  {goal.text}
                </p>
              </div>
            </div>
          ))}

          {/* Modifications Breakdown */}
          {modifiedGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-200 flex items-start gap-2 text-xs"
            >
              <Edit className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider block">
                  Updated Goal ({goal.type})
                </span>
                <p className="font-medium text-charcoal truncate">{goal.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two Explicit Buttons: Return to Editing & Confirm Changes */}
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row items-center gap-2">
          {/* Button 1: Return to Editing */}
          <button
            type="button"
            onClick={onReturnToEditing}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span>Return to Editing</span>
          </button>

          {/* Button 2: Confirm Changes */}
          <button
            type="button"
            onClick={onConfirmChanges}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Confirm Changes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalConfirmationModal;
