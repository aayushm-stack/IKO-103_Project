import { TriggerCategory, GunaType } from '../types/iks';

export interface ReframeTemplate {
  vitarkaExample: string;
  pratipakshaPrompt: string;
  suggestedReframe: string;
  defaultMicroSwaps: string[];
}

/**
 * Pedagogical and cognitive reappraisal templates for each trigger category,
 * implementing Patanjali's Pratipaksha Bhavana (Yoga Sutra 2.33).
 */
export const TRIGGER_REFRAME_TEMPLATES: Record<TriggerCategory, ReframeTemplate> & {
  Academic_Anxiety?: ReframeTemplate;
  Social_Comparison?: ReframeTemplate;
  Sensory_Craving?: ReframeTemplate;
} = {
  Doomscrolling: {
    vitarkaExample:
      'Just 5 minutes of reels or outrage feeds to decompress before starting my study session.',
    pratipakshaPrompt:
      'Yoga Sutra 2.33: When unwholesome thoughts distract you, cultivate the opposing wholesome contemplation. How does endless algorithmic novelty impact your working memory?',
    suggestedReframe:
      'This infinite scroll delivers fleeting dopamine wanting without genuine nourishment. Guarding my attention now preserves cognitive virya for deep mastery.',
    defaultMicroSwaps: [
      'Lock phone and place it across the room',
      'Take 5 deep breaths with extended exhalation (Rechaka)',
      'Drink a glass of cool water away from screens',
      'Open one specific academic problem or chapter',
    ],
  },
  'Academic Anxiety / Professional Workload': {
    vitarkaExample:
      'Everyone else in the batch or team is far ahead in milestones; I am hopelessly behind and doomed to fail.',
    pratipakshaPrompt:
      'Bhagavad Gita 2.47: You have rightful mastery over your immediate action, never over external outcomes. Where can you anchor your agency right now?',
    suggestedReframe:
      'Obsessing over peer progress and future deliverables scatters my prana. My sole duty is to dedicate full attention to the next single priority before me.',
    defaultMicroSwaps: [
      'Write down one clear, isolated sub-task on paper',
      'Start a 25-minute single-focus Pomodoro timer',
      'Practice 2 minutes of Sama Vritti (box breathing)',
      'Step out to clear mental tension and reset posture',
    ],
  },
  'Academic Anxiety': {
    vitarkaExample:
      'Everyone else in the batch or team is far ahead in milestones; I am hopelessly behind and doomed to fail.',
    pratipakshaPrompt:
      'Bhagavad Gita 2.47: You have rightful mastery over your immediate action, never over external outcomes. Where can you anchor your agency right now?',
    suggestedReframe:
      'Obsessing over peer progress and future deliverables scatters my prana. My sole duty is to dedicate full attention to the next single priority before me.',
    defaultMicroSwaps: [
      'Write down one clear, isolated sub-task on paper',
      'Start a 25-minute single-focus Pomodoro timer',
      'Practice 2 minutes of Sama Vritti (box breathing)',
      'Step out to clear mental tension and reset posture',
    ],
  },
  'Social Comparison': {
    vitarkaExample:
      'Browsing peers’ LinkedIn and internship announcements makes my own quiet efforts feel invisible and useless.',
    pratipakshaPrompt:
      'Yoga Sutra 1.33 (Mudita): Cultivate sympathetic joy in the virtue and progress of others. How does their milestone impact your personal swadharma?',
    suggestedReframe:
      'Their milestones do not diminish my potential. I celebrate their success with genuine Mudita while quietly and steadily perfecting my own craft.',
    defaultMicroSwaps: [
      'Close all social feed tabs immediately',
      'Silently wish them happiness and continued excellence',
      'Review my personal one-line Sankalpa',
      'Stand up and do a 2-minute physical shoulder stretch',
    ],
  },
  Lethargy: {
    vitarkaExample:
      'Heavy afternoon brain fog; let me just lie down and mindlessly play YouTube videos until late evening.',
    pratipakshaPrompt:
      'Samkhya / Bhagavad Gita 14.8: Tamas binds consciousness through indolence and sleepiness. Is this physiological fatigue or habitual inert resistance?',
    suggestedReframe:
      'Digital distraction deepens Tamasic heaviness. Real restorative energy comes from moving the body and circulating fresh prana.',
    defaultMicroSwaps: [
      'Splash cold water thoroughly on face and eyes',
      'Engage in 5 minutes of brisk outdoor walking',
      'Perform 6 rounds of dynamic stretching or Surya Namaskar',
      'Drink a cup of warm water or herbal infusion',
    ],
  },
  'Cheap Dopamine / Junk Stimulation': {
    vitarkaExample:
      'Under deadline pressure, intensely craving sugary junk snacks, energy drinks, or instant stimulation.',
    pratipakshaPrompt:
      'Charaka Samhita Sutrasthana 7: The senses naturally pursue pleasant stimuli, but excessive indulgence injures metabolic Agni and Ojas. What does the body truly require?',
    suggestedReframe:
      'This urge is an emotional tension reflex, not true bodily hunger. Conscious hydration and calm breathing will ride this wave out cleanly.',
    defaultMicroSwaps: [
      'Drink a warm glass of water away from all devices',
      'Perform 3 minutes of 4-7-8 relaxing breathwork',
      'Step away from food storage or the cafeteria',
      'Take 5 conscious slow breaths observing the sensation fade',
    ],
  },
};

