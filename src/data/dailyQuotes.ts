/**
 * The 12 Designated Bhagavad Gita Quotes for Student Cognitive Mastery & Non-Repeating Session Randomization.
 *
 * Each entry is structured into five display fields:
 * - Top Verse Badge (`verse`)
 * - Sanskrit Quote (`sanskrit`)
 * - English Pronunciation (`transliteration`)
 * - English Translation (`translation`)
 * - Meaning for Life & Goal Attainment (`lifeMeaning`)
 */

export interface GitaQuoteItem {
  id: string;
  verse: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  lifeMeaning: string;
}

/**
 * Backward compatibility type alias for existing components.
 */
export interface DailyShloka {
  source: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  rationale: string;
}

export const DESIGNATED_GITA_QUOTES: GitaQuoteItem[] = [
  {
    id: 'bg_2_41',
    verse: 'Bhagavad Gita 2.41',
    sanskrit: 'व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन । बहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम् ॥',
    transliteration: "vyavasāyātmikā buddhir ekeha kurunandana | bahuśākhā hy anantāś ca buddhayo 'vyavasāyinām ||",
    translation:
      'O descendant of Kuru, the intellect of those who are resolute on this path is single-pointed and unified, whereas the intellects of the irresolute are many-branched and endlessly divided.',
    lifeMeaning:
      'We show you this verse because the biggest threat to an ambitious student\'s goal is a "many-branched intellect" (bahu-śākhā buddhi). When your attention is split across ten tabs, side-projects, and impulsive desires, your vital energy scatters. Cultivate vyavasāyātmikā buddhi—lock your intelligence onto one primary mission today and prune away secondary noise.',
  },
  {
    id: 'bg_2_58',
    verse: 'Bhagavad Gita 2.58',
    sanskrit: 'यदा संहरते चायं कूर्मोऽङ्गानीव सर्वशः । इन्द्रियाणीन्द्रियार्थेभ्यस्तस्य प्रज्ञा प्रतिष्ठिता ॥',
    transliteration: "yadā saṁharate cāyaṁ kūrmo 'ṅgānīva sarvaśaḥ | indriyāṇīndriyārthebhyas tasya prajñā pratiṣṭhitā ||",
    translation:
      'When one is able to completely withdraw the senses from their sense objects, just as a tortoise draws its limbs within its shell, their wisdom and intelligence become firmly established.',
    lifeMeaning:
      'A tortoise does not fight every disturbance; it retracts its limbs into its shell when danger approaches and extends them only when ready to move forward. As Swami Chinmayananda notes on sense mastery, the goal is not forced isolation from the world, but an inward withdrawal of the senses at will. Retract your eyes and ears from digital feeds the exact moment you sit down for deep work.',
  },
  {
    id: 'bg_5_10',
    verse: 'Bhagavad Gita 5.10',
    sanskrit: 'ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः । लिप्यते न स पापेन पद्मपत्रमिवाम्भसा ॥',
    transliteration: 'brahmaṇy ādhāya karmāṇi saṅgaṁ tyaktvā karoti yaḥ | lipyate na sa pāpena padma-patram ivāmbhasā ||',
    translation:
      '"Those who dedicate their actions to God, abandoning all attachment, remain untouched by sin, just as a lotus leaf is untouched by water." (Swami Mukundananda).',
    lifeMeaning:
      'A lotus leaf lives right in the middle of muddy water, yet its surface repels every drop so it never sinks. You do not need to escape competitive exams or high-stakes deadlines to keep your mental peace. Give 100% effort to your work today while refusing to let outcome anxiety stick to your inner consciousness.',
  },
  {
    id: 'bg_6_5',
    verse: 'Bhagavad Gita 6.5',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
    transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||',
    translation:
      '"Elevate yourself through the power of your mind, and not degrade yourself, for the mind can be the friend and also the enemy of the self." (Swami Mukundananda).',
    lifeMeaning:
      'No external obstacle, tough syllabus, or peer competition can defeat you unless your own mind agrees to pull you down (nātmānam avasādayet). Every small promise you keep to yourself today turns your mind into a supportive friend (bandhu); every time you break your own word for cheap stimulation, you train your mind to act as your enemy (ripu).',
  },
  {
    id: 'bg_6_9',
    verse: 'Bhagavad Gita 6.9',
    sanskrit: 'सुहृन्मित्रार्युदासीनमध्यस्थद्वेष्यबन्धुषु । साधुष्वपि च पापेषु समबुद्धिर्विशिष्यते ॥',
    transliteration: 'suhṛn-mitrāry-udāsīna-madhyastha-dveṣya-bandhuṣu | sādhuṣv api ca pāpeṣu sama-buddhir viśiṣyate ||',
    translation:
      '"The yogis look upon all—well-wishers, friends, foes, the pious, and the sinners—with an impartial intellect. The yogi who is of equal intellect toward friend, companion, and foe, neutral among enemies and relatives, and unbiased between the righteous and sinful, is considered to be distinguished among humans." (Swami Mukundananda).',
    lifeMeaning:
      'Immense cognitive energy is wasted reacting to campus politics, peer jealousy, or uncooperative teammates. Cultivating sama-buddhi—an even-keeled, impartial intellect—acts as psychological armor so your daily focus never rises or falls based on other people\'s behavior.',
  },
  {
    id: 'bg_6_19',
    verse: 'Bhagavad Gita 6.19',
    sanskrit: 'यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता । योगिनो यतचित्तस्य युञ्जतो योगमात्मनः ॥',
    transliteration: 'yathā dīpo nivāta-stho neṅgate sopamā smṛtā | yogino yata-cittasya yuñjato yogam ātmanaḥ ||',
    translation:
      '"Just as a lamp in a windless place does not flicker, so the disciplined mind of a yogi remains steady in meditation on the Supreme." (Swami Mukundananda).',
    lifeMeaning:
      'Even a small lamp burns with unwavering intensity when sheltered from drafts (nivāta-stha). The winds that make your concentration flicker are constant phone pings, background chatter, and unrestrained cravings. Build a "windless" sanctuary around your study blocks today and let your intellect burn steadily toward your goal.',
  },
  {
    id: 'bg_6_20',
    verse: 'Bhagavad Gita 6.20',
    sanskrit: 'यत्रोपरमते चित्तं निरुद्धं योगसेवया । यत्र चैवात्मनात्मानं पश्यन्नात्मनि तुष्यति ॥',
    transliteration: 'yatroparamate cittaṁ niruddhaṁ yoga-sevayā | yatra caivātmanātmānaṁ paśyann ātmani tuṣyati ||',
    translation:
      '"When the mind, restrained from material activities, becomes still by the practice of Yog, then the yogi is able to behold the soul through the purified mind, and he rejoices in the inner joy." (Swami Mukundananda).',
    lifeMeaning:
      'The distracted mind fears that putting down the phone or stepping away from constant entertainment will feel empty and dull. This verse reveals the opposite: when restless mental agitation (citta) is quieted through disciplined practice, a profound, self-generating inner fulfillment (ātmani tuṣyati) naturally emerges.',
  },
  {
    id: 'bg_6_26',
    verse: 'Bhagavad Gita 6.26',
    sanskrit: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् । ततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
    transliteration: 'yato yato niścarati manaś cañcalam asthiram | tatas tato niyamyaitad ātmany eva vaśaṁ nayet ||',
    translation:
      'From whatever object the restless and unsteady mind wanders away, from that very object one must gently restrain it and bring it back under the control of the Self.',
    lifeMeaning:
      'Focus is not a magical state where your mind never wanders; it is the training of noticing that your restless mind (manaś cañcalam) has drifted and calmly bringing it back without self-hatred. Every single time you catch yourself drifting today and pull the reins back to your work, you strengthen your cognitive sovereignty.',
  },
  {
    id: 'bg_18_26',
    verse: 'Bhagavad Gita 18.26',
    sanskrit: 'मुक्तसङ्गोऽनहंवादी धृत्युत्साहसमन्वितः । सिद्ध्यसिद्ध्योर्निर्विकारः कर्ता सात्त्विक उच्यते ॥',
    transliteration: "mukta-saṅgo 'nahaṁ-vādī dhṛty-utsāha-samanvitaḥ | siddhy-asiddhyor nirvikāraḥ kartā sāttvika ucyate ||",
    translation:
      'A performer of action who is free from selfish attachment, humble and non-egoistic, endowed with unwavering determination and enthusiasm (dhṛty-utsāha-samanvitaḥ), and steady in both success and failure is declared to be a worker in the mode of goodness (Sattva).',
    lifeMeaning:
      'People often mistake Sattva (goodness/clarity) for passivity. Here, the Gita defines the ultimate Sattvic achiever as someone overflowing with fierce determination and enthusiasm (dhṛti and utsāha), while remaining free from arrogance in victory and emotional collapse in temporary defeat (siddhy-asiddhyor nirvikāraḥ).',
  },
  {
    id: 'bg_18_28',
    verse: 'Bhagavad Gita 18.28',
    sanskrit: 'अयुक्तः प्राकृतः स्तब्धः शठो नैष्कृतिकोऽलसः । विषादी दीर्घसूत्री च कर्ता तामस उच्यते ॥',
    transliteration: "ayuktaḥ prākṛtaḥ stabdhaḥ śaṭho naiṣkṛtiko 'lasaḥ | viṣādī dīrgha-sūtrī ca kartā tāmasa ucyate ||",
    translation:
      'A worker who is undisciplined, vulgar, stubborn, deceitful, indolent, chronically morose (viṣādī), and given to long procrastination (dīrgha-sūtrī) is declared to be a worker in the mode of ignorance (Tamas).',
    lifeMeaning:
      'Examine the pairing of viṣādī (chronic gloom/dejection) and dīrgha-sūtrī (procrastination—literally "spinning a long thread" by dragging a one-hour task across a whole week). Procrastination does not relax you; it directly breeds low-grade depression. Starting your hardest task for just ten minutes shatters Tamas immediately.',
  },
  {
    id: 'bg_18_35',
    verse: 'Bhagavad Gita 18.35',
    sanskrit: 'यया स्वप्नं भयं शोकं विषादं मदमेव च । न विमुञ्चति दुर्मेधा धृतिः सा पार्थ तामसी ॥',
    transliteration: 'yayā svapnaṁ bhayaṁ śokaṁ viṣādaṁ madam eva ca | na vimuñcati durmedhā dhṛtiḥ sā pārtha tāmasī ||',
    translation:
      '"That unintelligent resolve is said to be determination in the mode of ignorance, in which one does not give up dreaming, fearing, grieving, despair, and conceit." (Swami Mukundananda).',
    lifeMeaning:
      'Even when you feel you lack willpower, you are often using immense willpower in the wrong direction—stubbornly clinging to daydreaming (svapnam), anxious overthinking (bhayam), and self-pity (viṣādam). Recognize this as Tamasic stubbornness, drop the rumination, and redirect your resolve toward constructive action.',
  },
  {
    id: 'bg_18_37',
    verse: 'Bhagavad Gita 18.37',
    sanskrit: 'यत्तदग्रे विषमिव परिणामेऽमृतोपमम् । तत्सुखं सात्त्विकं प्रोक्तमात्मबुद्धिप्रसादजम् ॥',
    transliteration: "yat tad agre viṣam iva pariṇāme 'mṛtopamam | tat sukhaṁ sāttvikaṁ proktam ātma-buddhi-prasāda-jam ||",
    translation:
      '"That which in the beginning may be just like poison but at the end is just like nectar and which awakens one to self-realization is said to be happiness in the mode of goodness." (Srila Prabhupada, Bhagavad-gītā As It Is).',
    lifeMeaning:
      'As both Srila Prabhupada and Swami Mukundananda explain, real discipline—waking up early, regulating the senses, or tackling a tough subject—tastes bitter like poison (agre viṣam iva) or raw āmlā (Indian gooseberry) in the first few minutes, but yields pure nectar (amṛtopamam) and serene intelligence (ātma-buddhi-prasāda-jam) in the end. Cheap digital pleasures work in reverse, tasting sweet for ten minutes and leaving you depleted. Smile through the initial bitterness of focus today—the nectar is right on the other side.',
  },
];

