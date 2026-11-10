import { LifeRhythm } from '../types/shastra';

/**
 * Metadata for civilian life rhythm modes in Stage 1 (Path of the Seeker).
 */
export interface LifeRhythmInfo {
  id: LifeRhythm;
  label: string;
  badge: string;
  summary: string;
}

export const LIFE_RHYTHMS: LifeRhythmInfo[] = [
  {
    id: 'learning_study',
    label: 'Learning & Study',
    badge: 'Academic & Skill Focus',
    summary: 'Focused on learning, skill mastery, and building steady daily discipline.',
  },
  {
    id: 'work_enterprise',
    label: 'Work & Enterprise',
    badge: 'Career & Leadership',
    summary: 'Focused on clear decisions, steady execution, and leaving work stress behind in the evening.',
  },
  {
    id: 'home_quiet',
    label: 'Home & Quiet Living',
    badge: 'Household & Peaceful Rhythm',
    summary: 'Focused on household harmony, gentle vitality, and peaceful daily rhythm.',
  },
];

/**
 * Sadhana dynamic reflection hints adapted to the civilian seeker's life rhythm.
 */
export interface SeekerSadhanaPrompt {
  aharaNutritionHint: string;
  aharaScreenHint: string;
  aharaMindfulHint: string;
  nidraSleepHint: string;
  brahmaEnergyHint: string;
  focusBlocksTitle: string;
  focusBlocksHint: string;
}

export const SEEKER_SADHANA_PROMPTS: Record<LifeRhythm, SeekerSadhanaPrompt> = {
  learning_study: {
    aharaNutritionHint: 'Were your meals regular and nourishing today, or replaced by late-night snacks and hurry?',
    aharaScreenHint: 'Track how well you guarded your study hours from mindless scrolling.',
    aharaMindfulHint: 'How calm and uncluttered did you keep your mind while eating and taking breaks?',
    nidraSleepHint: 'Did you protect your night sleep instead of staying up late with screens or worry?',
    brahmaEnergyHint: 'How well did you protect your attention from restlessness and distractions today?',
    focusBlocksTitle: '2. Dedicated Study Sessions (0–10)',
    focusBlocksHint: 'Focused blocks of reading, practice, or problem-solving completed today.',
  },
  work_enterprise: {
    aharaNutritionHint: 'Did you eat steady, nourishing meals today, or push through busy hours on extra tea and coffee?',
    aharaScreenHint: 'Track your personal screen drift outside of necessary work tasks.',
    aharaMindfulHint: 'How well did you step away from messages and work talk during your meals?',
    nidraSleepHint: 'Did your mind let go of tomorrow\'s tasks and decisions when you lay down to sleep?',
    brahmaEnergyHint: 'How well did you conserve your mental stamina without draining it into stress or impatience?',
    focusBlocksTitle: '2. Deep Work & Key Priorities (0–10)',
    focusBlocksHint: 'Undivided blocks of meaningful work and clear execution completed today.',
  },
  home_quiet: {
    aharaNutritionHint: 'Were your meals warm, timely, and gentle on your digestion today?',
    aharaScreenHint: 'Track how well you kept phone scrolling and television from tiring your eyes and mind.',
    aharaMindfulHint: 'How peacefully did you take in today\'s conversations, news, and household moments?',
    nidraSleepHint: 'Was your rest peaceful and unhurried, leaving your body light and refreshed today?',
    brahmaEnergyHint: 'How steady and peaceful was your inner energy across the quiet hours of the day?',
    focusBlocksTitle: '2. Mindful Daily Anchors (0–10)',
    focusBlocksHint: 'Unhurried moments done with full presence: morning walk, caring for home, reading, prayer, or a gentle hobby.',
  },
};

/**
 * Returns a warm, practical 2-sentence remedy tailored to both the Dosha and the active rhythm.
 */
