/**
 * Type definitions for the Vedic Sankalpa (Goal Manager) module.
 * Grounded in the concept of Sankalpa: specific, present-tense resolve.
 */

/**
 * Strict schema for a Sankalpa Goal, supporting inline batch-editing flags.
 */
export interface Goal {
  id: string;
  text: string;
  type: 'SHORT_TERM' | 'LONG_TERM';
  /** Flag for inline batch deletion awaiting user confirmation/commit */
  pendingDelete?: boolean;
  /** Flag for inline batch addition awaiting user confirmation/commit */
  pendingAdd?: boolean;
}

export type SankalpaTimeline = 'short_term' | 'long_term';

export type SankalpaCategory =
  | 'focus'
  | 'restraint'
  | 'sleep'
  | 'equanimity'
  | 'dharma';

export interface SankalpaItem {
  id: string;
  /** Present-tense resolve statement (e.g., "I focus my attention for 90 uninterrupted minutes.") */
  statement: string;
  /** Timeline category */
  timeline: SankalpaTimeline;
  /** Associated dimension of student sadhana */
  category: SankalpaCategory;
  /** Tag or recurrence indicator (e.g., 'Daily', 'Today', 'Quarterly Vision') */
  timeframeTag: string;
  /** Completion or active status */
  completed?: boolean;
}
