import { GunaType } from './primitives';

/**
 * Triggers initiating compulsive digital/behavioral loops.
 * Strictly 5 core situational triggers rooted in modern student psychology.
 */
export type TriggerCategory =
  | 'Doomscrolling'
  | 'Academic Anxiety / Professional Workload'
  | 'Academic Anxiety'
  | 'Social Comparison'
  | 'Lethargy'
  | 'Cheap Dopamine / Junk Stimulation';

/**
 * The 7-step psychological descent cascade described in Bhagavad Gita 2.62-63:
 * Dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate |
 * saṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate ||
 * krodhād bhavati sammohaḥ sammohāt smṛti-vibhramaḥ |
 * smṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati ||
 */
export type CascadeStage =
  | 'Dhyana'
  | 'Sanga'
  | 'Kama'
  | 'Krodha'
  | 'Sammoha'
  | 'Smriti_vibhrama'
  | 'Buddhi_nasha'
  | 'Dhyana_Dwelling'
  | 'Sanga_Attachment'
  | 'Kama_Craving'
  | 'Krodha_Agitation'
  | 'Sammoha_Delusion'
  | 'SmritiVibhrama_MemoryLoss'
  | 'BuddhiNasha_IntellectLoss';

/**
 * Structural metadata and pedagogical info for each step of the Gita 2.62-63 cascade.
 */
export interface CascadeStepInfo {
  /** Machine-readable stage identifier */
  stage: CascadeStage;
  /** Transliterated Sanskrit term (e.g., 'Dhyāna', 'Saṅga') */
  sanskritTerm: string;
  /** Plain English title */
  englishTitle: string;
  /** Concise psychological description */
  description: string;
  /** Whether the urge is early and easily interruptible */
  canInterceptEasily: boolean;
  /** Step order in the cascade progression (1-7) */
  stepNumber: number;
}

/**
 * Historical record of a Impulse Interceptor intervention / loop-breaking event.
 * Combines Gita 2.62-63 cascade tracking with Patanjali Yoga Sutra 2.33 (Pratipaksha Bhavana).
 */
export interface InterceptionRecord {
  /** Unique record identifier */
  id: string;

  /** ISO timestamp when the impulse interceptor was triggered */
  timestamp: string;

  /** Categorical source of the compulsive urge */
  triggerCategory: TriggerCategory;

  /** Stage along the Gita 2.62-63 cascade where intervention occurred */
  cascadeStageReached: CascadeStage;

  /** Urge intensity on a scale of 1 (subtle urge) to 5 (overwhelming compulsion) */
  urgeIntensity: number;

  /** Vitarka: The raw, unwholesome impulse or negative narrative (Yoga Sutra 2.33) */
  vitarkaText: string;

  /** Pratipaksha: The opposite wholesome cognitive reframe (Yoga Sutra 2.33) */
  pratipakshaText: string;

  /** Selected concrete micro-swap replacement (Śreyas over Preyas) */
  selectedMicroSwap: string;

  /** Concrete micro-swap replacement action (backwards compatibility alias) */
  microSwapAction?: string;

  /** Emotional/energetic state when entering the gate */
  initialGuna?: GunaType;

  /** Attained psychological state following the intervention */
  resolvedGunaState?: GunaType;

  /**
   * Tracks whether the logged interaction was a positive buffer or a resolved/unresolved negative friction.
   */
  interactionType?:
    | 'positive_buffer'
    | 'negative_friction'
    | 'resolved_negative_friction'
    | 'unresolved_negative_friction';

  /**
   * Whether the interaction or negative friction has been resolved.
   */
  isResolved?: boolean;

  /**
   * Whether the interception reframe was successfully executed.
   */
  isSuccessful?: boolean;

  /**
   * Whether the logged interaction is inherently positive.
   */
  isPositive?: boolean;
}