export function getSeekerDoshaRemedy(
  dominantDosha: string,
  rhythm: LifeRhythm = 'learning_study'
): string {
  const normalized = (dominantDosha || '').toLowerCase();

  if (normalized.includes('vata') || normalized.includes('vāta')) {
    if (rhythm === 'learning_study') {
      return 'Restless thoughts and scattered study blocks indicate elevated Vāta. Anchor your focus with a warm cup of water, clear your desk of extra clutter, and commit to one single 25-minute reading block before switching tasks.';
    }
    if (rhythm === 'work_enterprise') {
      return 'Rapid context-switching and racing thoughts indicate elevated Vāta. Take 3 deep, grounding breaths before your next meeting, close unused browser tabs, and focus on completing a single priority rather than multitasking.';
    }
    return 'Anxious overthinking and restless physical energy indicate elevated Vāta. Sip warm herbal tea, step away from digital screens into natural daylight, and spend ten quiet minutes tending to a gentle household routine.';
  }

  if (normalized.includes('pitta')) {
    if (rhythm === 'learning_study') {
      return 'Impatience with difficult topics and perfectionist frustration indicate aggravated Pitta. Cool your mental fire by stepping away from the screen for 5 minutes, splashing cool water on your face, and letting go of rigid score comparisons.';
    }
    if (rhythm === 'work_enterprise') {
      return 'Sharp irritation with delays and competitive heat indicate aggravated Pitta. Pause before hitting send on urgent messages, unclench your jaw, and take a brief quiet walk outside to cool your executive drive into composed clarity.';
    }
    return 'Critical self-talk and irritability over household matters indicate aggravated Pitta. Drink a glass of cool water, take five unhurried breaths, and release the urge to control every small domestic detail today.';
  }

  if (normalized.includes('kapha')) {
    if (rhythm === 'learning_study') {
      return 'Heavy mental lethargy and prolonged procrastination indicate accumulated Kapha. Break the sluggish loop by standing up immediately, doing 10 brisk shoulder rolls or stretches, and diving into 5 minutes of active problem-solving.';
    }
    if (rhythm === 'work_enterprise') {
      return 'Sluggish afternoon momentum and reluctance to initiate demanding tasks indicate accumulated Kapha. Stand up from your chair, open a window for fresh air, and tackle one quick 10-minute task to spark active mental circulation.';
    }
    return 'Daytime drowsiness and heavy scrolling inertia indicate accumulated Kapha. Step outside for a brisk 5-minute walk in open air, drink warm water with a touch of ginger, and engage in an uplifting conversation or creative hobby.';
  }

  // Balanced / Tridoshic baseline
  if (rhythm === 'learning_study') {
    return 'Your natural doshic harmony supports deep cognitive absorption. Maintain this steady equilibrium through regular meal hours, mindful breathing pauses, and clean study transitions.';
  }
  if (rhythm === 'work_enterprise') {
    return 'Your grounded equilibrium enables clear leadership and calm decisions. Preserve this composure by honoring your evening boundaries and stepping cleanly out of work mode at dusk.';
  }
  return 'Your balanced rhythm brings quiet warmth and calm stability to your surroundings. Protect this peaceful state with gratitude, gentle physical movement, and restful sleep.';
}

/**
 * Reframe pair containing a raw compulsive impulse (Vitarka) and a steady counter-thought (Pratipaksha).
 */
export interface SeekerReframePair {
  vitarka: string;
  pratipaksha: string;
}

/**
 * Cognitive reframe trigger item for Impulse Interceptor.
 */
export interface SeekerInterceptorTrigger {
  id: string;
  label: string;
  category: string;
  pairs: SeekerReframePair[];
}

