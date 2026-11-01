/**
 * Core Indian Knowledge Systems (IKS) primitives and physiological/psychological typing.
 * Strictly decoupled pure type definitions without external dependencies.
 */

/**
 * Tri-Guna (Bhagavad Gita 14.5-18, Samkhya Karika):
 * The three fundamental qualities/tendencies of nature and consciousness.
 * - `Sattva`: Purity, luminosity, balance, clarity, and harmony.
 * - `Rajas`: Passion, movement, agitation, desire, and dynamic activity.
 * - `Tamas`: Inertia, darkness, dullness, lethargy, and resistance.
 */
export type GunaType = 'Sattva' | 'Rajas' | 'Tamas';

/**
 * Tri-Dosha (Charaka Samhita Sutrasthana 1.57, Ashtanga Hridaya 1.6-1.8):
 * The three bio-energetic regulatory principles governing mind and body physiology.
 * - `Vata`: Kinetic/air-space principle regulating movement, nervous impulse, and breath.
 * - `Pitta`: Metabolic/fire-water principle regulating digestion, transformation, and discernment.
 * - `Kapha`: Structural/earth-water principle regulating stability, lubrication, and endurance.
 */
export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

/**
 * Pancha Kosha (Taittiriya Upanishad 2.1-5):
 * The five concentric sheaths enveloping the core Self (Atman).
 * - `Annamaya`: Physical/food body; cellular and anatomical structure.
 * - `Pranamaya`: Vital energy sheath; breath (prana) and energetic flows.
 * - `Manomaya`: Mental sheath; sensory processing, emotions, and reactive thoughts.
 * - `Vijnanamaya`: Wisdom/intellect sheath; higher discernment (buddhi) and willpower.
 * - `Anandamaya`: Bliss sheath; innermost state of non-dual contentment and peace.
 */
export type KoshaType = 'Annamaya' | 'Pranamaya' | 'Manomaya' | 'Vijnanamaya' | 'Anandamaya';

/**
 * Chariot Metaphor State (Katha Upanishad 1.3.3-4):
 * Visualized gait and composure of the horses (senses) held by the reins (manas)
 * directed by the charioteer (buddhi).
 * - `Calm`: Harmonious balance; reins firm and senses settled.
 * - `Brisk`: Active forward engagement under conscious control.
 * - `Gallop`: Agitated state; horses straining against the reins requiring mindful pause.
 */
export type ChariotState = 'Resting' | 'Calm' | 'Brisk' | 'Gallop' | 'Galloping';

/**
 * Pranayama Regimens / Breathing Modes:
 * - `SamaVritti`: Equal ratio breathing (box breathing / balanced flow) cultivating equilibrium.
 * - `Relaxation478`: Extended exhalation technique to downregulate autonomic nervous arousal.
 * - `NadiShodhana`: Alternate nostril breathing balancing IDA and PINGALA energy channels.
 */
export type BreathingMode =
  | 'SamaVritti'
  | 'Relaxation478'
  | 'NadiShodhana'
  | 'Samavritti'
  | 'relaxation'
  | 'Relaxation'
  | 'Nadi Shodhana';

/**
 * Breath Phases (Patanjali Yoga Sutras 2.49-50):
 * Classical stages of pranic regulation and breath control.
 * - `Idle`: Resting state prior to initiating a pranayama cycle.
 * - `Puraka_Inhale`: Controlled conscious inhalation.
 * - `Antara_Kumbhaka_Hold`: Internal retention with lungs full.
 * - `Rechaka_Exhale`: Slow, controlled exhalation (facilitating parasympathetic tone).
 * - `Bahya_Kumbhaka_Hold`: External retention with lungs emptied.
 */
export type BreathPhase =
  | 'Idle'
  | 'Puraka_Inhale'
  | 'Antara_Kumbhaka_Hold'
  | 'Rechaka_Exhale'
  | 'Bahya_Kumbhaka_Hold';

/**
 * Numerical distribution representing proportions or score breakdown
 * across the three Gunas (Sattva, Rajas, Tamas).
 */
export interface GunaDistribution {
  sattva: number;
  rajas: number;
  tamas: number;
}
