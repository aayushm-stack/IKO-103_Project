import {
  AharaLog,
  NidraLog,
  BrahmacharyaLog,
  YuktaBalanceSummary,
  DoshaType,
} from '../types/iks';

export interface ScreenTimeZoneEvaluation {
  zone: 'deep_recovery' | 'steady_reduction' | 'maintained' | 'above_baseline';
  points: number; // Out of 12 max Ahara screen points
  shortBadge: string; // Concise pill label for Vault & Sadhana
  sadhanaFeedback: string; // Supportive psychological message shown below the Sadhana slider
  pillStyle: {
    bg: string;
    text: string;
    border: string;
    dot: string;
  };
}

/**
 * Evaluates screen time into a supportive category and feedback.
 * Uses a smooth continuous formula internally for scoring (0–12 pts).
 */
export function evaluateScreenTimeZone(
  digitalMinutes: number,
  baselineMinutes: number = 360
): ScreenTimeZoneEvaluation {
  const safeBaseline = Math.max(60, baselineMinutes || 360);
  const mins = Math.max(0, digitalMinutes);
  const r = mins / safeBaseline;

  // Continuous relative screen time calculation (0–12 pts)
  let points = 0;
  if (r <= 0.75) {
    points = Math.round(12 - 2.67 * r);
  } else if (r <= 1.0) {
    points = Math.round(10 - 12 * (r - 0.75));
  } else {
    points = Math.max(0, Math.round(7 - 11.67 * (r - 1.0)));
  }

  // Zone 1: Deep Recovery (<= 50% of personal baseline)
  if (r <= 0.5) {
    return {
      zone: 'deep_recovery',
      points,
      shortBadge: 'Significantly Dropped',
      sadhanaFeedback:
        'Significant drop below your average! You reclaimed deep hours from the screen today and honored your inner Sankalpa.',
      pillStyle: {
        bg: '#DEF7EC',
        text: '#065F46',
        border: '#86EFAC',
        dot: '#059669',
      },
    };
  }

  // Zone 2: Steady Reduction (50% to 85% of personal baseline)
  if (r <= 0.85) {
    return {
      zone: 'steady_reduction',
      points,
      shortBadge: 'Dropped a Bit',
      sadhanaFeedback:
        'Yes, you recovered well! You stepped back from your usual screen habit today and redirected energy toward real focus.',
      pillStyle: {
        bg: '#ECFDF5',
        text: '#047857',
        border: '#A7F3D0',
        dot: '#10B981',
      },
    };
  }

  // Zone 3: Maintained Baseline (85% to 112.5% of personal baseline)
  if (r <= 1.125) {
    return {
      zone: 'maintained',
      points,
      shortBadge: 'Maintained Urges',
      sadhanaFeedback:
        'You held your ground within your current average. You are containing your urges steadily—keep trying gently to step this down.',
      pillStyle: {
        bg: '#FEF3C7',
        text: '#92400E',
        border: '#FDE68A',
        dot: '#D97706',
      },
    };
  }

  // Zone 4: Above Baseline (> 112.5% of personal baseline)
  return {
    zone: 'above_baseline',
    points,
    shortBadge: 'Above Average',
    sadhanaFeedback:
      'You used your screen more than your average today. Remember your Sankalpa pledge—do not judge yourself, forgive the drift, and reclaim your focus tomorrow.',
    pillStyle: {
      bg: '#FEE2E2',
      text: '#991B1B',
      border: '#FECACA',
      dot: '#DC2626',
    },
  };
}

/**
 * Computes individual pillar scores for Ahara, Nidra, and Brahmacharya.
 * Returns exact individual scores: ahara (0–34), nidra (0–33), brahmacharya (0–33).
 * If loggedPillars is passed:
 *   - ahara returns 0 if loggedPillars.ahara is false
 *   - nidra returns 0 if loggedPillars.nidra is false
 *   - brahmacharya returns 0 if loggedPillars.brahmacharya is false
 */
