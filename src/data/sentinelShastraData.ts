/**
 * Dedicated curated dataset of field verses and operational diagnostics for the Sentinel path
 * (Path of the Sentinel for defense personnel).
 *
 * Includes the 5 core Bhagavad Gita verses for high-risk deployment challenges:
 * - BG 6.26 for restless/intrusive thoughts
 * - BG 2.14 for enduring temporary waves of grief and hardship
 * - BG 12.13 for preserving compassion and non-hatred under moral strain
 * - BG 2.56 for Sthitaprajña steadiness amid hypervigilance
 * - BG 6.5 for self-upliftment during heavy field fatigue
 * Plus:
 * - BG 2.48 (Samatvam)
 * - BG 2.58 (Kūrma Pratyāhāra)
 * - BG 18.26 (Sāttvika Kartā)
 */

export interface SentinelGitaQuote {
  id: string;
  verseRef: string;
  sanskritDevanagari: string;
  transliteration: string;
  englishTranslation: string;
  fieldApplication: string;
}

export const SENTINEL_GITA_QUOTES: SentinelGitaQuote[] = [
  {
    id: 'bg_6_26',
    verseRef: 'Bhagavad Gita 6.26',
    sanskritDevanagari: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् ।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
    transliteration: 'yato yato niścarati manaś cañcalam asthiram |\ntatas tato niyamyaitad ātmany eva vaśaṁ nayet ||',
    englishTranslation:
      'From wherever the restless and unsteady mind wanders away, one should repeatedly restrain it and bring it back under the control of the Self alone.',
    fieldApplication:
      'When intrusive thoughts or hyper-alert flashbacks surge during solitary night sentry shifts, do not fight the mental turbulence with brute resistance. Quietly notice where your attention drifted, take one deliberate breath, and anchor your awareness firmly back on your operational post.',
  },
  {
    id: 'bg_2_14',
    verseRef: 'Bhagavad Gita 2.14',
    sanskritDevanagari: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥',
    transliteration: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ |\nāgamāpāyino 'nityās tāṁs titikṣasva bhārata ||",
    englishTranslation:
      'The contact of the senses with their objects gives rise to cold and heat, pleasure and pain. They are impermanent, appearing and disappearing; endure them bravely, O descendant of Bharata.',
    fieldApplication:
      'Numbing mountain frost, physical exhaustion, and sharp waves of longing for distant family are sensory contacts that arrive and depart like shifting weather. Practice Titikṣā (stoic forbearance)—bear the discomfort with steady dignity without allowing outer circumstance to breach your inner bunker.',
  },
  {
    id: 'bg_12_13',
    verseRef: 'Bhagavad Gita 12.13',
    sanskritDevanagari: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥',
    transliteration: 'adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca |\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī ||',
    englishTranslation:
      'One who harbors no malice toward any living being, who is friendly and compassionate, free from possessiveness and false ego, even-tempered in joy and sorrow, and ever forgiving—such a soul is dear to Me.',
    fieldApplication:
      'High-stress operational environments and chain-of-command friction can tempt a soldier into cold cynicism or internal bitterness. Preserve your warrior integrity by keeping your heart free from hidden malice, protecting your unit comrades with genuine Sahyog, and meeting friction with quiet inner magnanimity.',
  },
  {
    id: 'bg_2_56',
    verseRef: 'Bhagavad Gita 2.56',
    sanskritDevanagari: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः ।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
    transliteration: 'duḥkheṣv anudvigna-manāḥ sukheṣu vigata-spṛhaḥ |\nvīta-rāga-bhaya-krodhaḥ sthita-dhīr munir ucyate ||',
    englishTranslation:
      'One whose mind remains unperturbed in sorrow, who is free from craving in the midst of pleasure, and from whom attachment, fear, and anger have vanished, is called a sage of steady intellect (Sthitaprajña).',
    fieldApplication:
      'Tactical survival demands hypervigilant eyes, but an agitated mind creates false alarms and erratic judgment. Train yourself to be a Sthitaprajña on the frontline—unshaken by unexpected operational delays, purged of reactive rage, and holding absolute stillness under fire.',
  },
  {
    id: 'bg_6_5',
    verseRef: 'Bhagavad Gita 6.5',
    sanskritDevanagari: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
    transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||',
    englishTranslation:
      'Let a person lift themselves by their own mind, and not degrade themselves. For the mind alone is the steadfast friend of the self, and the mind alone can be its bitterest enemy.',
    fieldApplication:
      'During long deployments when isolation feels heavy and morale begins to wear thin, refuse to let negative self-talk pull you down. Use your inner intellect as an unyielding comrade—remind yourself of your chosen duty, discipline your mental chatter, and stand tall.',
  },
  {
    id: 'bg_2_48',
    verseRef: 'Bhagavad Gita 2.48',
    sanskritDevanagari: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
    transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||',
    englishTranslation:
      'Perform your prescribed duties steadfast in Yoga, O Arjuna, abandoning attachment and remaining undisturbed by success or failure. Such evenness of mind is known as Yoga.',
    fieldApplication:
      'Execute every tactical order and routine protocol with total commitment, releasing all obsessive worry over immediate accolades or external outcomes. True warrior poise is Samatvam—a calm, centered mind that remains just as composed in victory as during an unexpected setback.',
  },
  {
    id: 'bg_2_58',
    verseRef: 'Bhagavad Gita 2.58',
    sanskritDevanagari: 'यदा संहरते चायं कूर्मोऽङ्गानीव सर्वशः ।\nइन्द्रियाणीन्द्रियार्थेभ्यस्तस्य प्रज्ञा प्रतिष्ठिता ॥',
    transliteration: "yadā saṁharate cāyaṁ kūrmo 'ṅgānīva sarvaśaḥ |\nindriyāṇīndriyārthebhyas tasya prajñā pratiṣṭhitā ||",
    englishTranslation:
      'When one completely withdraws the senses from their sense-objects, just as a tortoise retracts its limbs into its protective shell, their discriminative wisdom becomes firmly anchored.',
    fieldApplication:
      'The second your watch is relieved and you step into the barracks bunk, execute the Kūrma Pratyāhāra maneuver. Retract your tactical antennae, stow away the smartphone screen, and withdraw your senses completely to let deep restorative rest rebuild your physical armor.',
  },
  {
    id: 'bg_18_26',
    verseRef: 'Bhagavad Gita 18.26',
    sanskritDevanagari: 'मुक्तसङ्गोऽनहंवादी धृत्युत्साहसमन्वितः ।\nसिद्ध्यसिद्ध्योर्निर्विकारः कर्ता सात्त्विक उच्यते ॥',
    transliteration: "mukta-saṅgo 'nahaṁ-vādī dhṛty-utsāha-samanvitaḥ |\nsiddhy-asiddhyor nirvikāraḥ kartā sāttvika ucyate ||",
    englishTranslation:
      'One who is liberated from attachment, free from egotism, full of resolute determination and tireless enthusiasm, and unaffected by success or failure—such a doer is declared to be Sattvic.',
    fieldApplication:
      'Hold your post not out of personal pride or resentment toward hardship, but with silent fortitude and steady inner energy. A Sāttvika sentinel operates with quiet professional mastery, standing as a reassuring pillar of stability for the entire platoon.',
  },
];

