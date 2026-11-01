import {
  ChariotState,
  TrayopastambhaLog,
  InterceptionRecord,
  BhavaLog,
  BhavaCardData,
} from '../types/iks';
import { calculateGateScore, isInterceptionSuccessful } from './interceptorEngine';
export { calculateGateScore, isInterceptionSuccessful } from './interceptorEngine';

/**
 * Diagnostic report matching the Katha Upanishad 1.3.3-4 Chariot Allegory:
 * - Atman (Self) = Rider
 * - Buddhi (Intellect) = Charioteer
 * - Manas (Mind) = Reins
 * - Indriyas (Senses) = Horses
 * - Vishayas (Sensory Objects) = Paths
 */
export interface ChariotStatusReport {
  composureScore: number;
  state: ChariotState;
  horsesStatus: string;
  reinsStatus: string;
  charioteerStatus: string;
  score: number;
  title: string;
  upanishadAllegory: string;
  gateScore: number;
  bhavaScore: number;
  yuktaScore: number;
}

// isInterceptionSuccessful imported from ./interceptorEngine

/**
 * Helper to determine if a Bhava Compass interaction represents a positive emotional buffer.
 */
export function isBhavaPositive(item: any): boolean {
  if (!item) return false;
  if (typeof item.isPositive === 'boolean') return item.isPositive;
  if (item.interactionType === 'positive_buffer') return true;
  if (item.type === 'positive' || item.category === 'positive') return true;
  if (
    typeof item.appreciationMessage === 'string' &&
    item.appreciationMessage.trim().length > 0
  ) {
    return true;
  }
  return false;
}

/**
 * Helper to determine if a negative Bhava Compass friction was successfully resolved.
 */
export function isBhavaNegativeResolved(item: any): boolean {
  if (!item) return false;
  if (typeof item === 'boolean') return item;
  if (typeof item.isResolved === 'boolean') return item.isResolved;
  if (typeof item.resolved === 'boolean') return item.resolved;
  if (item.interactionType === 'resolved_negative_friction') return true;
  if (item.interactionType === 'unresolved_negative_friction') return false;
  if (typeof item.success === 'boolean') return item.success;
  if (item.status === 'resolved' || item.status === 'success') return true;
  if (item.status === 'unresolved') return false;
  if (item.targetGunaShift === 'Sattva') return true;
  return false;
}

/**
 * Helper for backwards-compatibility checking whether a Bhava log is resolved.
 */
export function isBhavaResolved(item: any): boolean {
  if (!item) return false;
  if (isBhavaPositive(item)) return true;
  return isBhavaNegativeResolved(item);
}

/**
 * Calculates the Bhava Score using the Emotional Surplus (Buffer) algorithm.
 *
 * Mathematical Rules:
 * 1. If !todayBhavaLogs || todayBhavaLogs.length === 0:
 *    return 75 (Neutral Sattvic-Rajasic baseline when no Bhāva cards have been logged today).
 *
 * 2. Count totalPositives, totalNegatives, and resolvedNegatives using
 *    isBhavaPositive(item) and isBhavaNegativeResolved(item).
 *
 * Case A (totalNegatives === 0 and totalPositives > 0):
 *    Start from the neutral baseline of 75 and add the Emotional Surplus buffer (totalPositives * 20), clamped to 100:
 *    return Math.min(100, Math.round(75 + (totalPositives * 20)));
 *    (Now 1 positive card boosts BhavaScore from 75 -> 95, and 2+ positive cards reach 100!)
 *
 * Case B (totalNegatives > 0):
 *    Compute the resolution ratio: const resolutionRatio = resolvedNegatives / totalNegatives;
 *    const unresolvedCount = totalNegatives - resolvedNegatives;
 *
 *    If unresolvedCount === 0 (all encountered negative frictions have been resolved via YS 1.33):
 *      baseScore = 85; (Rewarding active emotional resolution above the passive 75 baseline, leaving room for +20 positive buffers to push it to 100).
 *
 *    If unresolvedCount > 0 (user has active, unresolved negative friction):
 *      baseScore = Math.max(10, Math.round((resolvedNegatives / totalNegatives) * 75) - (unresolvedCount * 15));
 *
 *    Add the Emotional Surplus buffer: const positiveBonus = totalPositives * 20;
 *    return Math.max(0, Math.min(100, Math.round(baseScore + positiveBonus)));
 *
 * (Encountering 1 unresolved negative drops BhavaScore to 10. Logging 1 Positive Buffer rescues it by +20 to 30.
 * Marking that negative friction as "Resolved" jumps BhavaScore to 85, and with a Positive Buffer it hits 100!)
 *
 * @param todayBhavaLogs Array of Bhava logs or card interactions from today
 * @returns BhavaScore clamped between 0 and 100
 */
