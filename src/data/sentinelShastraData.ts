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

import { DeploymentEnvironment } from '../types/shastra';
import { TriggerCategory } from '../types/iks';
import { DetailedMicroSwap } from './seekerShastraData';
export type { DetailedMicroSwap };

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
 * Deployment posting terrain definitions for defense personnel.
 */
export interface DeploymentEnvironmentInfo {
  id: DeploymentEnvironment;
  label: string;
  badge: string;
  summary: string;
}

export const DEPLOYMENT_ENVIRONMENTS: DeploymentEnvironmentInfo[] = [
  {
    id: 'high_altitude',
    label: 'High-Altitude & Cold',
    badge: 'Siachen • Ladakh • Snow Post',
    summary: 'Sub-zero bunker routine, thin air, low appetite, and tight shelter rest.',
  },
  {
    id: 'active_border',
    label: 'Active Border & Picket',
    badge: 'Naka • OP • Fence Grid',
    summary: 'Split sentry shifts, watch-tea load, and real-time homefront network tension.',
  },
  {
    id: 'cantonment',
    label: 'Cantonment & Peace',
    badge: 'Lines • Parade • Training',
    summary: 'Roll-calls, inspection pressure, command hierarchy, and leave coordination.',
  },
];

/**
 * Sadhana dynamic field reflection hints adapted to the soldier's posting terrain.
 */
export interface SadhanaTerrainPrompt {
  aharaFuelHint: string;
  aharaDigestionHint: string;
  nidraWatchHint: string;
  viryaTankHint: string;
}

export const SADHANA_TERRAIN_PROMPTS: Record<DeploymentEnvironment, SadhanaTerrainPrompt> = {
  high_altitude: {
    aharaFuelHint: "High altitude kills appetite (Agni-Māndya). Did you take warm ration, soup, or melted snow water today even if you didn't feel hungry?",
    aharaDigestionHint: "Inside a tight shelter or fiberglass hut, small tensions echo loudly. How peacefully did your mind digest today's bunker talks and calls?",
    nidraWatchHint: "Thin air and freezing nights break sleep into pieces. Count both night bunk hours and daytime watch-off recovery.",
    viryaTankHint: "Sub-zero cold drains physical and mental heat fast. How full is your inner patience reserve right now?",
  },
  active_border: {
    aharaFuelHint: "Long Naka and OP shifts tempt you to survive on 6 cups of sweet watch-tea. How balanced was your real meal and water intake today?",
    aharaDigestionHint: "With mobile network right by the fence, home worries reach you on duty. How steadily did you absorb today's phone calls?",
    nidraWatchHint: "Rotating 2-hour or 4-hour night sentry shifts require deliberate power-down after duty. Log your cumulative 24-hour rest.",
    viryaTankHint: "Standing watch between border alertness and home thoughts takes grit. How steady is your inner coping tank tonight?",
  },
  cantonment: {
    aharaFuelHint: "Between early PT, working parties, and mess timings, how steady was your food and caffeine balance today?",
    aharaDigestionHint: "How well did you keep parade-ground remarks, roster changes, or phone calls from sitting heavy in your stomach?",
    nidraWatchHint: "Log your total rest across barrack lights-out, guard duty, and early morning reveille.",
    viryaTankHint: "After inspections, hierarchy orders, and daily drill, how much calm patience is left in your tank tonight?",
  },
};

/**
 * Returns a practical, 2-sentence buddy remedy tailored to both the Dosha state
 * and active posting environment.
 */