const STORAGE_KEY_LAST_SENTINEL_QUOTE = 'bp_last_sentinel_quote_id';

/**
 * Returns a non-repeating verse object from the Sentinel Gita collection.
 */
export function getNextSentinelGitaQuote(excludeId?: string): SentinelGitaQuote {
  let lastId = excludeId;

  if (!lastId) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        lastId = window.localStorage.getItem(STORAGE_KEY_LAST_SENTINEL_QUOTE) || undefined;
      }
    } catch {
      // Local storage unavailable fallback
    }
  }

  const candidates = SENTINEL_GITA_QUOTES.filter((q) => q.id !== lastId);
  const pool = candidates.length > 0 ? candidates : SENTINEL_GITA_QUOTES;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_LAST_SENTINEL_QUOTE, selected.id);
    }
  } catch {
    // Local storage unavailable fallback
  }

  return selected;
}

/**
 * Returns a field-ready Ayurvedic remedy for soldiers based on their dominant Dosha state.
 */
export function getSentinelDoshaRemedy(dominantDosha: string): string {
  const normalized = (dominantDosha || '').toLowerCase();

  if (normalized.includes('vata') || normalized.includes('vāta')) {
    return 'Elevated Vāta (Watch Alertness & Broken Rest): Your nervous system is still scanning after duty. Sip warm water, keep your feet warm, and practice 60 seconds of Kūrma eye-palming in darkness before sleeping.';
  }

  if (normalized.includes('pitta')) {
    return 'Elevated Pitta (Command Friction & Stimulant Heat): Internal heat is high from watch caffeine or swallowed frustration. Step back from extra tea, splash cool water on your face, and take 5 slow extended exhalations before speaking.';
  }

  if (normalized.includes('kapha')) {
    return 'Elevated Kapha (Field Monotony & Bunk Heaviness): Prolonged routine is causing mental fog and inertia. Step outside into natural light, do 3 minutes of brisk shoulder/spine mobility, and check in with your unit buddy.';
  }

  return 'Sama-Dosha (Tactical Equilibrium): Your biological rhythm is steady across watch and rest. Maintain balanced mess hydration and post-watch decompression.';
}

export default SENTINEL_GITA_QUOTES;
