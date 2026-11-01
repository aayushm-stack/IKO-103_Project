/**
 * Master catalog of 12 classical and modern Shreyas Micro-Swap actions.
 * Grouped into three somatic/behavioral tiers:
 * - Invisible: Subtle cognitive, pranic, and sensory regulation without visible movement.
 * - Kinetic: Movement, somatic vagal resets, and postural adjustments.
 * - Tangible: Physical, environmental, and tactile boundary anchors.
 */

export type MicroSwapCategory = 'Invisible' | 'Kinetic' | 'Tangible';

export interface MicroSwapItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: MicroSwapCategory;
}

export const MASTER_MICRO_SWAPS: MicroSwapItem[] = [
  // --- Invisible: Cognitive / Pranic & Sensory Regulation ---
  {
    id: 'extended-exhale',
    icon: '',
    title: 'Pranayama - Extended Exhale',
    description:
      'Inhale slowly for 4 seconds, then double your exhale to 8 seconds. This directly stimulates the vagus nerve and downregulates nervous fight-or-flight agitation.',
    category: 'Invisible',
  },
  {
    id: 'trataka',
    icon: '',
    title: 'Trataka - Fixed Gazing',
    description:
      'Lock your unblinking gaze onto a single stationary point for 60 seconds. Concentrating optical focus immediately arrests restless mental scatter and eye fatigue.',
    category: 'Invisible',
  },
  {
    id: 'urge-surf',
    icon: '',
    title: 'Urge Surfing',
    description:
      'Set a firm 10-minute timer and witness the impulse without resisting or indulging. Urges peak and naturally dissipate like waves within minutes.',
    category: 'Invisible',
  },
  {
    id: 'grounding',
    icon: '',
    title: '5-4-3-2-1 Grounding',
    description:
      'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste. Forces sensory processing to pull your attention out of digital trance.',
    category: 'Invisible',
  },
  {
    id: 'nada-yoga',
    icon: '',
    title: 'Nada Yoga',
    description:
      'Put on noise-cancelling headphones or cover your ears in silence. Attune to the subtle internal high-frequency vibration to quiet intrusive thoughts.',
    category: 'Invisible',
  },

  // --- Kinetic: Somatic / Movement & Postural Vagal Resets ---
  {
    id: 'jala',
    icon: '',
    title: 'Jala - Cold Water Reset',
    description:
      'Splash cold water forcefully across your face and closed eyes three times. Activates the mammalian dive reflex to drop elevated heart rate instantly.',
    category: 'Kinetic',
  },
  {
    id: 'pratyahara',
    icon: '',
    title: 'Pratyahara',
    description:
      'Close your eyes and cup your warm palms over them for 60 seconds of pitch darkness. Cut external optical stimulation to starve sensory appetite.',
    category: 'Kinetic',
  },
  {
    id: 'ahimsa-pace',
    icon: '',
    title: 'Ahimsa Pacing',
    description:
      'Stand up and take 20 deliberate, unhurried steps feeling each foot roll against the floor. Channels restless fidgeting into grounded somatic calm.',
    category: 'Kinetic',
  },
  {
    id: 'spinal-asana',
    icon: '',
    title: 'Spinal Asana',
    description:
      'Stand up, interlock fingers overhead, and stretch your spine tall with 3 deep diaphragmatic breaths. Breaks physical slump and stagnant screen lethargy.',
    category: 'Kinetic',
  },

  // --- Tangible: Physical, Environmental & Tactile Anchors ---
  {
    id: 'hydration',
    icon: '',
    title: 'Internal Cooling',
    description:
      'Pour a glass of fresh water and drink 5 slow, conscious sips with deliberate pauses. Physically quenches metabolic heat and irritable impulsivity.',
    category: 'Tangible',
  },
  {
    id: 'sattvic-anchor',
    icon: '',
    title: 'Sattvic Anchor',
    description:
      'Pick up a real pen and write one physical, truthful sentence about what matters right now. Converts drifting distraction into tangible commitment.',
    category: 'Tangible',
  },
  {
    id: 'tapas',
    icon: '',
    title: 'Tapas',
    description:
      'Physically pick up your phone and place it inside a closed drawer or another room. Introduce physical distance to disrupt instant gratification.',
    category: 'Tangible',
  },
];

/**
 * Default starter micro-swap IDs: all 12 foundational master micro-swaps.
 */
export const DEFAULT_MICRO_SWAP_IDS: string[] = MASTER_MICRO_SWAPS.map((item) => item.id);

/**
 * Helper to fetch a micro-swap by its unique ID.
 */
export function getMicroSwapById(id: string): MicroSwapItem | undefined {
  return MASTER_MICRO_SWAPS.find((item) => item.id === id);
}

/**
 * Helper to fetch multiple micro-swaps by an array of IDs.
 */
export function getMicroSwapsByIds(ids: string[]): MicroSwapItem[] {
  const set = new Set(ids);
  return MASTER_MICRO_SWAPS.filter((item) => set.has(item.id));
}