export const SEEKER_INTERCEPTOR_TRIGGERS: Record<LifeRhythm, SeekerInterceptorTrigger[]> = {
  learning_study: [
    {
      id: 'doomscrolling',
      label: 'Endless Scrolling',
      category: 'Compulsive Media Drift',
      pairs: [
        {
          vitarka: 'Just five more minutes of reels will relax my mind before I begin studying.',
          pratipaksha: 'Passive scrolling fragments my attention. Two minutes of quiet breathing will give my mind the real rest it needs.',
        },
        {
          vitarka: 'I will quickly check notifications to see what I missed, then start my work.',
          pratipaksha: 'Notifications only trigger fresh restlessness. I will complete one focused study block first, with my phone placed aside.',
        },
      ],
    },
    {
      id: 'academic_anxiety',
      label: 'Exam & Future Worry',
      category: 'Anticipatory Anxiety',
      pairs: [
        {
          vitarka: 'What if the paper is too tough or I forget everything I reviewed?',
          pratipaksha: 'Anxiety about tomorrow consumes today\'s clarity. Bhagavad Gita 2.47 reminds me: I hold command over my preparation, not future results.',
        },
        {
          vitarka: 'Everyone else seems prepared while I am lagging behind and running out of time.',
          pratipaksha: 'Panic solves nothing. Focusing on this single page in front of me moves me forward with calm dignity.',
        },
      ],
    },
    {
      id: 'social_comparison',
      label: 'Comparing Progress with Others',
      category: 'Peer Comparison',
      pairs: [
        {
          vitarka: 'My peer completed the whole syllabus already, while I am still struggling on basics.',
          pratipaksha: 'Their timeline is not my benchmark. I honor my own pace and build genuine depth step by step.',
        },
        {
          vitarka: 'Seeing others celebrate their test scores makes me feel inadequate and small.',
          pratipaksha: 'Mudita softens envy. I quietly celebrate their effort and turn my full focus back to my own duty.',
        },
      ],
    },
    {
      id: 'procrastination',
      label: 'Restless Procrastination',
      category: 'Dopamine Drift & Avoidance',
      pairs: [
        {
          vitarka: 'This assignment feels too heavy right now; I will start when I feel more motivated.',
          pratipaksha: 'Action creates motivation, not the other way around. I will sit down and do just three mindful minutes of work right now.',
        },
        {
          vitarka: 'Let me clean my room and organize my desk files before opening my notebook.',
          pratipaksha: 'Productive delay is still delay. I will open my notes immediately and begin with the easiest first step.',
        },
      ],
    },
    {
      id: 'late_night_bingeing',
      label: 'Late-Night Bingeing',
      category: 'Tamasic Fatigue',
      pairs: [
        {
          vitarka: 'It is already past midnight, but I feel like watching videos or snacking to unwind.',
          pratipaksha: 'Late-night screen drift borrows energy from tomorrow. My body deserves restorative sleep, not blue-light stimulation.',
        },
        {
          vitarka: 'I studied so hard today, I deserve to stay up late without rules.',
          pratipaksha: 'True self-respect means giving my brain the deep recovery it earned. I will close my eyes and let my mind settle.',
        },
      ],
    },
  ],

  work_enterprise: [
    {
      id: 'work_overload',
      label: 'Work Pressure & Overload',
      category: 'Executive Strain',
      pairs: [
        {
          vitarka: 'There are too many urgent demands; if I do not do everything at once, things will fall apart.',
          pratipaksha: 'Multitasking only increases errors. I will identify the single most critical priority and execute it with calm composure.',
        },
        {
          vitarka: 'I cannot afford to step away for lunch; I must power through these deliverables.',
          pratipaksha: 'A depleted mind makes clouded decisions. Five minutes of mindful nourishment will restore my stamina.',
        },
      ],
    },
    {
      id: 'conversation_friction',
      label: 'Friction from a Conversation',
      category: 'Workplace Tension',
      pairs: [
        {
          vitarka: 'Their email was dismissive and disrespectful; I need to send a sharp reply immediately.',
          pratipaksha: 'Bhagavad Gita 17.15 teaches speech that is calm, truthful, and non-agitating. I will wait until my heart is cool before replying.',
        },
        {
          vitarka: 'They do not appreciate how much weight I carry on this project.',
          pratipaksha: 'Seeking validation from external praise creates vulnerability. My self-worth is anchored in my own integrity and duty.',
        },
      ],
    },
    {
      id: 'phone_checking',
      label: 'Compulsive Phone Checking',
      category: 'Hyper-Connected Drift',
      pairs: [
        {
          vitarka: 'A new ping or message might require my instant response right this second.',
          pratipaksha: 'Constant reactivity robs me of strategic depth. I will finish this 30-minute focus block before checking my inbox.',
        },
        {
          vitarka: 'Checking market feeds and industry news keeps me sharp and informed.',
          pratipaksha: 'Information overload is noise, not insight. I will guard my discriminative intellect from endless digital chatter.',
        },
      ],
    },
    {
      id: 'mental_fatigue',
      label: 'Mental Fatigue & Impatience',
      category: 'Cognitive Depletion',
      pairs: [
        {
          vitarka: 'People are moving too slowly, and these roadblocks are frustrating my progress.',
          pratipaksha: 'Impatience exhausts prana. Steadiness under delays demonstrates true leadership and maturity.',
        },
        {
          vitarka: 'I am completely drained; another espresso or sugary snack will push me through.',
          pratipaksha: 'Artificial stimulants mask fatigue and increase afternoon agitation. I will sip cool water and take five slow breaths instead.',
        },
      ],
    },
    {
      id: 'evening_carryover',
      label: 'Evening Work Carryover',
      category: 'Unclosed Loops',
      pairs: [
        {
          vitarka: 'Let me quickly reply to just one more message from home so tomorrow is easier.',
          pratipaksha: 'Unclosed work loops invade domestic peace. Work will be there tomorrow; this evening belongs to presence and recovery.',
        },
        {
          vitarka: 'I keep replaying the boardroom meeting over and over in my head.',
          pratipaksha: 'Pratyahara means withdrawing the senses. The workday is complete; I surrender what has passed and return to the present moment.',
        },
      ],
    },
  ],

  home_quiet: [
    {
      id: 'afternoon_restlessness',
      label: 'Afternoon Restlessness',
      category: 'Aimless Wandering',
      pairs: [
        {
          vitarka: 'The house is quiet, and I feel a sudden urge to scroll or snack out of boredom.',
          pratipaksha: 'Quietness is a gift, not an emptiness to fill with noise. I will enjoy this calm pause with a warm cup of herbal tea.',
        },
        {
          vitarka: 'I have nothing urgent to do right now, so opening social media won\'t hurt.',
          pratipaksha: 'Mindless feeds leave the mind agitated. I will pick up a meaningful book or step into the balcony for fresh air.',
        },
      ],
    },
    {
      id: 'overthinking_family',
      label: 'Overthinking Family Matters',
      category: 'Domestic Concern',
      pairs: [
        {
          vitarka: 'What if things do not work out well for my loved ones? I cannot stop worrying about them.',
          pratipaksha: 'Anxious worry cannot protect anyone; it only creates emotional strain. I surrender outcomes to the divine and send them calm prayers.',
        },
        {
          vitarka: 'They did not take my advice, and now they will face unnecessary trouble.',
          pratipaksha: 'Each soul walks their own path of learning. I offer loving support without clinging to control.',
        },
      ],
    },
    {
      id: 'habitual_drift',
      label: 'Habitual Phone or TV Drift',
      category: 'Passive Consumption',
      pairs: [
        {
          vitarka: 'Leaving the television or phone on in the background keeps me company.',
          pratipaksha: 'Constant background chatter scatters my inner peace. Embracing gentle silence brings true contentment.',
        },
        {
          vitarka: 'Just one more video before I begin my evening routine.',
          pratipaksha: 'One more becomes an hour. I choose to gently turn off the screen and honor my evening peace.',
        },
      ],
    },
    {
      id: 'feeling_unnoticed',
      label: 'Feeling Unnoticed or Lonely',
      category: 'Quiet Yearning',
      pairs: [
        {
          vitarka: 'I do so much for the household every day, yet nobody seems to notice or express gratitude.',
          pratipaksha: 'My service is an offering of love, not a transaction for praise. The peace and warmth I create in this home is its own reward.',
        },
        {
          vitarka: 'Everyone is busy with their own lives, leaving me feeling left behind and isolated.',
          pratipaksha: 'Solitude is an opportunity to be my own dearest friend. I will nurture my own spirit with kindness, prayer, and gentle presence.',
        },
      ],
    },
    {
      id: 'heavy_mood',
      label: 'Heavy Mood & Low Energy',
      category: 'Emotional Heaviness',
      pairs: [
        {
          vitarka: 'I feel low and unmotivated today; I do not feel like doing anything at all.',
          pratipaksha: 'Tamasic heaviness dissolves with gentle movement. I will take a 5-minute walk or wash my hands and face with warm water.',
        },
        {
          vitarka: 'Yesterday felt so unproductive, and today feels just as bleak.',
          pratipaksha: 'Each sunrise is a completely fresh start. I will bless this present hour and take one tiny, joyful step forward.',
        },
      ],
    },
  ],
};

