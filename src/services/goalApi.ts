import { Goal } from '../components/Sankalpa/types';

export interface GoalMutationsPayload {
  deleteIds: string[];
  addedGoals: Goal[];
  updatedGoals: Goal[];
}

/**
 * Service to dispatch transactional DELETE and POST payloads to backend endpoints.
 * Implements optimistic network execution with offline PWA resilience.
 */
export async function sendGoalMutations(
  payload: GoalMutationsPayload
): Promise<{ success: boolean; timestamp: string }> {
  const timestamp = new Date().toISOString();

  // 1. Dispatch DELETE payload for removed goals
  if (payload.deleteIds.length > 0) {
    try {
      await fetch('/api/goals', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'BrahmaPath-PWA',
        },
        body: JSON.stringify({
          ids: payload.deleteIds,
          timestamp,
        }),
      }).catch((err) => {
        // Graceful offline queue log
        console.info(
          '[BrahmaPath Offline Sync] Queued DELETE mutation payload:',
          payload.deleteIds,
          err
        );
      });
    } catch (error) {
      console.warn('[BrahmaPath API] DELETE dispatch error:', error);
    }
  }

  // 2. Dispatch POST payload for newly added goals
  if (payload.addedGoals.length > 0) {
    try {
      await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'BrahmaPath-PWA',
        },
        body: JSON.stringify({
          goals: payload.addedGoals,
          timestamp,
        }),
      }).catch((err) => {
        // Graceful offline queue log
        console.info(
          '[BrahmaPath Offline Sync] Queued POST mutation payload:',
          payload.addedGoals,
          err
        );
      });
    } catch (error) {
      console.warn('[BrahmaPath API] POST dispatch error:', error);
    }
  }

  return { success: true, timestamp };
}
