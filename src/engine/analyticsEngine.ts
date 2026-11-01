import {
  TrayopastambhaLog,
  InterceptionRecord,
  TriggerCategory,
  BhavaLog,
} from '../types/iks';
import { calculateGunaDistribution } from './gunaDoshaEngine';
import { computeYuktaScore } from './yuktaEngine';

/**
 * Extended log entry supporting optional time-of-day or timestamp metadata.
 */
export interface SadhanaLogInput extends Omit<Partial<TrayopastambhaLog>, 'timestamp'> {
  id?: string;
  date?: string;
  timestamp?: string | number | Date;
  createdAt?: string | number | Date;
  recordedAt?: string | number | Date;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | string;
  slot?: 'morning' | 'afternoon' | 'evening' | string;
  period?: 'morning' | 'afternoon' | 'evening' | string;
  weight?: number;
  timeWeight?: number;
  yuktaScore?: number;
  score?: number;
}

/**
 * Returns today's calendar date in local YYYY-MM-DD format (fixing late-night UTC timezone mismatch).
 */
export function getLocalTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the local date string (YYYY-MM-DD) for a given Date, timestamp, or string.
 */
export function getLocalDateString(dateInput: string | number | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return typeof dateInput === 'string' ? dateInput.slice(0, 10) : '';
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return typeof dateInput === 'string' ? dateInput.slice(0, 10) : '';
  }
}

/**
 * Data structure representing a single day in the rolling sadhana trajectory
 * (last 7 days of historical data + current day data which varies throughout the day).
 */
export interface RollingTrendPoint {
  /** ISO Date string (YYYY-MM-DD) */
  date: string;
  /** Human-readable short date for X-Axis labels (e.g., 'Oct 22') */
  displayDate: string;
  /** Consolidated or decayed Yukta equilibrium score (0-100) */
  yuktaScore: number;
  /** Hours slept on this date */
  sleepHours: number;
  /** Digital screen minutes consumed on this date */
  digitalMinutes: number;
  /** Focused study blocks completed on this date */
  focusBlocks: number;
  /** Dominant psychological Guna */
  dominantGuna: string;
  /** Whether the user actively recorded a sadhana log on this date */
  hasLogs: boolean;
  /** Whether a -5% natural decay penalty was applied due to absence of daily reflection */
  penaltyApplied: boolean;
  /** Whether this data point represents today's live, fluctuating reflection */
  isToday?: boolean;
  /** Snapshotted baseline screen time in minutes for this date */
  baselineMinutes: number;
  /** Whether Ahara pillar was logged */
  aharaLogged: boolean;
  /** Whether Nidra pillar was logged */
  nidraLogged: boolean;
  /** Whether Brahmacharya pillar was logged */
  brahmacharyaLogged: boolean;
}

/** Backwards-compatibility alias for previous 14-day trajectory types */
export type FourteenDayTrendPoint = RollingTrendPoint;

/**
 * Backwards-compatibility helper for time-of-day weighting.
 * Under the unified daily log architecture, returns 1.0.
 */
export function getTimeOfDayWeight(
  _log?: SadhanaLogInput,
  _indexInDay: number = 0,
  _totalLogsInDay: number = 1
): number {
  return 1.0;
}

/**
 * Extracts or computes the numeric score (S_i) for a log entry.
 */
function extractLogScore(log: SadhanaLogInput): number {
  if (typeof log.yuktaScore === 'number' && !isNaN(log.yuktaScore)) {
    return log.yuktaScore;
  }
  if (typeof log.score === 'number' && !isNaN(log.score)) {
    return log.score;
  }
  if (log.ahara && log.nidra && log.brahmacharya) {
    return computeYuktaScore(log.ahara, log.nidra, log.brahmacharya, log.loggedPillars);
  }
  return 0;
}

/**
 * Calculates the unified Daily Equilibrium score for a specific calendar date.
 * Under the unified daily log architecture, returns the score of the latest log entry
 * for the target date directly without stepped multipliers.
 *
 * @param logs Array of daily Trayopastambha logs or entries.
 * @param targetDate The specific calendar date ('YYYY-MM-DD'). Defaults to log date or today.
 * @returns Single consolidated E_daily score for that specific calendar date.
 */
