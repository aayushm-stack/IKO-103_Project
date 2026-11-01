import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  AharaLog,
  NidraLog,
  BrahmacharyaLog,
  TrayopastambhaLog,
  UserPreferences,
  InterceptionRecord,
  BhavaLog,
  BhavaCardData,
  GunaDistribution,
  ShastraFeatureKey,
  ShastraLensData,
} from '../types/iks';
import { useSadhanaData } from '../hooks/useSadhanaData';
import { useInterceptorLogs } from '../hooks/useInterceptorLogs';
import {
  calculateGunaDistribution,
  diagnoseDoshaImbalance,
  DoshaDiagnosisResult,
} from '../engine/gunaDoshaEngine';
import { calculateChariotStatus, ChariotStatusReport } from '../engine/chariotEngine';
import { resolveShastraLens } from '../engine/shastraResolver';
import {
  getWeeklyYuktaTrend,
  getTriggerFrequencyBreakdown,
  getGunaChartData,
} from '../engine/analyticsEngine';
import {
  exportJsonBackup,
  importJsonBackup,
} from '../engine/backup/jsonBackup';
import {
  exportEncryptedBackup,
  importEncryptedBackup,
} from '../engine/backup/cryptoBackup';
import {
  clearAllBrahmaPathData,
  STORAGE_KEYS,
  setLocalItem,
  performStorageHygiene,
} from '../engine/storage/localStore';
import { DEFAULT_PREFERENCES } from '../engine/storage/seedData';
import { MASTER_MICRO_SWAPS } from '../data/microSwaps';
import { useAccount, USER_NAME_STORAGE_KEY } from './AccountContext';

/**
 * Returns today's calendar date in local YYYY-MM-DD format (fixing late-night IST timezone mismatch).
 */
export function getLocalTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Checks whether an ISO timestamp string or Date falls on today's local calendar date.
 */
export function isTimestampLocalToday(timestamp?: string | number | Date): boolean {
  if (!timestamp) return false;
  try {
    const todayLocal = getLocalTodayDateString();
    if (typeof timestamp === 'string' && timestamp.slice(0, 10) === todayLocal && !timestamp.includes('T')) {
      return true;
    }
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return false;
    const itemLocalDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return itemLocalDate === todayLocal;
  } catch {
    return false;
  }
}

/**
 * Calculates the earliest allowed date string (7 days before today) in YYYY-MM-DD format.
 */
function getSevenDayCutoffDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Prunes bhava logs older than the 7-day rolling window to prevent data accumulation.
 */
function pruneBhavaLogs(logs: BhavaLog[]): BhavaLog[] {
  if (!Array.isArray(logs)) return [];
  const cutoff = getSevenDayCutoffDate();
  return logs.filter((log) => {
    if (!log || !log.timestamp) return false;
    try {
      const d = new Date(log.timestamp);
      if (isNaN(d.getTime())) return false;
      const logLocalDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return logLocalDate >= cutoff;
    } catch {
      return false;
    }
  });
}

const BHAVA_STORAGE_KEY = (STORAGE_KEYS as any).BHAVA_LOGS || 'brahmapath_bhava_logs_v1';

/**
 * Full contract for the global BrahmaPath application state and logic layer.
 */
export interface BrahmaPathContextType {
  // Navigation View Routing State
  activeView: string;
  setActiveView: (view: string) => void;
  // User Account & Preferred Name (Decoupled Global State)
  userName: string;
  setUserName: (name: string) => void;
  // Sadhana & Habits
  logs: TrayopastambhaLog[];
  sadhanaLogs?: TrayopastambhaLog[];
  preferences: UserPreferences;
  todayLog: TrayopastambhaLog | undefined;
  todaySadhana?: TrayopastambhaLog | null;
  addOrUpdateDailyLog: (
    entry: Omit<TrayopastambhaLog, 'id' | 'yuktaScore'>,
    calculatedYuktaScore: number
  ) => void;
  logSadhanaPillar: (
    pillar: 'ahara' | 'nidra' | 'brahmacharya' | 'reflection',
    payload: {
      ahara?: AharaLog;
      nidra?: NidraLog;
      brahmacharya?: BrahmacharyaLog;
      generalReflection?: string;
    }
  ) => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;

  // Interceptor & Urge Tracking
  interceptions: InterceptionRecord[];
  interceptionLogs?: InterceptionRecord[];
  logInterception: (
    record: Omit<InterceptionRecord, 'id' | 'timestamp'>
  ) => InterceptionRecord;
  deleteInterception: (id: string) => void;
  resolveInterceptionById: (
    id: string,
    pratipakshaText?: string,
    selectedMicroSwap?: string
  ) => void;
  toggleInterceptionResolution?: (id: string, defaultPratipaksha?: string) => void;
  todayInterceptionCount: number;