export function getSentinelDoshaRemedy(
  dominantDosha: string,
  env: DeploymentEnvironment = 'active_border'
): string {
  const normalized = (dominantDosha || '').toLowerCase();

  if (normalized.includes('vata') || normalized.includes('vāta')) {
    if (env === 'high_altitude') {
      return 'Elevated Vāta (Sub-Zero Cold & Thin Air): Sub-zero wind and broken sleep agitate the nervous system. Sip warm melted water or soup, keep boots and socks dry, and rub warm palms over closed eyes before bunk rest.';
    }
    if (env === 'cantonment') {
      return 'Elevated Vāta (Parade Fatigue & Irregular Routine): The rush between roll-calls and duties has scattered your focus. Drink a glass of warm water, stretch your calves and lower back, and take 10 quiet breaths away from barracks noise.';
    }
    return 'Elevated Vāta (Night Sentry Alertness & Split Rest): Your nervous system is still scanning after post duty. Sip warm water, cup warm hands over closed eyes for 60 seconds (Kūrma), and loosen gear before sleeping.';
  }

  if (normalized.includes('pitta')) {
    if (env === 'high_altitude') {
      return 'Elevated Pitta (Shelter Friction & Irritability): Being cooped up in a tight heated bunker elevates mental heat. Avoid excessive hot spices or extra tea, step into the cold vestibule for 3 deep nasal breaths, and practice 10 minutes of silent Mauna.';
    }
    if (env === 'cantonment') {
      return 'Elevated Pitta (Hierarchy Stress & Inspection Pressure): Sharp words or sudden duty changes have stoked internal anger. Splash cool water on your face and temples, step away from heated canteen debates, and speak calmly to your unit buddy.';
    }
    return 'Elevated Pitta (Command Friction & Watch-Chai Heat): Internal heat is spiking from swallowed frustration or too many sweet watch-teas. Splash cool water over your face and wrists, cut your next tea, and take 5 slow extended exhalations (4s in, 8s out).';
  }

  if (normalized.includes('kapha')) {
    if (env === 'high_altitude') {
      return 'Elevated Kapha (Bunker Heaviness & Low Oxygen Fog): Sitting inside heated fiberglass shelters causes deep mental fog and lethargy. Step into the shelter doorway for fresh air, flex your toes and ankles actively inside your gear, and drink warm clear soup.';
    }
    if (env === 'cantonment') {
      return 'Elevated Kapha (Routine Lethargy & Downtime Scrolling): Repetitive barracks routine is pulling you into numbing phone drift. Step outside the lines for a brisk 5-minute walk, drink fresh water, and break isolation by visiting a comrade.';
    }
    return 'Elevated Kapha (Naka Monotony & Bunk Inertia): Long hours in static positions are breeding heaviness and apathy. Step into daylight, do 3 minutes of brisk shoulder rolls and rifle-free stretches, and share a quick laugh with your buddy.';
  }

  if (env === 'high_altitude') {
    return 'Sama-Dosha (High-Altitude Equilibrium): Your body is handling the altitude and cold with steady composure. Maintain consistent warm hydration, protect your extremities, and sustain deliberate post-watch sleep.';
  }
  if (env === 'cantonment') {
    return 'Sama-Dosha (Peace Station Equilibrium): Your energy and recovery are well aligned between drill and downtime. Keep your sleep schedule disciplined and preserve this calm poise.';
  }
  return 'Sama-Dosha (Tactical Equilibrium): Your biological rhythm is steady across sentry watch and rest. Maintain balanced meals, avoid late-night bunk screens, and hold your inner composure.';
}

/**
 * Field reframe pair for Impulse Interceptor cognitive circuit-breaker.
 */
export interface FieldReframePair {
  id: string;
  vitarka: string;
  pratipaksha: string;
}

/**
 * Sentinel trigger mapping to TriggerCategory with battle-buddy reframe pairs.
 */
export interface PauseGateFieldTrigger {
  id: string;
  label: string;
  category: TriggerCategory;
  pairs: [FieldReframePair, FieldReframePair];
}