export function calculateDailyEquilibrium(
  logs: SadhanaLogInput[] | SadhanaLogInput,
  targetDate?: string
): number;
export function calculateDailyEquilibrium(
  targetDate: string,
  logs: SadhanaLogInput[] | SadhanaLogInput
): number;
export function calculateDailyEquilibrium(
  param1: SadhanaLogInput[] | SadhanaLogInput | string,
  param2?: string | SadhanaLogInput[] | SadhanaLogInput
): number {
  let logs: SadhanaLogInput[] = [];
  let targetDate: string | undefined;

  if (Array.isArray(param1)) {
    logs = param1;
    targetDate = typeof param2 === 'string' ? param2 : undefined;
  } else if (typeof param1 === 'string') {
    targetDate = param1;
    if (Array.isArray(param2)) {
      logs = param2;
    } else if (param2 && typeof param2 === 'object') {
      logs = [param2 as SadhanaLogInput];
    } else {
      logs = [];
    }
  } else if (param1 && typeof param1 === 'object') {
    logs = [param1 as SadhanaLogInput];
    targetDate = typeof param2 === 'string' ? param2 : undefined;
  }

  if (!logs || logs.length === 0) {
    return 0;
  }

  // Determine target date if not explicitly provided
  if (!targetDate) {
    const firstWithDate = logs.find((l) => Boolean(l.date));
    if (firstWithDate && firstWithDate.date) {
      targetDate = firstWithDate.date.slice(0, 10);
    } else {
      targetDate = getLocalTodayDateString();
    }
  }

  const normalizedTargetDate = targetDate.slice(0, 10);

  // Filter logs strictly for that specific calendar date using local date formatting
  const dayLogs = logs.filter((log) => {
    if (!log) return false;
    if (log.date) {
      return log.date.slice(0, 10) === normalizedTargetDate;
    }
    if (log.timestamp) {
      const d = new Date(log.timestamp);
      if (!isNaN(d.getTime())) {
        const itemLocalDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return itemLocalDate === normalizedTargetDate;
      }
    }
    if (log.createdAt) {
      const d = new Date(log.createdAt);
      if (!isNaN(d.getTime())) {
        const itemLocalDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return itemLocalDate === normalizedTargetDate;
      }
    }
    return true;
  });

  if (dayLogs.length === 0) {
    return 0;
  }

  const latestLog = dayLogs[dayLogs.length - 1];
  return Math.round(extractLogScore(latestLog));
}

/**
 * Calculates a rolling trend covering up to the last 7 days of historical data
 * plus current day data (which varies dynamically throughout the day).
 *
 * Window Architecture:
 *   - Up to 8 days total (7 previous days + current day).
 *   - Handles New User Edge Case: If account age is less than 8 days (e.g. 3 days),
 *     the returned array strictly contains 3 days of data—preventing artificial flatlines.
 *
 * Current Day Dynamics:
 *   - Today's data point uses `calculateDailyEquilibrium` for the unified daily log recorded today.
 *   - The score reflects the day's active reflection in real-time.
 *
 * Natural Decay Logic:
 *   - Applies a -5% penalty for previous unlogged days, simulating that cognitive discipline
 *     requires daily maintenance.
 *
 * @param logs Array of user Trayopastambha logs.
 * @param accountCreationDate Date string, Date object, or numeric day age representing account creation.
 * @returns Array of RollingTrendPoint items sized strictly between 1 and 8 days (last 7 days + today).
 */
