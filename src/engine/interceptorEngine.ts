import { InterceptionRecord } from '../types/iks';

/**
 * Helper to determine if an interception record represents a successful Pause Gate reframe.
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
 *
 * Part 1 (Intensity-Weighted Ratio & Dynamic Sensitivity):
 * - Calculate total Cognitive Load: Denominator = sum of all urgeIntensity values logged today.
 * - Numerator = sum of urgeIntensity for only the successful interceptions.
 * - Dynamic Sensitivity: If all logged urges are successful (successfulCognitiveLoad === totalCognitiveLoad > 0),
 *   BaseScore starts at 85 + Math.min(10, totalCognitiveLoad * 1.5).
 * - Otherwise: BaseScore = (Numerator / Denominator) * 100.
 *
 * Part 2 (Stamina Bonus):
 * - Logarithmic Stamina Bonus: Bonus = (Total Successful Intercepts) * 2.5.
 *
 * Final Math:
 * - GateScore = Math.min(100, BaseScore + Bonus).
 *
 * Edge Case:
 * - If interceptions.length === 0, return 100 (Neutral baseline when no urges occurred).
 *
 * @param interceptions Array of InterceptionRecord items logged today
 * @returns GateScore clamped between 0 and 100
 */
export function calculateGateScore(interceptions: InterceptionRecord[]): number {
  // Edge Case: If interceptions.length === 0, return 100
  if (!interceptions || interceptions.length === 0) {
    return 100;
  }

  let totalCognitiveLoad = 0;
  let successfulCognitiveLoad = 0;
  let totalSuccessfulIntercepts = 0;

  for (const item of interceptions) {
    const intensity =
      typeof item.urgeIntensity === 'number' && item.urgeIntensity > 0
        ? item.urgeIntensity
        : 1;

    totalCognitiveLoad += intensity;

    if (isInterceptionSuccessful(item)) {
      successfulCognitiveLoad += intensity;
      totalSuccessfulIntercepts += 1;
    }
  }

  // Edge Case: If total cognitive load is 0, return 100
  if (totalCognitiveLoad === 0) {
    return 100;
  }

  // Part 1: Intensity-Weighted Ratio with Dynamic Sensitivity
  let baseScore: number;
  if (successfulCognitiveLoad === totalCognitiveLoad && interceptions.length > 0) {
    baseScore = 85 + Math.min(10, totalCognitiveLoad * 1.5);
  } else {
    baseScore = (successfulCognitiveLoad / totalCognitiveLoad) * 100;
  }

  // Part 2: Stamina Bonus
  const bonus = totalSuccessfulIntercepts * 2.5;

  // Final Math: GateScore = Math.min(100, BaseScore + Bonus)
  return Math.min(100, Math.round(baseScore + bonus));
}

/**
 * Computes a full analytical breakdown of the PRQ GateScore for telemetry and gauges.
 */
export function getPRQBreakdown(interceptions: InterceptionRecord[]): PRQBreakdown {
  if (!interceptions || interceptions.length === 0) {
    return {
      totalCognitiveLoad: 0,
      successfulCognitiveLoad: 0,
      totalSuccessfulIntercepts: 0,
      baseScore: 100,
      bonus: 0,
      gateScore: 100,
    };
  }

  let totalCognitiveLoad = 0;
  let successfulCognitiveLoad = 0;
  let totalSuccessfulIntercepts = 0;

  for (const item of interceptions) {
    const intensity =
      typeof item.urgeIntensity === 'number' && item.urgeIntensity > 0
        ? item.urgeIntensity
        : 1;

    totalCognitiveLoad += intensity;

    if (isInterceptionSuccessful(item)) {
      successfulCognitiveLoad += intensity;
      totalSuccessfulIntercepts += 1;
    }
  }

  if (totalCognitiveLoad === 0) {
    return {
      totalCognitiveLoad: 0,
      successfulCognitiveLoad: 0,
      totalSuccessfulIntercepts: 0,
      baseScore: 100,
      bonus: 0,
      gateScore: 100,
    };
  }

  let baseScore: number;
  if (successfulCognitiveLoad === totalCognitiveLoad && interceptions.length > 0) {
    baseScore = 85 + Math.min(10, totalCognitiveLoad * 1.5);
  } else {
    baseScore = (successfulCognitiveLoad / totalCognitiveLoad) * 100;
  }

  const bonus = totalSuccessfulIntercepts * 2.5;
  const gateScore = Math.min(100, Math.round(baseScore + bonus));

  return {
    totalCognitiveLoad,
    successfulCognitiveLoad,
    totalSuccessfulIntercepts,
    baseScore: Math.round(baseScore * 10) / 10,
    bonus: Math.round(bonus * 10) / 10,
    gateScore,
  };
}
