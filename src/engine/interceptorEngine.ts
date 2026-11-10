import { InterceptionRecord } from '../types/iks';

/**
 * Helper to determine if an interception record represents a successful Impulse Interceptor reframe.
 * First checks explicit negative flags to prevent slips/unresolved frictions from counting as successes.
 * Then checks positive flags (isSuccessful, isResolved, Sattvic transition, or pratipaksha reframe text).
 */
export function isInterceptionSuccessful(item: InterceptionRecord | any): boolean {
  if (!item) return false;

  // 1. First check explicit negative flags (unresolved friction, honest slips, explicit false)
  if (
    item.isSuccessful === false ||
    item.success === false ||
    item.resolved === false ||
    item.isResolved === false ||
    item.interactionType === 'unresolved_negative_friction'
  ) {
    return false;
  }

  // 2. Then check positive flags
  if (
    item.isSuccessful === true ||
    item.isResolved === true ||
    item.success === true ||
    item.resolved === true ||
    item.interactionType === 'resolved_negative_friction' ||
    item.resolvedGunaState === 'Sattva'
  ) {
    return true;
  }

  // 3. Fallback: check meaningful pratipaksha reframe formulation
  return Boolean(item.pratipakshaText && item.pratipakshaText.trim().length > 0);
}

/**
 * Structured statistical overview of today's Impulse Interceptor activity
 * for dynamic Chariot Composure weighting and telemetry gauges.
 */
export interface InterceptionStats {
  hasActivityToday: boolean;
  prqScore: number;
  interceptedCount: number;
  slipCount: number;
}

/**
 * Calculates today's Pratipaksha Resilience Quotient (PRQ) and activity statistics:
 *
 * If todayEvents.length === 0:
 *   hasActivityToday = false, prqScore = 0.
 * If todayEvents.length > 0:
 *   hasActivityToday = true.
 *   If interceptedEvents.length === 0 (user only logged Honest Slips today):
 *     prqScore = 0 (active negative score that actively pulls Chariot Composure down!).
 *   Else:
 *     posWeight = sum(0.7 + 0.3 * (e.urgeIntensity || 3))
 *     negWeight = sum(0.8 + 0.35 * (e.urgeIntensity || 3))
 *     rawRatio = posWeight / (posWeight + negWeight)
 *     totalInterceptedIntensity = sum(e.urgeIntensity || 3)
 *     intensityFactor = Math.min(1.0, 0.78 + 0.045 * totalInterceptedIntensity)
 *     prqScore = Math.round(100 * rawRatio * intensityFactor)
 */
export function calculateInterceptionStats(
  todayEvents: InterceptionRecord[] = []
): InterceptionStats {
  if (!todayEvents || todayEvents.length === 0) {
    return {
      hasActivityToday: false,
      prqScore: 0,
      interceptedCount: 0,
      slipCount: 0,
    };
  }

  const interceptedEvents = todayEvents.filter((e) => isInterceptionSuccessful(e));
  const slipEvents = todayEvents.filter((e) => !isInterceptionSuccessful(e));

  const interceptedCount = interceptedEvents.length;
  const slipCount = slipEvents.length;

  // Active negative score: 0 if user only logged slips today
  if (interceptedCount === 0) {
    return {
      hasActivityToday: true,
      prqScore: 0,
      interceptedCount: 0,
      slipCount,
    };
  }

  const posWeight = interceptedEvents.reduce(
    (sum, e) => sum + (0.7 + 0.3 * (e.urgeIntensity || 3)),
    0
  );
  const negWeight = slipEvents.reduce(
    (sum, e) => sum + (0.8 + 0.35 * (e.urgeIntensity || 3)),
    0
  );
  const rawRatio = posWeight / (posWeight + negWeight);

  const totalInterceptedIntensity = interceptedEvents.reduce(
    (sum, e) => sum + (e.urgeIntensity || 3),
    0
  );
  const intensityFactor = Math.min(1.0, 0.78 + 0.045 * totalInterceptedIntensity);
  const prqScore = Math.max(0, Math.min(100, Math.round(100 * rawRatio * intensityFactor)));

  return {
    hasActivityToday: true,
    prqScore,
    interceptedCount,
    slipCount,
  };
}

/**
 * Detailed breakdown of the Pratipaksha Resilience Quotient (PRQ) metrics.
 */
export interface PRQBreakdown {
  totalCognitiveLoad: number;
  successfulCognitiveLoad: number;
  totalSuccessfulIntercepts: number;
  baseScore: number;
  bonus: number;
  gateScore: number;
}

/**
 * Calculates the Pratipaksha Resilience Quotient (PRQ) / GateScore
 * rooted in Bhagavad Gita 2.62-63 cascade interception and Patanjali Yoga Sutra 2.33.
 * Delegates to calculateInterceptionStats for consistent dynamic weighting.
 *
 * @param interceptions Array of InterceptionRecord items logged today
 * @returns GateScore clamped between 0 and 100
 */
export function calculateGateScore(interceptions: InterceptionRecord[] = []): number {
  const stats = calculateInterceptionStats(interceptions);
  return stats.prqScore;
}

/**
 * Computes a full analytical breakdown of the PRQ GateScore for telemetry and gauges.
 */
export function getPRQBreakdown(interceptions: InterceptionRecord[] = []): PRQBreakdown {
  const stats = calculateInterceptionStats(interceptions);

  if (!interceptions || interceptions.length === 0) {
    return {
      totalCognitiveLoad: 0,
      successfulCognitiveLoad: 0,
      totalSuccessfulIntercepts: 0,
      baseScore: 0,
      bonus: 0,
      gateScore: 0,
    };
  }

  let totalCognitiveLoad = 0;
  let successfulCognitiveLoad = 0;

  for (const item of interceptions) {
    const intensity =
      typeof item.urgeIntensity === 'number' && item.urgeIntensity > 0
        ? item.urgeIntensity
        : 1;

    totalCognitiveLoad += intensity;

    if (isInterceptionSuccessful(item)) {
      successfulCognitiveLoad += intensity;
    }
  }

  return {
    totalCognitiveLoad,
    successfulCognitiveLoad,
    totalSuccessfulIntercepts: stats.interceptedCount,
    baseScore: stats.prqScore,
    bonus: 0,
    gateScore: stats.prqScore,
  };
}
