import { useState, useEffect, useCallback } from 'react';
import { InterceptionRecord } from '../types/iks';
import { isInterceptionSuccessful } from '../engine/interceptorEngine';
import {
  STORAGE_KEYS,
  setLocalItem,
} from '../engine/storage/localStore';

/**
 * Returns today's calendar date prefix (YYYY-MM-DD) for date filtering.
 */
function getTodayDatePrefix(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the earliest allowed date string (7 days before today) in YYYY-MM-DD format.
 * Any interception records strictly earlier than this cutoff are completely trashed.
 */
export function getSevenDayInterceptionCutoffDateString(): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const year = cutoff.getFullYear();
  const month = String(cutoff.getMonth() + 1).padStart(2, '0');
  const day = String(cutoff.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper that parses a timestamp string and returns the local calendar date
 * in YYYY-MM-DD format (fixing late-night UTC timezone mismatch between 12:00 AM and 5:30 AM IST).
 */
export function getRecordLocalDateString(timestampStr: string): string {
  if (!timestampStr) return '';
  try {
    const d = new Date(timestampStr);
    if (isNaN(d.getTime())) {
      return timestampStr.slice(0, 10);
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return timestampStr.slice(0, 10);
  }
}

/**
 * Known template vitarka strings used in mock judge presentations that should never pollute real user storage.
 */
const GHOST_DEMO_VITARKAS = new Set([
  'Just 5 minutes of short reels to unwind before starting my semester project code.',
  'Browsing batchmates’ LinkedIn promotion and hackathon posts made my own quiet progress feel entirely useless.',
  'Heavy post-lunch fog at 3:30 PM; feeling like lying down and mindlessly playing YouTube videos until dinner.',
  'Intense anxiety about tomorrow’s viva exam; craving ultra-sweet snacks and high-caffeine energy drinks.',
  'Unlocked phone to look up professor’s assignment deadline and instantly got sucked into algorithmic news feeds.',
]);

/**
 * Pure pruning and garbage-collection function for Interception records:
 * Strictly discards and trashes any record older than the 7-day window or matching ghost demo seeds.
 */
export function pruneInterceptions(records: InterceptionRecord[]): InterceptionRecord[] {
  if (!Array.isArray(records)) return [];
  const cutoff = getSevenDayInterceptionCutoffDateString();

  return records.filter((item) => {
    if (!item || !item.timestamp) return false;
    // Purge ghost demo presentation records
    if (item.vitarkaText && GHOST_DEMO_VITARKAS.has(item.vitarkaText)) {
      return false;
    }
    const itemDate = getRecordLocalDateString(item.timestamp);
    // Trash anything strictly older than 7 days ago
    return itemDate >= cutoff;
  });
}

/**
 * Custom React hook for logging and managing Pause Gate interception records.
 * Fully offline-capable, syncs with local storage, and automatically prunes records
 * outside the 7-day rolling window to prevent data accumulation bugs.
 * Never seeds fake demo data into empty localStorage for new users.
 */
export function useInterceptorLogs() {
  const [interceptions, setInterceptions] = useState<InterceptionRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.INTERCEPTIONS);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const pruned = pruneInterceptions(parsed);
          if (pruned.length !== parsed.length) {
            setLocalItem(STORAGE_KEYS.INTERCEPTIONS, pruned);
          }
          return pruned;
        }
      }
    } catch {
      // ignore JSON parse errors
    }
    return [];
  });

  // Verify and prune old records on mount without injecting fake demo seeds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.INTERCEPTIONS);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const pruned = pruneInterceptions(parsed);
          if (pruned.length !== parsed.length) {
            setLocalItem(STORAGE_KEYS.INTERCEPTIONS, pruned);
            setInterceptions(pruned);
          }
        }
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  /**
   * Records a new loop interception event and persists it to local storage,
   * automatically pruning records outside the 7-day window.
   */
  const logInterception = useCallback(
    (record: Omit<InterceptionRecord, 'id' | 'timestamp'>): InterceptionRecord => {
      const newRecord: InterceptionRecord = {
        ...record,
        id: `interception-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
      };

      setInterceptions((prev) => {
        const combined = [newRecord, ...prev];
        const updated = pruneInterceptions(combined);
        setLocalItem(STORAGE_KEYS.INTERCEPTIONS, updated);
        return updated;
      });

      return newRecord;
    },
    []
  );

  /**
   * Deletes a specific interception record by ID.
   */
  const deleteInterception = useCallback((id: string) => {
    setInterceptions((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      setLocalItem(STORAGE_KEYS.INTERCEPTIONS, updated);
      return updated;
    });
  }, []);

  /**
   * Reframes an earlier honest slip or un-intercepted urge by ID:
   * Sets isResolved: true, resolved: true, isSuccessful: true, success: true,
   * resolvedGunaState: 'Sattva', interactionType: 'resolved_negative_friction',
   * updates the pratipakshaText and optional microSwap, persists to localStorage, and updates state.
   */
  const resolveInterceptionById = useCallback(
    (id: string, pratipakshaText?: string, selectedMicroSwap?: string) => {
      setInterceptions((prev) => {
        const targetIndex = prev.findIndex((item) => item.id === id);
        if (targetIndex < 0) return prev;

        const existing = prev[targetIndex];
        const updatedRecord: InterceptionRecord = {
          ...existing,
          isResolved: true,
          isSuccessful: true,
          resolvedGunaState: 'Sattva',
          interactionType: 'resolved_negative_friction',
          pratipakshaText:
            pratipakshaText ||
            existing.pratipakshaText ||
            'Conscious Pratipaksha reframe: Reclaimed inner composure and released impulsive craving.',
          selectedMicroSwap: selectedMicroSwap ?? existing.selectedMicroSwap ?? 'Pranayama - Extended Exhale',
        };

        const updated = [...prev];
        updated[targetIndex] = updatedRecord;
        const pruned = pruneInterceptions(updated);
        setLocalItem(STORAGE_KEYS.INTERCEPTIONS, pruned);
        return pruned;
      });
    },
    []
  );

  /**
   * Toggles resolution of an interception record by ID:
   * If currently unresolved/slip -> marks resolved (+PRQ, Sattvic).
   * If currently resolved -> marks as slip/unresolved.
   */
  const toggleInterceptionResolution = useCallback(
    (id: string, defaultPratipaksha?: string) => {
      setInterceptions((prev) => {
        const targetIndex = prev.findIndex((item) => item.id === id);
        if (targetIndex < 0) return prev;

        const existing = prev[targetIndex];
        const currentlySuccessful = isInterceptionSuccessful(existing);

        const updatedRecord: InterceptionRecord = currentlySuccessful
          ? {
              ...existing,
              isResolved: false,
              isSuccessful: false,
              interactionType: 'unresolved_negative_friction',
              resolvedGunaState:
                existing.urgeIntensity && existing.urgeIntensity >= 4 ? 'Tamas' : 'Rajas',
            }
          : {
              ...existing,
              isResolved: true,
              isSuccessful: true,
              interactionType: 'resolved_negative_friction',
              resolvedGunaState: 'Sattva',
              pratipakshaText:
                existing.pratipakshaText && existing.pratipakshaText.trim().length > 0
                  ? existing.pratipakshaText
                  : defaultPratipaksha ||
                    'Conscious Pratipaksha reframe: Reclaimed inner composure and released impulsive craving.',
              selectedMicroSwap: existing.selectedMicroSwap || 'Pranayama - Extended Exhale',
            };

        const updated = [...prev];
        updated[targetIndex] = updatedRecord;
        const pruned = pruneInterceptions(updated);
        setLocalItem(STORAGE_KEYS.INTERCEPTIONS, pruned);
        return pruned;
      });
    },
    []
  );

  /**
   * Returns the total number of Pause Gate interceptions triggered today,
   * matching against the local calendar date to support late-night sessions.
   */
  const getTodayInterceptionCount = useCallback((): number => {
    const todayLocal = getTodayDatePrefix();
    return interceptions.filter((item) => {
      try {
        return getRecordLocalDateString(item.timestamp) === todayLocal;
      } catch {
        return false;
      }
    }).length;
  }, [interceptions]);

  /**
   * Reloads interception logs directly from local storage, pruning records outside 7 days.
   * Initializes to empty [] if storage is empty.
   */
  const reloadInterceptions = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.INTERCEPTIONS);
      let stored: InterceptionRecord[] = [];
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          stored = pruneInterceptions(parsed);
        }
      }
      setLocalItem(STORAGE_KEYS.INTERCEPTIONS, stored);
      setInterceptions(stored);
    } catch {
      setInterceptions([]);
    }
  }, []);

  return {
    interceptions,
    logInterception,
    deleteInterception,
    resolveInterceptionById,
    toggleInterceptionResolution,
    getTodayInterceptionCount,
    reloadInterceptions,
    setInterceptions,
  };
}