/**
 * Detailed Micro-Swap item with physiological/yogic explanation and modality tag.
 */
export interface DetailedMicroSwap {
  id: string;
  title: string;
  description: string;
  tag: string;
}

/**
 * 8 Detailed Curated Micro-Swaps per Life Rhythm.
 */
export const SEEKER_MICRO_SWAPS: Record<LifeRhythm, DetailedMicroSwap[]> = {
  learning_study: [
    {
      id: 'ls_pranayama_extended_exhale',
      title: 'Pranayama - Extended Exhale',
      description:
        'Inhale slowly for 4 seconds, then double your exhale to 8 seconds for four cycles. Extending the exhalation directly stimulates the vagus nerve and downregulates restless study anxiety.',
      tag: 'INVISIBLE',
    },
    {
      id: 'ls_trataka_fixed_horizon',
      title: 'Trataka - Fixed Horizon Gazing',
      description:
        'Lock your unblinking gaze onto a distant stationary point away from your screen for 60 seconds. Concentrating optical focus immediately arrests mental scatter and relieves eye strain.',
      tag: 'OPTICAL RESET',
    },
    {
      id: 'ls_pratyahara_dark_palming',
      title: 'Pratyahara - 60-Second Dark Palming',
      description:
        'Rub your palms together until warm and cup them gently over closed eyes in complete darkness. Shutting off visual inflow starves digital dopamine loops and settles an overloaded mind.',
      tag: 'SENSORY WITHDRAWAL',
    },
    {
      id: 'ls_jala_cool_water',
      title: 'Jala - Conscious Cool Water Sip',
      description:
        'Step away from your desk and drink a glass of cool water in slow, deliberate sips. Tracking the physical temperature shifts attention from mental overthinking back into the body.',
      tag: 'SOMATIC GROUNDING',
    },
    {
      id: 'ls_asana_cervical_spine',
      title: 'Asana - Cervical & Spine Decompression',
      description:
        'Stand up, interlace your fingers overhead, and draw your shoulder blades back for 45 seconds. Releasing forward-head posture restores blood flow and clears afternoon mental fog.',
      tag: 'KINETIC RELEASE',
    },
    {
      id: 'ls_svadhyaya_printed_pages',
      title: 'Svadhyaya - Two Quiet Printed Pages',
      description:
        'Close all browser tabs and read two physical pages of a book or handwritten notes at an unhurried pace. Linear ink-on-paper reading retrains sustained attention after fragmented scrolling.',
      tag: 'COGNITIVE ANCHOR',
    },
    {
      id: 'ls_sankalpa_next_step',
      title: 'Sankalpa - Single Next-Step Clarity',
      description:
        'Write down the single smallest task you need to finish in the next 20 minutes on a slip of paper. Shrinking an overwhelming workload into one concrete step dissolves avoidance paralysis.',
      tag: 'MENTAL ORDER',
    },
    {
      id: 'ls_desha_device_placement',
      title: 'Desha - Out-of-Reach Device Placement',
      description:
        'Place your phone on a shelf across the room with the screen facing down for the next 30 minutes. Adding five steps of physical distance breaks automatic hand-to-phone muscle memory.',
      tag: 'SPACE SHIFT',
    },
  ],

  work_enterprise: [
    {
      id: 'we_pranayama_extended_exhale',
      title: 'Pranayama - Extended Exhale',
      description:
        'Inhale slowly for 4 seconds, then double your exhale to 8 seconds before replying or switching tasks. This directly stimulates the vagus nerve and cools acute decision fatigue or friction.',
      tag: 'INVISIBLE',
    },
    {
      id: 'we_trataka_fixed_point',
      title: 'Trataka - Fixed Point Gazing',
      description:
        'Lock your unblinking gaze onto a single stationary object across the room for 60 seconds. Steadying optical movement immediately halts fragmented task-switching and screen fatigue.',
      tag: 'OPTICAL RESET',
    },
    {
      id: 'we_mauna_quiet_stepback',
      title: 'Mauna - Three-Minute Quiet Step-Back',
      description:
        'Step away from your workstation and spend three minutes in complete silence without checking notifications. Creating a deliberate gap between work blocks prevents reactive exhaustion.',
      tag: 'SENSORY WITHDRAWAL',
    },
    {
      id: 'we_shithilikarana_jaw_shoulder',
      title: 'Shithilikarana - Jaw & Shoulder Drop',
      description:
        'Unclench your back teeth, soften your tongue, and let your shoulders drop two inches on a long exhale. Releasing unconscious muscular armor signals safety to an overworked nervous system.',
      tag: 'SOMATIC RELEASE',
    },
    {
      id: 'we_jala_hydration_pause',
      title: 'Jala - Unhurried Hydration Pause',
      description:
        'Walk to fetch fresh water and drink it slowly while standing away from all screens. This brief physical transition breaks sedentary inertia and cools internal Pitta heat.',
      tag: 'SOMATIC GROUNDING',
    },
    {
      id: 'we_pratyahara_eye_palming',
      title: 'Pratyahara - Warm Eye Palming',
      description:
        'Gently cup warm palms over your closed eyes for 60 seconds to block out harsh monitor glare. Resting the optic nerve restores calm discernment for your next key decision.',
      tag: 'OPTICAL RECOVERY',
    },
    {
      id: 'we_viveka_priority_reset',
      title: 'Viveka - Top Priority Reset',
      description:
        'Clear your workspace and write down the one priority that actually matters before the day ends. Separating essential action from noisy urgency stops compulsive message checking.',
      tag: 'MENTAL ORDER',
    },
    {
      id: 'we_maryada_face_down',
      title: 'Maryada - Thirty-Minute Face-Down Boundary',
      description:
        'Turn your phone face-down and silence non-urgent alerts for a protected 30-minute window. Reclaiming unbroken focus protects both your daytime clarity and evening peace.',
      tag: 'SPACE SHIFT',
    },
  ],

  home_quiet: [
    {
      id: 'hq_pranayama_gentle_exhale',
      title: 'Pranayama - Gentle Extended Exhale',
      description:
        'Inhale softly through the nose for 4 seconds and breathe out slowly for 8 seconds. Lengthening the breath gently calms household worry and afternoon restlessness.',
      tag: 'INVISIBLE',
    },
    {
      id: 'hq_pratyahara_warm_eye_rest',
      title: 'Pratyahara - Warm Eye Rest',
      description:
        'Rub your hands gently together and rest warm palms over closed eyes for one quiet minute. Giving your eyes a peaceful break from television and phone light settles the mind.',
      tag: 'SENSORY WITHDRAWAL',
    },
    {
      id: 'hq_prana_fresh_air',
      title: 'Prana - Balcony or Window Fresh Air',
      description:
        'Step onto the balcony, veranda, or near an open window and take five slow breaths of outdoor air. Connecting with natural light and sky breaks indoor heaviness and overthinking.',
      tag: 'SPACE SHIFT',
    },
    {
      id: 'hq_jala_herbal_sip',
      title: 'Jala - Warm Water or Herbal Sip',
      description:
        'Sit down without any screen and sip warm water or soothing herbal tea with full attention. Warmth in the stomach calms Vata restlessness and restores gentle vitality.',
      tag: 'SOMATIC GROUNDING',
    },
    {
      id: 'hq_nada_bhajan_pause',
      title: 'Nada - Soothing Instrumental or Bhajan Pause',
      description:
        'Set aside news feeds and listen to three minutes of peaceful instrumental music or a quiet chant with eyes closed. Harmonious sound clears emotional residue from the heart.',
      tag: 'AUDITORY ANCHOR',
    },
    {
      id: 'hq_chankramana_three_min_walk',
      title: 'Chankramana - Unhurried Three-Minute Walk',
      description:
        'Walk slowly through your home or garden while feeling the steady contact of each footstep on the floor. Gentle rhythmic movement dissolves lethargy and stiffness without strain.',
      tag: 'KINETIC RELEASE',
    },
    {
      id: 'hq_trataka_soft_gaze',
      title: 'Trataka - Soft Gaze on Nature or Lamp',
      description:
        'Rest a steady, relaxed gaze on a green plant, distant tree, or warm lamp for 60 seconds. Anchoring visual attention on a calm object quiets repetitive family worries.',
      tag: 'OPTICAL RESET',
    },
    {
      id: 'hq_sparsha_neck_hand_release',
      title: 'Sparsha - Gentle Neck & Hand Release',
      description:
        'Slowly roll your shoulders back and massage the center of your palms for 60 seconds. Softening physical tension helps the body let go of accumulated daily fatigue.',
      tag: 'SOMATIC RELEASE',
    },
  ],
};

