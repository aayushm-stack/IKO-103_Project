import { BhavaEmotion, BhavaPrescription, BhavaCardData } from '../types/iks';

/**
 * Patanjali's Chitta Prasadanam framework (Yoga Sutra 1.33):
 * maitrī-karuṇā-muditopekṣāṇāṁ sukha-duḥkha-puṇyāpuṇya-viṣayāṇāṁ bhāvanātaś citta-prasādanam ||
 *
 * Mapping interpersonal emotional perturbations directly to serene counter-attitudes:
 * - Happy (Sukha) -> Friendliness (Maitri)
 * - Suffering (Duhkha) -> Compassion (Karuna, including self-compassion)
 * - Virtuous / Successful (Punya) -> Sympathetic Joy (Mudita)
 * - Hostile / Harmful (Apunya) -> Equanimity / Neutrality (Upeksha)
 *
 * Expanded with deep, humanized resolutions addressing modern student psychology:
 * - "Imposter Syndrome / Feeling Left Out" -> Karuna (Self-Compassion)
 * - "Academic Burnout seeing others succeed effortlessly" -> Mudita (Sympathetic Joy)
 * - "Dealing with a toxic project partner" -> Upeksha (Equanimity)
 */

const IMPOSTER_PRESCRIPTION: BhavaPrescription = {
  emotion: 'Imposter Syndrome / Feeling Left Out',
  recommendedAttitude: 'Karuna_Compassion',
  sanskritSutra: 'duḥkheṣu karuṇā-bhāvanā (दुःखेषु करुणा-भावना - YS 1.33)',
  cognitivePrompt:
    "When you feel like an imposter or that everyone else has their life sorted out while you flounder, your inner student is suffering. Cultivate Karuna. You do not need to be flawless, finished, or extraordinary to belong in this room. Offer yourself the exact same gentle warmth and patience you would offer to a beloved friend in tears.",
  actionableStep:
    'Rest a gentle hand over your heart. Breathe in kindness for yourself, and breathe out the exhausting pressure to prove your worth to anyone.',
  targetGunaShift: 'Sattva',
};

const BURNOUT_PRESCRIPTION: BhavaPrescription = {
  emotion: 'Academic Burnout seeing others succeed effortlessly',
  recommendedAttitude: 'Mudita_SympatheticJoy',
  sanskritSutra: 'puṇyeṣu muditā-bhāvanā (पुण्येषु मुदिता-भावना - YS 1.33)',
  cognitivePrompt:
    "When we compare our chapter 1 to someone else's chapter 10, our mind contracts. Cultivate Mudita. Silently wish them well, and watch your own mental burden disappear.",
  actionableStep:
    'Notice how effortless external appearances can be deceptive. Silently wish them well: "May your hard work bear fruit." Then gently bring your focus back to your own single breath and single step.',
  targetGunaShift: 'Sattva',
};

const TOXIC_PARTNER_PRESCRIPTION: BhavaPrescription = {
  emotion: 'Dealing with a toxic project partner',
  recommendedAttitude: 'Upeksha_Equanimity',
  sanskritSutra: 'apuṇyeṣu upekṣā-bhāvanā (अपुण्येषु उपेक्षा-भावना - YS 1.33)',
  cognitivePrompt:
    "When a project partner brings passive aggression, blame, or uncooperative chaos, retaliating only invites their turbulence into your own nervous system. Practice Upekṣā: detached equanimity that protects your peace while keeping your boundaries clear, dignified, and firm.",
  actionableStep:
    'Document facts objectively without emotional debate. Do not absorb their turbulence as personal commentary. Preserve your vital prāṇa for the work that is genuinely in your control.',
  targetGunaShift: 'Sattva',
};

