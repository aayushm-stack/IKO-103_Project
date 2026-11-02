import { GunaType, DoshaType } from './primitives';

/**
 * Common emotional challenges triggering interpersonal conflict or internal turmoil,
 * addressed via Patanjali's Chitta Prasadanam framework (Yoga Sutra 1.33).
 */
export type BhavaEmotion =
  | 'Peer_Envy'
  | 'Other_Suffering'
  | 'Shared_Success'
  | 'Toxic_Hostility'
  | 'Imposter_Syndrome'
  | 'Academic_Burnout'
  | 'Toxic_Partner'
  | 'Imposter Syndrome / Feeling Left Out'
  | 'Academic Burnout seeing others succeed effortlessly'
  | 'Dealing with a toxic project partner';

/**
 * The four tranquilizing mental attitudes (Chitta Prasadanam - Yoga Sutra 1.33):
 * - `Maitri`: Friendliness toward the happy/prosperous (sukha).
 * - `Karuna`: Compassion toward the suffering/unhappy (duhkha).
 * - `Mudita`: Sympathetic delight/joy in virtue and merit (punya).
 * - `Upeksha`: Equanimity, non-reactivity, and neutrality toward the harmful/unvirtuous (apunya).
 */
export type BhavaAttitude =
  | 'Maitri_Friendliness'
  | 'Karuna_Compassion'
  | 'Mudita_SympatheticJoy'
  | 'Upeksha_Equanimity';

/**
 * Counter-attitude prescription mapping an emotional trigger to an intentional mental stance.
 */
export interface BhavaPrescription {
  /** The incoming disruptive emotional trigger */
  emotion: BhavaEmotion;
  /** Prescribed counter-attitude from Yoga Sutra 1.33 */
  recommendedAttitude: BhavaAttitude;
  /** Supporting Sanskrit sutra or shloka citation */
  sanskritSutra: string;
  /** Reflective prompt for cognitive reappraisal */
  cognitivePrompt: string;
  /** Immediate behavioral step or response */
  actionableStep: string;
  /** Desired qualitative shift in mental state */
  targetGunaShift: GunaType;
}

/**
 * Feature keys corresponding to BrahmaPath core functional modules linked to Shastra Lens citations.
 */
export type ShastraFeatureKey =
  | 'trayopastambha'
  | 'interceptor'
  | 'breathing'
  | 'chitta_prasadanam'
  | 'gunas'
  | 'chariot'
  | 'brahmacharya'
  | 'cascade'
  | 'pratipaksha'
  | 'yukta'
  | 'daily_verse'
  | 'svadhyaya'
  | 'tridosha'
  | 'doshas'
  | 'diagnosis';

/**
 * Scriptural knowledge metadata linking application features directly to authoritative Indian Knowledge Systems texts.
 */
export interface ShastraLensData {
  /** Unique citation identifier */
  id: string;
  /** Associated feature in BrahmaPath */
  featureKey: ShastraFeatureKey;
  /** Original Sanskrit verse/sutra in Devanagari script */
  sanskritVerse: string;
  /** Standard academic IAST transliteration */
  transliteration: string;
  /** Canonical source text (e.g., 'Bhagavad Gita', 'Yoga Sutras', 'Charaka Samhita') */
  sourceText: string;
  /** Specific chapter/verse citation (e.g., 'Gita 2.62-63', 'YS 1.33') */
  commentaryReference: string;
  /** Literal translation/meaning of the passage */
  literalMeaning: string;
  /** Psychological and behavioral application for modern habit regulation */
  practicalModernApplication: string;
}

/**
 * User profile and behavioral preferences persisted in local storage.
 */
export interface UserPreferences {
  /** User preferred name or spiritual title */
  name?: string;
  /** One-line personal Sankalpa (guiding purpose and intention) */
  sankalpa: string;
  /** Selected battleground path: civilian Seeker vs. defense Sentinel */
  battlegroundPath?: 'inner' | 'frontline';
  /** User's baseline Guna constitution */
  baselineGuna: GunaType;
  /** User's dominant Dosha constitution */
  dominantDosha: DoshaType;
  /** List of personalized micro-swap habits (e.g., sip water, deep breathing, quick walk) */
  preferredMicroSwaps: string[];
  /** Selected Shreyas Micro-Swap IDs for customizable Pause Gate options */
  selectedMicroSwapIds: string[];
  /** Whether daily Smriti notifications are enabled */
  notificationsEnabled?: boolean;
  /** Custom micro swap ids fallback */
  customMicroSwaps?: string[];
  /** Whether the user has completed the initial onboarding setup */
  onboardingCompleted: boolean;
  /** ISO calendar date when user profile was created (YYYY-MM-DD) */
  accountCreationDate?: string;
  /** User's self-reported honest daily average screen time in hours */
  averageScreenTimeHours?: number;
}