// Aliases for backwards compatibility with legacy seed data and logs
TRIGGER_REFRAME_TEMPLATES.Academic_Anxiety = TRIGGER_REFRAME_TEMPLATES['Academic Anxiety'];
TRIGGER_REFRAME_TEMPLATES.Social_Comparison = TRIGGER_REFRAME_TEMPLATES['Social Comparison'];
TRIGGER_REFRAME_TEMPLATES.Sensory_Craving = TRIGGER_REFRAME_TEMPLATES['Cheap Dopamine / Junk Stimulation'];

/**
 * Validates user-submitted Vitarka and Pratipaksha texts according to Patanjali's
 * cognitive reappraisal discipline (Yoga Sutra 2.33).
 */
export function validatePratipakshaReframe(
  vitarka: string,
  pratipaksha: string
): {
  isValid: boolean;
  feedback: string;
  resultingGuna: GunaType;
} {
  const trimmedVitarka = vitarka.trim();
  const trimmedPratipaksha = pratipaksha.trim();

  // Basic validation: vitarka cannot be empty
  if (trimmedVitarka.length < 5) {
    return {
      isValid: false,
      feedback:
        'Please articulate the unwholesome urge (Vitarka) clearly (at least 5 characters). Naming the distraction breaks identification.',
      resultingGuna: 'Tamas',
    };
  }

  // Basic validation: pratipaksha cannot be empty
  if (trimmedPratipaksha.length < 8) {
    return {
      isValid: false,
      feedback:
        'Please formulate a conscious opposing reframe (Pratipaksha Bhavana). A single word is insufficient to alter neural momentum.',
      resultingGuna: 'Rajas',
    };
  }

  // Check if vitarka and pratipaksha are identical (user just copied or entered gibberish)
  if (trimmedVitarka.toLowerCase() === trimmedPratipaksha.toLowerCase()) {
    return {
      isValid: false,
      feedback:
        'The Pratipaksha reframe must actively oppose and neutralize the Vitarka impulse, not merely duplicate it.',
      resultingGuna: 'Rajas',
    };
  }

  return {
    isValid: true,
    feedback:
      'Cognitive pause verified. The unwholesome impulse has been consciously counter-balanced with Pratipaksha contemplation (YS 2.33).',
    resultingGuna: 'Sattva',
  };
}