export const BHAVA_COMPASS_MAP: Record<BhavaEmotion, BhavaPrescription> = {
  // --- Modern Student Psychology Triggers ---
  'Imposter Syndrome / Feeling Left Out': IMPOSTER_PRESCRIPTION,
  Imposter_Syndrome: {
    ...IMPOSTER_PRESCRIPTION,
    emotion: 'Imposter_Syndrome',
  },

  'Academic Burnout seeing others succeed effortlessly': BURNOUT_PRESCRIPTION,
  Academic_Burnout: {
    ...BURNOUT_PRESCRIPTION,
    emotion: 'Academic_Burnout',
  },

  'Dealing with a toxic project partner': TOXIC_PARTNER_PRESCRIPTION,
  Toxic_Partner: {
    ...TOXIC_PARTNER_PRESCRIPTION,
    emotion: 'Toxic_Partner',
  },

  // --- Classical Chitta Prasadanam Triggers ---
  Peer_Envy: {
    emotion: 'Peer_Envy',
    recommendedAttitude: 'Mudita_SympatheticJoy',
    sanskritSutra: 'puṇyeṣu muditā-bhāvanā (पुण्येषु मुदिता-भावना - YS 1.33)',
    cognitivePrompt:
      'When witnessing a peer’s placement, accolade, or skill, envy contracts consciousness into scarcity. Reframe their win as proof that excellence is possible. When you celebrate another, their light elevates the whole room.',
    actionableStep:
      'Silently wish them continued growth and flourishing. Identify one inspirational takeaway for your own focused swadharma.',
    targetGunaShift: 'Sattva',
  },

  Other_Suffering: {
    emotion: 'Other_Suffering',
    recommendedAttitude: 'Karuna_Compassion',
    sanskritSutra: 'duḥkheṣu karuṇā-bhāvanā (दुःखेषु करुणा-भावना - YS 1.33)',
    cognitivePrompt:
      'When encountering a classmate or friend in distress, exhaustion, or vulnerability, resist superiority, contempt, or emotional numbness. Ground yourself in selfless empathy.',
    actionableStep:
      'Offer genuine presence or extend a small, concrete act of service (Loka-saṅgraha) without patronizing judgment or unsolicited lecturing.',
    targetGunaShift: 'Sattva',
  },

  Shared_Success: {
    emotion: 'Shared_Success',
    recommendedAttitude: 'Maitri_Friendliness',
    sanskritSutra: 'sukheṣu maitrī-bhāvanā (सुखेषु मैत्री-भावना - YS 1.33)',
    cognitivePrompt:
      'When surrounded by flourishing and collective joy, dissolve feelings of separation and competition through open-hearted camaraderie.',
    actionableStep:
      'Communicate sincere warmth, share in their happiness, and cultivate enduring goodwill without holding back.',
    targetGunaShift: 'Sattva',
  },

  Toxic_Hostility: {
    emotion: 'Toxic_Hostility',
    recommendedAttitude: 'Upeksha_Equanimity',
    sanskritSutra: 'apuṇyeṣu upekṣā-bhāvanā (अपुण्येषु उपेक्षा-भावना - YS 1.33)',
    cognitivePrompt:
      'When targeted by bad-faith comments, online toxicity, or disruptive hostility, counter-rage burns your own cognitive reserves. Upekṣā is deliberate, majestic neutrality.',
    actionableStep:
      'Do not retaliate or feed the cycle. Withdraw attention entirely, preserve your inner composure, and let their agitation dissipate without an echo.',
    targetGunaShift: 'Sattva',
  },
};

/**
 * 8 Bhava Compass cards covering student psychological friction and positive emotional buffers
 * rooted in Patanjali's Chitta Prasadanam framework (Yoga Sutra 1.33).
 */
