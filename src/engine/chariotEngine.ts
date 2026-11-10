import {
  ChariotState,
  TrayopastambhaLog,
  InterceptionRecord,
  BhavaLog,
  BhavaCardData,
} from '../types/iks';
import {
  calculateGateScore,
  isInterceptionSuccessful,
  calculateInterceptionStats,
  InterceptionStats,
} from './interceptorEngine';
import {
  calculateBhavaScore,
  calculateBhavaStats,
  isBhavaPositive,
  isBhavaNegativeResolved,
} from './bhavaEngine';

export {
  calculateGateScore,
  isInterceptionSuccessful,
  calculateInterceptionStats,
  calculateBhavaScore,
  calculateBhavaStats,
  isBhavaPositive,
  isBhavaNegativeResolved,
};
export type { InterceptionStats };

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
  interceptionStats?: InterceptionStats;
  loggedPillarCount?: number;
  hasActivityToday?: boolean;
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
 * Evaluates the dynamic composure and gait of the Katha Upanishad Chariot.
 *
 * Rules:
 * 1. Count Logged Sadhana Pillars Today (loggedPillarCount: 0 to 3).
 * 2. Dynamic Composure Calculation (Solving the Unlogged Interceptor Bug):
 *    - If interceptorActive === false (Nothing logged in Interceptor today):
 *      composureScore = Math.round(0.65 * yuktaScore + 0.35 * bhavaScore);
 *    - If interceptorActive === true (User logged Interceptions or Slips today):
 *      composureScore = Math.round(0.50 * yuktaScore + 0.25 * prqScore + 0.25 * bhavaScore);
 * 3. Progressive Chariot Gait & Color Thresholds:
 *    - 'Resting': Nothing logged across entire app today (loggedPillarCount === 0 && !interceptorActive && !hasBhavaActivityToday),
 *      OR (dominantGuna === 'Tamas' && composureScore < 42).
 *    - 'Galloping': composureScore < 50, OR (loggedPillarCount === 1 && composureScore < 58).
 *    - 'Brisk': composureScore >= 50 and does not meet all criteria for Calm.
 *    - 'Calm': Requires ALL THREE: composureScore >= 75 AND loggedPillarCount >= 2 AND unresolvedNegativeBhavaCount === 0.
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
  // 1. Data & Pillar Resolution
  let loggedPillarCount = 0;
  let dominantGuna: string | undefined = undefined;
  let rawYuktaScore = 0;
  let todayLogObj: TrayopastambhaLog | null = null;

  if (typeof todayYuktaScoreOrLog === 'number') {
    rawYuktaScore = todayYuktaScoreOrLog;
    if (hasTodayLogs) {
      loggedPillarCount = rawYuktaScore > 0 ? 3 : 0;
    }
  } else if (todayYuktaScoreOrLog) {
    if (Array.isArray(todayYuktaScoreOrLog)) {
      todayLogObj = todayYuktaScoreOrLog[todayYuktaScoreOrLog.length - 1] ?? null;
    } else {
      todayLogObj = todayYuktaScoreOrLog;
    }

    if (todayLogObj) {
      rawYuktaScore = typeof todayLogObj.yuktaScore === 'number' ? todayLogObj.yuktaScore : 0;
      dominantGuna = todayLogObj.brahmacharya?.dominantGuna;
      if (todayLogObj.loggedPillars) {
        if (todayLogObj.loggedPillars.ahara) loggedPillarCount++;
        if (todayLogObj.loggedPillars.nidra) loggedPillarCount++;
        if (todayLogObj.loggedPillars.brahmacharya) loggedPillarCount++;
      } else {
        if (todayLogObj.yuktaScore > 0 || todayLogObj.date) {
          loggedPillarCount = 3;
        }
      }
    }
  }
  const yuktaScore = Math.max(0, Math.min(100, Math.round(rawYuktaScore)));

  // 2. Interceptor & Bhāva Evaluation
  const interceptionStats = calculateInterceptionStats(todayInterceptions || []);
  const interceptorActive = interceptionStats.hasActivityToday;
  const prqScore = interceptionStats.prqScore;

  const bhavaStats = calculateBhavaStats(todayBhavaLogs || []);
  const bhavaScore = bhavaStats.score;
  const hasBhavaActivityToday = bhavaStats.hasBhavaActivityToday;
  const unresolvedNegativeBhavaCount = bhavaStats.unresolvedCount;

  const hasAppActivityToday =
    loggedPillarCount > 0 || interceptorActive || hasBhavaActivityToday;

  // 3. Dynamic Composure Calculation
  let composureScore = 0;
  if (!hasAppActivityToday) {
    composureScore = 0;
  } else if (!interceptorActive) {
    // Interceptor on standby: weight only Sadhana (65%) + Bhāva (35%)
    composureScore = Math.round(0.65 * yuktaScore + 0.35 * bhavaScore);
  } else {
    // Interceptor active: 50% Sadhana + 25% Interceptor + 25% Bhāva
    composureScore = Math.round(
      0.50 * yuktaScore + 0.25 * prqScore + 0.25 * bhavaScore
    );
  }
  composureScore = Math.max(0, Math.min(100, composureScore));

  // 4. Progressive Gait & State Thresholds
  const isResting =
    !hasAppActivityToday || (dominantGuna === 'Tamas' && composureScore < 42);

  const isCalm =
    composureScore >= 75 &&
    loggedPillarCount >= 2 &&
    unresolvedNegativeBhavaCount === 0;

  const isGalloping =
    composureScore < 50 || (loggedPillarCount === 1 && composureScore < 58);

  let state: ChariotState;
  if (isResting) {
    state = 'Resting';
  } else if (isCalm) {
    state = 'Calm';
  } else if (isGalloping) {
    state = 'Galloping';
  } else {
    state = 'Brisk';
  }

  // If completely inactive today, override composureScore to 0 for pristine resting view
  if (!hasAppActivityToday) {
    composureScore = 0;
  }

  // 5. Philosophical Status Reasoning
  let charioteerStatus: string;
  let reinsStatus: string;
  let horsesStatus: string;

  if (state === 'Resting') {
    charioteerStatus =
      'The charioteer (Buddhi) rests in tranquil stillness, awaiting your morning reflection.';
    reinsStatus =
      'Draped gently without tension; mental activity has not yet engaged the day.';
    horsesStatus =
      'Calm and stabled in pasture; the senses await the morning wake-up.';
  } else if (state === 'Calm') {
    if (yuktaScore >= 80) {
      charioteerStatus =
        'Luminous and poised in Sattva; the intellect (Buddhi) directs the chariot with effortless clarity, firmly anchored in physiological equilibrium.';
    } else {
      charioteerStatus =
        'Vigilant and composed; the intellect holds noble discernment despite moderate physical depletion.';
    }

    reinsStatus =
      interceptorActive && prqScore >= 80
        ? 'Supple, centered, and responsive; mental impulses (Manas) are guided without strain.'
        : 'Steady and responsive; mental focus holds the course without agitation.';

    horsesStatus =
      !interceptorActive || interceptionStats.interceptedCount === 0
        ? 'Gentle and content in pasture; no sensory distractions have unseated the senses today.'
        : 'Rhythmic, subdued, and noble; senses follow the chariot without bolting after cheap dopamine.';
  } else if (state === 'Brisk') {
    if (yuktaScore < 50 && (!interceptorActive || prqScore >= 70)) {
      charioteerStatus =
        'The charioteer is physically fatigued from depleted sleep or nutrition, but is pulling the reins hard to steer through turbulence.';
    } else if (interceptorActive && prqScore < 50) {
      charioteerStatus =
        'The intellect is actively negotiating multiple sensory surges, striving to separate fleeting Preyas from enduring Śreyas.';
    } else {
      charioteerStatus =
        'Vigilant and engaged; active discriminative intelligence steers purposeful movement through heavy academic demands.';
    }

    reinsStatus =
      interceptorActive && prqScore >= 70
        ? 'Taut and held firm; deliberate Pratipaksha Bhavana prevents runaway impulsive loops.'
        : 'Strained by fluctuating impulses; the mind requires conscious reinforcement to stabilize.';

    horsesStatus =
      yuktaScore < 50
        ? 'Restless from physiological depletion; irregular circadian rhythm makes the senses skittish and prone to sudden cravings.'
        : 'High energetic drive; forward sensory momentum is spirited but contained under active steering.';
  } else {
    // Galloping (< 50 or incomplete foundation)
    if (yuktaScore < 40) {
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
    gateScore: prqScore,
    bhavaScore,
    yuktaScore,
    interceptionStats,
    loggedPillarCount,
    hasActivityToday: hasAppActivityToday,
  };
}

/** Export evaluateChariotState alias */
export const evaluateChariotState = calculateChariotStatus;
