import {
  TrayopastambhaLog,
  InterceptionRecord,
  UserPreferences,
} from '../../types/iks';
import { STORAGE_KEYS, setLocalItem } from './localStore';

/**
 * Default starter preferences for students embarking on the BrahmaPath protocol.
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  name: '',
  sankalpa: 'Conserve cognitive virya and cultivate Sattvic focus',
  battlegroundPath: 'inner',
  deploymentEnvironment: 'active_border',
  lifeRhythm: 'learning_study',
  baselineGuna: 'Rajas',
  dominantDosha: 'Vata',
  preferredMicroSwaps: [
    'Take 5 deep breaths with extended exhalation (Rechaka)',
    'Drink a warm glass of water away from all screens',
    'Step out for a 3-minute brisk walk in open air',
    'Write down one clear academic task and set a 25-minute timer',
  ],
  selectedMicroSwapIds: [
    'extended-exhale',
    'trataka',
    'urge-surf',
    'grounding',
    'nada-yoga',
    'jala',
    'pratyahara',
    'ahimsa-pace',
    'spinal-asana',
    'hydration',
    'sattvic-anchor',
    'tapas',
  ],
  notificationsEnabled: false,
  onboardingCompleted: false,
  averageScreenTimeHours: 6,
};

/**
 * Formats a Date object into YYYY-MM-DD string format.
 */
function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 8-day template progression telling the student transformation narrative:
 * - Days 1-3 (offsets 7, 6, 5): Low Yukta scores (<50) and high Vata/Tamas
 *   (doomscrolling, irregular sleep, low mindfulness, imposter syndrome).
 * - Days 4-8 (offsets 4 down to 0): Steady, progressive improvement into Sattvic balance
 *   (regular circadian sleep, Impulse Interceptor habituation, high Yukta scores >75, Svastha calm).
 */
export const EIGHT_DAY_JUDGE_TEMPLATES = [
  // --- Day 1 (7 days ago): Severe Vata & Tamas Spikes, Low Yukta Score ---
  {
    offset: 7,
    ahara: {
      nutritionQuality: 'Tamasic' as const,
      digitalConsumptionMinutes: 340,
      sensoryMindfulnessScore: 1,
    },
    nidra: {
      hoursSlept: 4.5,
      bedtimeConsistency: false,
      restQuality: 'Disturbed' as const,
    },
    brahmacharya: {
      energyConservationRating: 1,
      focusedStudyBlocks: 0,
      dominantGuna: 'Tamas' as const,
    },
    yuktaScore: 35,
    generalReflection:
      'Late-night doomscrolling until 3:30 AM. Extreme lethargy, missed morning lecture, high anxiety (Spiked Vata & Tamas).',
  },

  // --- Day 2 (6 days ago): Heavy Caffeine, Disturbed Sleep, Low Yukta Score ---
  {
    offset: 6,
    ahara: {
      nutritionQuality: 'Tamasic' as const,
      digitalConsumptionMinutes: 290,
      sensoryMindfulnessScore: 1,
    },
    nidra: {
      hoursSlept: 5.0,
      bedtimeConsistency: false,
      restQuality: 'Disturbed' as const,
    },
    brahmacharya: {
      energyConservationRating: 2,
      focusedStudyBlocks: 1,
      dominantGuna: 'Tamas' as const,
    },
    yuktaScore: 40,
    generalReflection:
      'High caffeine and sugar crashes. Fragmented attention, social media FOMO, constant notification checking (Spiked Vata).',
  },

  // --- Day 3 (5 days ago): Imposter Syndrome, Academic Anxiety, Low Yukta Score ---
  {
    offset: 5,
    ahara: {
      nutritionQuality: 'Rajasic' as const,
      digitalConsumptionMinutes: 240,
      sensoryMindfulnessScore: 2,
    },
    nidra: {
      hoursSlept: 5.5,
      bedtimeConsistency: false,
      restQuality: 'Lethargic' as const,
    },
    brahmacharya: {
      energyConservationRating: 2,
      focusedStudyBlocks: 1,
      dominantGuna: 'Rajas' as const,
    },
    yuktaScore: 46,
    generalReflection:
      'Academic anxiety and imposter syndrome comparing myself to peers. Restless mind, fragmented study sessions (Spiked Rajas & Vata).',
  },

  // --- Day 4 (4 days ago): Rebound begins, Impulse Interceptor implemented, Moderate Yukta ---
  {
    offset: 4,
    ahara: {
      nutritionQuality: 'Rajasic' as const,
      digitalConsumptionMinutes: 160,
      sensoryMindfulnessScore: 3,
    },
    nidra: {
      hoursSlept: 6.5,
      bedtimeConsistency: true,
      restQuality: 'Restorative' as const,
    },
    brahmacharya: {
      energyConservationRating: 3,
      focusedStudyBlocks: 2,
      dominantGuna: 'Rajas' as const,
    },
    yuktaScore: 62,
    generalReflection:
      'First day implementing early interception before YouTube binges. Slept before midnight, waking up with more clear energy.',
  },

  // --- Day 5 (3 days ago): Building Momentum, Screen reduction, Approaching Balance ---
  {
    offset: 3,
    ahara: {
      nutritionQuality: 'Sattvic' as const,
      digitalConsumptionMinutes: 120,
      sensoryMindfulnessScore: 3,
    },
    nidra: {
      hoursSlept: 7.0,
      bedtimeConsistency: true,
      restQuality: 'Restorative' as const,
    },
    brahmacharya: {
      energyConservationRating: 4,
      focusedStudyBlocks: 3,
      dominantGuna: 'Rajas' as const,
    },
    yuktaScore: 73,
    generalReflection:
      'Adopted fresh home-cooked meals and phone-free mornings. Two solid 50-minute deep work blocks completed with steady focus.',
  },

  // --- Day 6 (2 days ago): Crossing the 75 Threshold into Sattva & Calm Chariot ---
  {
    offset: 2,
    ahara: {
      nutritionQuality: 'Sattvic' as const,
      digitalConsumptionMinutes: 80,
      sensoryMindfulnessScore: 4,
    },
    nidra: {
      hoursSlept: 7.5,
      bedtimeConsistency: true,
      restQuality: 'Restorative' as const,
    },
    brahmacharya: {
      energyConservationRating: 4,
      focusedStudyBlocks: 4,
      dominantGuna: 'Sattva' as const,
    },
    yuktaScore: 82,
    generalReflection:
      'Sattvic clarity emerging. Crossed into the Yukta threshold (>75). Pratipaksha Bhavana helped disarm comparison anxiety seamlessly.',
  },

  // --- Day 7 (1 day ago / Yesterday): Deep Sattvic poise, High vitality ---
  {
    offset: 1,
    ahara: {
      nutritionQuality: 'Sattvic' as const,
      digitalConsumptionMinutes: 60,
      sensoryMindfulnessScore: 5,
    },
    nidra: {
      hoursSlept: 7.8,
      bedtimeConsistency: true,
      restQuality: 'Restorative' as const,
    },
    brahmacharya: {
      energyConservationRating: 5,
      focusedStudyBlocks: 4,
      dominantGuna: 'Sattva' as const,
    },
    yuktaScore: 89,
    generalReflection:
      'Deep restorative sleep. Chariot intellect (Buddhi) in command; senses felt calm and receptive without compulsive urges.',
  },

  // --- Day 8 (Today / Offset 0): Peak Svastha Equilibrium, Chariot Calm State ---
  {
    offset: 0,
    ahara: {
      nutritionQuality: 'Sattvic' as const,
      digitalConsumptionMinutes: 40,
      sensoryMindfulnessScore: 5,
    },
    nidra: {
      hoursSlept: 8.0,
      bedtimeConsistency: true,
      restQuality: 'Restorative' as const,
    },
    brahmacharya: {
      energyConservationRating: 5,
      focusedStudyBlocks: 5,
      dominantGuna: 'Sattva' as const,
    },
    yuktaScore: 95,
    generalReflection:
      'Svastha state. Katha Upanishad Chariot in complete equilibrium: intellect awake, reins steady, noble horses moving in harmony.',
  },
];