export const SENTINEL_INTERCEPTOR_TRIGGERS: Record<DeploymentEnvironment, PauseGateFieldTrigger[]> = {
  high_altitude: [
    {
      id: 'bunker_confinement',
      label: 'Sub-Zero Bunker Confinement & Fog',
      category: 'Lethargy',
      pairs: [
        {
          id: 'bunker_confinement_a',
          vitarka: 'Being cooped up in this freezing bunker for days is making my head numb and useless.',
          pratipaksha:
            'Low oxygen and bitter cold test the spirit. I will step into the vestibule for 3 deep breaths and flex my extremities (BG 6.5).',
        },
        {
          id: 'bunker_confinement_b',
          vitarka: 'I cannot bear the silence of this snow post anymore; I just want to zone out on my screen.',
          pratipaksha:
            'Screen glare in the dark worsens altitude headaches. Warm tea and 60 seconds of eye-palming will restore my nerves.',
        },
      ],
    },
    {
      id: 'thin_air_insomnia',
      label: 'Post-Watch Insomnia in the Cold',
      category: 'Cheap Dopamine / Junk Stimulation',
      pairs: [
        {
          id: 'thin_air_insomnia_a',
          vitarka: 'My watch is done, my toes are numb, but the thin air has my heart thumping so hard I cannot sleep.',
          pratipaksha:
            'Altitude increases heart rate naturally; panicking only worsens it. I will slow my breath to 4s-in, 8s-out and let my body settle.',
        },
        {
          id: 'thin_air_insomnia_b',
          vitarka: 'Let me keep scrolling through old phone photos until I finally pass out from exhaustion.',
          pratipaksha:
            'Blue light tricks the brain into staying awake. I will stow the phone in my pack and draw my senses inward like the tortoise (BG 2.58).',
        },
      ],
    },
    {
      id: 'frozen_ration_frustration',
      label: 'Rations & Shelter Monotony',
      category: 'Lethargy',
      pairs: [
        {
          id: 'frozen_ration_frustration_a',
          vitarka: 'Tinned rations and melted snow water again; I am sick of this hardship while civilians live in comfort.',
          pratipaksha:
            'Hardship is the crucible that tempers warrior fortitude. I honor this nourishment as the fuel that keeps my watch strong.',
        },
        {
          id: 'frozen_ration_frustration_b',
          vitarka: 'Nobody back home understands what it feels like to endure minus 20 degrees in isolation.',
          pratipaksha:
            'True duty asks for no external praise (BG 2.48). My silent endurance protects millions who sleep in warmth tonight.',
        },
      ],
    },
    {
      id: 'remote_isolation_anxiety',
      label: 'Delayed News & Isolation Worry',
      category: 'Academic Anxiety',
      pairs: [
        {
          id: 'remote_isolation_anxiety_a',
          vitarka: 'The satellite link is down, news from home is delayed, and my mind is imagining the worst.',
          pratipaksha:
            'Imagining disasters in the dark steals today\'s composure. What is beyond my reach is in the hands of destiny; I hold my post with trust.',
        },
        {
          id: 'remote_isolation_anxiety_b',
          vitarka: 'If something happens at home while I am stationed on this peak, I will never forgive myself.',
          pratipaksha:
            'Worrying from a distance cannot shield them. I serve here with honor so they may live in peace; I send them silent blessing.',
        },
      ],
    },
    {
      id: 'shelter_temper_flare',
      label: 'Bunker Closeness & Friction with Comrades',
      category: 'Social Comparison',
      pairs: [
        {
          id: 'shelter_temper_flare_a',
          vitarka: 'We have been locked in this tiny shelter together too long; every little habit of my buddy is getting on my nerves.',
          pratipaksha:
            'Proximity breeds friction under pressure. I will practice 10 minutes of silent Mauna (BG 17.15) and remember he is my lifeline.',
        },
        {
          id: 'shelter_temper_flare_b',
          vitarka: 'He skipped his turn clearing the ice; I am going to blast him right now.',
          pratipaksha:
            'Snapping in a high-altitude bunker destroys unit cohesion. I will speak calmly once my blood cools, preserving brotherhood.',
        },
      ],
    },
  ],

  active_border: [
    {
      id: 'tense_home_call',
      label: 'Tense Home Call & Leave Deferred',
      category: 'Academic Anxiety',
      pairs: [
        {
          id: 'tense_home_call_a',
          vitarka: 'My family is struggling back home, my leave was cancelled again, and I feel helpless behind this wire.',
          pratipaksha:
            'Being on duty is not abandonment. Staying steady and sending one calm, reassuring message tonight helps them ten times more than anger.',
        },
        {
          id: 'tense_home_call_b',
          vitarka: 'Everyone at home thinks I chose to stay away; their tears on the call broke my resolve.',
          pratipaksha:
            'Leave cancellations are operational necessity, not personal neglect. I will hold my composure and assure them of my unwavering care.',
        },
      ],
    },
    {
      id: 'sharp_command_friction',
      label: 'Sharp Order & Command Friction',
      category: 'Social Comparison',
      pairs: [
        {
          id: 'sharp_command_friction_a',
          vitarka: 'That reprimand in front of the section was unfair and my blood is still boiling.',
          pratipaksha:
            'Saluting the rank is military discipline; letting someone else\'s harsh mood live in my head tonight is optional (BG 2.56).',
        },
        {
          id: 'sharp_command_friction_b',
          vitarka: 'I got handed the toughest night picket shift again while others get easy duties.',
          pratipaksha:
            'Reacting in anger (Krodha) hurts only my own peace and record. I take the watch with warrior pride and steady focus.',
        },
      ],
    },
    {
      id: 'post_patrol_hypervigilance',
      label: 'Off Watch — Adrenaline Still Racing',
      category: 'Cheap Dopamine / Junk Stimulation',
      pairs: [
        {
          id: 'post_patrol_hypervigilance_a',
          vitarka: 'My border patrol is over and my body is exhausted, but my ears and nerves are still scanning for movement.',
          pratipaksha:
            'The next sentry has the wire. Like a tortoise retracting its limbs (BG 2.58), I command my autonomic system to stand down and rest.',
        },
        {
          id: 'post_patrol_hypervigilance_b',
          vitarka: 'I keep replaying the shadows near the fence and feeling sudden adrenaline spikes in my bunk.',
          pratipaksha:
            'The patrol was executed; the perimeter is secure. Replaying shadows solves nothing; deep exhalations will release the tension.',
        },
      ],
    },
    {
      id: 'border_naka_fatigue',
      label: 'Long Sentry Shift Monotony',
      category: 'Lethargy',
      pairs: [
        {
          id: 'border_naka_fatigue_a',
          vitarka: 'Standing stationary in this bunker hour after hour makes my attention wander into dangerous apathy.',
          pratipaksha:
            'Vigilance is a sacred trust. I will take 3 deliberate belly breaths, roll my shoulders, and re-anchor my eyes on the sector.',
        },
        {
          id: 'border_naka_fatigue_b',
          vitarka: 'Nothing ever happens on this stretch; letting my focus slip for a few minutes won\'t matter.',
          pratipaksha:
            'Complacency is the enemy\'s greatest ally. I renew my vow of alert presence for the comrades resting behind me.',
        },
      ],
    },
    {
      id: 'bunk_scrolling_outrage',
      label: 'Midnight Phone Scrolling & Feed Drift',
      category: 'Doomscrolling',
      pairs: [
        {
          id: 'bunk_scrolling_outrage_a',
          vitarka: 'Just 20 minutes of social media outrage feeds to numb my thoughts before my 3 AM watch.',
          pratipaksha:
            'Internet outrage drains the very mental stamina tomorrow\'s guard demands. Putting the phone away is an act of tactical discipline.',
        },
        {
          id: 'bunk_scrolling_outrage_b',
          vitarka: 'Reading political debates and toxic comments online makes me furious about who we are defending.',
          pratipaksha:
            'My uniform stands above civilian chatter. I protect the land and my people; I refuse to pollute my mind with digital noise.',
        },
      ],
    },
  ],

  cantonment: [
    {
      id: 'parade_inspection_tension',
      label: 'Parade Ground Drill & Inspection Friction',
      category: 'Social Comparison',
      pairs: [
        {
          id: 'parade_inspection_tension_a',
          vitarka: 'The inspection officer pulled me up for a tiny gear flaw; I feel humiliated and bitter.',
          pratipaksha:
            'Corrections on the parade square polish precision, not personal dignity. I absorb the note with professional poise and let resentment go.',
        },
        {
          id: 'parade_inspection_tension_b',
          vitarka: 'Others did half the preparation work and got praised, while my effort was overlooked.',
          pratipaksha:
            'Bhagavad Gita 2.47: You have a right to your labor, never to the fruits. My pride rests in doing my duty flawlessly, not applause.',
        },
      ],
    },
    {
      id: 'barracks_downtime_drift',
      label: 'Barracks Afternoon Inertia & Screen Slump',
      category: 'Lethargy',
      pairs: [
        {
          id: 'barracks_downtime_drift_a',
          vitarka: 'The drill is done, the barrack is quiet, and I feel like lying on the cot scrolling endlessly.',
          pratipaksha:
            'Cot scrolling traps the mind in heavy Kapha lethargy. A 10-minute walk to the sports ground or a shower will refresh my prana.',
        },
        {
          id: 'barracks_downtime_drift_b',
          vitarka: 'There is nothing meaningful to do until evening roll call, so killing time with games is fine.',
          pratipaksha:
            'Empty downtime drains purpose. I will read a book, clean my kit with mindful focus, or write a warm letter home.',
        },
      ],
    },
    {
      id: 'separation_from_family',
      label: 'Separation from Family & Domestic Worry',
      category: 'Academic Anxiety',
      pairs: [
        {
          id: 'separation_from_family_a',
          vitarka: 'Seeing families together in the cantonment while mine is hundreds of miles away makes me feel profoundly alone.',
          pratipaksha:
            'Temporary separation is a sacrifice made for their security. I honor the bond by staying disciplined, healthy, and cheerful.',
        },
        {
          id: 'separation_from_family_b',
          vitarka: 'My spouse sounded overwhelmed on the phone and I am stuck in this routine unable to help.',
          pratipaksha:
            'Panicking or spiraling into guilt won\'t resolve the situation. A steady, loving phone call tonight will anchor us both.',
        },
      ],
    },
    {
      id: 'rank_hierarchy_stress',
      label: 'Administrative Delays & Routine Frustration',
      category: 'Academic Anxiety / Professional Workload',
      pairs: [
        {
          id: 'rank_hierarchy_stress_a',
          vitarka: 'My allowance claims and quarter allotment have been delayed for months by desk staff; I want to create a scene.',
          pratipaksha:
            'Bureaucratic delays are an exercise in patience. Aggression will backfire; I will follow up through proper channels with calm persistence.',
        },
        {
          id: 'rank_hierarchy_stress_b',
          vitarka: 'Pointless administrative tasks are eating up my training hours and frustrating my tempo.',
          pratipaksha:
            'Every station demands patience with unglamorous duties. I approach each task with Sattvic thoroughness (BG 18.26).',
        },
      ],
    },
    {
      id: 'late_night_mess_drift',
      label: 'Late-Night Canteen Snacks & Binge Drift',
      category: 'Cheap Dopamine / Junk Stimulation',
      pairs: [
        {
          id: 'late_night_mess_drift_a',
          vitarka: 'It is late, but everyone is sitting around eating junk snacks and watching loud movies in the mess.',
          pratipaksha:
            'Yukta-ahara (BG 6.17) means regulated eating and rest. Tomorrow\'s PT requires clean energy; I choose an early night.',
        },
        {
          id: 'late_night_mess_drift_b',
          vitarka: 'I will watch just one more movie episode on the bunk Wi-Fi before turning in.',
          pratipaksha:
            'Wi-Fi drift borrows energy from tomorrow\'s parade. I shut down the screen and let my mind transition to restorative silence.',
        },
      ],
    },
  ],
};