export function getPillarScores(
  ahara: AharaLog,
  nidra: NidraLog,
  brahmacharya: BrahmacharyaLog,
  loggedPillars?: { ahara?: boolean; nidra?: boolean; brahmacharya?: boolean }
): {
  ahara: number;
  nidra: number;
  brahmacharya: number;
} {
  // -------------------------------------------------------------
  // 1. Āhāra Pillar (Max 34 pts, returns 0 if loggedPillars && !loggedPillars.ahara)
  // -------------------------------------------------------------
  let nutritionPts = 0;
  if (ahara.watchStimulantProfile) {
    if (ahara.watchStimulantProfile === 'balanced_ration') {
      nutritionPts = 10;
    } else if (ahara.watchStimulantProfile === 'high_watch_caffeine') {
      nutritionPts = 6;
    } else {
      nutritionPts = 2; // irregular_missed
    }
  } else {
    if (ahara.nutritionQuality === 'Sattvic') {
      nutritionPts = 10;
    } else if (ahara.nutritionQuality === 'Rajasic') {
      nutritionPts = 6;
    } else {
      nutritionPts = 2; // Tamasic
    }
  }

  // Continuous Relative Screen Time (0–12 pts)
  const defaultBaselineMinutes = 360;
  const baseline = Math.max(60, ahara.baselineMinutesAtLog ?? defaultBaselineMinutes);
  const digitalMins = Math.max(0, ahara.digitalConsumptionMinutes || 0);
  const r = digitalMins / baseline;
  let screenPts = 0;
  if (r <= 0.75) {
    screenPts = Math.round(12 - 2.67 * r); // 12 down to 10 pts
  } else if (r <= 1.0) {
    screenPts = Math.round(10 - 12 * (r - 0.75)); // 10 down to 7 pts
  } else {
    screenPts = Math.max(0, Math.round(7 - 11.67 * (r - 1.0))); // 7 down to 0 pts
  }

  // Sensory Mindfulness / Call Digestion Slider (1–5 -> 0–12 pts)
  const mindfulScore = ahara.sensoryMindfulnessScore || 1;
  const mindfulPts = Math.max(0, Math.min(12, Math.round((mindfulScore - 1) * 3))); // 0, 3, 6, 9, 12 pts

  let aharaScore = Math.min(34, nutritionPts + screenPts + mindfulPts);
  if (loggedPillars && !loggedPillars.ahara) {
    aharaScore = 0;
  }

  // -------------------------------------------------------------
  // 2. Nidrā Pillar (Max 33 pts, returns 0 if loggedPillars && !loggedPillars.nidra)
  // -------------------------------------------------------------
  // Continuous Sleep Hours (0–12h, step 0.5 -> 0–15 pts)
  const h = Math.max(0, nidra.hoursSlept || 0);
  let sleepPts = 0;
  if (h <= 7.5) {
    sleepPts = Math.round((h / 7.5) * 15); // +1 pt for every 0.5h
  } else if (h <= 8.5) {
    sleepPts = 15;
  } else {
    sleepPts = Math.max(6, Math.round(15 - (h - 8.5) * 2)); // gentle oversleep taper
  }

  // Split-Sentry Tactical Compensation (+3 pts capped at 15 if h >= 4.5 && h < 7.5)
  if (nidra.watchRestProtocol === 'split_sentry_kurma' && h >= 4.5 && h < 7.5) {
    sleepPts = Math.min(15, sleepPts + 3);
  }

  // Consistency / Watch Rest Protocol (0–8 pts)
  let consistencyPts = 0;
  if (nidra.watchRestProtocol) {
    if (nidra.watchRestProtocol === 'continuous_bunk') {
      consistencyPts = 8;
    } else if (nidra.watchRestProtocol === 'split_sentry_kurma') {
      consistencyPts = 8;
    } else {
      consistencyPts = 2; // post_watch_hypervigilance
    }
  } else {
    consistencyPts = nidra.bedtimeConsistency ? 8 : 2;
  }

  // Sleep Quality (0–10 pts): 'Restorative' -> 10, 'Fragmented' -> 5, 'Depleted' -> 1
  let qualityPts = 1;
  const rq = nidra.restQuality as string;
  if (rq === 'Restorative') {
    qualityPts = 10;
  } else if (rq === 'Fragmented' || rq === 'Disturbed') {
    qualityPts = 5;
  } else {
    qualityPts = 1; // Depleted or Lethargic
  }

  let nidraScore = Math.min(33, sleepPts + consistencyPts + qualityPts);
  if (loggedPillars && !loggedPillars.nidra) {
    nidraScore = 0;
  }

  // -------------------------------------------------------------
  // 3. Brahmacharya / Vīrya Pillar (Max 33 pts, returns 0 if loggedPillars && !loggedPillars.brahmacharya)
  // -------------------------------------------------------------
  // Energy Conservation / Ojas Coping Reserve Slider (1–5 -> 0–12 pts)
  const energyScore =
    (brahmacharya as any).energyConservationScore ??
    brahmacharya.energyConservationRating ??
    1;
  const energyPts = Math.max(0, Math.min(12, Math.round((energyScore - 1) * 3))); // 0, 3, 6, 9, 12 pts

  // Focus Sessions / Grounding Wins (0–13 pts)
  const blocks = Math.max(0, brahmacharya.focusedStudyBlocks || 0);
  let focusPts = 0;
  if (brahmacharya.sahyogCohesion !== undefined) {
    // Stage 2 Defense 0–6 scale
    focusPts = Math.min(13, Math.round(blocks * 3.25));
  } else {
    // Stage 1 Civilian 0–10 scale
    focusPts = Math.min(13, Math.round(blocks * 2.2));
  }

  // Guna / Sahyog Cohesion (0–8 pts)
  let gunaPts = 1;
  if (brahmacharya.sahyogCohesion) {
    if (brahmacharya.sahyogCohesion === 'sahyog_connected') {
      gunaPts = 8;
    } else if (brahmacharya.sahyogCohesion === 'command_friction') {
      gunaPts = 4;
    } else {
      gunaPts = 1; // barracks_isolated
    }
  } else {
    if (brahmacharya.dominantGuna === 'Sattva') {
      gunaPts = 8;
    } else if (brahmacharya.dominantGuna === 'Rajas') {
      gunaPts = 4;
    } else {
      gunaPts = 1; // Tamas
    }
  }

  let brahmacharyaScore = Math.min(33, energyPts + focusPts + gunaPts);
  if (loggedPillars && !loggedPillars.brahmacharya) {
    brahmacharyaScore = 0;
  }

  return {
    ahara: Math.min(34, Math.max(0, aharaScore)),
    nidra: Math.min(33, Math.max(0, nidraScore)),
    brahmacharya: Math.min(33, Math.max(0, brahmacharyaScore)),
  };
}

