import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, BookOpen } from 'lucide-react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';

export interface AboutPageProps {
  className?: string;
  onBack?: () => void;
}

interface FeatureItem {
  id: number;
  title: string;
  paragraph: string;
}

const features: FeatureItem[] = [
  {
    id: 1,
    title: 'Katha Upanishad Chariot & Dynamic Composure',
    paragraph:
      'Right at the top of your home screen sits the living mirror of your mind (Katha Upanishad 1.3.3–4). Your body is the chariot, senses the horses, mind the reins, and intellect the charioteer. As you log your day, the chariot shifts live across Resting, Calm, Brisk, and Galloping. Composure adapts dynamically: on Standby (0 urges logged today) it weighs your biological foundation (65%) and emotional conditioning (35%); when impulses are active, it recalibrates to Sadhana (50%), Interceptor (25%), and Bhāva (25%).',
  },
  {
    id: 2,
    title: 'Daily Shastra Verse',
    paragraph:
      'Every time you open or refresh the app, a fresh verse from the Bhagavad Gita meets you on the home screen. Instead of starting your day with noisy social feeds, take thirty quiet seconds to read the Sanskrit verse, its English meaning, and the practical life reflection below it. It acts as a gentle mental anchor that reminds you of your higher purpose before the rush of the day begins.',
  },
  {
    id: 3,
    title: 'Triguna Energetic Balance',
    paragraph:
      'Every thought and habit carries one of three subtle qualities: Sattva (clarity and peace), Rajas (restless drive and agitation), or Tamas (heaviness and inertia). This card quietly observes your recent reflections and shows you the exact percentage of each energy currently shaping your mind. Whenever you notice restlessness or fatigue rising, a single glance here helps you understand why your focus feels scattered.',
  },
  {
    id: 4,
    title: 'Tridosha Biological Balance',
    paragraph:
      'Your mind does not exist separately from your body. When you stay up late scrolling, compare yourself to peers, or oversleep, your biological rhythms—Vata, Pitta, and Kapha—get thrown off balance. This card automatically translates your recent habits into an early-warning biological radar and offers simple, comforting daily remedies, like sipping warm water or stepping away from screens, to calm your nervous system.',
  },
  {
    id: 5,
    title: 'Personal Sankalpa & Sacred Intention Space',
    paragraph:
      'A ship without a compass drifts with every wind. Your Foundational Sankalpa card rests directly above the daily Bhagavad Gita shloka on your dashboard. Tapping it opens the Sacred Intention Space, where you set Immediate Daily Intentions alongside one-pointed Horizon Goals (Vyavasāyātmikā Buddhi, BG 2.41)—anchoring your routine in personal self-respect (BG 6.5) rather than self-punishment.',
  },
  {
    id: 6,
    title: 'Daily Sadhana Hub & 4-Zone Screen Baseline',
    paragraph:
      'Grounded in Charaka Samhita 11.35 and Gita 6.17, daily vitality rests on three pillars totaling an absolute 100-point scale: Āhāra (food & screen diet — 34 pts), Nidrā (restorative sleep — 33 pts), and Brahmacharya / Vīrya (focus & energy — 33 pts). Each logs independently with additive scoring. A Self-Anchored 4-Zone Relative Screen Baseline (0 to Baseline + 4h) measures progress against your own average, while Stage 2 introduces Jaṭharāgni ration checks, split-sentry sleep recovery, and Ojas coping reserves for frontline posting terrain.',
  },
  {
    id: 7,
    title: 'Daily Reflection & Mindful Note',
    paragraph:
      'At the bottom of your Daily Sadhana Reflection sits a quiet space for your own words. Numbers and sliders can track your hours, but they cannot capture how your heart feels. Taking one minute at the end of the day to write down what brought you peace—and gently forgiving yourself for whatever felt heavy—clears mental clutter so you can sleep with a lighter mind.',
  },
  {
    id: 8,
    title: 'Impulse Interceptor & 48 Micro-Swaps',
    paragraph:
      'Whenever a restless urge strikes, open the Impulse Interceptor before acting. Adjusting Urge Intensity (1 to 5) lights up the 7-stage downward cascade (Dhyāyato → Buddhi-nāśa, BG 2.62–63), exposing how subtle brooding turns into compulsion. Select your trigger to load 1-tap Vitarka → Pratipaksha reframes (YS 2.33) and choose from 8 detailed Shreyas Micro-Swaps automatically curated for your active rhythm or terrain (48 total). In Stage 2, sentinels can activate a 10-Minute Vāṅ-maya Tapas Speech Shield (BG 17.15) to cool frustration before calling home.',
  },
  {
    id: 9,
    title: 'Bhāva Compass & Sahyogi Battle-Buddy Kits',
    paragraph:
      'Emotional serenity is restored through Patanjali Yoga Sutra 1.33 (Chitta Prasādanam): Maitrī, Karuṇā, Muditā, and Upekṣā. Starting from a neutral baseline of 50, logging Positive Buffers adds +10 pts, unaddressed frictions subtract -12 pts, and practicing the 3-step grounding antidotes rewards +4 pts upon resolution. In Stage 2, sentinels receive a 2-Sentence Homefront Reassurance Script for leave-delay guilt (BG 2.14), Pre-Call De-Armoring (BG 12.13), and a direct Tele-MANAS (14416) clinical safeguard.',
  },
  {
    id: 10,
    title: 'Breathing Sanctum',
    paragraph:
      'When your thoughts are racing too fast to reason with them, the quickest way to quiet the mind is through the breath. Open the Breathing Sanctum two or three times a day—especially before focused work or when stress spikes—and simply follow the expanding and contracting rhythm on screen. Just two minutes of slow, guided breathing softens your heart rate, settles nervous tension, and brings your awareness back into the present moment.',
  },
  {
    id: 11,
    title: 'Offline Vault & -5% Momentum Engine',
    paragraph:
      'Your Vault gathers your practice into an 8-day story with 3 historical ledgers. Instead of punitive binary streak counters that reset your score to 0 after a single missed day, BrahmaPath applies a compassionate -5% natural Tamasic momentum drift, preserving 95% of your progress. All data remains 100% offline on your device, supported by 7 native scheduled notification anchors. To preserve historical ledger integrity, switching between Civilian and Defense paths requires a clean Factory Reset in Settings.',
  },
  {
    id: 12,
    title: 'Shastra Lens',
    paragraph:
      'Across every card and feature in BrahmaPath, you will notice a small Shastra Lens button in the corner. Whenever you are curious about the deeper wisdom behind a tool, tap that button. A clean drawer will open showing the original Sanskrit shloka, its English pronunciation, its authentic scriptural meaning, and a simple explanation of why that ancient principle was chosen for your modern daily life.',
  },
];

