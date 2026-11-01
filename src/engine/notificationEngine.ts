import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Offline-First Smṛti Local Notification Scheduler.
 *
 * Implements a 30-Day Rolling Explicit `at: Date` Queue (4 Fixed + 3 Random daily alerts):
 * - 4 Fixed Daily Sadhana log anchors:
 *     08:30 — Prātaḥ Smṛti (Morning Anchor)
 *     13:30 — Madhyāhna Smṛti (Midday Pause)
 *     18:30 — Sāyam Smṛti (Evening Reset)
 *     21:30 — Rātri Smṛti (Night Reflection / Bedtime)
 * - 3 Randomized Mindfulness check-ins:
 *     10:15–12:15 — Random 1: Anti-Distraction Check
 *     15:45–17:30 — Random 2: Low Mood & Emotional Support
 *     20:00–21:15 — Random 3: Night Wind-down & Digital Curfew (before 21:30 bedtime)
 *
 * Guaranteed Background Delivery (Even if user hasn't opened app recently):
 * 1. 30-day queue (up to 210 alarms) pre-armed directly in Android AlarmManager.
 * 2. Uses High-Importance Notification Channel (`brahmapath_smriti_high_v2`, importance: 5).
 * 3. Schedules explicit future Date objects with `allowWhileIdle: true` (AlarmManager.RTC_WAKEUP).
 * 4. RECEIVE_BOOT_COMPLETED re-arms all scheduled alarms if phone is restarted.
 * 5. Auto-tops up back to full 30 days whenever app is launched.
 * 6. Never fires immediately upon toggling: filters out timestamps within 15 seconds of Date.now().
 */

export const SMRITI_CHANNEL_ID = 'brahmapath_smriti_high_v2';
export const ROLLING_QUEUE_DAYS = 30; // 30-day pre-scheduled horizon

export type TimeWindowKey =
  | 'morning'
  | 'midday'
  | 'evening'
  | 'night'
  | 'random_focus'
  | 'random_mood'
  | 'random_night';

export interface TimeWindowConfig {
  key: TimeWindowKey;
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  title: string;
  body: string;
}

export interface SmritiDailySlot {
  id: number;
  hour: number;
  minute: number;
  title: string;
  body: string;
  timeWindow: TimeWindowKey;
}

/**
 * 4 Fixed Daily Log Slots
 */
export const FIXED_DAILY_SLOTS: SmritiDailySlot[] = [
  {
    id: 1,
    hour: 8,
    minute: 30,
    title: 'Prātaḥ Smṛti (Morning Anchor)',
    body: "Good morning! Review your Sankalpa and log last night's Nidrā (sleep) in the Sadhana Hub.",
    timeWindow: 'morning',
  },
  {
    id: 2,
    hour: 13,
    minute: 30,
    title: 'Madhyāhna Smṛti (Midday Pause)',
    body: 'Midday check-in: Log your morning Āhāra intake and keep your Chariot reins steady.',
    timeWindow: 'midday',
  },
  {
    id: 3,
    hour: 18,
    minute: 30,
    title: 'Sāyam Smṛti (Evening Reset)',
    body: 'Evening transition: Update your Āhāra screen time and clear any emotional friction in the Bhāva Compass.',
    timeWindow: 'evening',
  },
  {
    id: 4,
    hour: 21,
    minute: 30,
    title: 'Rātri Smṛti (Night Reflection)',
    body: "Day's end: Record your Brahmacharya focus blocks and write a brief mindful note before sleep.",
    timeWindow: 'night',
  },
];

// Backward-compatibility alias
export const SMRITI_DAILY_SLOTS = FIXED_DAILY_SLOTS;

/**
 * Prompt pools for the 3 Randomized Daily Windows
 */
export const RANDOM_PROMPTS_DISTRACTION = [
  {
    title: 'Chariot Reins Check',
    body: 'Are you holding the reins right now, or has your attention drifted? Open the Pause Gate if an urge is pulling you.',
  },
  {
    title: 'Mindful Focus Check',
    body: 'Feeling distracted or restless? Take two quiet minutes in the Breathing Sanctum to reset your rhythm.',
  },
  {
    title: 'Break the Loop',
    body: 'Notice where your mind is. If you are stuck in digital drift, log a quick Pratipaksha reframe right now.',
  },
];

export const RANDOM_PROMPTS_MOOD = [
  {
    title: 'Gentle Check-In',
    body: 'Feeling low, overwhelmed, or comparing yourself to others today? Open the Bhāva Compass—be kind to yourself.',
  },
  {
    title: 'Steady Your Heart',
    body: "If today hasn't gone according to plan, forgive the slip without guilt. You can realign your Chariot right now.",
  },
  {
    title: 'Pause & Breathe',
    body: 'Carrying any heavy thoughts or frustration this afternoon? Step away from your screen and take five slow breaths.',
  },
];

export const RANDOM_PROMPTS_NIGHT = [
  {
    title: 'Evening Wind-Down',
    body: 'Step back from intense screens and sensory overload. Let your mind begin to settle into quiet stillness.',
  },
  {
    title: 'Night Digital Curfew',
    body: 'Consider putting your phone aside. Giving your eyes a break before bed ensures your Nidrā (sleep) remains deep and restorative.',
  },
  {
    title: 'Ease the Chariot',
    body: 'Whatever is left unfinished today can wait for tomorrow. Loosen your grip, take three slow breaths, and let go of tension.',
  },
];

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'default'
  | 'unsupported';

export interface SmritiPayload {
  title: string;
  body: string;
  timestamp?: Date;
}

export type SmritiListener = (payload: SmritiPayload) => void;
const smritiListeners: Set<SmritiListener> = new Set();

/**
 * Registers an in-app listener callback invoked whenever a Smriti reminder triggers.
 */
export function onSmritiTrigger(listener: SmritiListener): () => void {
  smritiListeners.add(listener);
  return () => {
    smritiListeners.delete(listener);
  };
}

/**
 * Dispatches an in-app event to all registered Smriti listeners.
 */
export function notifySmritiListeners(payload: SmritiPayload): void {
  smritiListeners.forEach((listener) => {
    try {
      listener(payload);
    } catch (err) {
      console.error('[SmritiNotification] Error in listener callback:', err);
    }
  });
}

/**
 * Safely accesses Capacitor's native LocalNotifications plugin when available.
 */
export const getNativeLocalNotifications = () =>
  typeof window !== 'undefined'
    ? (window as any).Capacitor?.Plugins?.LocalNotifications
    : undefined;

/**
 * Checks if notifications are supported.
 */
export function isNotificationSupported(): boolean {
  if (getNativeLocalNotifications()) return true;
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Returns current permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermissionStatus {
  if (getNativeLocalNotifications()) {
    return 'granted';
  }
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  return getNotificationPermissionStatus();
}

/**
 * Requests notification permissions across native Capacitor and standard Web platforms.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const permStatus = await LocalNotifications.requestPermissions();
    if (permStatus.display === 'granted') {
      return true;
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  } catch (error) {
    console.error('[SmritiNotification] Error requesting notification permissions:', error);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Creates the high-importance Android notification channel for reliable lockscreen & Doze wakeup.
 */
async function ensureHighImportanceChannel(): Promise<void> {
  try {
    await LocalNotifications.createChannel({
      id: SMRITI_CHANNEL_ID,
      name: 'Smṛti Mindful Anchors',
      description: 'Daily Sadhana log reminders and mindful check-ins',
      importance: 5, // MAX importance for lockscreen & closed-app wakeup
      visibility: 1, // PUBLIC
      vibration: true,
    });
  } catch (err) {
    console.warn('[SmritiNotification] Failed to create notification channel:', err);
  }
}

/**
 * Schedules the 30-Day Rolling Explicit `at: Date` Queue (4 Fixed + 3 Random daily alerts).
 *
 * Ensures long-term background delivery even if the user hasn't opened the app for weeks.
 * Prevents immediate firing by strictly skipping timestamps that have already passed (or are <= Date.now() + 15000).
 */
export async function scheduleDailySmritiAlarms(): Promise<boolean> {
  try {
    // 1. Ensure high-importance notification channel is registered
    await ensureHighImportanceChannel();

    // 2. Query and cancel existing pending alarms to avoid duplicates
    try {
      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications && pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map((n) => ({ id: n.id })),
        });
      }
    } catch (cancelErr) {
      console.warn('[SmritiNotification] Warning querying/cancelling pending alarms:', cancelErr);
    }

    // 3. Prepare the 30-day rolling queue (4 Fixed + 3 Randomized per day = 7 alarms/day)
    const notificationsToSchedule: Array<{
      id: number;
      title: string;
      body: string;
      channelId: string;
      schedule: {
        at: Date;
        allowWhileIdle: boolean;
      };
      smallIcon?: string;
      iconColor?: string;
    }> = [];

    const now = new Date();
    const nowMs = now.getTime();
    const thresholdMs = nowMs + 15000; // 15-second safety buffer: never fire immediately

    for (let dayOffset = 0; dayOffset < ROLLING_QUEUE_DAYS; dayOffset++) {
      const dayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);

      // --- Slot 0: Fixed 08:30 (Morning Anchor) ---
      const morningDate = new Date(dayBase);
      morningDate.setHours(8, 30, 0, 0);
      if (morningDate.getTime() > thresholdMs) {
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 0,
          title: FIXED_DAILY_SLOTS[0].title,
          body: FIXED_DAILY_SLOTS[0].body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: morningDate, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }

      // --- Slot 1: Random Window 1 (Anti-Distraction: between 10:15 and 12:15) ---
      const offset1Mins = Math.floor(Math.random() * 121);
      const randomTime1 = new Date(dayBase);
      randomTime1.setHours(10, 15 + offset1Mins, 0, 0);
      if (randomTime1.getTime() > thresholdMs) {
        const prompt1 = RANDOM_PROMPTS_DISTRACTION[Math.floor(Math.random() * RANDOM_PROMPTS_DISTRACTION.length)];
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 1,
          title: prompt1.title,
          body: prompt1.body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: randomTime1, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }

      // --- Slot 2: Fixed 13:30 (Midday Pause) ---
      const middayDate = new Date(dayBase);
      middayDate.setHours(13, 30, 0, 0);
      if (middayDate.getTime() > thresholdMs) {
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 2,
          title: FIXED_DAILY_SLOTS[1].title,
          body: FIXED_DAILY_SLOTS[1].body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: middayDate, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }

      // --- Slot 3: Random Window 2 (Low Mood & Emotional Support: between 15:45 and 17:30) ---
      const offset2Mins = Math.floor(Math.random() * 106);
      const randomTime2 = new Date(dayBase);
      randomTime2.setHours(15, 45 + offset2Mins, 0, 0);
      if (randomTime2.getTime() > thresholdMs) {
        const prompt2 = RANDOM_PROMPTS_MOOD[Math.floor(Math.random() * RANDOM_PROMPTS_MOOD.length)];
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 3,
          title: prompt2.title,
          body: prompt2.body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: randomTime2, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }

      // --- Slot 4: Fixed 18:30 (Evening Reset) ---
      const eveningDate = new Date(dayBase);
      eveningDate.setHours(18, 30, 0, 0);
      if (eveningDate.getTime() > thresholdMs) {
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 4,
          title: FIXED_DAILY_SLOTS[2].title,
          body: FIXED_DAILY_SLOTS[2].body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: eveningDate, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }

      // --- Slot 5: Random Window 3 (Night Calm & Wind-down: between 20:00 and 21:15, before bedtime) ---
      const offset3Mins = Math.floor(Math.random() * 76);
      const randomTime3 = new Date(dayBase);
      randomTime3.setHours(20, offset3Mins, 0, 0);
      if (randomTime3.getTime() > thresholdMs) {
        const prompt3 = RANDOM_PROMPTS_NIGHT[Math.floor(Math.random() * RANDOM_PROMPTS_NIGHT.length)];
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 5,
          title: prompt3.title,
          body: prompt3.body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: randomTime3, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }

      // --- Slot 6: Fixed 21:30 (Night Reflection / Bedtime) ---
      const nightDate = new Date(dayBase);
      nightDate.setHours(21, 30, 0, 0);
      if (nightDate.getTime() > thresholdMs) {
        notificationsToSchedule.push({
          id: 3000 + dayOffset * 10 + 6,
          title: FIXED_DAILY_SLOTS[3].title,
          body: FIXED_DAILY_SLOTS[3].body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: { at: nightDate, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        });
      }
    }

    if (notificationsToSchedule.length > 0) {
      await LocalNotifications.schedule({
        notifications: notificationsToSchedule,
      });
      console.log(
        `[SmritiNotification] Scheduled ${notificationsToSchedule.length} explicit future Smṛti alarms across next ${ROLLING_QUEUE_DAYS} days (4 fixed + 3 random daily).`
      );
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('bp_notifications_enabled', 'true');
    }

    return true;
  } catch (err) {
    console.error('[SmritiNotification] Failed to schedule Smṛti alarms:', err);
    return false;
  }
}

