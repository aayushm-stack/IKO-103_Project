/**
 * Offline-first, type-safe local storage utility with zero external dependencies.
 * Provides resilient serialization, schema fallbacks, and storage quota guardrails.
 */

export const STORAGE_KEYS = {
  LOGS: 'bp_sadhana_logs',
  INTERCEPTIONS: 'bp_interceptions',
  PREFS: 'bp_user_prefs',
  GOALS: 'bp_sankalpa_goals',
  BHAVA_LOGS: 'brahmapath_bhava_logs_v1',
} as const;

/**
 * Checks whether localStorage is available in the current runtime environment.
 */
function isStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Retrieves and deserializes a typed item from localStorage.
 * Returns the fallback value if the item is missing, unparseable, or inaccessible.
 */
export function getLocalItem<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[BrahmaPath LocalStore] Failed to parse key "${key}":`, error);
    return fallback;
  }
}

/**
 * Serializes and persists a typed item into localStorage.
 * Gracefully handles QuotaExceededError and write failures.
 */
export function setLocalItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.code === 1014 ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.error(
        `[BrahmaPath LocalStore] Storage quota exceeded while saving key "${key}".`,
        error
      );
    } else {
      console.error(`[BrahmaPath LocalStore] Failed to write key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Purges all BrahmaPath-related persisted keys from localStorage.
 */
export function clearAllBrahmaPathData(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('[BrahmaPath LocalStore] Failed to clear BrahmaPath storage:', error);
  }
}

/**
 * Performs storage optimization and garbage collection across BrahmaPath keys,
 * ensuring no unbounded data accumulation occurs in browser localStorage.
 * Any sadhana logs or urge interceptions outside the active 7-day rolling window
 * are completely trashed.
 */
export function performStorageHygiene(): void {
  if (!isStorageAvailable()) return;

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

    // 1. Prune Stale Sadhana Logs outside the 7-day window
    const rawLogs = window.localStorage.getItem(STORAGE_KEYS.LOGS);
    if (rawLogs) {
      const parsed = JSON.parse(rawLogs);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((l: any) => l && l.date && l.date.slice(0, 10) >= cutoffStr);
        if (cleaned.length !== parsed.length) {
          window.localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(cleaned));
        }
      }
    }

    // 2. Prune Stale Interception Records outside the 7-day window
    const rawInterceptions = window.localStorage.getItem(STORAGE_KEYS.INTERCEPTIONS);
    if (rawInterceptions) {
      const parsed = JSON.parse(rawInterceptions);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((i: any) => i && i.timestamp && i.timestamp.slice(0, 10) >= cutoffStr);
        if (cleaned.length !== parsed.length) {
          window.localStorage.setItem(STORAGE_KEYS.INTERCEPTIONS, JSON.stringify(cleaned));
        }
      }
    }

    // 3. Prune Stale Bhava Logs outside the 7-day window
    const rawBhava = window.localStorage.getItem(STORAGE_KEYS.BHAVA_LOGS);
    if (rawBhava) {
      const parsed = JSON.parse(rawBhava);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((b: any) => b && b.timestamp && b.timestamp.slice(0, 10) >= cutoffStr);
        if (cleaned.length !== parsed.length) {
          window.localStorage.setItem(STORAGE_KEYS.BHAVA_LOGS, JSON.stringify(cleaned));
        }
      }
    }

    // 4. Sanitize Preferences to eliminate ghost accountCreationDate injected by old demo runs
    const rawPrefs = window.localStorage.getItem(STORAGE_KEYS.PREFS);
    if (rawPrefs) {
      const prefs = JSON.parse(rawPrefs);
      if (prefs && typeof prefs.accountCreationDate === 'string' && prefs.accountCreationDate < '2026-10-25') {
        delete prefs.accountCreationDate;
        window.localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
      }
    }
  } catch (error) {
    console.warn('[BrahmaPath LocalStore] Storage hygiene pass encountered error:', error);
  }
}
