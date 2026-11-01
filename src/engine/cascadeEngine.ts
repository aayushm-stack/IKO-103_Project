import {
  CascadeStage,
  CascadeStepInfo,
  TriggerCategory,
} from '../types/iks';

/**
 * The 7 canonical stages of psychological decline from Bhagavad Gita 2.62-63:
 * Dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate |
 * saṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate ||
 * krodhād bhavati sammohaḥ sammohāt smṛti-vibhramaḥ |
 * smṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati ||
 */
export const GITA_CASCADE_STEPS: CascadeStepInfo[] = [
  {
    stepNumber: 1,
    stage: 'Dhyana_Dwelling',
    sanskritTerm: 'Dhyāyato Viṣayān (ध्यायतो विषयान्)',
    englishTitle: 'Dwelling on the Sense-Object',
    description:
      'The mind idly lingers on an external sensory stimulus or digital feed (notification, thumbnail, fleeting thought). Adi Shankara notes that passive contemplation plants the latent seed of attachment.',
    canInterceptEasily: true,
  },
  {
    stepNumber: 2,
    stage: 'Sanga_Attachment',
    sanskritTerm: 'Saṅga (सङ्ग)',
    englishTitle: 'Psychological Attachment',
    description:
      'Repeated contemplation generates emotional affinity and mental attachment ("just one more reel"). The stimulus begins occupying working memory and cognitive bandwidth.',
    canInterceptEasily: true,
  },
  {
    stepNumber: 3,
    stage: 'Kama_Craving',
    sanskritTerm: 'Kāma (काम)',
    englishTitle: 'Intense Craving / Urge Peak',
    description:
      'Attachment matures into compulsive craving and urgent longing to consume. Dopamine wanting outruns conscious liking, seeking instantaneous distraction or sensory gratification.',
    canInterceptEasily: true,
  },
  {
    stepNumber: 4,
    stage: 'Krodha_Agitation',
    sanskritTerm: 'Krodha (क्रोध)',
    englishTitle: 'Frustration & Inner Agitation',
    description:
      'When the craving is thwarted, resisted, or delayed, irritation, comparison, and cognitive friction arise, destabilizing emotional poise.',
    canInterceptEasily: true,
  },
  {
    stepNumber: 5,
    stage: 'Sammoha_Delusion',
    sanskritTerm: 'Sammoha (सम्मोह)',
    englishTitle: 'Delusion & Attentional Trance',
    description:
      'Bewilderment of discernment where temporal awareness vanishes ("where did the last hour go?"). The boundary between wholesome and unwholesome actions dissolves into hypnotic trance.',
    canInterceptEasily: false,
  },
  {
    stepNumber: 6,
    stage: 'SmritiVibhrama_MemoryLoss',
    sanskritTerm: 'Smṛti-vibhrama (स्मृतिविभ्रम)',
    englishTitle: 'Lapse of Memory & Intention',
    description:
      'Complete lapse of working memory regarding one’s core Sankalpa, obligations, and higher values. The original intention for opening the device is entirely forgotten.',
    canInterceptEasily: false,
  },
  {
    stepNumber: 7,
    stage: 'BuddhiNasha_IntellectLoss',
    sanskritTerm: 'Buddhi-nāśa (बुद्धिनाश)',
    englishTitle: 'Collapse of Discernment',
    description:
      'Total collapse of higher intellectual capacity (buddhi) to steer executive function. Shankara explains that with the paralysis of buddhi, self-governance is lost, requiring gentle, shame-free recovery.',
    canInterceptEasily: false,
  },
];

/**
 * Maps incoming compulsive urge intensity (1-5) and trigger category to the
 * corresponding stage in the Gita 2.62-63 cascade.
 *
 * @param trigger The behavioral trigger category.
 * @param urgeIntensity Intensity on a 1-5 scale (defaults to step 3 Kama_Craving for intensity 3).
 * @returns The matching CascadeStepInfo metadata.
 */
export function estimateCascadeStage(
  trigger: TriggerCategory,
  urgeIntensity: number
): CascadeStepInfo {
  const intensity = Math.max(1, Math.min(5, Math.round(urgeIntensity)));

  let stepNumber = 3;

  if (intensity === 1) {
    stepNumber = 1; // Dhyana_Dwelling
  } else if (intensity === 2) {
    stepNumber = 2; // Sanga_Attachment
  } else if (intensity === 3) {
    // Default to Kama_Craving; shift to Krodha if anxiety/comparison is high
    if (
      trigger === 'Academic Anxiety' ||
      trigger === 'Academic Anxiety / Professional Workload' ||
      (trigger as string) === 'Academic_Anxiety' ||
      trigger === 'Social Comparison' ||
      (trigger as string) === 'Social_Comparison'
    ) {
      stepNumber = 4; // Krodha_Agitation
    } else {
      stepNumber = 3; // Kama_Craving
    }
  } else if (intensity === 4) {
    if (trigger === 'Lethargy' || trigger === 'Doomscrolling') {
      stepNumber = 5; // Sammoha_Delusion
    } else {
      stepNumber = 4; // Krodha_Agitation
    }
  } else if (intensity >= 5) {
    if (trigger === 'Doomscrolling' || trigger === 'Lethargy') {
      stepNumber = 6; // SmritiVibhrama_MemoryLoss
    } else {
      stepNumber = 5; // Sammoha_Delusion
    }
  }

  const foundStep = GITA_CASCADE_STEPS.find((step) => step.stepNumber === stepNumber);
  return foundStep ?? GITA_CASCADE_STEPS[2]; // Fallback to Step 3 Kama_Craving
}