/**
 * Backwards compatibility alias for 14-day template references.
 */
export const FOURTEEN_DAY_JUDGE_TEMPLATES = EIGHT_DAY_JUDGE_TEMPLATES;

/**
 * Generates an array of 8 days of realistic Trayopastambha daily logs
 * for hackathon judges, illustrating the complete journey:
 * - First 3 days: low Yukta scores (<50) and high Vata/Tamas.
 * - Last 5 days: steady improvement into Sattvic balance.
 */
export function generate8DayJudgeLogs(): TrayopastambhaLog[] {
  const now = new Date();

  return EIGHT_DAY_JUDGE_TEMPLATES.map((tmpl) => {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - tmpl.offset);
    const dateStr = toDateString(targetDate);

    return {
      id: `sadhana-log-${dateStr}`,
      date: dateStr,
      ahara: tmpl.ahara,
      nidra: tmpl.nidra,
      brahmacharya: tmpl.brahmacharya,
      yuktaScore: tmpl.yuktaScore,
      generalReflection: tmpl.generalReflection,
    };
  });
}

/**
 * Backwards-compatible alias returning the 8-day judge logs.
 */
export function generate14DayJudgeLogs(): TrayopastambhaLog[] {
  return generate8DayJudgeLogs();
}

/**
 * Generates 8 days of realistic student sadhana logs ending today.
 */
export function generateDemoSadhanaLogs(): TrayopastambhaLog[] {
  return generate8DayJudgeLogs();
}

/**
 * Generates realistic Impulse Interceptor interception records spanning the 8-day journey,
 * with authentic student vitarka triggers and Patanjali Pratipaksha Bhavana reframes.
 */