/**
 * Cancels all scheduled OS-level Smṛti notifications and marks them disabled.
 */
export async function cancelDailySmritiAlarms(): Promise<void> {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending && pending.notifications && pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map((n) => ({ id: n.id })),
      });
    }

    // Cancel all possible queue ID ranges (3000..3400, legacy 1000..1200, 101..104, 999)
    const extraIdsToCancel: number[] = [101, 102, 103, 104, 999];
    for (let d = 0; d < 35; d++) {
      for (let s = 0; s < 10; s++) {
        extraIdsToCancel.push(3000 + d * 10 + s);
        extraIdsToCancel.push(1000 + d * 10 + s);
      }
    }
    await LocalNotifications.cancel({
      notifications: extraIdsToCancel.map((id) => ({ id })),
    }).catch(() => {});

    console.log('[SmritiNotification] Cancelled all pending Smṛti notifications.');
  } catch (err) {
    console.warn('[SmritiNotification] Error cancelling native notifications:', err);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('bp_notifications_enabled', 'false');
  }
}

/**
 * Fires an immediate test notification via Capacitor LocalNotifications and in-app listeners.
 */
export async function sendTestNotification(
  title: string = 'Smriti Check-in — Brahma Path',
  body: string = 'Take a conscious breath. Where is your attention anchored right now?'
): Promise<{ osFired: boolean; inAppFired: boolean }> {
  let osFired = false;

  try {
    await ensureHighImportanceChannel();
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999,
          title,
          body,
          channelId: SMRITI_CHANNEL_ID,
          schedule: {
            at: new Date(Date.now() + 1000),
            allowWhileIdle: true,
          },
          smallIcon: 'ic_stat_icon',
          iconColor: '#065F46',
        },
      ],
    });
    osFired = true;
  } catch (err) {
    console.warn('[SmritiNotification] Test notification via LocalNotifications failed:', err);
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/logo.png' });
        osFired = true;
      } catch (e) {
        console.warn('[SmritiNotification] Web Notification fallback failed:', e);
      }
    }
  }

  notifySmritiListeners({
    title,
    body,
    timestamp: new Date(),
  });

  return { osFired, inAppFired: true };
}

/**
 * Backward compatibility exports
 */
export function clearScheduledNotifications(): void {
  cancelDailySmritiAlarms().catch(() => {});
}

export function scheduleSmritiNotifications(): void {
  scheduleDailySmritiAlarms().catch(() => {});
}