/**
 * AboutPage: Sequential walkthrough of all 12 BrahmaPath features
 * with the Core Purpose & Dual-Stage Architecture Card at the top.
 */
export const AboutPage: React.FC<AboutPageProps> = ({ className = '', onBack }) => {
  const { setActiveView } = useBrahmaPath();
  const [expandedId, setExpandedId] = useState<number | null>(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveView('settings');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        backgroundColor: '#FDFBF7',
        color: '#1E293B',
      }}
      className={`w-full min-h-full pb-24 space-y-6 ${className}`}
    >
      {/* Main Container Card */}
      <div
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
        className="p-5 sm:p-6 rounded-3xl border shadow-xs space-y-6"
      >
        {/* Top Header */}
        <div className="border-b border-slate-200/90 pb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Settings</span>
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              About BrahmaPath
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Purpose, dual-stage architecture &amp; all 12 inner equilibrium tools
          </p>
        </div>

        {/* =========================================================================
            PURPOSE OF BRAHMAPATH & DUAL-STAGE ARCHITECTURE CARD
            ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5">
          {/* Top Badge & Heading Row */}
          <div>
            <span className="bg-emerald-50 text-[#065F46] border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-block">
              OUR PURPOSE • ONE TIMELESS PHILOSOPHY, TWO ARENAS OF LIFE
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              Why BrahmaPath Exists &amp; How It Adapts to Your World
            </h3>
          </div>

          {/* Core Purpose Paragraph */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            BrahmaPath solves a fundamental flaw in modern wellness apps: rigid blockers and streak resets punish human bad days, while passive quotes offer no real habit change. Rooted in the timeless psychology of the Bhagavad Gita, Katha Upanishad, Charaka Samhita, and Yoga Sutras, BrahmaPath is a non-judgmental, 100% offline companion that helps you steady the reins of your mind, honor your body's recovery, and build lasting inner peace.
          </p>

          {/* Stacked Vertical Stage Boxes (One on top of each other) */}
          <div className="space-y-3 pt-1">
            {/* Box 1 — Stage 1: The Inner Battleground */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] block">
                1. The Inner Battleground (Everyday Life)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                For calmer focus, emotional balance, and freedom from digital noise. The Current Life Rhythm bar at the top adapts your prompts and resets across three rhythms: <strong>Learning &amp; Study</strong>, <strong>Work &amp; Enterprise</strong>, and <strong>Home &amp; Quiet Living</strong>.
              </p>
            </div>

            {/* Box 2 — Stage 2: The Frontline Battleground */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block">
                2. The Frontline Battleground (Defense Service)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                A warm Battle-Buddy (Sahyogi) for uniformed personnel under high operational stress. The Current Posting Terrain selector adapts to <strong>High-Altitude / Cold</strong>, <strong>Active Border / Pickets</strong>, and <strong>Cantonment / Peace</strong>—supporting split-watch sleep recovery, ration balance, and warm connection with family back home.
              </p>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Unified Under the Hood:</strong> Both paths feed into a unified Chariot Composure engine that dynamically weighs your biological foundation (Yukta), impulse restraint (Interceptor), and emotional conditioning (Bhāva)—rewarding honest effort without punishing missed days.
          </div>
        </div>

        {/* =========================================================================
            ALL 12 SEQUENTIAL ACCORDION CARDS
            ========================================================================= */}
        <div className="space-y-3">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              The 12 Inner Equilibrium Tools
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Tap to expand
            </span>
          </div>

          {features.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 shadow-2xs ${
                  isExpanded
                    ? 'border-amber-400/80 bg-amber-50/10 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 pr-3 min-w-0 flex-1">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center border transition-colors ${
                        isExpanded
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-slate-100 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      {item.id}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out flex-shrink-0 ${
                      isExpanded ? 'rotate-180 text-[#D97706]' : ''
                    }`}
                  />
                </button>

                {/* Accordion Body with Smooth Animation */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 sm:p-5 pt-0">
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {item.paragraph}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            DEVELOPER INTENTION (NIṢKĀMA BHĀVA) & BOTTOM BRANDING
            ========================================================================= */}
        <div className="pt-6 border-t border-slate-200/90 space-y-4">
          {/* Static Developer Intention Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5 shadow-2xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                Built with Niṣkāma Bhāva
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              This application was crafted with <span className="font-semibold text-slate-900">Niṣkāma Bhāva</span>—free from commercial greed, advertisements, subscriptions, or the worldly chase for money and user data. We do not track you, we do not ask for your personal data, and no external server ever watches what you write here. BrahmaPath exists for one quiet reason: to bring the timeless, life-steadying wisdom of our classical heritage back into your daily hands as a practical, compassionate companion.
            </p>
          </div>

          {/* Bottom App Signature */}
          <div className="pt-4 pb-2 text-center select-none">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
              BrahmaPath
            </h3>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#D97706] mt-1">
              INNER EQUILIBRIUM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
