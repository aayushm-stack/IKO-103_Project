import { ShastraFeatureKey, ShastraLensData } from '../types/iks';

/**
 * Authentic, canonical Indian Knowledge Systems (IKS) database backing the Shastra Lens drawer.
 * Grounded in classical primary texts and accredited traditional commentaries:
 * - Charaka Samhita (Chakrapani Datta commentary)
 * - Bhagavad Gita & Katha Upanishad (Adi Shankaracharya Bhashya)
 * - Patanjali Yoga Sutras (Vyasa Bhashya)
 * - Taittiriya Upanishad
 */
export const FALLBACK_SHASTRA_DATABASE: Record<ShastraFeatureKey, ShastraLensData> = {
  trayopastambha: {
    id: 'shastra-trayopastambha',
    featureKey: 'trayopastambha',
    sanskritVerse: 'त्रय उपस्तम्भा इति—आहारः, स्वप्नो, ब्रह्मचर्यं च ।',
    transliteration: 'traya upastambhā iti—āhāraḥ, svapno, brahmacaryaṁ ca |',
    sourceText: 'Charaka Samhita, Sutrasthana 11.35',
    commentaryReference: 'Chakrapani Datta, Ayurveda Dipika on Charaka Sutrasthana 11.35',
    literalMeaning:
      'There are three foundational subsidiary pillars (Trayopastambha) of life: Ahara (intake), Nidra (sleep), and Brahmacharya (restraint/energy conservation). Just as a building is supported by its pillars, physical and mental stability is sustained by what we consume, how deeply we rest, and how effectively we conserve our vital energy.',
    practicalModernApplication:
      'This is why the Daily Sadhana check-in tracks screen time right next to food and sleep. Just like junk food crashes the body, junk digital content crashes the mind. This feature trains you to treat your digital attention with the exact same care as your physical diet.',
  },
  brahmacharya: {
    id: 'shastra-brahmacharya',
    featureKey: 'brahmacharya',
    sanskritVerse: 'ब्रह्मचर्यप्रतिष्ठायां वीर्यलाभः ॥',
    transliteration: 'brahmacarya-pratiṣṭhāyāṁ vīrya-lābhaḥ ||',
    sourceText: 'Patanjali Yoga Sutras 2.38',
    commentaryReference: 'Vyasa Bhashya on Patanjali Yoga Sutra 2.38',
    literalMeaning:
      'Upon being firmly established in Brahmacharya (sensory restraint and disciplined focus), one attains profound vitality and vigor (Virya). By deliberately withdrawing attention from endless digital fragmentation and overstimulation, you reclaim the mental stamina required for true self-mastery.',
    practicalModernApplication:
      'Think of your attention like a battery. The Energy Conservation slider exists because true focus isn\'t just about logging hours at a desk—it\'s about how well you protect your mental charge from draining notifications and digital noise.',
  },
  cascade: {
    id: 'shastra-cascade',
    featureKey: 'cascade',
    sanskritVerse:
      'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥\nक्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः ।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥',
    transliteration:
      'dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate |\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho \'bhijāyate ||\nkrodhād bhavati saṁmohaḥ saṁmohāt smṛti-vibhramaḥ |\nsmṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati ||',
    sourceText: 'Bhagavad Gita 2.62-63',
    commentaryReference: 'Adi Shankaracharya Bhashya on Bhagavad Gita 2.62-63',
    literalMeaning:
      'Dwelling on sensory objects breeds attachment; attachment births craving; craving obstructed becomes agitation. Agitation leads to delusion, which ultimately destroys the discriminative intellect (Buddhi). This reveals the precise psychology of distraction: failure begins at the subtlest first thought, and intercepting the impulse early is the only way to prevent a complete loss of control.',
    practicalModernApplication:
      'Ever open your phone to check the time and suddenly lose an hour? That’s the distraction snowball. The Impulse Cascade Visualizer shows exactly where you are in that 7-step loop, helping you catch a fleeting urge before it completely overrides your intellect.',
  },
  pratipaksha: {
    id: 'shastra-pratipaksha',
    featureKey: 'pratipaksha',
    sanskritVerse: 'वितर्कबाधने प्रतिपक्षभावनम् ॥',
    transliteration: 'vitarka-bādhane pratipakṣa-bhāvanam ||',
    sourceText: 'Patanjali Yoga Sutras 2.33',
    commentaryReference: 'Vyasa Bhashya on Patanjali Yoga Sutra 2.33',
    literalMeaning:
      'When the mind is afflicted by unwholesome thoughts or destructive impulses (vitarkas), one should deliberately cultivate the exact opposite, wholesome perspective (Pratipaksha Bhavana). This active cognitive reframing cuts the root of toxic loops by redirecting mental energy (Chitta Vritti) rather than merely suppressing it.',
    practicalModernApplication:
      'You can\'t just delete a bad habit; you have to overwrite it. Instead of just locking you out of an app, the Interceptor asks you to pause, acknowledge the negative urge, and type a better alternative to actively rewire your brain.',
  },
  yukta: {
    id: 'shastra-yukta',
    featureKey: 'yukta',
    sanskritVerse:
      'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु ।\nयुक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥',
    transliteration:
      'yuktāhāra-vihārasya yukta-ceṣṭasya karmasu |\nyukta-svapnāvabodhasya yogo bhavati duḥkha-hā ||',
    sourceText: 'Bhagavad Gita 6.17',
    commentaryReference: 'Adi Shankaracharya Bhashya on Bhagavad Gita 6.17',
    literalMeaning:
      'For one who is moderate in eating and recreation, balanced in effort at work, and regulated in sleep and waking, yoga removes all sorrow. True discipline is not extreme asceticism or self-punishment; it is finding sustainable harmony in daily routines.',
    practicalModernApplication:
      'This is the exact logic behind the app\'s Yukta Scoring algorithm. The app doesn\'t demand 14 hours of study and zero entertainment. It rewards you for balanced sleep (6.5 to 8 hours), mindful digital boundaries, and sustainable daily focus.',
  },
  chariot: {
    id: 'shastra-chariot',
    featureKey: 'chariot',
    sanskritVerse:
      'आत्मानं रथिनं विद्धि शरीरं रथमेव तु । बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥\nइन्द्रियाणि हयानाहुर्विषयांस्तेषु गोचरान् ॥',
    transliteration:
      'ātmānaṁ rathinaṁ viddhi śarīraṁ rathameva tu | buddhiṁ tu sārathiṁ viddhi manaḥ pragrahameva ca ||\nindriyāṇi hayān āhur viṣayāṁs teṣu gocarān ||',
    sourceText: 'Katha Upanishad 1.3.3-4',
    commentaryReference: 'Shankara Bhashya on Katha Upanishad 1.3.3-4',
    literalMeaning:
      'The human body is a chariot, the intellect (Buddhi) is the charioteer, the mind (Manas) acts as the reins, and the senses (Indriyas) are the wild horses. If the intellect is asleep and the mind lacks restraint, the sensory horses run wild and drag the chariot off course.',
    practicalModernApplication:
      'This is the dynamic visual on your Home Dashboard. Instead of a boring chart, you see your current chariot state. If your digital screen time is too high, your chariot shows as \'Galloping\' out of control, instantly telling you that your intellect needs to pull the reins.',
  },
  breathing: {
    id: 'shastra-breathing',
    featureKey: 'breathing',
    sanskritVerse: 'तस्माद्वा एतस्मादन्नरसमयात् । अन्योऽन्तर आत्मा प्राणमयः । तेनैष पूर्णः ॥',
    transliteration:
      'tasmād vā etasmād anna-rasamayāt | anyo\'ntara ātmā prāṇamayaḥ | tenaiṣa pūrṇaḥ ||',
    sourceText: 'Taittiriya Upanishad, Brahmananda Valli 2.2',
    commentaryReference: 'Shankara Bhashya on Taittiriya Upanishad 2.2 & Yoga Sutra 2.49',
    literalMeaning:
      'Beyond the physical body (Annamaya Kosha) lies the vital energy sheath (Pranamaya Kosha), governed by the breath (Prana). Because the breath acts as the physical bridge to the mental sheath (Manomaya Kosha), regulating respiration directly stabilizes an agitated mind.',
    practicalModernApplication:
      'This anchors the Breathing Sanctum. When you are overwhelmed, logic and reading don\'t always work. The expanding and contracting concentric rings bypass the thinking brain, using paced rhythms to mechanically slow your heart rate and restore calm.',
  },
  interceptor: {
    id: 'shastra-interceptor',
    featureKey: 'interceptor',
    sanskritVerse: 'वितर्कबाधने प्रतिपक्षभावनम् ॥',
    transliteration: 'vitarka-bādhane pratipakṣa-bhāvanam ||',
    sourceText: 'Patanjali Yoga Sutras 2.33',
    commentaryReference: 'Vyasa Bhashya on Patanjali Yoga Sutra 2.33',
    literalMeaning:
      'When the mind is afflicted by unwholesome thoughts or destructive impulses (vitarkas), one should deliberately cultivate the exact opposite, wholesome perspective (Pratipaksha Bhavana). This active cognitive reframing cuts the root of toxic loops by redirecting mental energy (Chitta Vritti) rather than merely suppressing it.',
    practicalModernApplication:
      'You can\'t just delete a bad habit; you have to overwrite it. Instead of just locking you out of an app, the Interceptor asks you to pause, acknowledge the negative urge, and type a better alternative to actively rewire your brain.',
  },
  chitta_prasadanam: {
    id: 'shastra-chitta_prasadanam',
    featureKey: 'chitta_prasadanam',
    sanskritVerse:
      'मैत्रीकरुणामुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम् ॥',
    transliteration:
      'maitrī-karuṇā-muditopekṣāṇāṁ sukha-duḥkha-puṇyāpuṇya-viṣayāṇāṁ bhāvanātaś citta-prasādanam ||',
    sourceText: 'Yoga Sutra 1.33',
    commentaryReference: 'Vyasa Bhashya on Patanjali Yoga Sutra 1.33',
    literalMeaning:
      'The mind is purified and pacified (Chitta Prasadanam) by cultivating friendliness (Maitri) toward the happy, compassion (Karuna) for the suffering, joy (Mudita) toward the virtuous, and equanimity (Upeksha) toward the wicked or toxic. Practicing these specific attitudes acts as a social shield, actively dissolving modern interpersonal frictions.',
    practicalModernApplication:
      'Social media FOMO and peer comparison can easily ruin a good day. The Bhava Compass acts as your emotional reset button. When you feel triggered or stressed by others, it gives you quick journaling prompts to drop the negativity and get your peace back.',
  },
  gunas: {
    id: 'shastra-gunas',
    featureKey: 'gunas',
    sanskritVerse:
      'सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः । निबध्नन्ति महाबाहो देहे देहिनमव्ययम् ॥\nब्रह्मचर्यप्रतिष्ठायां वीर्यलाभः ॥',
    transliteration:
      'sattvaṁ rajas tama iti guṇāḥ prakṛti-sambhavāḥ | nibadhnanti mahā-bāho dehe dehinam avyayam ||\nbrahmacarya-pratiṣṭhāyāṁ vīrya-lābhaḥ ||',
    sourceText: 'Bhagavad Gita 14.5-18 & Yoga Sutra 2.38',
    commentaryReference: 'Shankara Bhashya on Gita 14.5 & Vyasa Bhashya on YS 2.38',
    literalMeaning:
      'Sattva (clarity/light), Rajas (passion/agitation), and Tamas (inertia/dullness)—these three qualities born of material nature condition the embodied self. Upon the firm establishment of regulated conduct (Brahmacharya), unshakeable cognitive vitality and vigor (Virya) is attained.',
    practicalModernApplication:
      'Daily Guna monitoring and analytics: empowers students to self-diagnose mental states (distracted Rajas, lethargic Tamas, or focused Sattva) and consciously align their daily rhythms.',
  },
  daily_verse: {
    id: 'shastra-daily_verse',
    featureKey: 'daily_verse',
    sanskritVerse:
      'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
    transliteration:
      'uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hyātmano bandhur ātmaiva ripur ātmanaḥ ||',
    sourceText: 'Bhagavad Gita 6.5',
    commentaryReference: 'Adi Shankaracharya Bhashya on Bhagavad Gita 6.5',
    literalMeaning:
      'Elevate yourself through the power of your own mind, and do not degrade yourself. For the mind can be your greatest ally, and the mind can be your greatest enemy.',
    practicalModernApplication:
      'True discipline starts from within. Do not wait for external motivation to begin your deep work; use your intellect to guide your senses and rein in compulsive digital impulses.',
  },
    svadhyaya: {
    id: 'lens_svadhyaya',
    featureKey: 'svadhyaya',
    sourceText: 'Bhagavad Gita 17.15 (Svādhyāya Pramāṇa)',
    sanskritVerse: 'अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत् । स्वाध्यायाभ्यसनं चैव वाङ्मयं तप उच्यते ॥',
    transliteration: 'anudvega-karaṁ vākyaṁ satyaṁ priya-hitaṁ ca yat | svādhyāyābhyasanaṁ caiva vāṅ-mayaṁ tapa ucyate ||',
    commentaryReference: 'Srila Prabhupada (Bhagavad-gita As It Is 17.15) & IKS Sravana-Manana-Nididhyasana Pedagogy',
    literalMeaning:
      '"Austerity of speech consists in speaking words that are truthful, pleasing, beneficial, and not agitating to others, and also in regularly reciting Vedic literature." (His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, Bhagavad-gītā As It Is 17.15). In his purport, Srila Prabhupada emphasizes that cultivating spiritual and intellectual elevation requires regularly engaging with scriptural authority (svādhyāya-abhyasanam). Within the Indian Knowledge Systems (IKS) pedagogical framework, this daily contemplation transforms raw text into lived wisdom through the three-stage cycle of Śravaṇa (encountering valid scriptural testimony), Manana (rational reflection on its meaning for life), and Nididhyāsana (deep internalization into daily conduct), where the text guides the practitioner like a well-wishing friend (suhṛda-sammita).',
    practicalModernApplication:
      'Why does BrahmaPath greet you with a newly allotted Bhagavad Gita shloka every single time you open or reload the application? Before algorithmic feeds can agitate your mind, engaging in 30 seconds of Svādhyāya (intentional scriptural study) anchors your discriminative intellect (Buddhi). Dynamically rotating the verse on every launch prevents mental habituation—ensuring your brain actively performs Manana (fresh reflection) on a living teaching rather than scrolling past a static banner you have grown blind to.',
  },
  tridosha: {
    id: 'shastra-tridosha',
    featureKey: 'tridosha',
    sourceText: 'Ashtanga Hridayam, Sutrasthana 1.6',
    sanskritVerse: 'वायुः पित्तं कफश्चेति त्रयो दोषाः समासतः । विकृताऽविकृता देहं घ्नन्ति ते वर्तयन्ति च ॥',
    transliteration: "vāyuḥ pittaṁ kaphaśceti trayo doṣāḥ samāsataḥ | vikṛtā'vikṛtā dehaṁ ghnanti te vartayanti ca ||",
    commentaryReference: 'Arunadatta (Sarvangasundara) & Hemadri (Ayurvedarasayana) on Ashtanga Hridayam 1.6',
    literalMeaning:
      'Vata (wind/movement), Pitta (fire/metabolism), and Kapha (water-earth/structure) are the three fundamental doshas (biological humors). When they are in a natural, balanced state (avikrita), they sustain and nourish the body and mind. When they are aggravated or out of balance (vikrita), they degrade the system and destroy equilibrium.',
    practicalModernApplication:
      'The Tri-Dosha engine acts as your early-warning biological radar. By tracking behavioral spikes—like Vata-aggravating late-night doomscrolling, Pitta-aggravating social comparison, or Kapha-aggravating lethargy—this feature translates ancient physiological wisdom into real-time, personalized course corrections to stabilize your nervous system.',
  },
  doshas: {
    id: 'shastra-doshas',
    featureKey: 'doshas',
    sourceText: 'Ashtanga Hridayam, Sutrasthana 1.6',
    sanskritVerse: 'वायुः पित्तं कफश्चेति त्रयो दोषाः समासतः । विकृताऽविकृता देहं घ्नन्ति ते वर्तयन्ति च ॥',
    transliteration: "vāyuḥ pittaṁ kaphaśceti trayo doṣāḥ samāsataḥ | vikṛtā'vikṛtā dehaṁ ghnanti te vartayanti ca ||",
    commentaryReference: 'Arunadatta (Sarvangasundara) & Hemadri (Ayurvedarasayana) on Ashtanga Hridayam 1.6',
    literalMeaning:
      'Vata (wind/movement), Pitta (fire/metabolism), and Kapha (water-earth/structure) are the three fundamental doshas (biological humors). When they are in a natural, balanced state (avikrita), they sustain and nourish the body and mind. When they are aggravated or out of balance (vikrita), they degrade the system and destroy equilibrium.',
    practicalModernApplication:
      'The Tri-Dosha engine acts as your early-warning biological radar. By tracking behavioral spikes—like Vata-aggravating late-night doomscrolling, Pitta-aggravating social comparison, or Kapha-aggravating lethargy—this feature translates ancient physiological wisdom into real-time, personalized course corrections to stabilize your nervous system.',
  },
  diagnosis: {
    id: 'shastra-diagnosis',
    featureKey: 'diagnosis',
    sourceText: 'Ashtanga Hridayam, Sutrasthana 1.6',
    sanskritVerse: 'वायुः पित्तं कफश्चेति त्रयो दोषाः समासतः । विकृताऽविकृता देहं घ्नन्ति ते वर्तयन्ति च ॥',
    transliteration: "vāyuḥ pittaṁ kaphaśceti trayo doṣāḥ samāsataḥ | vikṛtā'vikṛtā dehaṁ ghnanti te vartayanti ca ||",
    commentaryReference: 'Arunadatta (Sarvangasundara) & Hemadri (Ayurvedarasayana) on Ashtanga Hridayam 1.6',
    literalMeaning:
      'Vata (wind/movement), Pitta (fire/metabolism), and Kapha (water-earth/structure) are the three fundamental doshas (biological humors). When they are in a natural, balanced state (avikrita), they sustain and nourish the body and mind. When they are aggravated or out of balance (vikrita), they degrade the system and destroy equilibrium.',
    practicalModernApplication:
      'The Tri-Dosha engine acts as your early-warning biological radar. By tracking behavioral spikes—like Vata-aggravating late-night doomscrolling, Pitta-aggravating social comparison, or Kapha-aggravating lethargy—this feature translates ancient physiological wisdom into real-time, personalized course corrections to stabilize your nervous system.',
  },
  sankalpa: {
    id: 'shastra-sankalpa',
    featureKey: 'sankalpa',
    sourceText: 'Bhagavad Gita 2.41 & 6.5 • Śukla Yajurveda 34.6 (Śiva-Saṅkalpa Sūktam)',
    commentaryReference: 'Adi Shankaracharya Bhashya on Gita 2.41 & 6.5, Śiva-Saṅkalpa Sūktam (Yajurveda 34.6)',
    sanskritVerse:
      'व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन ।\nबहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम् ॥ २.४१ ॥\n(तन्मे मनः शिवसङ्कल्पमस्तु — शुक्लयजुर्वेदः ३४.६)',
    transliteration:
      'vyavasāyātmikā buddhir ekeha kuru-nandana |\nbahu-śākhā hy anantāś ca buddhayo ’vyavasāyinām || 2.41 ||\n(tan me manaḥ śiva-saṅkalpam astu — Śukla Yajurveda 34.6)',
    literalMeaning:
      'On this path, the resolute intellect (Buddhi) is single-pointed and unified; many-branched and endless are the thoughts of the irresolute. Just as a skilled charioteer guides horses with the reins, may my mind be anchored in auspicious resolve (Śiva-Saṅkalpa).',
    practicalModernApplication:
      'In modern cognitive science (Implementation Intentions & Prefrontal Goal-Shielding), an unanchored mind defaults to automatic habit loops and cheap dopamine triggers. Explicitly defining Immediate Intentions alongside long-term Horizon Goals activates top-down executive steering in the prefrontal cortex—eliminating morning decision fatigue and giving your brain a concrete anchor when urges strike.',
  },
};
/**
 * Resolves Shastra Lens scriptural data for any given feature module.
 * Checks external JSON database first, gracefully falling back to the immutable canonical database.
 */
export function resolveShastraLens(
  featureKey: ShastraFeatureKey,
  externalList?: ShastraLensData[]
): ShastraLensData {
  if (externalList && externalList.length > 0) {
    const found = externalList.find((item) => item.featureKey === featureKey);
    if (found) {
      return found;
    }
  }
  return FALLBACK_SHASTRA_DATABASE[featureKey];
}