/**
 * Bhava cards data structure.
 */
export interface SeekerPositiveBuffer {
  id: string;
  title: string;
  badge: string;
  note: string;
}

export interface SeekerNegativeFriction {
  id: string;
  title: string;
  badge: string;
  reflection: string;
  steps: [string, string, string];
}

export interface SeekerBhavaGroup {
  positive: SeekerPositiveBuffer[];
  negative: SeekerNegativeFriction[];
}

export const SEEKER_BHAVA_CARDS: Record<LifeRhythm, SeekerBhavaGroup> = {
  learning_study: {
    positive: [
      {
        id: 'pos_1',
        title: 'Celebrating a Friend\'s Growth',
        badge: 'Muditā • YS 1.33',
        note: 'Genuinely admiring someone else\'s study streak or good result softens envy and expands your own capacity for excellence.',
      },
      {
        id: 'pos_2',
        title: 'Shared Learning & Kindness',
        badge: 'Maitrī • YS 1.33',
        note: 'Explaining a difficult concept to a peer or offering quiet encouragement builds warmth and lifts the entire study circle.',
      },
      {
        id: 'pos_3',
        title: 'Gratitude for Today\'s Progress',
        badge: 'Santoṣa • YS 2.42',
        note: 'Taking a moment to appreciate what you genuinely understood today anchors steady confidence and quiet contentment.',
      },
    ],
    negative: [
      {
        id: 'neg_1',
        title: 'Comparing Your Journey with Peers',
        badge: 'Upekṣā • BG 2.56',
        reflection: 'Seeing others post high test scores or progress milestones can trigger a sudden feeling of being left behind.',
        steps: [
          'Pause and acknowledge the sting without self-criticism.',
          'Remind yourself that their chapter ten is not your chapter two.',
          'Return your full attention to the page in front of you.',
        ],
      },
      {
        id: 'neg_2',
        title: 'Worry Over Upcoming Results',
        badge: 'Karmaphala • BG 2.47',
        reflection: 'Obsessing over future exam marks or competitive rankings paralyzes your intellect and drains today\'s retention.',
        steps: [
          'Notice when anxiety leaps forward into tomorrow.',
          'Anchor in Krishna\'s counsel: you have a right to the work, never to the fruits.',
          'Dedicate the next 25 minutes entirely to honest practice.',
        ],
      },
      {
        id: 'neg_3',
        title: 'Frustration with Unshared Group Effort',
        badge: 'Titikṣā • BG 2.14',
        reflection: 'When project partners shirk responsibilities or contribute carelessly, anger burns your own cognitive stamina.',
        steps: [
          'Take three slow breaths to cool immediate irritation.',
          'Distinguish between their conduct and your own duty.',
          'Communicate necessary boundaries calmly without carrying lingering resentment.',
        ],
      },
      {
        id: 'neg_4',
        title: 'Guilt After a Wasted Afternoon',
        badge: 'Ātma-Kṛpā • BG 6.5',
        reflection: 'Slipping into hours of distraction often triggers self-hatred, which ironically drives another round of escapism.',
        steps: [
          'Break the guilt loop immediately by naming it as Tamas.',
          'Offer yourself the gentle forgiveness of a loving friend.',
          'Salvage the evening by completing one single meaningful task.',
        ],
      },
      {
        id: 'neg_5',
        title: 'Feeling Isolated in a Busy Routine',
        badge: 'Karuṇā • YS 1.33',
        reflection: 'Intense study schedules can feel intensely lonely when days blur into identical repetitive routines.',
        steps: [
          'Step outside your study space into daylight or fresh air.',
          'Send a warm, unhurried message or call to someone you love.',
          'Recognize that thousands of seekers are walking this exact path of discipline alongside you.',
        ],
      },
    ],
  },

  work_enterprise: {
    positive: [
      {
        id: 'pos_1',
        title: 'Generous Recognition of Others',
        badge: 'Muditā • YS 1.33',
        note: 'Publicly acknowledging a teammate\'s hard work and celebrating their success creates trust and dissolves workplace jealousy.',
      },
      {
        id: 'pos_2',
        title: 'Calm Steadiness Under Pressure',
        badge: 'Samatvam • BG 2.48',
        note: 'Remaining composed when deadlines tighten acts as an anchor for your team and preserves high-quality decision making.',
      },
      {
        id: 'pos_3',
        title: 'Undivided Presence After Hours',
        badge: 'Pratyāhāra • YS 2.54',
        note: 'Stepping completely away from office emails at dusk allows true rejuvenation and deep connection with family.',
      },
    ],
    negative: [
      {
        id: 'neg_1',
        title: 'Carrying Daytime Tension into Evening',
        badge: 'Pratyāhāra • BG 2.58',
        reflection: 'Bringing unresolved work arguments and project anxieties to the dinner table strains relationships and prevents rest.',
        steps: [
          'Establish a physical boundary ritual when leaving your workspace.',
          'Write down lingering tasks on paper to close mental open loops.',
          'Give your undivided presence to those sharing your evening.',
        ],
      },
      {
        id: 'neg_2',
        title: 'Heat After a Difficult Conversation',
        badge: 'Krodha-Nirodha • BG 2.63',
        reflection: 'A tense meeting or sharp comment from a colleague causes pride to flare and demands a retaliatory response.',
        steps: [
          'Pause for ten slow breaths before sending an emotionally charged reply.',
          'Reflect on whether reacting now serves your long-term integrity.',
          'Respond with firm, courteous clarity after your inner fire has cooled.',
        ],
      },
      {
        id: 'neg_3',
        title: 'Anxiety Over Targets & Uncertainty',
        badge: 'Abhyāsa • BG 6.35',
        reflection: 'Shifting organizational priorities, aggressive targets, and economic changes create an underlying hum of insecurity.',
        steps: [
          'Identify what is within your control and what is not.',
          'Ground yourself in daily execution rather than distant forecasts.',
          'Trust that steady competence and adaptability outlast corporate fluctuations.',
        ],
      },
      {
        id: 'neg_4',
        title: 'Impatience When Things Move Slowly',
        badge: 'Dhṛti • BG 18.33',
        reflection: 'Delays in approvals, bureaucratic friction, or slow responses from stakeholders tempt you to force outcomes angrily.',
        steps: [
          'Recognize that impatience burns your prana without speeding up external processes.',
          'Practice enduring patience while keeping communication clear.',
          'Channel spare energy into another constructive task.',
        ],
      },
      {
        id: 'neg_5',
        title: 'Exhaustion from Constant Availability',
        badge: 'Yukta-Vihāra • BG 6.17',
        reflection: 'Responding to pings at all hours breeds chronic burnout, cognitive fatigue, and resentment toward your work.',
        steps: [
          'Set clear, respectful communication boundaries during off-hours.',
          'Turn off non-essential work notifications after your duty concludes.',
          'Honor sleep as an indispensable foundation of professional excellence.',
        ],
      },
    ],
  },

  home_quiet: {
    positive: [
      {
        id: 'pos_1',
        title: 'Warmth in Simple Daily Moments',
        badge: 'Santoṣa • YS 2.42',
        note: 'Finding quiet joy in preparing a fresh meal, watering plants, or sharing tea brings deep contentment to the home.',
      },
      {
        id: 'pos_2',
        title: 'Blessing Those You Care For',
        badge: 'Maitrī • YS 1.33',
        note: 'Silently wishing peace, health, and protection for your family members fills your household with gentle protective energy.',
      },
      {
        id: 'pos_3',
        title: 'Patience with Yourself & Others',
        badge: 'Titikṣā • BG 2.14',
        note: 'Accepting minor household imperfections and moods with gentle grace keeps family relationships harmonized.',
      },
    ],
    negative: [
      {
        id: 'neg_1',
        title: 'Worrying Over Family You Cannot Control',
        badge: 'Īśvara-Praṇidhāna • BG 18.66',
        reflection: 'Constantly worrying about children, elders, or relatives creates invisible internal anxiety and tension.',
        steps: [
          'Acknowledge that worry is not love; calm presence is love.',
          'Surrender outcomes you cannot dictate into higher divine care.',
          'Focus on offering a warm, steady sanctuary whenever they turn to you.',
        ],
      },
      {
        id: 'neg_2',
        title: 'Feeling Unseen in Daily Care',
        badge: 'Nirahaṅkāra • BG 12.13',
        reflection: 'Endless cooking, cleaning, and emotional support often go unnoticed by busy family members, causing quiet resentment.',
        steps: [
          'Notice the ache for appreciation and hold yourself with tender kindness.',
          'Remember that your unseen acts of care are sacred karma yoga.',
          'Express your needs openly and gently rather than expecting mind-reading.',
        ],
      },
      {
        id: 'neg_3',
        title: 'Replaying Old Hurts in Quiet Hours',
        badge: 'Kṣamā • BG 16.3',
        reflection: 'In quiet moments, past misunderstandings and hurtful words spoken by relatives replay like an unclosed loop.',
        steps: [
          'Notice when the mind is wandering into the graveyard of past memories.',
          'Release the burden of re-litigating old arguments in your head.',
          'Anchor awareness in the present moment with five deep, clearing breaths.',
        ],
      },
      {
        id: 'neg_4',
        title: 'Irritability Over Small Household Friction',
        badge: 'Śama • BG 6.26',
        reflection: 'Clutter, broken routines, or small inconsiderate habits can suddenly trigger sharp annoyance.',
        steps: [
          'Step into another room or balcony before speaking in irritation.',
          'Drink a glass of cool water and let your nervous system reset.',
          'Address practical household needs with humor and lightness.',
        ],
      },
      {
        id: 'neg_5',
        title: 'Restlessness or Loneliness in Solitude',
        badge: 'Ātma-Rati • BG 3.17',
        reflection: 'Long quiet afternoons or retirement hours can bring a hollow sense of restlessness or purposelessness.',
        steps: [
          'Transform empty solitude into intentional, peaceful sanctum.',
          'Engage in uplifting reading, sacred music, or gentle creative craft.',
          'Reach out to share a kind word with a neighbor or distant friend.',
        ],
      },
    ],
  },
};