/**
 * Computes an integer Yukta balance score (0-100) based on Bhagavad Gita 6.17.
 * Moderation is rewarded; both sensory/sleep deprivation and excess are penalized.
 * Supports independently logged pillars with proportional dynamic denominators.
 */
export function computeYuktaScore(
  ahara: AharaLog,
  nidra: NidraLog,
  brahmacharya: BrahmacharyaLog,
  loggedPillars?: { ahara?: boolean; nidra?: boolean; brahmacharya?: boolean }
): number {
  const scores = getPillarScores(ahara, nidra, brahmacharya);

  const pillars = !loggedPillars
    ? { ahara: true, nidra: true, brahmacharya: true }
    : loggedPillars;

  let earned = 0;
  let maxPossible = 0;

  if (pillars.ahara) {
    earned += scores.ahara;
    maxPossible += 34;
  }
  if (pillars.nidra) {
    earned += scores.nidra;
    maxPossible += 33;
  }
  if (pillars.brahmacharya) {
    earned += scores.brahmacharya;
    maxPossible += 33;
  }

  if (maxPossible === 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((earned / maxPossible) * 100)));
}

/** Export calculateYuktaScore alias for full compatibility */
export const calculateYuktaScore = computeYuktaScore;

/**
 * Evaluates a complete balance diagnostic summary across the Trayopastambha pillars.
 * Detects the limiting pillar and provides shastra-grounded recommendations from Charaka Su. 11.35 / Gita 6.17.
 */