/**
 * Pure helper function implementing the Zero-Repeat Session Randomizer:
 * 1. Reads last shown quote ID from localStorage ('bp_last_gita_quote_id' and 'bp_last_quote_id').
 * 2. Filters DESIGNATED_GITA_QUOTES to exclude the quote matching that last ID (guaranteeing never the same quote twice in a row).
 * 3. Selects a random quote from the remaining items using Math.floor(Math.random() * candidates.length).
 * 4. Saves newly selected quote ID to localStorage inside a try/catch block.
 * 5. Returns the selected GitaQuoteItem.
 */
export function getNextRandomGitaQuote(): GitaQuoteItem {
  let lastId: string | null = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      lastId =
        window.localStorage.getItem('bp_last_gita_quote_id') ||
        window.localStorage.getItem('bp_last_quote_id');
    }
  } catch (err) {
    console.warn('[dailyQuotes] Unable to read quote ID from localStorage:', err);
  }

  const candidates = DESIGNATED_GITA_QUOTES.filter((q) => q.id !== lastId);
  const pool = candidates.length > 0 ? candidates : DESIGNATED_GITA_QUOTES;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('bp_last_gita_quote_id', selected.id);
      window.localStorage.setItem('bp_last_quote_id', selected.id);
    }
  } catch (err) {
    console.warn('[dailyQuotes] Unable to save quote ID to localStorage:', err);
  }

  return selected;
}

/**
 * Backward compatibility: Map the 12 quotes to the legacy DailyShloka shape
 * so existing imports of DAILY_SHLOKAS continue working with 0 errors.
 */
export const DAILY_SHLOKAS: DailyShloka[] = DESIGNATED_GITA_QUOTES.map((q) => ({
  source: q.verse,
  sanskrit: q.sanskrit,
  transliteration: q.transliteration,
  meaning: q.translation,
  rationale: q.lifeMeaning,
}));

/**
 * Backward compatibility: getDailyShloka returning a non-repeating randomized shloka
 * adhering to the legacy DailyShloka interface.
 */
export function getDailyShloka(): DailyShloka {
  const quote = getNextRandomGitaQuote();
  return {
    source: quote.verse,
    sanskrit: quote.sanskrit,
    transliteration: quote.transliteration,
    meaning: quote.translation,
    rationale: quote.lifeMeaning,
  };
}

export default DESIGNATED_GITA_QUOTES;
