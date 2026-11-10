import React, { useState, useRef, useEffect } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import {
  Target,
  Flame,
  HelpCircle,
  Edit3,
  Check,
  X,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { ShastraFeatureKey } from '../../types/shastra';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from '../../engine/storage/localStore';
import { sendGoalMutations } from '../../services/goalApi';
import { ShortTermListContainer } from './ShortTermListContainer';
import { LongTermListContainer } from './LongTermListContainer';
import { GoalConfirmationModal } from './GoalConfirmationModal';
import { Goal } from './types';

export interface SankalpaHubProps {
  className?: string;
  onOpenShastraLens?: (key: ShastraFeatureKey | 'chariot' | 'brahmacharya' | 'yukta' | 'sankalpa') => void;
}

/**
 * Authentic default Vedic Sankalpa goals initialized as an empty collection
 * to ensure 100% personalization from day one.
 */
export const INITIAL_COMMITTED_GOALS: Goal[] = [];

/**
 * SankalpaHub: Dedicated viewport for the Vedic Goal Manager module.
 * Implements strict data models and mutation handlers for draft state with
 * W3C WCAG 2.2 Level AA accessibility compliance and transactional confirmation modal.
 */
export const SankalpaHub: React.FC<SankalpaHubProps> = ({
  className = '',
  onOpenShastraLens,
}) => {
  // Subscribe to global userName state
  const { userName } = useAccount();
  const { openShastraLens } = useBrahmaPath();
  const handleOpenLens = onOpenShastraLens ?? openShastraLens;

  // 1. Master database-backed committed goals array
  const [committedGoals, setCommittedGoals] = useState<Goal[]>(() =>
    getLocalItem<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_COMMITTED_GOALS)
  );

  // Sync committedGoals if localStorage changes (e.g. global reset)
  useEffect(() => {
    const handleStorageChange = () => {
      setCommittedGoals(getLocalItem<Goal[]>(STORAGE_KEYS.GOALS, []));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2. Boolean state for read-only vs inline editing (default false)
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 3. Local draft state array for inline batch mutations
  const [draftState, setDraftState] = useState<Goal[]>([]);

  // 4. Transactional confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  // 5. In-button save feedback state (shows on "Edit List" button for 2-3s then fades)
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local state for the "Add Goal" form
  const [newGoalText, setNewGoalText] = useState<string>('');
  const [newGoalType, setNewGoalType] = useState<'SHORT_TERM' | 'LONG_TERM'>('SHORT_TERM');
  const [formError, setFormError] = useState<string>('');

  // Clear feedback timeout on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  // Intercept button click: If editing, open confirmation modal; else enter editing mode
  const handleToggleEdit = () => {
    if (!isEditing) {
      // Enter Edit Mode: Deep clone committedGoals into local draftState
      setDraftState(committedGoals.map((g) => ({ ...g })));
      setIsEditing(true);
    } else {
      // Intercept submit action with intentional friction: Open Confirmation Modal
      setIsConfirmModalOpen(true);
    }
  };

  // Confirmation Modal Action 1: Return to Editing (perfectly preserves draftState)
  const handleReturnToEditing = () => {
    setIsConfirmModalOpen(false);
  };

  // Confirmation Modal Action 2: Confirm Changes
  // Extracts mutations, dispatches DELETE and POST payloads, optimistic update, flips isEditing false, triggers toast
  const handleConfirmChanges = async () => {
    // 1. Extract mutations from draftState
    const deleteIds = draftState.filter((g) => g.pendingDelete).map((g) => g.id);
    const addedGoals = draftState
      .filter((g) => g.pendingAdd && !g.pendingDelete && g.text.trim().length > 0)
      .map((g) => ({ id: g.id, text: g.text.trim(), type: g.type }));
    const updatedGoals = draftState
      .filter(
        (g) =>
          !g.pendingDelete &&
          !g.pendingAdd &&
          g.text.trim().length > 0 &&
          committedGoals.some((c) => c.id === g.id && c.text !== g.text.trim())
      )
      .map((g) => ({ id: g.id, text: g.text.trim(), type: g.type }));

    // 2. Dispatch DELETE and POST payloads to backend
    sendGoalMutations({ deleteIds, addedGoals, updatedGoals });

    // 3. Immediately apply optimistic update: overwrite master committedGoals with sanitized draftState
    const finalizedGoals: Goal[] = draftState
      .filter((g) => !g.pendingDelete && g.text.trim().length > 0)
      .map((g) => ({
        id: g.id,
        text: g.text.trim(),
        type: g.type,
      }));

    setCommittedGoals(finalizedGoals);
    setLocalItem(STORAGE_KEYS.GOALS, finalizedGoals);

    // 4. Flip isEditing to false, close modal, and reset draft inputs
    setIsEditing(false);
    setIsConfirmModalOpen(false);
    setDraftState([]);
    setNewGoalText('');
    setFormError('');

    // 5. Trigger in-button success state on "Edit List" button for 3 seconds
    setIsSavedFeedback(true);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => {
      setIsSavedFeedback(false);
    }, 3000);
  };

  // Discard draft edits entirely
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsConfirmModalOpen(false);
    setDraftState([]);
    setNewGoalText('');
    setFormError('');
  };

  // Mutation Handler: Toggle pendingDelete on goal object
  const handleTogglePendingDelete = (id: string) => {
    setDraftState((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, pendingDelete: !g.pendingDelete } : g
      )
    );
  };

  // Mutation Handler: Update draft goal text
  const handleUpdateGoalText = (id: string, text: string) => {
    setDraftState((prev) =>
      prev.map((g) => (g.id === id ? { ...g, text } : g))
    );
  };

  // Mutation Handler: Submit "Add Goal" form (visible only when isEditing is true)
  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newGoalText.trim();
    if (!trimmed) {
      setFormError('Please enter a specific, present-tense resolve.');
      return;
    }

    const newGoal: Goal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: trimmed,
      type: newGoalType,
      pendingAdd: true,
    };

    setDraftState((prev) => [...prev, newGoal]);
    setNewGoalText('');
    setFormError('');
  };

  const displayName = userName && userName.trim() ? userName.trim() : 'Sadhaka';

  // Active goals list depends on editing mode
  const activeGoals = isEditing ? draftState : committedGoals;
  const shortTermGoals = activeGoals.filter((g) => g.type === 'SHORT_TERM');
  const longTermGoals = activeGoals.filter((g) => g.type === 'LONG_TERM');

  // Count pending batch operations
  const pendingDeletionsCount = draftState.filter((g) => g.pendingDelete).length;
  const pendingAdditionsCount = draftState.filter((g) => g.pendingAdd).length;

  return (
    <div
      style={{
        backgroundColor: '#FDFBF7',
        color: '#1E293B',
      }}
      className={`w-full min-h-full pb-16 space-y-5 relative ${className}`}
    >
      {/* ================= TOP VIEWPORT HEADER ================= */}
      <header className="space-y-3">
        {/* Dynamic Greeting directly subscribing to global userName */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal tracking-tight">
              Hello, {displayName}!
            </h1>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Welcome to your sacred intention space.
            </p>
          </div>

          <div
            aria-label="Sankalpa Flame"
            className="w-10 h-10 rounded-2xl bg-orange-100/70 text-terracotta border border-orange-200/80 flex items-center justify-center shadow-xs"
          >
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Vedic Sankalpa Philosophical Anchor Card */}
        <div className="p-4 rounded-2xl bg-white/80 border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-terracotta bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/50">
              <Target className="w-3 h-3" />
              <span>Vedic Sankalpa</span>
            </span>

            {handleOpenLens && (
              <ShastraLensButton
                onClick={() => handleOpenLens('sankalpa')}
              />
            )}
          </div>

          <p className="font-serif italic text-xs text-charcoal/80 leading-relaxed">
            “A Sankalpa is not a distant wish—it is a specific, present-tense resolve formulated by the intellect (Buddhi) to consciously steer the chariot of your mind.”
          </p>
        </div>
      </header>

      {/* Inline Editing Feedback & Batch Summary Banner */}
      {isEditing && (
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Inline Batch-Editing Active
            </span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-[11px] font-semibold text-charcoal/60 hover:text-charcoal px-2 py-0.5 rounded hover:bg-black/5 transition cursor-pointer"
            >
              Discard Changes
            </button>
          </div>
          <p className="text-xs text-charcoal/80 leading-relaxed">
            Spatial context preserved across both timelines. Mutate or stage goals below, then click{' '}
            <strong className="text-charcoal font-semibold">Update List</strong> to commit.
          </p>
          {(pendingDeletionsCount > 0 || pendingAdditionsCount > 0) && (
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              {pendingDeletionsCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded border border-red-300">
                  {pendingDeletionsCount} marked for deletion
                </span>
              )}
              {pendingAdditionsCount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded border border-emerald-300">
                  {pendingAdditionsCount} new pending
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= 1. SHORT-TERM CONTAINER (TOP OF VIEWPORT FOR F-PATTERN SCANNING) ================= */}
      <ShortTermListContainer
        goals={shortTermGoals}
        isEditing={isEditing}
        onUpdateGoalText={handleUpdateGoalText}
        onTogglePendingDelete={handleTogglePendingDelete}
      />

      {/* ================= 2. LONG-TERM CONTAINER (HORIZON GOALS) ================= */}
      <LongTermListContainer
        goals={longTermGoals}
        isEditing={isEditing}
        onUpdateGoalText={handleUpdateGoalText}
        onTogglePendingDelete={handleTogglePendingDelete}
      />

      {/* ================= ADD GOAL FORM (VISIBLE ONLY WHEN isEditing IS TRUE) ================= */}
      {isEditing && (
        <section
          aria-label="Add Goal Form"
          className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2 pb-1 border-b border-[#E2E8F0]">
            <PlusCircle className="w-4 h-4 text-emerald-800" />
            <h3 className="font-serif text-sm font-bold text-charcoal">
              Add New Sankalpa (Present-Tense Resolve)
            </h3>
          </div>

          <form onSubmit={handleAddGoalSubmit} className="space-y-3">
            {/* Timeline selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60 block">
                Timeline Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewGoalType('SHORT_TERM')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    newGoalType === 'SHORT_TERM'
                      ? 'bg-orange-50 border-terracotta text-terracotta ring-1 ring-terracotta/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Immediate (Short-Term)
                </button>
                <button
                  type="button"
                  onClick={() => setNewGoalType('LONG_TERM')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    newGoalType === 'LONG_TERM'
                      ? 'bg-emerald-50 border-sage text-sage ring-1 ring-sage/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Horizon (Long-Term)
                </button>
              </div>
            </div>

            {/* Input for present-tense text */}
            <div className="space-y-1">
              <label
                htmlFor="new-sankalpa-input"
                className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60 block"
              >
                Present-Tense Affirmation
              </label>
              <input
                id="new-sankalpa-input"
                type="text"
                value={newGoalText}
                onChange={(e) => {
                  setNewGoalText(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder={
                  newGoalType === 'SHORT_TERM'
                    ? 'e.g. I maintain deep sensory focus during morning study...'
                    : 'e.g. I embody calm mental equanimity in daily life...'
                }
                className="w-full px-3.5 py-2.5 text-sm font-medium text-charcoal bg-white rounded-xl border border-[#E2E8F0] placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition shadow-2xs"
              />
              {formError && (
                <p className="text-xs text-red-800 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formError}</span>
                </p>
              )}
            </div>

            {/* Submit button for Add Goal */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Add Goal to Draft</span>
            </button>
          </form>
        </section>
      )}

      {/* ================= INLINE BATCH EDITING ACTION BUTTON AT BOTTOM ================= */}
      <div className="pt-3 border-t border-[#E2E8F0] flex items-center gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex-1 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Discard</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleToggleEdit}
          disabled={isSavedFeedback}
          style={{
            backgroundColor: isSavedFeedback
              ? '#059669'
              : isEditing
              ? '#065F46'
              : '#D97706',
            color: '#FFFFFF',
          }}
          className={`flex-1 py-3 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-xs cursor-pointer ${
            isSavedFeedback
              ? 'bg-emerald-600'
              : isEditing
              ? 'bg-sage hover:bg-emerald-800'
              : 'bg-terracotta hover:bg-terracotta-dark'
          }`}
        >
          {isSavedFeedback ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Successfully updated the list</span>
            </>
          ) : isEditing ? (
            <>
              <Check className="w-4 h-4" />
              <span>Update List</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit List</span>
            </>
          )}
        </button>
      </div>

      {/* ================= TRANSACTIONAL CONFIRMATION MODAL ================= */}
      <GoalConfirmationModal
        isOpen={isConfirmModalOpen}
        draftState={draftState}
        committedGoals={committedGoals}
        onReturnToEditing={handleReturnToEditing}
        onConfirmChanges={handleConfirmChanges}
      />
    </div>
  );
};

export default SankalpaHub;
