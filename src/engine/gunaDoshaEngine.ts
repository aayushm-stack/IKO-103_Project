import {
  GunaType,
  DoshaType,
  GunaDistribution,
  TrayopastambhaLog,
  InterceptionRecord,
  BhavaLog,
} from '../types/iks';

/**
 * Proportional Tri-Dosha balance distribution.
 */
export interface DoshaDistribution {
  vata: number;
  pitta: number;
  kapha: number;
}

/**
 * Diagnostic result detailing biological humor imbalance and classical Ayurvedic remedies.
 */
export interface DoshaDiagnosisResult {
  aggravatedDosha: DoshaType;
  cause: string;
  dinacharyaRemedy: string;
  dietaryAdvice: string;
  pranayamaSuggestion: string;
  physicalRemedy: string;
  doshaScores: DoshaDistribution;
  normalizedPercentages: DoshaDistribution;
}

/**
 * Computes a normalized Tri-Guna distribution (sattva + rajas + tamas === 100)
 * reflecting recent behavioral patterns across nourishment, sleep, vital focus, urge loops,
 * and emotional friction/buffering from the Bhāva Compass.
 * Smoothly reactive to continuous slider adjustments.
 * Supports optional Sentinel telemetry when present.
 */
export function calculateGunaDistribution(
  logs: TrayopastambhaLog[] = [],
  interceptions: InterceptionRecord[] = [],
  bhavaLogs: BhavaLog[] = []
): GunaDistribution {
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeInterceptions = Array.isArray(interceptions) ? interceptions : [];
  const safeBhavaLogs = Array.isArray(bhavaLogs) ? bhavaLogs : [];

  if (
    safeLogs.length === 0 &&
    safeInterceptions.length === 0 &&
    safeBhavaLogs.length === 0
  ) {
    return { sattva: 50, rajas: 35, tamas: 15 };
  }

  let sattvaWeight = 0;
  let rajasWeight = 0;
  let tamasWeight = 0;

  // 1. Evaluate recent sadhana logs (chronologically sorted descending, taking recent 7)
  const recentLogs = [...safeLogs]
    .sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date).getTime() || 0;
      const timeB = new Date(b.timestamp || b.date).getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 7);

  for (const log of recentLogs) {
    if (!log) continue;

    const hasAhara = log.loggedPillars ? Boolean(log.loggedPillars.ahara) : true;
    const hasNidra = log.loggedPillars ? Boolean(log.loggedPillars.nidra) : true;
    const hasBrahmacharya = log.loggedPillars ? Boolean(log.loggedPillars.brahmacharya) : true;

    // Ahara (Dietary & Sensory quality)
    if (hasAhara && log.ahara) {
      if (log.ahara.nutritionQuality === 'Sattvic') {
        sattvaWeight += 12;
      } else if (log.ahara.nutritionQuality === 'Rajasic') {
        rajasWeight += 10;
      } else {
        tamasWeight += 12;
      }

      // Sentinel telemetry: watchStimulantProfile
      if (log.ahara.watchStimulantProfile === 'high_watch_caffeine') {
        rajasWeight += 6;
      }

      // Sensory mindfulness slider (1-5) - continuous smooth deltas
      const mindful = Math.max(1, Math.min(5, log.ahara.sensoryMindfulnessScore || 1));
      sattvaWeight += (mindful - 1) * 3; // 0, 3, 6, 9, 12
      rajasWeight += Math.max(0, (5 - mindful) * 1.5); // 6, 4.5, 3, 1.5, 0

      // Screen time (digitalConsumptionMinutes) - continuous relative model
      const baselineMins = Math.max(60, log.ahara.baselineMinutesAtLog ?? 360);
      const digitalMins = Math.max(0, log.ahara.digitalConsumptionMinutes || 0);
      const r = digitalMins / baselineMins;
      if (r <= 0.75) {
        sattvaWeight += Math.round(10 - 2.5 * r);
        rajasWeight += Math.round(2 + 2 * r);
      } else if (r <= 1.0) {
        sattvaWeight += Math.max(2, Math.round(8 - 8 * (r - 0.75)));
        rajasWeight += Math.round(4 + 8 * (r - 0.75));
      } else {
        sattvaWeight += Math.max(0, Math.round(2 - 4 * (r - 1.0)));
        rajasWeight += Math.round(6 + 6 * Math.min(1.5, r - 1.0));
        tamasWeight += Math.round(3 + 8 * Math.min(1.5, r - 1.0));
      }
    }

    // Nidra (Circadian & restorative sleep)
    if (hasNidra && log.nidra) {
      if (log.nidra.restQuality === 'Restorative') {
        sattvaWeight += 12;
      } else if (log.nidra.restQuality === 'Disturbed' || (log.nidra.restQuality as string) === 'Fragmented') {
        rajasWeight += 12;
      } else {
        tamasWeight += 14;
      }

      if (log.nidra.bedtimeConsistency) {
        sattvaWeight += 6;
      } else {
        rajasWeight += 5;
      }

      // Hours slept continuous slider (0-12h, step 0.5)
      const h = Math.max(0, log.nidra.hoursSlept || 0);
      if (h <= 7.5) {
        sattvaWeight += Math.round((h / 7.5) * 10);
        rajasWeight += Math.max(0, Math.round((7.5 - h) * 1.6));
      } else if (h <= 8.5) {
        sattvaWeight += 10;
      } else {
        sattvaWeight += Math.max(3, Math.round(10 - (h - 8.5) * 1.5));
        tamasWeight += Math.round(Math.min(12, (h - 8.5) * 2.5));
      }

      // Sentinel telemetry: watchRestProtocol
      if (log.nidra.watchRestProtocol === 'split_sentry_kurma') {
        sattvaWeight += 6;
      }
      if (log.nidra.watchRestProtocol === 'post_watch_hypervigilance') {
        rajasWeight += 8;
      }
    }

    // Brahmacharya (Energy conservation & deep work)
    if (hasBrahmacharya && log.brahmacharya) {
      // Energy conservation continuous slider (1-5)
      const energy = Math.max(
        1,
        Math.min(
          5,
          (log.brahmacharya as any).energyConservationScore ??
            log.brahmacharya.energyConservationRating ??
            1
        )
      );
      sattvaWeight += (energy - 1) * 3; // 0, 3, 6, 9, 12
      rajasWeight += Math.max(0, (5 - energy) * 2); // 8, 6, 4, 2, 0
      if (energy <= 2) {
        tamasWeight += (3 - energy) * 2;
      }

      // Focus sessions / blocks continuous slider
      const blocks = Math.max(0, log.brahmacharya.focusedStudyBlocks || 0);
      sattvaWeight += Math.min(14, Math.round(blocks * 2.2));
      rajasWeight += Math.max(0, Math.round((4 - blocks) * 1.5));

      if (log.brahmacharya.dominantGuna === 'Sattva') {
        sattvaWeight += 10;
      } else if (log.brahmacharya.dominantGuna === 'Rajas') {
        rajasWeight += 10;
      } else {
        tamasWeight += 10;
      }

      // Sentinel telemetry: sahyogCohesion
      if (log.brahmacharya.sahyogCohesion === 'sahyog_connected') {
        sattvaWeight += 6;
      }
      if (log.brahmacharya.sahyogCohesion === 'command_friction') {
        rajasWeight += 6;
      }
      if (log.brahmacharya.sahyogCohesion === 'barracks_isolated') {
        tamasWeight += 8;
      }
    }
  }

  // 2. Evaluate recent interception records (chronologically sorted descending, taking recent 10)
  const recentInterceptions = [...safeInterceptions]
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime() || 0;
      const timeB = new Date(b.timestamp).getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 10);

  for (const item of recentInterceptions) {
    if (!item) continue;

    // Stage reached before pause
    if (
      item.cascadeStageReached === 'Dhyana_Dwelling' ||
      item.cascadeStageReached === 'Sanga_Attachment'
    ) {
      sattvaWeight += 6; // Early intervention retains cognitive control
    } else if (
      item.cascadeStageReached === 'Kama_Craving' ||
      item.cascadeStageReached === 'Krodha_Agitation'
    ) {
      rajasWeight += 6;
    } else {
      tamasWeight += 8; // Deep into confusion or memory loss
    }

    // Initial versus resolved state transition
    if (item.initialGuna === 'Rajas') rajasWeight += 4;
    if (item.initialGuna === 'Tamas') tamasWeight += 5;

    if (item.resolvedGunaState === 'Sattva') {
      sattvaWeight += 8;
    } else if (item.resolvedGunaState === 'Rajas') {
      rajasWeight += 4;
    } else {
      tamasWeight += 4;
    }
  }

  // 3. Evaluate recent bhavaLogs (chronologically sorted descending, taking recent 10)
  const recentBhavas = [...safeBhavaLogs]
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime() || 0;
      const timeB = new Date(b.timestamp).getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 10);

  for (const bhava of recentBhavas) {
    if (!bhava) continue;

    const isPos =
      bhava.isPositive === true ||
      bhava.interactionType === 'positive_buffer';
    const isRes =
      bhava.isResolved === true ||
      bhava.interactionType === 'resolved_negative_friction';

    if (isPos) {
      // Cultivating Maitrī, Muditā, or Karuṇā directly expands Sattva per YS 1.33
      sattvaWeight += 10;
    } else if (isRes) {
      // Active cognitive resolution shifts turbulence into Sattvic poise
      sattvaWeight += 8;
      rajasWeight += 2;
    } else {
      // Unresolved negative friction: !bhava.isPositive && !bhava.isResolved
      const identifier = (bhava.cardId || bhava.title || '').toLowerCase();
      if (
        identifier.includes('isolation') ||
        identifier.includes('loneliness') ||
        identifier.includes('overwhelm')
      ) {
        tamasWeight += 10;
        rajasWeight += 5;
      } else {
        // Placement Envy, Imposter Syndrome, Toxic Partner, etc.
        rajasWeight += 12;
        tamasWeight += 4;
      }
    }
  }

  const total = sattvaWeight + rajasWeight + tamasWeight;
  if (total <= 0) {
    return { sattva: 50, rajas: 35, tamas: 15 };
  }

  let sattva = Math.round((sattvaWeight / total) * 100);
  let rajas = Math.round((rajasWeight / total) * 100);
  let tamas = 100 - (sattva + rajas);

  // Boundary safety guards to prevent negative values
  if (tamas < 0) {
    if (rajas >= Math.abs(tamas)) {
      rajas += tamas;
    } else {
      sattva += tamas;
    }
    tamas = 0;
  }

  return { sattva, rajas, tamas };
}

