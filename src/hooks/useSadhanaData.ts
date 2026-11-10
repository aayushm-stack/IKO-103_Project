import { useState, useEffect, useCallback } from 'react';
import {
  AharaLog,
  NidraLog,
  BrahmacharyaLog,
  TrayopastambhaLog,
  UserPreferences,
} from '../types/iks';
import {
  STORAGE_KEYS,
  getLocalItem,
  setLocalItem,
} from '../engine/storage/localStore';
import { DEFAULT_PREFERENCES } from '../engine/storage/seedData';
import {
  calculateDailyEquilibrium,
  getTimeOfDayWeight,
} from '../engine/analyticsEngine';
import { computeYuktaScore } from '../engine/yuktaEngine';

export { getTimeOfDayWeight };

/**
 * Returns today's calendar date in local YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the earliest allowed date string (7 days before today) in YYYY-MM-DD format.
 * Any sadhana data with a date strictly earlier than this cutoff is completely trashed.
 */
export function getSevenDayCutoffDateString(): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const year = cutoff.getFullYear();
  const month = String(cutoff.getMonth() + 1).padStart(2, '0');
  const day = String(cutoff.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Known template strings used in mock judge presentations that should never pollute real user storage.
 */
const GHOST_DEMO_REFLECTIONS = new Set([
  'High Rajas & Tamas surge with erratic late-night doomscrolling.',
  'High Vata spike; severe fatigue from fragmented sleep.',
  'Slight improvement; experimented with Impulse Interceptor after lunch.',
  'First sustained Sattva morning; 4 deep focus blocks logged.',
  'Sattvic momentum building; reduced digital media to 45 min.',
]);

/**
 * Pure pruning and garbage-collection function for Trayopastambha logs:
 * 1. Discards any log older than the 7-day window (older than today - 7 days).
 * 2. Purges any ghost presentation demo logs injected into local storage.
 * 3. Deduplicates strictly by calendar date (cleanDate = log.date.slice(0, 10)),
 *    keeping the latest entry for each YYYY-MM-DD and normalizing its id to `sadhana-log-${cleanDate}`.
 * 4. Preserves loggedPillars flags on every log entry.
 * 5. Sorts surviving records chronologically.
 */
export function pruneSadhanaLogs(rawLogs: TrayopastambhaLog[]): TrayopastambhaLog[] {
  if (!Array.isArray(rawLogs)) return [];

  const cutoff = getSevenDayCutoffDateString();
  const dateMap = new Map<string, TrayopastambhaLog>();

  for (const log of rawLogs) {
    if (!log || !log.date) continue;
    const cleanDate = log.date.slice(0, 10);
    // Trash anything strictly older than 7 days ago
    if (cleanDate < cutoff) {
      continue;
    }

    // Purge ghost judge demo template records prior to user's real logging window
    if (log.generalReflection && GHOST_DEMO_REFLECTIONS.has(log.generalReflection)) {
      continue;
    }

    // Retain/overwrite with the latest record for each YYYY-MM-DD
    dateMap.set(cleanDate, {
      ...log,
      id: `sadhana-log-${cleanDate}`,
      date: cleanDate,
      loggedPillars: log.loggedPillars,
    });
  }

  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Custom React hook for managing user sadhana data and preferences.
 * Fully offline-capable, resilient against empty initial state, and syncs
 * with local storage on every mutation with automatic 7-day window garbage collection.
 * Supports independent Trayopastambha pillar logging throughout the day.
 */
export function useSadhanaData() {
  const [logs, setLogs] = useState<TrayopastambhaLog[]>(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.LOGS) : null;
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const pruned = pruneSadhanaLogs(parsed);
          // Persist trimmed state immediately if stale data was trashed
          if (pruned.length !== parsed.length) {
            setLocalItem(STORAGE_KEYS.LOGS, pruned);
          }
          return pruned;
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const existing = getLocalItem<UserPreferences | null>(STORAGE_KEYS.PREFS, null);
    if (existing) {
      return existing;
    }
    setLocalItem(STORAGE_KEYS.PREFS, DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  });

  // Verify and auto-prune stale records on mount without seeding fake demo data
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.LOGS) : null;
    if (raw === null) {
      setLocalItem(STORAGE_KEYS.LOGS, []);
      setLogs([]);
    } else {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const pruned = pruneSadhanaLogs(parsed);
          if (pruned.length !== parsed.length) {
            setLocalItem(STORAGE_KEYS.LOGS, pruned);
            setLogs(pruned);
          }
        }
      } catch {
        // ignore JSON errors
      }
    }

    const storedPrefs = getLocalItem<UserPreferences | null>(STORAGE_KEYS.PREFS, null);
    if (!storedPrefs) {
      setLocalItem(STORAGE_KEYS.PREFS, DEFAULT_PREFERENCES);
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  /**
   * Adds a new daily log or updates an existing entry for that specific calendar date.
   */
  const addOrUpdateDailyLog = useCallback(
    (
      entry: Omit<TrayopastambhaLog, 'id' | 'yuktaScore'>,
      calculatedYuktaScore: number
    ) => {
      setLogs((prevLogs) => {
        const cleanDate = entry.date ? entry.date.slice(0, 10) : getTodayDateString();
        const newLog: TrayopastambhaLog = {
          ...entry,
          id: `sadhana-log-${cleanDate}`,
          date: cleanDate,
          timestamp: new Date().toISOString(),
          yuktaScore: calculatedYuktaScore,
        };

        // Replace any existing record for this calendar date
        const withoutCurrentDate = prevLogs.filter(
          (log) => log.date.slice(0, 10) !== cleanDate
        );
        const combined = [...withoutCurrentDate, newLog];
        // Prune out anything older than 7 days ago and deduplicate by cleanDate
        const updatedLogs = pruneSadhanaLogs(combined);

        setLocalItem(STORAGE_KEYS.LOGS, updatedLogs);
        return updatedLogs;
      });
    },
    []
  );

  /**
   * Logs or updates a single Trayopastambha pillar or reflection for today
   * without overwriting pillars logged earlier. Dynamically recalibrates
   * the Yukta Score using only logged pillars.
   */
  const logSadhanaPillar = useCallback(
    (
      pillar: 'ahara' | 'nidra' | 'brahmacharya' | 'reflection',
      payload: {
        ahara?: AharaLog;
        nidra?: NidraLog;
        brahmacharya?: BrahmacharyaLog;
        generalReflection?: string;
      }
    ) => {
      const today = getTodayDateString();
      setLogs((prevLogs) => {
        const existing = prevLogs.find((l) => l.date.slice(0, 10) === today);

        const prevLoggedPillars = existing?.loggedPillars ?? {
          ahara: false,
          nidra: false,
          brahmacharya: false,
        };

        const updatedLoggedPillars = {
          ahara: pillar === 'ahara' ? true : Boolean(prevLoggedPillars.ahara),
          nidra: pillar === 'nidra' ? true : Boolean(prevLoggedPillars.nidra),
          brahmacharya:
            pillar === 'brahmacharya' ? true : Boolean(prevLoggedPillars.brahmacharya),
        };

        const mergedAhara: AharaLog =
          payload.ahara ??
          existing?.ahara ?? {
            nutritionQuality: 'Sattvic',
            digitalConsumptionMinutes: 90,
            sensoryMindfulnessScore: 4,
          };

        const mergedNidra: NidraLog =
          payload.nidra ??
          existing?.nidra ?? {
            hoursSlept: 7.5,
            bedtimeConsistency: true,
            restQuality: 'Restorative',
          };

        const mergedBrahmacharya: BrahmacharyaLog =
          payload.brahmacharya ??
          existing?.brahmacharya ?? {
            energyConservationRating: 4,
            focusedStudyBlocks: 4,
            dominantGuna: 'Sattva',
          };

        const mergedReflection =
          payload.generalReflection !== undefined
            ? payload.generalReflection
            : existing?.generalReflection ?? '';

        const newYuktaScore = computeYuktaScore(
          mergedAhara,
          mergedNidra,
          mergedBrahmacharya,
          updatedLoggedPillars
        );

        const updatedLog: TrayopastambhaLog = {
          id: existing?.id || `sadhana-log-${today}`,
          date: today,
          ahara: mergedAhara,
          nidra: mergedNidra,
          brahmacharya: mergedBrahmacharya,
          generalReflection: mergedReflection,
          loggedPillars: updatedLoggedPillars,
          yuktaScore: newYuktaScore,
        };

        const withoutToday = prevLogs.filter((l) => l.date.slice(0, 10) !== today);
        const updatedLogs = pruneSadhanaLogs([...withoutToday, updatedLog]);
        setLocalItem(STORAGE_KEYS.LOGS, updatedLogs);
        return updatedLogs;
      });
    },
    []
  );

  /**
   * Updates partial user preferences and synchronizes with storage.
   */
  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated: UserPreferences = {
        ...prev,
        ...partial,
      };
      setLocalItem(STORAGE_KEYS.PREFS, updated);
      return updated;
    });
  }, []);

  /**
   * Retrieves today's unified Trayopastambha log directly.
   */
  const getTodayLog = useCallback((): TrayopastambhaLog | undefined => {
    const today = getTodayDateString();
    return logs.find((log) => log.date.slice(0, 10) === today);
  }, [logs]);

  /**
   * Reloads state directly from local storage, auto-pruning stale data out of the 7-day window.
   */
  const reloadFromStorage = useCallback(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.LOGS) : null;
    let storedLogs: TrayopastambhaLog[] = [];
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          storedLogs = pruneSadhanaLogs(parsed);
        }
      } catch {
        storedLogs = [];
      }
    }
    const storedPrefs = getLocalItem<UserPreferences>(
      STORAGE_KEYS.PREFS,
      DEFAULT_PREFERENCES
    );

    setLocalItem(STORAGE_KEYS.LOGS, storedLogs);
    setLogs(storedLogs);
    setPreferences(storedPrefs);
  }, []);

  /**
   * Resets all logs and user preferences back to pure default initial state.
   */
  const resetSadhanaData = useCallback(() => {
    setLocalItem(STORAGE_KEYS.LOGS, []);
    setLocalItem(STORAGE_KEYS.PREFS, DEFAULT_PREFERENCES);
    setLogs([]);
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    logs,
    preferences,
    addOrUpdateDailyLog,
    logSadhanaPillar,
    updatePreferences,
    getTodayLog,
    reloadFromStorage,
    setLogs,
    resetSadhanaData,
  };
}