export function getRollingTrend(
  logs: TrayopastambhaLog[] = [],
  accountCreationDate?: string | Date | number
): RollingTrendPoint[] {
  // Base Case Guard: Brand-new users without logs receive [] to preserve empty-state placeholders
  if (!logs || logs.length === 0) {
    return [];
  }

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Default window: last 7 days of past data + current day = 8 days max
  let accountAgeDays = 8;

  // 1. Calculate Account Age
  if (typeof accountCreationDate === 'number' && !isNaN(accountCreationDate)) {
    accountAgeDays = Math.max(1, Math.round(accountCreationDate));
  } else if (accountCreationDate) {
    let creationDate: Date;
    if (typeof accountCreationDate === 'string') {
      const parts = accountCreationDate.slice(0, 10).split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        creationDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        creationDate = new Date(accountCreationDate);
      }
    } else {
      creationDate = new Date(accountCreationDate);
    }

    if (!isNaN(creationDate.getTime())) {
      const creationMidnight = new Date(
        creationDate.getFullYear(),
        creationDate.getMonth(),
        creationDate.getDate()
      );
      const diffMs = todayMidnight.getTime() - creationMidnight.getTime();
      const rawDiffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      // Account age includes today: day 0 -> 1 day; day 2 -> 3 days
      accountAgeDays = Math.max(1, rawDiffDays + 1);
    }
  } else if (logs && logs.length > 0) {
    // If no explicit accountCreationDate is provided, infer from earliest recorded date
    const sortedDates = logs
      .map((l) => l.date?.slice(0, 10))
      .filter(Boolean)
      .sort();
    if (sortedDates.length > 0) {
      const [y, m, d] = sortedDates[0].split('-').map(Number);
      const earliestMidnight = new Date(y, m - 1, d);
      const diffMs = todayMidnight.getTime() - earliestMidnight.getTime();
      const rawDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      accountAgeDays = Math.max(1, rawDiff + 1);
    }
  }

  // Look backward up to a maximum of 8 days (last 7 days + current day)
  const effectiveDays = Math.min(8, accountAgeDays);

  // Generate target dates array in chronological order (oldest to today)
  const targetDates: string[] = [];
  for (let i = effectiveDays - 1; i >= 0; i--) {
    const d = new Date(todayMidnight);
    d.setDate(todayMidnight.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    targetDates.push(`${year}-${month}-${day}`);
  }

  // Group existing logs by calendar date (YYYY-MM-DD)
  const dateLogMap = new Map<string, TrayopastambhaLog[]>();
  for (const log of logs) {
    if (log && log.date) {
      const d = log.date.slice(0, 10);
      if (!dateLogMap.has(d)) {
        dateLogMap.set(d, []);
      }
      dateLogMap.get(d)!.push(log);
    }
  }

  // Determine initial baseline score (find first logged score or baseline 75)
  let lastDisciplineScore = 75;
  const firstLoggedDate = targetDates.find((d) => (dateLogMap.get(d) || []).length > 0);
  if (firstLoggedDate) {
    const initialDayLogs = dateLogMap.get(firstLoggedDate)!;
    lastDisciplineScore = calculateDailyEquilibrium(initialDayLogs, firstLoggedDate);
  }

  const result: RollingTrendPoint[] = [];

  for (const dateStr of targetDates) {
    const dayLogs = dateLogMap.get(dateStr) || [];
    const hasLogs = dayLogs.length > 0;
    const isToday = dateStr === todayStr;

    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const displayDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    let yuktaScore: number;
    let penaltyApplied = false;
    let sleepHours = 0;
    let digitalMinutes = 0;
    let focusBlocks = 0;
    let dominantGuna = 'Sattva';
    let baselineMinutes = 360;
    let aharaLogged = false;
    let nidraLogged = false;
    let brahmacharyaLogged = false;

    if (hasLogs) {
      yuktaScore = calculateDailyEquilibrium(dayLogs, dateStr);
      lastDisciplineScore = yuktaScore;
      penaltyApplied = false;

      const latestLog = dayLogs[dayLogs.length - 1];
      aharaLogged = latestLog.loggedPillars ? Boolean(latestLog.loggedPillars.ahara) : true;
      nidraLogged = latestLog.loggedPillars ? Boolean(latestLog.loggedPillars.nidra) : true;
      brahmacharyaLogged = latestLog.loggedPillars ? Boolean(latestLog.loggedPillars.brahmacharya) : true;
      digitalMinutes = aharaLogged ? (latestLog.ahara?.digitalConsumptionMinutes ?? 0) : 0;
      baselineMinutes = latestLog.ahara?.baselineMinutesAtLog ?? 360;
      sleepHours = nidraLogged ? (latestLog.nidra?.hoursSlept ?? 0) : 0;
      focusBlocks = brahmacharyaLogged ? (latestLog.brahmacharya?.focusedStudyBlocks ?? 0) : 0;
      dominantGuna = latestLog.brahmacharya?.dominantGuna ?? 'Sattva';
    } else {
      // Natural decay: apply -5% penalty for missing daily reflection on past days
      penaltyApplied = true;
      yuktaScore = Math.max(0, Math.round(lastDisciplineScore * 0.95));
      lastDisciplineScore = yuktaScore;
      dominantGuna = 'Rajas'; // Restlessness / inert drift when unobserved
      focusBlocks = 0;
      digitalMinutes = 0;
      baselineMinutes = 360;
      aharaLogged = false;
      nidraLogged = false;
      brahmacharyaLogged = false;
    }

    result.push({
      date: dateStr,
      displayDate,
      yuktaScore,
      sleepHours,
      digitalMinutes,
      focusBlocks,
      dominantGuna,
      hasLogs,
      penaltyApplied,
      isToday,
      baselineMinutes,
      aharaLogged,
      nidraLogged,
      brahmacharyaLogged,
    });
  }

  return result;
}