/**
 * Analyzes behavioral signals, urge triggers, and emotional friction/buffering from Bhāva Compass
 * to detect acute Tri-Dosha biological imbalances:
 *
 * - Vata: Spiked by high screen time, irregular sleep, "Academic Anxiety", or imposter syndrome/overwhelm.
 * - Pitta: Spiked by "Social Comparison", "Toxic Hostility", or placement envy/interpersonal toxicity.
 * - Kapha: Spiked by >9 hours of sleep, Tamasic nutritional intake, lethargy, or heavy emotional isolation.
 *
 * Normalizes all three doshas to strictly equal 100%, determines the dominant aggravated humor,
 * and prescribes dynamic, compassionate Ayurvedic remedies based on the highest Dosha.
 * Evaluates optional Sentinel telemetry natively when present.
 */
export function diagnoseDoshaImbalance(
  logs: TrayopastambhaLog[] = [],
  interceptions: InterceptionRecord[] = [],
  bhavaLogs: BhavaLog[] = []
): DoshaDiagnosisResult {
  const safeLogs = Array.isArray(logs) ? logs : [logs];
  const safeInterceptions = Array.isArray(interceptions) ? interceptions : [interceptions];
  const safeBhavaLogs = Array.isArray(bhavaLogs) ? bhavaLogs : [bhavaLogs];

  // Sama-Dosha constitutional equilibrium baseline (Charaka Samhita Sutrasthana 1.55)
  // Ensures that minor isolated points do not artificially polarize a single humor to 100%
  let vataScore = 12;
  let pittaScore = 12;
  let kaphaScore = 12;

  // 1. Evaluate lifestyle & physiological signals from logs (recent 7 days)
  const recentLogs = [...safeLogs]
    .sort((a, b) => {
      const timeA = new Date(a?.timestamp || a?.date || '').getTime() || 0;
      const timeB = new Date(b?.timestamp || b?.date || '').getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 7);

  for (const log of recentLogs) {
    if (!log) continue;

    const hasAhara = log.loggedPillars ? Boolean(log.loggedPillars.ahara) : true;
    const hasNidra = log.loggedPillars ? Boolean(log.loggedPillars.nidra) : true;
    const hasBrahmacharya = log.loggedPillars ? Boolean(log.loggedPillars.brahmacharya) : true;

    // 1. Ahara signals
    if (hasAhara && log.ahara) {
      // Screen time continuous response on Vata (Self-Anchored Relative Model)
      const baselineMins = Math.max(60, log.ahara.baselineMinutesAtLog ?? 360);
      const digitalMins = Math.max(0, log.ahara.digitalConsumptionMinutes || 0);
      const r = digitalMins / baselineMins;
      if (r > 0.75) {
        vataScore += Math.round((r - 0.75) * 35);
      }

      // Sensory mindfulness continuous effect
      const mindful = Math.max(1, Math.min(5, log.ahara.sensoryMindfulnessScore || 1));
      vataScore += Math.round((5 - mindful) * 4);
      pittaScore += Math.round((5 - mindful) * 2);

      // Nutritional quality
      if (log.ahara.nutritionQuality === 'Tamasic') {
        kaphaScore += 35;
      }
      if (log.ahara.nutritionQuality === 'Rajasic') {
        pittaScore += 10;
      }

      // Sentinel telemetry: watchStimulantProfile
      if (log.ahara.watchStimulantProfile === 'high_watch_caffeine') {
        pittaScore += 15;
        vataScore += 8;
      }
    }

    // 2. Nidra signals
    if (hasNidra && log.nidra) {
      if (log.nidra.bedtimeConsistency === false) {
        vataScore += 20;
      }
      if (log.nidra.restQuality === 'Disturbed' || (log.nidra.restQuality as string) === 'Fragmented') {
        vataScore += 20;
      }

      // Sleep hours continuous slider
      const h = Math.max(0, log.nidra.hoursSlept || 0);
      if (h < 7.5) {
        vataScore += Math.round((7.5 - h) * 6);
      }
      if (h > 8.0) {
        kaphaScore += Math.round((h - 8.0) * 8);
      }
      if (log.nidra.restQuality === 'Lethargic' || (log.nidra.restQuality as string) === 'Depleted') {
        kaphaScore += 20;
      }

      // Sentinel telemetry: watchRestProtocol
      if (log.nidra.watchRestProtocol === 'post_watch_hypervigilance') {
        vataScore += 18;
      }
    }

    // 3. Brahmacharya signals
    if (hasBrahmacharya && log.brahmacharya) {
      // Energy conservation continuous slider (1-5)
      const energy = Math.max(
        1,
        Math.min(
          5,
          (log.brahmacharya as any).energyConservationScore ??
            log.brahmacharya.energyConservationRating ??
            1
        )
      );
      vataScore += (5 - energy) * 4;
      pittaScore += Math.max(0, (3 - energy) * 3);

      // Focused blocks continuous slider
      const blocks = Math.max(0, log.brahmacharya.focusedStudyBlocks || 0);
      if (blocks < 4) {
        vataScore += Math.round((4 - blocks) * 3);
      } else if (blocks > 6) {
        pittaScore += Math.round((blocks - 6) * 3);
      }

      if (log.brahmacharya.dominantGuna === 'Rajas') {
        pittaScore += 10;
      }

      // Sentinel telemetry: sahyogCohesion
      if (log.brahmacharya.sahyogCohesion === 'barracks_isolated') {
        kaphaScore += 14;
        vataScore += 8;
      }
      if (log.brahmacharya.sahyogCohesion === 'command_friction') {
        pittaScore += 12;
      }
    }

    // General reflection text scan
    if (log.generalReflection) {
      const refText = log.generalReflection.toLowerCase();
      if (
        refText.includes('academic anxiety') ||
        (refText.includes('academic') && refText.includes('anxiety'))
      ) {
        vataScore += 35;
      }
      if (
        refText.includes('social comparison') ||
        refText.includes('comparison')
      ) {
        pittaScore += 35;
      }
      if (
        refText.includes('toxic hostility') ||
        refText.includes('toxic') ||
        refText.includes('hostil')
      ) {
        pittaScore += 40;
      }
    }
  }

  // 2. Evaluate urge triggers & vitarka narratives from Interception records (recent 15)
  const recentInterceptions = [...safeInterceptions]
    .sort((a, b) => {
      const timeA = new Date(a?.timestamp || '').getTime() || 0;
      const timeB = new Date(b?.timestamp || '').getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 15);

  for (const rec of recentInterceptions) {
    if (!rec) continue;
    const trigger = (rec.triggerCategory || '') as string;
    const vitarka = (rec.vitarkaText || '').toLowerCase();
    const stage = rec.cascadeStageReached as string;

    // --- VATA SPIKE: "Academic Anxiety & Professional Workload" ---
    if (
      trigger === 'Academic_Anxiety' ||
      trigger === 'Academic Anxiety' ||
      trigger === 'Academic Anxiety / Professional Workload' ||
      vitarka.includes('academic anxiety') ||
      vitarka.includes('professional workload') ||
      vitarka.includes('workload') ||
      (vitarka.includes('academic') && vitarka.includes('anxiety')) ||
      vitarka.includes('exam stress') ||
      vitarka.includes('exam anxiety')
    ) {
      vataScore += 40;
    } else if (trigger === 'Doomscrolling') {
      vataScore += 15;
    }

    // --- PITTA SPIKE: "Social Comparison" ---
    if (
      trigger === 'Social_Comparison' ||
      trigger === 'Social Comparison' ||
      vitarka.includes('social comparison') ||
      vitarka.includes('comparison') ||
      vitarka.includes('envy') ||
      vitarka.includes('jealous')
    ) {
      pittaScore += 40;
    }

    // --- PITTA SPIKE: "Toxic Hostility" ---
    if (
      trigger === 'Toxic_Hostility' ||
      trigger === 'Toxic Hostility' ||
      stage === 'Krodha_Agitation' ||
      vitarka.includes('toxic hostility') ||
      vitarka.includes('toxic') ||
      vitarka.includes('hostil') ||
      vitarka.includes('anger') ||
      vitarka.includes('rage') ||
      vitarka.includes('partner')
    ) {
      pittaScore += 45;
    }

    // --- KAPHA SPIKE: "Lethargy" ---
    if (
      trigger === 'Lethargy' ||
      vitarka.includes('letharg') ||
      vitarka.includes('inertia') ||
      vitarka.includes('sluggish')
    ) {
      kaphaScore += 30;
    }
  }

  // 3. Evaluate recent Bhāva Compass logs for acute Dosha spikes (recent 15)
  const recentBhavas = [...safeBhavaLogs]
    .sort((a, b) => {
      const timeA = new Date(a?.timestamp || '').getTime() || 0;
      const timeB = new Date(b?.timestamp || '').getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 15);

  for (const bhava of recentBhavas) {
    if (!bhava) continue;
    const isPos =
      bhava.isPositive === true ||
      bhava.interactionType === 'positive_buffer';
    const isRes =
      bhava.isResolved === true ||
      bhava.interactionType === 'resolved_negative_friction';

    // If bhava.isPositive or bhava.isResolved, skip Dosha spike
    if (isPos || isRes) {
      continue;
    }

    // Active unresolved emotional friction (!bhava.isPositive && !bhava.isResolved)
    const key = (bhava.cardId || bhava.title || '').toLowerCase();

    if (key.includes('envy') || key.includes('toxic') || key.includes('unfair')) {
      pittaScore += 35;
    }

    if (key.includes('imposter') || key.includes('overwhelm') || key.includes('doubt')) {
      vataScore += 35;
    }

    if (key.includes('isolation') || key.includes('loneliness')) {
      kaphaScore += 30;
    }
  }

  // 4. Normalize these to equal strictly 100%
  const total = vataScore + pittaScore + kaphaScore;
  let vataPercentage = Math.round((vataScore / total) * 100);
  let pittaPercentage = Math.round((pittaScore / total) * 100);
  let kaphaPercentage = 100 - (vataPercentage + pittaPercentage);

  // Safety correction guaranteeing valid distribution [0, 100] summing to 100%
  if (kaphaPercentage < 0) {
    if (pittaPercentage >= Math.abs(kaphaPercentage)) {
      pittaPercentage += kaphaPercentage;
    } else {
      vataPercentage += kaphaPercentage;
    }
    kaphaPercentage = 0;
  } else if (kaphaPercentage > 100) {
    kaphaPercentage = 100;
    vataPercentage = 0;
    pittaPercentage = 0;
  }

  const normalizedPercentages: DoshaDistribution = {
    vata: vataPercentage,
    pitta: pittaPercentage,
    kapha: kaphaPercentage,
  };

  const doshaScores: DoshaDistribution = {
    vata: vataScore,
    pitta: pittaScore,
    kapha: kaphaScore,
  };

  // 5. Determine dominant aggravated Dosha (highest percentage)
  let aggravatedDosha: DoshaType = 'Vata';
  if (pittaPercentage > vataPercentage && pittaPercentage >= kaphaPercentage) {
    aggravatedDosha = 'Pitta';
  } else if (kaphaPercentage > vataPercentage && kaphaPercentage > pittaPercentage) {
    aggravatedDosha = 'Kapha';
  } else {
    aggravatedDosha = 'Vata';
  }

  // 6. Dynamic, compassionate remedy based on highest Dosha
  let physicalRemedy = '';
  if (aggravatedDosha === 'Vata') {
    physicalRemedy =
      'High Vata detected: Step away from screens for 10 minutes and sip warm water.';
  } else if (aggravatedDosha === 'Pitta') {
    physicalRemedy =
      'High Pitta detected: Cool mental heat with 3 minutes of Sheetali breathing and splash cold water on your face and eyes.';
  } else {
    physicalRemedy =
      'High Kapha detected: Counter physical stagnation with 10 brisk Surya Namaskars or a 10-minute brisk walk in fresh air.';
  }

  if (aggravatedDosha === 'Pitta') {
    return {
      aggravatedDosha: 'Pitta',
      physicalRemedy,
      doshaScores,
      normalizedPercentages,
      cause:
        'Cognitive overheating triggered by Social Comparison, Toxic Hostility, or competitive tension.',
      dinacharyaRemedy:
        'Step away from screens during midday solar peak, practice Upeksha (serene equanimity and non-reactivity), and walk in natural greenery.',
      dietaryAdvice:
        'Prioritize cooling, sweet, and bitter foods (fresh coconut water, sweet juicy fruits, mint infusion, leafy greens); avoid pungent/spicy snacks.',
      pranayamaSuggestion:
        'Sheetali / Sitkari cooling breath or 4-7-8 relaxation breathing with prolonged exhalation to dissipate internal heat.',
    };
  }

  if (aggravatedDosha === 'Kapha') {
    return {
      aggravatedDosha: 'Kapha',
      physicalRemedy,
      doshaScores,
      normalizedPercentages,
      cause:
        'Mental inertia and physical stagnation driven by >9 hours of sleep, Tamasic nutrition, or prolonged screen trance.',
      dinacharyaRemedy:
        'Awaken before 6:00 AM during the active morning window, engage in 12 brisk Surya Namaskars, and eliminate post-lunch naps.',
      dietaryAdvice:
        'Consume warm, light, freshly prepared meals seasoned with black pepper, dry ginger, and cinnamon; eliminate heavy dairy and sugary sweets.',
      pranayamaSuggestion:
        'Stimulating Kapalabhati or Bhastrika (bellows breath) to revitalize circulation and clear mental fog.',
    };
  }

  return {
    aggravatedDosha: 'Vata',
    physicalRemedy,
    doshaScores,
    normalizedPercentages,
    cause:
      'Excessive digital screen stimulation, irregular sleep patterns, or Academic Anxiety destabilizing the nervous system.',
    dinacharyaRemedy:
      'Step away from screens for 10 minutes, sip warm water, establish unwavering sleep timing, and massage feet with warm sesame oil before bed.',
    dietaryAdvice:
      'Nourish with warm, freshly cooked, grounding foods enriched with healthy fats (ghee, hot soups, whole grains, warm spiced milk); avoid dry, cold, raw foods.',
    pranayamaSuggestion:
      'Sama Vritti (Equal-ratio box breathing) or Nadi Shodhana (Alternate Nostril Breathing) to stabilize the fluctuating nervous system.',
  };
}