/**
 * Curated Foundational Sankalpa Pledges tailored for the 3 Civilian Life Rhythms.
 * Provides authentic, compassionate, IKS-grounded intention templates that seekers can use as-is or personalize.
 */
export const CURATED_SEEKER_SANKALPAS: Record<LifeRhythm, string> = {
  learning_study:
    '“I step onto this path not to punish myself into perfection, but to elevate myself by my own mind. When my attention wanders into digital distraction or study fatigue, I will pause without guilt. When my mind feels fragmented across too many subjects, I choose vyavasāyātmikā buddhi—a single-pointed, resolute intellect. Breath by breath, I hold the reins of my attention, honoring steady daily discipline as my truest friend.”',
  work_enterprise:
    '“I dedicate my daily labor to purposeful action without anxious attachment to the fruits (Karma Yoga). Amid demanding deadlines, difficult decisions, and workplace friction, I will not surrender my inner equilibrium. When pressure rises, I will take one slow, steady breath before responding. Day by day, I hold the reins of my mind—channeling ambition with ethical clarity, honoring evening rest, and guarding my peace.”',
  home_quiet:
    '“I anchor my daily life in presence, contentment, and gentle vitality (Santosha). I release the urge to compare my journey with the noisy demands of the outside world. When domestic fatigue, family worries, or emotional friction arise, I will meet them with patience and self-compassion. Day by day, I hold the reins of my mind—protecting peaceful quietude in my home and honoring simple daily harmony.”',
};