export const BHAVA_CARDS: BhavaCardData[] = [
  // --- 1. Positive Buffer Card (Maitri) ---
  {
    id: 'celebrating-shared-success',
    title: 'Celebrating a Shared Success & Team Win',
    sanskritTrait: 'Maitrī (Friendliness)',
    isPositive: true,
    appreciationMessage:
      "Your mind expands when you elevate others! Taking a moment to genuinely celebrate a team win or a friend's good news proves that you are operating from a place of abundance. Shared joy completely cancels out competitive burnout. Keep sharing that light!",
  },

  // --- 2. Positive Buffer Card (Mudita) ---
  {
    id: 'inspired-hard-work',
    title: "Inspired by Someone's Hard Work",
    sanskritTrait: 'Muditā (Joy in Virtue)',
    isPositive: true,
    appreciationMessage:
      "Recognizing and admiring someone else's intense dedication or good character is a beautiful trait. It means your ego is quiet enough to let someone else shine without feeling threatened. Let their dedication fuel your own focus and study session today!",
  },

  // --- 3. Positive Buffer Card (Karuna) ---
  {
    id: 'handling-setback-grace',
    title: 'Handling a Setback with Grace',
    sanskritTrait: 'Karuṇā (Self-Compassion)',
    isPositive: true,
    appreciationMessage:
      'You faced a bad grade, a rejected application, or a tough setback today—and instead of spiraling into self-hate, you chose resilience and self-forgiveness. That takes immense emotional maturity. Be proud of how you handled this; this is what true self-mastery looks like.',
  },

  // --- 4. Negative Friction Card (Mudita) ---
  {
    id: 'placement-envy',
    title: 'Placement Envy & Academic Comparison',
    sanskritTrait: 'Muditā (Joy in Others)',
    isPositive: false,
    explanationText:
      "It burns to watch someone else get the exact offer, grade, or recognition you’ve been working so hard for. Feeling this envy doesn't make you a bad person; it just means you care deeply about your future, and right now, you are scared of being left behind.",
    actionSteps: [
      'Take a deep breath and let yourself feel the sting without judging yourself for it.',
      "Remind yourself of a core truth: someone else's success does not consume your opportunities. Your timeline is uniquely yours.",
      "Try to silently wish them well. Releasing this heavy envy isn't for them—it’s to free up your own mental bandwidth so you can get back to your own grind with a clear head.",
    ],
    isResolved: false,
  },

  // --- 5. Negative Friction Card (Karuna) ---
  {
    id: 'imposter-syndrome-self-doubt',
    title: 'Imposter Syndrome & Self-Doubt',
    sanskritTrait: 'Karuṇā (Self-Compassion)',
    isPositive: false,
    explanationText:
      "You are looking around the room and feeling like everyone else understands the material effortlessly, while you are just pretending. Carrying the weight of feeling 'not good enough' or like a fraud is exhausting.",
    actionSteps: [
      'Remember that people only display their highlights, not their midnight struggles or failures. You are comparing your messy behind-the-scenes to their polished front stage.',
      'You belong here. You earned your seat.',
      'Talk to yourself right now like you would talk to a tired, overwhelmed friend. Close the books for just 10 minutes, step outside, and give yourself some grace.',
    ],
    isResolved: false,
  },

  // --- 6. Negative Friction Card (Upeksha) ---
  {
    id: 'toxic-partner-unfair-treatment',
    title: 'Toxic Partner or Unfair Treatment',
    sanskritTrait: 'Upekṣā (Equanimity)',
    isPositive: false,
    explanationText:
      'You are carrying the weight while someone else slacks off, or you are dealing with outright hostility and blame. It feels deeply unfair, and the frustration is completely draining your energy.',
    actionSteps: [
      'Recognize that their toxic behavior is a reflection of their own character and stress, not yours.',
      'Practice emotional detachment (Upeksha). You do not have to absorb their chaos. Build a mental shield.',
      'Protect your peace. Stop fighting a pointless battle in your head, draw a strict boundary, and focus only on the work you can actually control.',
    ],
    isResolved: false,
  },

  // --- 7. Negative Friction Card (Maitri) ---
  {
    id: 'social-isolation-loneliness',
    title: 'Social Isolation & Loneliness',
    sanskritTrait: 'Maitrī (Friendliness)',
    isPositive: false,
    explanationText:
      'You are on a campus surrounded by hundreds of people, yet you feel completely disconnected and invisible. That kind of quiet loneliness is one of the heaviest things to carry.',
    actionSteps: [
      'Know that this feeling is temporary, and many students in the rooms right next to you are feeling the exact same quiet isolation right now.',
      "Don't wait for the world to reach out. Extend a tiny branch of friendliness (Maitri) outward. Text a friend you haven't spoken to, or simply go sit with your laptop in a public, shared space. Connection starts with small ripples.",
    ],
    isResolved: false,
  },

  // --- 8. Negative Friction Card (Karuna) ---
  {
    id: 'paralyzing-academic-overwhelm',
    title: 'Paralyzing Academic Overwhelm',
    sanskritTrait: 'Karuṇā (Grounding)',
    isPositive: false,
    explanationText:
      'The deadlines are piling up, the syllabus looks impossible, and your mind is spinning into a panic state. You feel so overwhelmed that you are completely paralyzed.',
    actionSteps: [
      "Stop looking at the mountain. You cannot do a month's work in one night, and staring at the massive pile will only feed the panic.",
      'Forgive yourself for procrastinating or falling behind—carrying guilt right now just wastes the little energy you have left.',
      'Pick one single, tiny task. Commit to doing it for just 15 minutes. Action kills anxiety.',
    ],
    isResolved: false,
  },
];

/**
 * Retrieves the specific Chitta Prasadanam psychological prescription for an emotional trigger.
 * Resilient to full student trigger phrasing and shorthand keys.
 */
export function getBhavaPrescription(emotion: BhavaEmotion | string): BhavaPrescription {
  if (emotion in BHAVA_COMPASS_MAP) {
    return BHAVA_COMPASS_MAP[emotion as BhavaEmotion];
  }

  if (typeof emotion === 'string') {
    const lower = emotion.toLowerCase();
    if (lower.includes('imposter') || lower.includes('left out') || lower.includes('self-doubt')) {
      return BHAVA_COMPASS_MAP['Imposter Syndrome / Feeling Left Out'];
    }
    if (lower.includes('burnout') || lower.includes('effortless') || lower.includes('overwhelm') || lower.includes('paralyz')) {
      return BHAVA_COMPASS_MAP['Academic Burnout seeing others succeed effortlessly'];
    }
    if (lower.includes('partner') || (lower.includes('toxic') && lower.includes('project')) || lower.includes('unfair')) {
      return BHAVA_COMPASS_MAP['Dealing with a toxic project partner'];
    }
    if (lower.includes('hostil') || lower.includes('toxic')) {
      return BHAVA_COMPASS_MAP['Toxic_Hostility'];
    }
    if (lower.includes('envy') || lower.includes('jealous') || lower.includes('placement')) {
      return BHAVA_COMPASS_MAP['Peer_Envy'];
    }
    if (lower.includes('suffering') || lower.includes('distress') || lower.includes('isolation') || lower.includes('lonel')) {
      return BHAVA_COMPASS_MAP['Other_Suffering'];
    }
    if (lower.includes('shared') || lower.includes('friend')) {
      return BHAVA_COMPASS_MAP['Shared_Success'];
    }
  }

  return BHAVA_COMPASS_MAP['Academic Burnout seeing others succeed effortlessly'];
}