export function calculateBhavaScore(
  todayBhavaLogs: (BhavaLog | BhavaCardData | any)[] = []
): number {
  if (!todayBhavaLogs || todayBhavaLogs.length === 0) {
    return 75;
  }

  let totalPositives = 0;
  let totalNegatives = 0;
  let resolvedNegatives = 0;

  for (const item of todayBhavaLogs) {
    if (isBhavaPositive(item)) {
      totalPositives += 1;
    } else {
      totalNegatives += 1;
      if (isBhavaNegativeResolved(item)) {
        resolvedNegatives += 1;
      }
    }
  }

  // Case A (totalNegatives === 0 and totalPositives > 0)
  if (totalNegatives === 0) {
    if (totalPositives > 0) {
      return Math.min(100, Math.round(75 + totalPositives * 20));
    }
    return 75;
  }

  // Case B (totalNegatives > 0)
  const resolutionRatio = resolvedNegatives / totalNegatives;
  const unresolvedCount = totalNegatives - resolvedNegatives;

  let baseScore: number;
  if (unresolvedCount === 0) {
    // All encountered negative frictions have been resolved via YS 1.33
    baseScore = 85;
  } else {
    // User has active, unresolved negative friction
    baseScore = Math.max(
      10,
      Math.round(resolutionRatio * 75) - unresolvedCount * 15
    );
  }

  const positiveBonus = totalPositives * 20;
  return Math.max(0, Math.min(100, Math.round(baseScore + positiveBonus)));
}

/**
 * Evaluates the dynamic composure and gait of the Katha Upanishad Chariot
 * using a Weighted Capacity Model where physical foundation (Yukta) anchors
 * cognitive and sensory composure.
 *
 * Mathematical Logic:
 * - Inactive Day / Reset Strict Override: If the user has logged 0 activity today across all subsystems
 *   (no sadhana log, no bhava logs, no urge interceptions), bypass the math and return
 *   special state: { state: 'Resting', score: 0 }.
 * - GateScore (0-100): Percentage of successfully intercepted urges today.
 *   If 0 triggers occurred, defaults to 100.
 * - BhavaScore (0-100): Emotional Surplus (Buffer) Algorithm:
 *   - If no logs today: returns neutral baseline 75.
 *   - If only positive buffers logged: Math.min(100, 75 + (totalPositives * 20)).
 *   - If negative frictions logged: unresolved friction drops baseScore to Math.max(10, (ratio * 75) - (unresolved * 15)),
 *     resolving all negatives restores base to 85, and positive buffers add +20 each.
 * - Final Composure Formula:
 *   - If only Bhāva Compass logged today: composureScore = BhavaScore (preventing 80% placeholder lock).
 *   - Otherwise: composureScore = Math.round((todayYuktaScore * 0.50) + (GateScore * 0.30) + (BhavaScore * 0.20)).
 *
 * Thresholds for Logged Days:
 * - composureScore > 75        => 'Calm'
 * - 40 <= composureScore <= 75 => 'Brisk'
 * - composureScore < 40        => 'Galloping'
 */