export function evaluateYuktaSummary(
  ahara: AharaLog,
  nidra: NidraLog,
  brahmacharya: BrahmacharyaLog,
  loggedPillars?: { ahara?: boolean; nidra?: boolean; brahmacharya?: boolean }
): YuktaBalanceSummary {
  const overallScore = computeYuktaScore(ahara, nidra, brahmacharya, loggedPillars);
  const scores = getPillarScores(ahara, nidra, brahmacharya, loggedPillars);

  const aharaPct = (scores.ahara / 34) * 100;
  const nidraPct = (scores.nidra / 33) * 100;
  const brahmacharyaPct = (scores.brahmacharya / 33) * 100;

  // Determine limiting sub-pillar
  let limitingPillar: 'Ahara' | 'Nidra' | 'Brahmacharya' | 'None' = 'None';
  if (overallScore < 75 || Math.min(aharaPct, nidraPct, brahmacharyaPct) < 65) {
    if (aharaPct <= nidraPct && aharaPct <= brahmacharyaPct) {
      limitingPillar = 'Ahara';
    } else if (nidraPct <= aharaPct && nidraPct <= brahmacharyaPct) {
      limitingPillar = 'Nidra';
    } else {
      limitingPillar = 'Brahmacharya';
    }
  }

  // Determine balance status (Yukta, Ati, or Hina)
  let status: 'Yukta_Balanced' | 'Ati_Excess' | 'Hina_Deficit';
  if (overallScore >= 75) {
    status = 'Yukta_Balanced';
  } else if (
    nidra.hoursSlept > 8.5 ||
    ahara.digitalConsumptionMinutes > (ahara.baselineMinutesAtLog ?? 360) * 1.125 ||
    ahara.nutritionQuality === 'Tamasic' ||
    nidra.restQuality === 'Lethargic'
  ) {
    status = 'Ati_Excess';
  } else {
    status = 'Hina_Deficit';
  }

  // Determine aggravated dosha tendency
  let aggravatedDosha: DoshaType = 'Vata';
  if (
    ahara.digitalConsumptionMinutes > (ahara.baselineMinutesAtLog ?? 360) * 1.125 ||
    nidra.hoursSlept < 6.0 ||
    nidra.restQuality === 'Disturbed'
  ) {
    aggravatedDosha = 'Vata';
  } else if (
    ahara.nutritionQuality === 'Rajasic' ||
    brahmacharya.dominantGuna === 'Rajas'
  ) {
    aggravatedDosha = 'Pitta';
  } else if (
    nidra.hoursSlept > 8.5 ||
    nidra.restQuality === 'Lethargic' ||
    ahara.nutritionQuality === 'Tamasic'
  ) {
    aggravatedDosha = 'Kapha';
  }

  // Generate shastra-grounded recommendation
  let recommendation: string;
  if (limitingPillar === 'Ahara') {
    recommendation =
      'Charaka Samhita Sutrasthana 11.35 establishes Āhāra (wholesome nutrition and disciplined sensory intake) as the primary life pillar. Moderating digital screen exposure to <120m and prioritizing fresh, Sattvic food directly protects mental clarity and digestive Agni.';
  } else if (limitingPillar === 'Nidra') {
    recommendation =
      'Bhagavad Gita 6.17 emphasizes "yukta-svapnāvabodha" (temperate sleep and waking). Aim for 6.5 to 8.0 hours of consistent rest. Both acute sleep deprivation (<5h) and excessive Tamasic slumber (>9.5h) disturb neuro-cognitive recovery and aggravate Doshas.';
  } else if (limitingPillar === 'Brahmacharya') {
    recommendation =
      'Charaka Samhita Sutrasthana 11.35 highlights Brahmacharya as the preservation of vital cognitive vitality and sensory restraint. Shielding deep study blocks from fragmentation channels scattered Rajas into steady Sattvic discernment.';
  } else {
    recommendation =
      'Bhagavad Gita 6.17: "yuktāhāra-vihārasya yukta-ceṣṭasya karmasu... yogo bhavati duḥkha-hā" — Your Trayopastambha pillars are in harmonious equilibrium. Maintain steady practice (Dṛḍha-bhūmi) with gentle consistency.';
  }

  return {
    overallScore,
    status,
    limitingPillar,
    recommendation,
    aggravatedDosha,
  };
}