export function generateDemoInterceptions(): InterceptionRecord[] {
  const now = new Date();

  const recordsData = [
    {
      hoursAgo: 140,
      triggerCategory: 'Doomscrolling' as const,
      cascadeStageReached: 'Dhyana_Dwelling' as const,
      initialGuna: 'Rajas' as const,
      vitarkaText:
        'Just 5 minutes of short reels to unwind before starting my semester project code.',
      pratipakshaText:
        'This 5-minute dopamine pull fragments my working memory for the next 45 minutes; let me stay with the hard problem.',
      microSwapAction: 'Closed Instagram feed and took 5 conscious slow exhalations.',
      resolvedGunaState: 'Sattva' as const,
    },
    {
      hoursAgo: 110,
      triggerCategory: 'Academic Anxiety' as const, urgeIntensity: 4,
      cascadeStageReached: 'Krodha_Agitation' as const,
      initialGuna: 'Rajas' as const,
      vitarkaText:
        'Everyone in the batch already has dream company placement offers and internships; I am hopelessly falling behind.',
      pratipakshaText:
        'Karmanye vadikaraste (Gita 2.47) - Focus solely on today’s DSA problem set without obsessing over comparative outcomes.',
      microSwapAction:
        'Wrote down the next single algorithm problem and started a 25-minute uninterrupted timer.',
      resolvedGunaState: 'Sattva' as const,
    },
    {
      hoursAgo: 84,
      triggerCategory: 'Social Comparison' as const, urgeIntensity: 3,
      cascadeStageReached: 'Sanga_Attachment' as const,
      initialGuna: 'Rajas' as const,
      vitarkaText:
        'Browsing batchmates’ LinkedIn promotion and hackathon posts made my own quiet progress feel entirely useless.',
      pratipakshaText:
        'Mudita (Yoga Sutra 1.33) - Genuinely delight in their success; their milestone does not diminish my own swadharma.',
      microSwapAction:
        'Closed LinkedIn tab, stood up from desk, and stretched for 2 minutes.',
      resolvedGunaState: 'Sattva' as const,
    },
    {
      hoursAgo: 58,
      triggerCategory: 'Lethargy' as const,
      cascadeStageReached: 'Sammoha_Delusion' as const,
      initialGuna: 'Tamas' as const,
      vitarkaText:
        'Heavy post-lunch fog at 3:30 PM; feeling like lying down and mindlessly playing YouTube videos until dinner.',
      pratipakshaText:
        'This is Tamasic inertia disguised as rest. Real renewal comes from physical prana flow, not digital trance.',
      microSwapAction:
        'Splashed cold water on face and did a 4-minute brisk outdoor walk.',
      resolvedGunaState: 'Rajas' as const,
    },
    {
      hoursAgo: 30,
      triggerCategory: 'Cheap Dopamine / Junk Stimulation' as const, urgeIntensity: 4,
      cascadeStageReached: 'Kama_Craving' as const,
      initialGuna: 'Rajas' as const,
      vitarkaText:
        'Intense anxiety about tomorrow’s viva exam; craving ultra-sweet snacks and high-caffeine energy drinks.',
      pratipakshaText:
        'Charaka Samhita warns that Rajasic stimulants spike Vata and destabilize the intellect; pure water and deep breath restore steady calm.',
      microSwapAction:
        'Drank a warm glass of water away from screens and completed a 4-7-8 breathing cycle.',
      resolvedGunaState: 'Sattva' as const,
    },
    {
      hoursAgo: 4,
      triggerCategory: 'Doomscrolling' as const,
      urgeIntensity: 5,
      cascadeStageReached: 'SmritiVibhrama_MemoryLoss' as const,
      initialGuna: 'Tamas' as const,
      vitarkaText:
        'Unlocked phone to look up professor’s assignment deadline and instantly got sucked into algorithmic news feeds.',
      pratipakshaText:
        'Smriti Anchor - Remember my primary Sankalpa: "Conserve cognitive virya". Exit the feed immediately without guilt or regret.',
      microSwapAction:
        'Locked phone, placed it across the room, and opened the course textbook.',
      resolvedGunaState: 'Sattva' as const,
    },
  ];

  return recordsData.map((item, index) => {
    const timestampDate = new Date(now.getTime() - item.hoursAgo * 60 * 60 * 1000);

    return {
      id: `interception-${index + 1}-${timestampDate.getTime()}`,
      timestamp: timestampDate.toISOString(),
      triggerCategory: item.triggerCategory,
      cascadeStageReached: item.cascadeStageReached,
      urgeIntensity: (item as any).urgeIntensity ?? 3,
      vitarkaText: item.vitarkaText,
      pratipakshaText: item.pratipakshaText,
      selectedMicroSwap: item.microSwapAction,
      microSwapAction: item.microSwapAction,
      initialGuna: item.initialGuna,
      resolvedGunaState: item.resolvedGunaState,
    };
  });
}

/**
 * Secret judge demo injection utility.
 * Neutralized to prevent unintentional destruction or corruption of real user data.
 */
export function injectJudgeDemoData(): TrayopastambhaLog[] {
  console.warn('[BrahmaPath] Demo data injection is disabled to protect user data integrity.');
  return [];
}