export function calculateChariotStatus(
  todayYuktaScore: number,
  todayInterceptions?: InterceptionRecord[],
  todayBhavaLogs?: (BhavaLog | BhavaCardData | any)[],
  hasTodayLogs?: boolean
): ChariotStatusReport;
export function calculateChariotStatus(
  todayLog: TrayopastambhaLog | TrayopastambhaLog[] | undefined | null,
  todayInterceptions?: InterceptionRecord[],
  todayBhavaLogs?: (BhavaLog | BhavaCardData | any)[]
): ChariotStatusReport;
export function calculateChariotStatus(
  todayYuktaScoreOrLog: number | TrayopastambhaLog | TrayopastambhaLog[] | undefined | null,
  todayInterceptions: InterceptionRecord[] = [],
  todayBhavaLogs: (BhavaLog | BhavaCardData | any)[] = [],
  hasTodayLogs?: boolean
): ChariotStatusReport {
  // ================= 1. INACTIVE DAY OVERRIDE =================
  // Inside calculateChariotStatus, at the very beginning of the function,
  // evaluate if the user has engaged today at all across any subsystem.
  // Helper to determine if a TrayopastambhaLog has at least one active pillar logged today
  const isPillarActive = (log?: TrayopastambhaLog | null): boolean => {
    if (!log) return false;
    if (!log.loggedPillars) {
      // Legacy logs without loggedPillars: active if date or yuktaScore exists
      return Boolean(log.date || typeof log.yuktaScore === 'number');
    }
    return Boolean(
      log.loggedPillars.ahara ||
      log.loggedPillars.nidra ||
      log.loggedPillars.brahmacharya
    );
  };

  const todaySadhana =
    todayYuktaScoreOrLog !== undefined && todayYuktaScoreOrLog !== null
      ? typeof todayYuktaScoreOrLog === 'number'
        ? hasTodayLogs !== undefined
          ? hasTodayLogs
          : todayYuktaScoreOrLog > 0
        : Array.isArray(todayYuktaScoreOrLog)
        ? todayYuktaScoreOrLog.some((l) => isPillarActive(l))
        : isPillarActive(todayYuktaScoreOrLog as TrayopastambhaLog)
      : false;

  const todayBhavas = todayBhavaLogs;

  const hasNoActivityToday =
    !todaySadhana &&
    (!todayBhavas || todayBhavas.length === 0) &&
    (!todayInterceptions || todayInterceptions.length === 0);

  // If hasNoActivityToday is true, immediately return { state: 'Resting', score: 0 }
  // Do not proceed to the mathematical calculations.
  if (hasNoActivityToday) {
    return {
      composureScore: 0,
      state: 'Resting',
      horsesStatus: 'Calm and stabled in pasture; the senses await the morning wake-up.',
      reinsStatus: 'Draped gently without tension; mental activity has not yet engaged the day.',
      charioteerStatus:
        'The charioteer (Buddhi) rests in tranquil stillness, awaiting your morning reflection.',
      score: 0,
      title: 'Resting (Dawn Stillness)',
      upanishadAllegory:
        'Katha Upanishad 1.3.3: "Know the Self as the rider in the chariot, the body as the chariot, the intellect as the charioteer, and the mind as the reins."',
      gateScore: 0,
      bhavaScore: 0,
      yuktaScore: 0,
    };
  }

  // ================= 2. DATA RESOLUTION =================
  let rawYuktaScore = 75;
  if (typeof todayYuktaScoreOrLog === 'number') {
    rawYuktaScore = todayYuktaScoreOrLog;
  } else if (Array.isArray(todayYuktaScoreOrLog) && todayYuktaScoreOrLog.length > 0) {
    const latest = todayYuktaScoreOrLog[todayYuktaScoreOrLog.length - 1];
    rawYuktaScore = latest?.yuktaScore ?? 75;
  } else if (todayYuktaScoreOrLog && typeof (todayYuktaScoreOrLog as TrayopastambhaLog).yuktaScore === 'number') {
    rawYuktaScore = (todayYuktaScoreOrLog as TrayopastambhaLog).yuktaScore;
  }
  const todayYuktaScore = Math.max(0, Math.min(100, Math.round(rawYuktaScore)));

  // GateScore: Pratipaksha Resilience Quotient (PRQ)
  const GateScore = calculateGateScore(todayInterceptions || []);

  // BhavaScore: Emotional Surplus (Buffer) algorithm
  const BhavaScore = calculateBhavaScore(todayBhavaLogs);

  // ================= 3. WEIGHTED CAPACITY MODEL =================
  let composureScore: number;
  if (
    !todaySadhana &&
    (!todayInterceptions || todayInterceptions.length === 0) &&
    todayBhavaLogs &&
    todayBhavaLogs.length > 0
  ) {
    // When a user logs only a Bhāva Compass interaction before logging Sadhana or Pause Gate,
    // prevent hardcoded placeholder Yukta = 75 and GateScore = 100 from locking 80% of the score.
    // Composure directly reflects the user's active emotional state.
    composureScore = BhavaScore;
  } else {
    composureScore = Math.round(
      todayYuktaScore * 0.5 + GateScore * 0.3 + BhavaScore * 0.2
    );
  }

  // ================= 4. STATE THRESHOLDS =================
  let state: ChariotState;
  if (composureScore > 75) {
    state = 'Calm';
  } else if (composureScore >= 40) {
    state = 'Brisk';
  } else {
    state = 'Galloping';
  }

  // ================= 5. PHILOSOPHICAL STATUS REASONING =================
  let charioteerStatus: string;
  let reinsStatus: string;
  let horsesStatus: string;

  if (state === 'Calm') {
    if (todayYuktaScore >= 80) {
      charioteerStatus =
        'Luminous and poised in Sattva; the intellect (Buddhi) directs the chariot with effortless clarity, firmly anchored in physiological equilibrium.';
    } else {
      charioteerStatus =
        'Vigilant and composed; the intellect holds noble discernment despite moderate physical depletion.';
    }

    reinsStatus =
      GateScore >= 80
        ? 'Supple, centered, and responsive; mental impulses (Manas) are guided without strain.'
        : 'Steady but monitored; mental focus holds the course.';

    horsesStatus =
      todayInterceptions.length === 0
        ? 'Gentle and content in pasture; no sensory distractions have unseated the senses today.'
        : 'Rhythmic, subdued, and noble; senses follow the chariot without bolting after cheap dopamine.';
  } else if (state === 'Brisk') {
    if (todayYuktaScore < 50 && GateScore >= 70) {
      charioteerStatus =
        'The charioteer is physically fatigued from depleted sleep or nutrition, but is pulling the reins hard to steer through turbulence.';
    } else if (GateScore < 50) {
      charioteerStatus =
        'The intellect is actively negotiating multiple sensory surges, striving to separate fleeting Preyas from enduring Śreyas.';
    } else {
      charioteerStatus =
        'Vigilant and engaged; active discriminative intelligence steers purposeful movement through heavy academic demands.';
    }

    reinsStatus =
      GateScore >= 70
        ? 'Taut and held firm; deliberate Pratipaksha Bhavana prevents runaway impulsive loops.'
        : 'Strained by fluctuating impulses; the mind requires conscious reinforcement to stabilize.';

    horsesStatus =
      todayYuktaScore < 50
        ? 'Restless from physiological depletion; irregular circadian rhythm makes the senses skittish and prone to sudden cravings.'
        : 'High energetic drive; forward sensory momentum is spirited but contained under active steering.';
  } else {
    // Galloping (< 40)
    if (todayYuktaScore < 40) {
      charioteerStatus =
        'The physical foundation (Yukta) is severely depleted, leaving the charioteer (Buddhi) weakened as runaway impulses overpower conscious discernment.';
    } else {
      charioteerStatus =
        'Clouded discernment; the intellect has momentarily dropped the reins and must reassert conscious command via the Impulse Interceptor.';
    }

    reinsStatus =
      'Slackened and vibrating with tension; the reactive mind struggles to contain recurring compulsive loops.';

    horsesStatus =
      'Unruly and bolting; the senses are dragging the chariot toward digital dopamine and sensory agitation.';
  }

  const titles: Record<ChariotState, string> = {
    Resting: 'Resting (Dawn Stillness)',
    Calm: 'Serene Poise (Sattvic Mastery)',
    Brisk: 'Dynamic Engagement (Active Steering)',
    Galloping: 'Unchecked Impulse (Galloping Senses)',
    Gallop: 'Unchecked Impulse (Galloping Senses)',
  };

  const allegories: Record<ChariotState, string> = {
    Resting:
      'Katha Upanishad 1.3.3: "Know the Self as the rider in the chariot, the body as the chariot, the intellect as the charioteer, and the mind as the reins."',
    Calm:
      'Katha Upanishad 1.3.6: "He whose mind is collected and whose intellect is discriminating—his senses are subdued like well-trained horses under a noble charioteer."',
    Brisk:
      'Katha Upanishad 1.3.3: "Know the Self as the rider in the chariot, the body as the chariot, the intellect as the charioteer, and the mind as the reins."',
    Galloping:
      'Katha Upanishad 1.3.5: "He whose mind is uncollected and whose intellect lacks discrimination—his senses are unruly like vicious horses for a charioteer."',
    Gallop:
      'Katha Upanishad 1.3.5: "He whose mind is uncollected and whose intellect lacks discrimination—his senses are unruly like vicious horses for a charioteer."',
  };

  return {
    composureScore,
    state,
    horsesStatus,
    reinsStatus,
    charioteerStatus,
    score: composureScore,
    title: titles[state],
    upanishadAllegory: allegories[state],
    gateScore: GateScore,
    bhavaScore: BhavaScore,
    yuktaScore: todayYuktaScore,
  };
}
