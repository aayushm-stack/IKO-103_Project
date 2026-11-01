/**
 * Barrel export and unified type definitions for all Indian Knowledge Systems (IKS) in BrahmaPath.
 * Rooted in Patanjali Yoga Sutras, Bhagavad Gita 2.62-63, and classical Ayurveda (Charaka Samhita).
 */

export * from './primitives';
export * from './trayopastambha';
export * from './interceptor';
export * from './shastra';
export * from '../data/microSwaps';

import { UserPreferences } from './shastra';
import { TrayopastambhaLog } from './trayopastambha';
import {
  InterceptionRecord,
  TriggerCategory,
  CascadeStage,
} from './interceptor';

export type {
  TriggerCategory,
  CascadeStage,
  InterceptionRecord,
};

/**
 * Data structure representing a Bhava Compass Card rooted in
 * Patanjali's Chitta Prasadanam framework (Yoga Sutra 1.33):
 * "maitrī-karuṇā-muditopekṣāṇāṁ sukha-duḥkha-puṇyāpuṇya-viṣayāṇāṁ bhāvanātaś citta-prasādanam"
 *
 * Cultivates the four tranquilizing mental attitudes to neutralize cognitive turbulence:
 * - Maitrī (Friendliness toward the happy / team wins / shared joy)
 * - Karuṇā (Compassion / Self-Compassion toward suffering, setbacks & imposter syndrome)
 * - Muditā (Sympathetic Joy toward virtue & dedicated peers, dissolving academic envy)
 * - Upekṣā (Equanimous Neutrality & detachment toward hostile partners & unwholesome drama)
 */
export interface BhavaCardData {
  /** Unique card identifier */
  id: string;

  /** Situational title of the life experience or cognitive friction */
  title: string;

  /** Canonical Sanskrit trait and attitude (e.g., 'Maitrī (Friendliness)', 'Muditā (Joy in Virtue)') */
  sanskritTrait: string;

  /** Indicates whether this card represents a positive wholesome buffer or a negative friction */
  isPositive: boolean;

  /**
   * For positive cards: optional appreciation message celebrating joy, connection,
   * resilience, or virtuous alignment.
   */
  appreciationMessage?: string;

  /**
   * For negative friction cards: optional explanatory text detailing the psychological
   * root and emotional turbulence the user is navigating.
   */
  explanationText?: string;

  /**
   * For negative friction cards: actionable cognitive antidotes and reflective steps
   * to resolve the friction and attain intellectual clarity (Buddhi Prasadanam).
   */
  actionSteps?: string[];

  /**
   * For negative friction cards: tracks whether the friction has been cleared.
   * @default false
   */
  isResolved?: boolean;
}

/**
 * Categorical interaction types for Bhava Compass emotional tracking.
 * Distinguishes positive emotional buffers from active or resolved negative friction.
 */
export type BhavaInteractionType =
  | 'positive_buffer'
  | 'negative_friction'
  | 'resolved_negative_friction'
  | 'unresolved_negative_friction';

/**
 * Historical record of a Bhava Compass interaction (Yoga Sutra 1.33 Chitta Prasadanam).
 * Tracks whether the logged interaction was a positive buffer (+20 point emotional surplus)
 * or a resolved/unresolved negative friction.
 */
export interface BhavaLog {
  /** Unique log entry identifier */
  id: string;

  /** ISO timestamp when the interaction was logged */
  timestamp: string;

  /** Reference to the associated BhavaCardData identifier */
  cardId?: string;

  /** Title or contextual label of the interaction */
  title: string;

  /** Sanskrit trait or attitude (Maitrī, Karuṇā, Muditā, Upekṣā) */
  sanskritTrait: string;

  /** Indicates whether the interaction was a positive buffer (true) or negative friction (false) */
  isPositive: boolean;

  /** Tracks whether the logged interaction was a positive buffer or negative friction */
  interactionType: BhavaInteractionType;

  /** For positive cards: appreciation message celebrating abundance */
  appreciationMessage?: string;

  /** For negative friction cards: explanation of the felt turbulence */
  explanationText?: string;

  /** For negative friction cards: actionable resolution steps */
  actionSteps?: string[];

  /**
   * Whether the interaction is resolved.
   * Default: false for negative friction; true for positive buffers and cleared friction.
   */
  isResolved: boolean;

  /** Optional user reflection or notes */
  notes?: string;
}

/**
 * Complete portable backup payload for local-first export/import and offline persistence.
 */
export interface BrahmaPathBackupPayload {
  /** Schema version */
  version: string;

  /** ISO timestamp of data export */
  exportedAt: string;

  /** Core user preferences and Sankalpa */
  preferences: UserPreferences;

  /** Complete historical Trayopastambha daily logs */
  sadhanaLogs: TrayopastambhaLog[];

  /** Historical Pause Gate / loop-breaking records (Gita 2.62-63 & YS 2.33) */
  interceptions: InterceptionRecord[];

  /** Historical Bhava Compass emotional interactions and reflections (YS 1.33) */
  bhavaLogs?: BhavaLog[];
}