  // Bhava Logs & Emotional Buffers
  bhavaLogs?: BhavaLog[];
  todayBhavaLogs: BhavaLog[];
  togglePositiveBhava: (card: BhavaCardData) => void;
  logNegativeBhavaEncounter: (card: BhavaCardData) => void;
  toggleNegativeBhavaResolution: (card: BhavaCardData) => void;
  clearBhavaCardToday: (cardId: string) => void;

  // Explicit setters for testing & atomic state resets
  setSadhanaLogs?: React.Dispatch<React.SetStateAction<TrayopastambhaLog[]>>;
  setBhavaLogs?: React.Dispatch<React.SetStateAction<BhavaLog[]>>;
  setInterceptionLogs?: React.Dispatch<React.SetStateAction<InterceptionRecord[]>>;
  setTodaySadhana?: React.Dispatch<React.SetStateAction<TrayopastambhaLog | null>>;

  // Live Computed Diagnostics
  gunaDistribution: GunaDistribution;
  doshaDiagnosis: DoshaDiagnosisResult;
  chariotStatus: ChariotStatusReport;
  weeklyTrend: ReturnType<typeof getWeeklyYuktaTrend>;
  triggerBreakdown: ReturnType<typeof getTriggerFrequencyBreakdown>;
  gunaChartData: ReturnType<typeof getGunaChartData>;

  // Shastra Lens Modal State
  activeLensKey: ShastraFeatureKey | null;
  activeLensData: ShastraLensData | null;
  openShastraLens: (keyOrData: ShastraFeatureKey | ShastraLensData) => void;
  closeShastraLens: () => void;