export const PAUSE_GATE_FIELD_TRIGGERS: PauseGateFieldTrigger[] = SENTINEL_INTERCEPTOR_TRIGGERS.active_border;

/**
 * 8 Detailed Curated Micro-Swaps per Defense Posting Terrain.
 */
export const TERRAIN_MICRO_SWAPS: Record<DeploymentEnvironment, DetailedMicroSwap[]> = {
  high_altitude: [
    {
      id: 'ha_pranayama_nasal_exhale',
      title: 'Pranayama - Slow Nasal Extended Exhale',
      description:
        'Inhale slowly through the nose for 4 seconds to warm the thin air, then exhale gently for 8 seconds. This steadies hypoxic heart-rate spikes and calms tight shelter restlessness.',
      tag: 'INVISIBLE',
    },
    {
      id: 'ha_kurma_friction_cupping',
      title: 'Kurma Pratyahara - Warm Friction Eye Cupping',
      description:
        'Briskly rub your palms together until warm and cup them over closed eyes for 60 seconds. Blocking out snow glare and bunker clutter gives your optic nerve instant relief.',
      tag: 'SENSORY WITHDRAWAL',
    },
    {
      id: 'ha_trataka_focal_anchor',
      title: 'Trataka - Fixed Focal Anchor',
      description:
        'Lock a steady gaze onto a single stationary point inside your shelter for 60 seconds without blinking. Arresting rapid eye movement immediately stops racing thoughts and cabin fever.',
      tag: 'OPTICAL RESET',
    },
    {
      id: 'ha_agni_jala_warm_sips',
      title: 'Agni Jala - Three Slow Sips of Warm Water',
      description:
        'Take three slow, deliberate sips of warm water or soup from your insulated flask. Internal warmth settles high-altitude stomach knots and restores grounded presence.',
      tag: 'SOMATIC WARMTH',
    },
    {
      id: 'ha_vyayama_circulation_flex',
      title: 'Vyayama - Boot & Finger Circulation Flex',
      description:
        'Slowly clench and spread your fingers and toes inside your gloves and boots for 60 seconds. Active peripheral circulation pulls nervous tension out of your head and warms the extremities.',
      tag: 'KINETIC WARMTH',
    },
    {
      id: 'ha_shithilikarana_armor_drop',
      title: 'Shithilikarana - Jaw & Shoulder Armor Drop',
      description:
        'Unclench your back teeth and drop your shoulders away from your ears across three long exhales. Releasing cold-weather muscular bracing saves vital physical stamina.',
      tag: 'SOMATIC RELEASE',
    },
    {
      id: 'ha_spanda_bunk_grounding',
      title: 'Spanda - Five-Point Bunk Grounding',
      description:
        'Feel five physical contact points—your heels, back, palms, blanket weight, and breath—for 45 seconds. Anchoring in physical sensation stops the mind from drifting into isolation loops.',
      tag: 'TACTICAL GROUNDING',
    },
    {
      id: 'ha_maryada_pocket_curfew',
      title: 'Maryada - Sleeping-Bag Pocket Curfew',
      description:
        'Zip your phone inside your inner jacket or sleeping-bag pocket for the next 30 minutes. Protecting your scarce bunk window from screen light guarantees deeper altitude recovery.',
      tag: 'SPACE SHIFT',
    },
  ],

  active_border: [
    {
      id: 'ab_pranayama_down_regulation',
      title: 'Pranayama - Extended Exhale Down-Regulation',
      description:
        'Inhale slowly for 4 seconds, then double your exhale to 8 seconds to engage the vagus nerve. This rapidly shifts your nervous system out of post-watch adrenaline and heat.',
      tag: 'INVISIBLE',
    },
    {
      id: 'ab_kurma_pitch_dark_palming',
      title: 'Kurma Pratyahara - 60-Second Pitch-Dark Palming',
      description:
        'Cup your palms over closed eyes in total darkness after coming off sentry or patrol duty. Consciously retracting the senses tells an alert brain that the next sentry now has the watch.',
      tag: 'SENSORY WITHDRAWAL',
    },
    {
      id: 'ab_trataka_steady_gazing',
      title: 'Trataka - Steady Point Gazing',
      description:
        'Fix your gaze on one non-moving object inside the barrack for 60 seconds. Switching from wide threat-scanning vision to a single calm point quiets post-patrol hypervigilance.',
      tag: 'OPTICAL RESET',
    },
    {
      id: 'ab_jala_water_splash',
      title: 'Jala - Cool Water Face & Wrist Splash',
      description:
        'Splash cool water across your eyes, temples, and wrists, or drink a slow glass of water. Cooling peripheral pulse points immediately vents Pitta heat after a tense call or shift.',
      tag: 'SOMATIC COOLING',
    },
    {
      id: 'ab_asana_sling_neck_release',
      title: 'Asana - Rifle-Sling & Neck Release',
      description:
        'Roll your shoulders backward ten times and gently tilt your ear toward each shoulder. Releasing heavy gear and weapon-sling tension clears physical irritability before hitting the bunk.',
      tag: 'KINETIC RELEASE',
    },
    {
      id: 'ab_indriya_safe_bunk_scan',
      title: 'Indriya - 5-4-3-2-1 Safe Bunk Scan',
      description:
        'Silently name 5 safe objects in your bunk, 4 sounds, 3 textures, 2 breaths, and 1 steady intention. This resets threat-radar pathways so your body can sleep peacefully.',
      tag: 'TACTICAL GROUNDING',
    },
    {
      id: 'ab_mauna_post_call_cooldown',
      title: 'Mauna - Ten-Minute Post-Call Cooldown',
      description:
        'Keep the phone aside and observe ten minutes of deliberate silence after a stressful home call. Letting the initial emotional surge pass prevents words that hurt you or your family.',
      tag: 'SPEECH RESTRAINT',
    },
    {
      id: 'ab_maryada_kitbag_lock',
      title: 'Maryada - Kitbag Phone Lock',
      description:
        'Place your phone inside your kitbag or locker before lying down for watch recovery. Breaking the 2 AM bunk-scrolling loop preserves your alertness for tomorrow\'s duty.',
      tag: 'SPACE SHIFT',
    },
  ],

  cantonment: [
    {
      id: 'ca_pranayama_extended_exhale',
      title: 'Pranayama - Extended Exhale',
      description:
        'Inhale slowly for 4 seconds, then double your exhale to 8 seconds before reacting to a sharp remark. Stimulating the vagus nerve cools hierarchy frustration and restores steady poise.',
      tag: 'INVISIBLE',
    },
    {
      id: 'ca_trataka_fixed_gazing',
      title: 'Trataka - Fixed Gazing',
      description:
        'Lock your unblinking gaze onto a single stationary point for 60 seconds. Concentrating optical focus arrests mental scatter after busy parade, office, or training hours.',
      tag: 'OPTICAL RESET',
    },
    {
      id: 'ca_prana_veranda_stepout',
      title: 'Prana - Three-Minute Veranda Step-Out',
      description:
        'Step outside the barrack room or line area into open air for three slow breaths. Changing your physical surroundings immediately interrupts barrack tension or boredom.',
      tag: 'SPACE SHIFT',
    },
    {
      id: 'ca_jala_temple_throat_reset',
      title: 'Jala - Cool Water Temple & Throat Reset',
      description:
        'Drink a glass of cool water slowly and splash water on your face and wrists. Physical cooling brings down acute Pitta anger after roster changes or inspection pressure.',
      tag: 'SOMATIC COOLING',
    },
    {
      id: 'ca_sahyog_chai_buddy',
      title: 'Sahyog - Five-Minute Unhurried Chai with Buddy',
      description:
        'Sit with a trusted unit buddy for five minutes without looking at your phone. Shared human presence dissolves isolation and puts daily friction into perspective.',
      tag: 'UNIT COHESION',
    },
    {
      id: 'ca_shithilikarana_parade_unbracing',
      title: 'Shithilikarana - Parade Posture Unbracing',
      description:
        'Loosen your shoulders, soften your jaw, and stretch your upper back for 60 seconds. Letting go of rigid daytime posture helps you transition cleanly into personal rest.',
      tag: 'SOMATIC RELEASE',
    },
    {
      id: 'ca_pratyahara_dark_eye_rest',
      title: 'Pratyahara - Sixty-Second Dark Eye Rest',
      description:
        'Cup warm palms over closed eyes to shut out fluorescent light and screen glare. A single minute of sensory quiet resets mental stamina before evening calls home.',
      tag: 'SENSORY WITHDRAWAL',
    },
    {
      id: 'ca_maryada_across_bunk',
      title: 'Maryada - Across-the-Bunk Phone Placement',
      description:
        'Set your phone away from your pillow before lights-out so your hands cannot reach it automatically. Protecting your final hour before reveille ensures deep, restorative sleep.',
      tag: 'SPACE SHIFT',
    },
  ],
};