/**
 * Backwards-compatibility alias for getRollingTrend.
 */
export const getFourteenDayTrend = getRollingTrend;

/**
 * Returns an 8-day chronological progression of Yukta balance, sleep, digital consumption,
 * and dominant Guna, optimized for line and area charts.
 * Covers the last 7 days of historical data + current day data (which varies throughout the day).
 * Consolidates multiple daily logs into a single daily equilibrium score.
 */
export function getWeeklyYuktaTrend(
  logs: TrayopastambhaLog[]
): {
  date: string;
  yuktaScore: number;
  sleepHours: number;
  digitalMinutes: number;
  dominantGuna: string;
  isToday?: boolean;
}[] {
  const todayStr = getLocalTodayDateString();

  // Group logs by unique calendar date
  const dateMap = new Map<string, TrayopastambhaLog[]>();
  for (const log of logs) {
    const d = log.date.slice(0, 10);
    if (!dateMap.has(d)) {
      dateMap.set(d, []);
    }
    dateMap.get(d)!.push(log);
  }

  const dates = Array.from(dateMap.keys()).sort((a, b) => a.localeCompare(b));
  // Take up to the last 8 calendar dates (last 7 days + current day)
  const recentDates = dates.slice(-8);

  return recentDates.map((date) => {
    const dayLogs = dateMap.get(date)!;
    const latestLog = dayLogs[dayLogs.length - 1];
    const consolidatedYukta = calculateDailyEquilibrium(dayLogs, date);

    // Sum digital intake across all logs for that date
    const totalDigital = dayLogs.reduce(
      (sum, l) => sum + (l.ahara?.digitalConsumptionMinutes || 0),
      0
    );

    return {
      date,
      yuktaScore: consolidatedYukta,
      sleepHours:
        latestLog.loggedPillars && !latestLog.loggedPillars.nidra
          ? 0
          : (latestLog.nidra?.hoursSlept ?? 0),
      digitalMinutes: totalDigital,
      dominantGuna: latestLog.brahmacharya?.dominantGuna ?? 'Sattva',
      isToday: date === todayStr,
    };
  });
}

/**
 * Aggregates and ranks the frequency of compulsive loop triggers,
 * sorted descending by occurrence for targeted behavioral awareness.
 */
export function getTriggerFrequencyBreakdown(
  interceptions: InterceptionRecord[]
): {
  category: TriggerCategory;
  label: string;
  count: number;
}[] {
  const categoryLabels: Record<TriggerCategory, string> = {
    Doomscrolling: 'Doomscrolling Feeds',
    'Academic Anxiety / Professional Workload': 'Academic & Professional Workload',
    'Academic Anxiety': 'Academic & Professional Workload',
    'Social Comparison': 'Social Comparison & Envy',
    Lethargy: 'Lethargy & Inertia',
    'Cheap Dopamine / Junk Stimulation': 'Cheap Dopamine & Junk Cravings',
  };

  const counts: Record<TriggerCategory, number> = {
    Doomscrolling: 0,
    'Academic Anxiety / Professional Workload': 0,
    'Academic Anxiety': 0,
    'Social Comparison': 0,
    Lethargy: 0,
    'Cheap Dopamine / Junk Stimulation': 0,
  };

  for (const item of interceptions) {
    if (counts[item.triggerCategory] !== undefined) {
      counts[item.triggerCategory]++;
    }
  }

  const result = (Object.keys(counts) as TriggerCategory[]).map((category) => ({
    category,
    label: categoryLabels[category],
    count: counts[category],
  }));

  return result.sort((a, b) => b.count - a.count);
}

/**
 * Formats normalized Tri-Guna distribution directly into Recharts-ready data points
 * using the BrahmaPath palette: Sattva (#065F46), Rajas (#D97706), and Tamas (#475569).
 */
export function getGunaChartData(
  logs: TrayopastambhaLog[],
  interceptions: InterceptionRecord[],
  bhavaLogs: BhavaLog[] = []
): {
  name: string;
  value: number;
  fill: string;
}[] {
  const dist = calculateGunaDistribution(logs, interceptions, bhavaLogs);

  return [
    {
      name: 'Sattva',
      value: dist.sattva,
      fill: '#065F46', // Emerald Forest
    },
    {
      name: 'Rajas',
      value: dist.rajas,
      fill: '#D97706', // Terracotta Amber
    },
    {
      name: 'Tamas',
      value: dist.tamas,
      fill: '#475569', // Slate Ash
    },
  ];
}
