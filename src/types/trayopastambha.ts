import { GunaType, DoshaType } from './primitives';

/**
 * Stage 2 Sentinel Telemetry: Operational stimulant and ration profile under watch duty.
 */
export type WatchStimulantProfile = 'balanced_ration' | 'high_watch_caffeine' | 'irregular_missed';

/**
 * Stage 2 Sentinel Telemetry: Rest protocol adapting to circadian watch shifts and duty cycles.
 */
export type WatchRestProtocol = 'continuous_bunk' | 'split_sentry_kurma' | 'post_watch_hypervigilance';

/**
 * Stage 2 Sentinel Telemetry: Peer/unit cohesion and psychological buffer state.
 */
export type SahyogCohesionState = 'sahyog_connected' | 'command_friction' | 'barracks_isolated';

/**
 * Stage 2 Sentinel Telemetry: Protocols for speech discipline and mental decompression.
 */
export type SpeechRestraintProtocol = 'mauna_hold_10m' | 'suhrda_measured_speech' | 'sahyog_buddy_debrief';

/**
 * Ahara (Nourishment & Sensory Intake - Charaka Samhita Sutrasthana 11.35, 28.3):
 * Encompasses nutritional quality as well as mental and digital sensory inputs.
 */
export interface AharaLog {
  /** Nutritional quality of food consumed */
  nutritionQuality: 'Sattvic' | 'Rajasic' | 'Tamasic';
  /** Screen and digital intake duration in minutes */
  digitalConsumptionMinutes: number;
  /** Rating of sensory mindfulness and moderation (1-5) */
  sensoryMindfulnessScore: number;
  /** Snapshot of the user's personal screen time baseline (in minutes) at the moment of logging */
  baselineMinutesAtLog?: number;
  /** Optional Sentinel Telemetry: Stimulant and ration pattern during watch duty */
  watchStimulantProfile?: WatchStimulantProfile;
}

/**
 * Nidra (Restorative Sleep - Charaka Samhita Sutrasthana 21.36):
 * The second sub-pillar of life vital for physical repair and mental equilibrium.
 */
export interface NidraLog {
  /** Total duration of sleep in hours */
  hoursSlept: number;
  /** Whether bedtime adhered to a consistent circadian schedule */
  bedtimeConsistency: boolean;
  /** Subjective restorative depth of rest */
  restQuality: 'Restorative' | 'Disturbed' | 'Lethargic';
  /** Optional Sentinel Telemetry: Watch sleep protocol adapted for sentry duty */
  watchRestProtocol?: WatchRestProtocol;
  /** Optional Sentinel Telemetry: Active decompression minutes before sleep */
  postWatchUnwindMinutes?: number;
}

/**
 * Brahmacharya (Regulation of Vital Energy & Conduct - Charaka Samhita Sutrasthana 11.35):
 * Preservation of vital force, emotional impulse management, and disciplined focus.
 */
export interface BrahmacharyaLog {
  /** Energy conservation and restraint rating (1-5) */
  energyConservationRating: number;
  /** Count of focused study or deep work intervals completed */
  focusedStudyBlocks: number;
  /** Predominant psychological quality observed during activity */
  dominantGuna: GunaType;
  /** Optional Sentinel Telemetry: Unit cohesion and psychological buffer level */
  sahyogCohesion?: SahyogCohesionState;
}

/**
 * Trayopastambha Daily Log:
 * Unified daily assessment across the three sub-pillars of health and balance (Yukta).
 */
export interface TrayopastambhaLog {
  /** Unique log identifier */
  id: string;
  /** Date of the entry in ISO YYYY-MM-DD format */
  date: string;
  /** Log for nourishment and sensory consumption */
  ahara: AharaLog;
  /** Log for sleep quality and rhythm */
  nidra: NidraLog;
  /** Log for vital energy conservation and conduct */
  brahmacharya: BrahmacharyaLog;
  /** Calculated balance score based on Gita 6.17 (0-100) */
  yuktaScore: number;
  /** Tracks which of the 3 pillars have been explicitly logged today */
  loggedPillars?: {
    ahara?: boolean;
    nidra?: boolean;
    brahmacharya?: boolean;
  };
  /** Optional daily reflection or notes */
  generalReflection?: string;
  /** Reflection window slot: morning, afternoon, or evening */
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | string;
  /** Alternative alias for reflection window slot */
  slot?: 'morning' | 'afternoon' | 'evening' | string;
  /** ISO timestamp when recorded */
  timestamp?: string;
}

/**
 * Evaluated balance summary across the pillars indicating equilibrium or deviation.
 */
export interface YuktaBalanceSummary {
  /** Aggregated balance score (0-100) */
  overallScore: number;
  /** State of balance: Yukta (balanced), Ati (hyperactive/excess), or Hina (deficient/depleted) */
  status: 'Yukta_Balanced' | 'Ati_Excess' | 'Hina_Deficit';
  /** Primary pillar showing imbalance, if any */
  limitingPillar: 'Ahara' | 'Nidra' | 'Brahmacharya' | 'None';
  /** Contextual guidance aligned with classical principles */
  recommendation: string;
  /** Biological humor vulnerable to aggravation under current state */
  aggravatedDosha: DoshaType;
}