/**
 * Curated Foundational Warrior Sankalpa Pledges tailored for the 3 Defense Posting Terrains.
 * Provides grounded, operational-grade intention shields for high-stress deployments.
 */
export const CURATED_SENTINEL_SANKALPAS: Record<DeploymentEnvironment, string> = {
  high_altitude:
    '“Standing on sub-zero ridges and silent snow posts where thin air tests every breath, I guard my inner fire. When bitter cold, isolation, or heavy memories pull at my composure, I will not fight myself in silence. I will honor warm rations, take deliberate breaths to ground my heart, and release what lies beyond my control. With unwavering courage and quiet self-compassion, I hold the command reins of my mind.”',
  active_border:
    '“Standing between high-alert sentry duty and the quiet love for those waiting at home, I choose to guard my inner peace. When sleepless night shifts, sudden alerts, or news from home agitate my mind, I will pause and recenter before reacting. I will honor my body\'s recovery between watches, stand firm beside my unit comrades, and hold the command reins of my mind with honor and calm resolve.”',
  cantonment:
    '“Navigating the daily rhythm of parade grounds, inspections, and peace station duties, I guard against routine stagnation and restless mind-wandering. When administrative friction, rank tension, or separation from family weighs on my spirit, I choose steady self-mastery. I honor timely sleep, maintain physical vigor, and hold the command reins of my mind with dignified discipline and inner calm.”',
};