  // Local-First Backup & Persistence Actions
  exportPlainJsonBackup: () => void;
  importPlainJsonBackup: (
    file: File
  ) => Promise<{ success: boolean; message: string }>;
  exportEncryptedBackup: (password: string) => Promise<void>;
  importEncryptedBackup: (
    file: File,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  resetAllData: () => void;
}

const BrahmaPathContext = createContext<BrahmaPathContextType | undefined>(undefined);

/**
 * Provider wrapping the application to supply pure IKS engine computations,
 * state persistence, and Shastra Lens drawers.
 */
export function BrahmaPathProvider({ children }: { children: ReactNode }) {
  // Global Account Context (userName)
  const { userName, setUserName } = useAccount();

  // Navigation view state
  const [activeView, setActiveViewState] = useState<string>('home');

  const setActiveView = useCallback((view: string) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, []);

  // Underlying persistent hooks
  const {
    logs,
    preferences,
    addOrUpdateDailyLog,
    logSadhanaPillar,
    updatePreferences,
    getTodayLog,
    reloadFromStorage,
    setLogs: setSadhanaLogs,
    resetSadhanaData,
  } = useSadhanaData();

  const {
    interceptions,
    logInterception,
    deleteInterception,
    resolveInterceptionById,
    toggleInterceptionResolution,
    getTodayInterceptionCount,
    reloadInterceptions,
    setInterceptions: setInterceptionLogs,
  } = useInterceptorLogs();

  // Persistent Bhava logs state with 7-day pruning (never seeds mock demo data)
  const [bhavaLogs, setBhavaLogs] = useState<BhavaLog[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw =
        window.localStorage.getItem(BHAVA_STORAGE_KEY) ||
        window.localStorage.getItem('brahmapath_bhava_logs_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return pruneBhavaLogs(parsed);
        }
      }
    } catch (e) {
      console.warn('[BrahmaPathContext] Failed to load bhavaLogs from storage:', e);
    }
    return [];
  });

  // Whenever bhavaLogs updates, persist to localStorage with 7-day pruning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const pruned = pruneBhavaLogs(bhavaLogs);
        window.localStorage.setItem(BHAVA_STORAGE_KEY, JSON.stringify(pruned));
        window.localStorage.setItem('brahmapath_bhava_logs_v1', JSON.stringify(pruned));
      } catch (e) {
        console.warn('[BrahmaPathContext] Failed to persist bhavaLogs:', e);
      }
    }
  }, [bhavaLogs]);

  // Explicit in-memory today's sadhana state
  const [todaySadhana, setTodaySadhana] = useState<TrayopastambhaLog | null>(() => getTodayLog() ?? null);

  // Run global storage hygiene on startup to prune any logs or interceptions outside the 7-day window
  useEffect(() => {
    performStorageHygiene();
  }, []);

  // Synchronize todaySadhana whenever logs update
  useEffect(() => {
    const currentToday = getTodayLog() ?? null;
    setTodaySadhana(currentToday);
  }, [logs, getTodayLog]);

  // Shastra Lens modal state
  const [activeLensKey, setActiveLensKey] = useState<ShastraFeatureKey | null>(null);
  const [customLensData, setCustomLensData] = useState<ShastraLensData | null>(null);

  const activeLensData = useMemo(() => {
    if (customLensData) return customLensData;
    if (!activeLensKey) return null;
    return resolveShastraLens(activeLensKey);
  }, [activeLensKey, customLensData]);

  const openShastraLens = useCallback((keyOrData: ShastraFeatureKey | ShastraLensData) => {
    if (typeof keyOrData === 'string') {
      setCustomLensData(null);
      setActiveLensKey(keyOrData);
    } else if (keyOrData && typeof keyOrData === 'object') {
      setCustomLensData(keyOrData);
      setActiveLensKey(keyOrData.featureKey || 'daily_verse');
    }
  }, []);

  const closeShastraLens = useCallback(() => {
    setActiveLensKey(null);
    setCustomLensData(null);
  }, []);

  // Today's log and counts
  const todayLog = useMemo(() => todaySadhana ?? getTodayLog(), [todaySadhana, getTodayLog]);
  const todayInterceptionCount = useMemo(
    () => getTodayInterceptionCount(),
    [getTodayInterceptionCount]
  );

  // Filter today's interceptions using local calendar date (fixing late-night IST timezone mismatch)
  const todayInterceptions = useMemo(() => {
    const todayLocal = getLocalTodayDateString();
    return interceptions.filter((item) => {
      if (!item || !item.timestamp) return false;
      try {
        const d = new Date(item.timestamp);
        if (isNaN(d.getTime())) {
          return item.timestamp.slice(0, 10) === todayLocal;
        }
        const itemLocalDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return itemLocalDate === todayLocal;
      } catch {
        return false;
      }
    });
  }, [interceptions]);

  // Filter today's bhava logs using local calendar date
  const todayBhavaLogs = useMemo(() => {
    return bhavaLogs.filter((log) => isTimestampLocalToday(log.timestamp));
  }, [bhavaLogs]);

  // --- DEDICATED BHAVA COMPASS ACTIONS ---
  const togglePositiveBhava = useCallback((card: BhavaCardData) => {
    setBhavaLogs((prev) => {
      const existingIndex = prev.findIndex(
        (log) =>
          (log.cardId === card.id || log.id === card.id) &&
          isTimestampLocalToday(log.timestamp)
      );

      if (existingIndex >= 0) {
        // Remove existing log for card.id (toggle OFF)
        const updated = [...prev];
        updated.splice(existingIndex, 1);
        return pruneBhavaLogs(updated);
      }

      // Append new positive buffer log
      const newLog: BhavaLog = {
        id: `bhava-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        cardId: card.id,
        timestamp: new Date().toISOString(),
        title: card.title,
        sanskritTrait: card.sanskritTrait,
        isPositive: true,
        interactionType: 'positive_buffer',
        isResolved: true,
        appreciationMessage: card.appreciationMessage,
      };

      return pruneBhavaLogs([...prev, newLog]);
    });
  }, []);

  const logNegativeBhavaEncounter = useCallback((card: BhavaCardData) => {
    setBhavaLogs((prev) => {
      const alreadyExists = prev.some(
        (log) =>
          (log.cardId === card.id || log.id === card.id) &&
          isTimestampLocalToday(log.timestamp)
      );

      if (alreadyExists) {
        return prev;
      }

      const newLog: BhavaLog = {
        id: `bhava-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        cardId: card.id,
        timestamp: new Date().toISOString(),
        isPositive: false,
        interactionType: 'unresolved_negative_friction',
        isResolved: false,
        title: card.title,
        sanskritTrait: card.sanskritTrait,
        explanationText: card.explanationText,
        actionSteps: card.actionSteps,
      };

      return pruneBhavaLogs([...prev, newLog]);
    });
  }, []);

  const toggleNegativeBhavaResolution = useCallback((card: BhavaCardData) => {
    setBhavaLogs((prev) => {
      const existingIndex = prev.findIndex(
        (log) =>
          (log.cardId === card.id || log.id === card.id) &&
          isTimestampLocalToday(log.timestamp)
      );

      if (existingIndex < 0) {
        // If no log exists today, create it resolved
        const newLog: BhavaLog = {
          id: `bhava-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          cardId: card.id,
          timestamp: new Date().toISOString(),
          title: card.title,
          sanskritTrait: card.sanskritTrait,
          isPositive: false,
          isResolved: true,
          interactionType: 'resolved_negative_friction',
          explanationText: card.explanationText,
          actionSteps: card.actionSteps,
        };
        return pruneBhavaLogs([...prev, newLog]);
      }

      // Flip resolution state
      const existing = prev[existingIndex];
      const nextResolved = !existing.isResolved;
      const updatedLog: BhavaLog = {
        ...existing,
        isResolved: nextResolved,
        interactionType: nextResolved
          ? 'resolved_negative_friction'
          : 'unresolved_negative_friction',
      };

      const updated = [...prev];
      updated[existingIndex] = updatedLog;
      return pruneBhavaLogs(updated);
    });
  }, []);

  const clearBhavaCardToday = useCallback((cardId: string) => {
    setBhavaLogs((prev) => {
      const updated = prev.filter(
        (log) =>
          !(
            (log.cardId === cardId || log.id === cardId) &&
            isTimestampLocalToday(log.timestamp)
          )
      );
      return pruneBhavaLogs(updated);
    });
  }, []);

  // Live computed diagnostics (memoized against data changes)
  const gunaDistribution = useMemo(
    () => calculateGunaDistribution(logs, interceptions, bhavaLogs),
    [logs, interceptions, bhavaLogs]
  );

  const doshaDiagnosis = useMemo(
    () => diagnoseDoshaImbalance(logs, interceptions, bhavaLogs),
    [logs, interceptions, bhavaLogs]
  );

  // Wire todayBhavaLogs directly into calculateChariotStatus
  const chariotStatus = useMemo(
    () => calculateChariotStatus(todaySadhana, todayInterceptions, todayBhavaLogs),
    [todaySadhana, todayInterceptions, todayBhavaLogs]
  );

  const weeklyTrend = useMemo(() => getWeeklyYuktaTrend(logs), [logs]);

  const triggerBreakdown = useMemo(
    () => getTriggerFrequencyBreakdown(interceptions),
    [interceptions]
  );

  const gunaChartData = useMemo(
    () => getGunaChartData(logs, interceptions, bhavaLogs),
    [logs, interceptions, bhavaLogs]
  );

  // Backup and data restoration handlers
  const handleExportJson = useCallback(() => {
    exportJsonBackup();
  }, []);

  const handleImportJson = useCallback(
    async (file: File) => {
      const res = await importJsonBackup(file);
      if (res.success) {
        reloadFromStorage();
        reloadInterceptions();
      }
      return { success: res.success, message: res.message };
    },
    [reloadFromStorage, reloadInterceptions]
  );

  const handleExportEncrypted = useCallback(async (password: string) => {
    await exportEncryptedBackup(password);
  }, []);

  const handleImportEncrypted = useCallback(
    async (file: File, password: string) => {
      const res = await importEncryptedBackup(file, password);
      if (res.success) {
        reloadFromStorage();
        reloadInterceptions();
      }
      return { success: res.success, message: res.message };
    },
    [reloadFromStorage, reloadInterceptions]
  );

  const handleUpdatePreferences = useCallback(
    (partial: Partial<UserPreferences>) => {
      // Guard against saving an empty or whitespace name to preferences
      if (partial.name !== undefined && partial.name.trim().length === 0) {
        const { name: _discarded, ...rest } = partial;
        if (Object.keys(rest).length > 0) {
          updatePreferences(rest);
        }
        return;
      }
      updatePreferences(partial);
      if (partial.name !== undefined && partial.name.trim().length > 0) {
        setUserName(partial.name.trim());
      }
    },
    [updatePreferences, setUserName]
  );

  const mergedPreferences = useMemo(() => {
    return {
      ...preferences,
      name: preferences.name || userName || '',
      selectedMicroSwapIds: (() => {
        if (!Array.isArray(preferences.selectedMicroSwapIds) || preferences.selectedMicroSwapIds.length === 0) {
          return MASTER_MICRO_SWAPS.map((s) => s.id);
        }
        // If it matches the legacy 4-item hardcoded seed, expand to all 12 master micro-swaps
        const legacyDefault = ['extended-exhale', 'urge-surf', 'jala', 'tapas'];
        if (
          preferences.selectedMicroSwapIds.length === 4 &&
          preferences.selectedMicroSwapIds.every((id, idx) => id === legacyDefault[idx])
        ) {
          return MASTER_MICRO_SWAPS.map((s) => s.id);
        }
        return preferences.selectedMicroSwapIds;
      })(),
    };
  }, [preferences, userName]);

  /**
   * Resets all persistent and in-memory application data.
   */
  const resetAllData = useCallback(() => {
    // 1. Storage purge
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('[BrahmaPathContext] localStorage.clear() failed, falling back to key removal:', e);
    }
    clearAllBrahmaPathData();

    // Clear bhava logs and goals in localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(BHAVA_STORAGE_KEY);
        window.localStorage.removeItem('brahmapath_bhava_logs_v1');
        window.localStorage.removeItem(USER_NAME_STORAGE_KEY);
        window.localStorage.removeItem('brahmapath_onboarding_completed');
        window.localStorage.removeItem(STORAGE_KEYS.GOALS);
        window.localStorage.removeItem('bp_sankalpa_goals');
      }
    } catch (e) {
      console.warn('[BrahmaPathContext] Failed to remove storage keys:', e);
    }

    // Persist empty collections so subsequent reloads don't generate mock demo seeds
    setLocalItem(STORAGE_KEYS.LOGS, []);
    setLocalItem(STORAGE_KEYS.INTERCEPTIONS, []);
    setLocalItem(STORAGE_KEYS.GOALS, []);
    setLocalItem(STORAGE_KEYS.PREFS, DEFAULT_PREFERENCES);

    // Reset underlying sadhana hook state (logs and preferences)
    resetSadhanaData();

    // Notify any active components to clear their local mirror states
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new Event('storage'));
      } catch {
        // ignore
      }
    }

    // 2. Explicitly set all state arrays back to empty inside context
    setUserName('');
    setActiveView('home');
    setSadhanaLogs([]);
    setBhavaLogs([]);
    setInterceptionLogs([]);
    setTodaySadhana(null);
  }, [resetSadhanaData, setSadhanaLogs, setInterceptionLogs, setUserName, setActiveView]);

  const contextValue: BrahmaPathContextType = useMemo(
    () => ({
      activeView,
      setActiveView,
      userName,
      setUserName,
      logs,
      sadhanaLogs: logs,
      preferences: mergedPreferences,
      todayLog,
      todaySadhana,
      addOrUpdateDailyLog,
      logSadhanaPillar,
      updatePreferences: handleUpdatePreferences,
      interceptions,
      interceptionLogs: interceptions,
      bhavaLogs,
      todayBhavaLogs,
      togglePositiveBhava,
      logNegativeBhavaEncounter,
      toggleNegativeBhavaResolution,
      clearBhavaCardToday,
      logInterception,
      deleteInterception,
      resolveInterceptionById,
      toggleInterceptionResolution,
      todayInterceptionCount,
      gunaDistribution,
      doshaDiagnosis,
      chariotStatus,
      weeklyTrend,
      triggerBreakdown,
      gunaChartData,
      activeLensKey,
      activeLensData,
      openShastraLens,
      closeShastraLens,
      exportPlainJsonBackup: handleExportJson,
      importPlainJsonBackup: handleImportJson,
      exportEncryptedBackup: handleExportEncrypted,
      importEncryptedBackup: handleImportEncrypted,
      resetAllData,
      setSadhanaLogs,
      setBhavaLogs,
      setInterceptionLogs,
      setTodaySadhana,
    }),
    [
      activeView,
      setActiveView,
      userName,
      setUserName,
      logs,
      mergedPreferences,
      todayLog,
      todaySadhana,
      addOrUpdateDailyLog,
      logSadhanaPillar,
      handleUpdatePreferences,
      interceptions,
      bhavaLogs,
      todayBhavaLogs,
      togglePositiveBhava,
      logNegativeBhavaEncounter,
      toggleNegativeBhavaResolution,
      clearBhavaCardToday,
      logInterception,
      deleteInterception,
      resolveInterceptionById,
      toggleInterceptionResolution,
      todayInterceptionCount,
      gunaDistribution,
      doshaDiagnosis,
      chariotStatus,
      weeklyTrend,
      triggerBreakdown,
      gunaChartData,
      activeLensKey,
      activeLensData,
      openShastraLens,
      closeShastraLens,
      handleExportJson,
      handleImportJson,
      handleExportEncrypted,
      handleImportEncrypted,
      resetAllData,
      setSadhanaLogs,
      setBhavaLogs,
      setInterceptionLogs,
      setTodaySadhana,
    ]
  );

  return (
    <BrahmaPathContext.Provider value={contextValue}>
      {children}
    </BrahmaPathContext.Provider>
  );
}

/**
 * Access the unified BrahmaPath state and logic engine.
 */
export function useBrahmaPath(): BrahmaPathContextType {
  const context = useContext(BrahmaPathContext);
  if (!context) {
    throw new Error('useBrahmaPath must be used within a <BrahmaPathProvider>');
  }
  return context;
}
