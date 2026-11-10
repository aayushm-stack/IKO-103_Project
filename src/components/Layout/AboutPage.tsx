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
    title: 'Katha Upanishad Chariot',
    paragraph:
      'Right at the top of your home screen sits the living mirror of your mind. Ancient wisdom compares your body to a chariot, your senses to the horses, your mind to the reins, and your higher intellect to the charioteer. You do not need to press anything here—as you log your daily sleep, food, focus, and emotions across the app, the chariot automatically shifts between Resting, Calm, Brisk, and Galloping, gently showing you whether you are holding the reins of your day or being pulled along by restless impulses.',
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
    title: 'Personal Sankalpa Log',
    paragraph:
      'A ship without a compass drifts with every wind, and a seeker without an inner intention gets pulled by every distraction. Your Sankalpa is the personal vow you made to yourself when you first entered BrahmaPath, thoughtfully placed right on your home dashboard so it never gets buried. Whenever you feel overwhelmed or tempted to give up on your routine, reading your own words reminds you that you are walking this path out of self-respect, not self-punishment.',
  },
  {
    id: 6,
    title: 'Daily Sadhana Hub',
    paragraph:
      'Think of this page as a gentle check-in with the three pillars that hold up your life: Āhāra (what your body and eyes consume), Nidrā (how deeply you rest), and Brahmacharya (how well you protect your focus and vital energy). Because your day unfolds in stages, you do not have to submit all three at once. When you wake up in the morning, simply adjust the Nidrā sleep inputs and tap the Nidrā log button—its grey status box will turn green, and your score will immediately update based only on your sleep. Later in the afternoon or evening, you can come back to log or update your Āhāra screen time and meals, and log your Brahmacharya study blocks before bed. Each pillar saves independently and can be updated as many times as you like throughout the day.',
  },
  {
    id: 7,
    title: 'Daily Reflection & Mindful Note',
    paragraph:
      'At the bottom of your Daily Sadhana Reflection sits a quiet space for your own words. Numbers and sliders can track your hours, but they cannot capture how your heart feels. Taking one minute at the end of the day to write down what brought you peace—and gently forgiving yourself for whatever felt heavy—clears mental clutter so you can sleep with a lighter mind.',
  },
  {
    id: 8,
    title: 'Impulse Interceptor',
    paragraph:
      'Whenever a heavy urge pulls at you—whether it is doomscrolling, restlessness, or sudden lethargy—open this tool before acting on the impulse. Start by tapping the trigger you are feeling and sliding the Urge Intensity bar from 1 to 5. Watch how the 7-step Bhagavad Gita cascade below it highlights the exact stage your mind has reached, showing you how a tiny lingering thought grows into a strong craving. Next, scroll down to the two text boxes: in the first box (Vitarka), honestly name the excuse your mind is telling you; in the second box (Pratipaksha), write a calm, truthful counter-thought. Pick one physical micro-swap action from the 6 context-aware options dynamically curated for your active Life Rhythm or Posting Terrain—like splashing cold water or taking five slow breaths—and tap the main button to intercept the urge, or honestly log a slip without guilt if the urge already passed.',
  },
  {
    id: 9,
    title: 'Bhāva Compass',
    paragraph:
      'Everyday life is full of quiet emotional friction—comparing yourself to others, doubting your own worth, feeling unseen or lonely, or dealing with difficult personal or work dynamics. When you open the Bhāva Compass, you will see eight expandable cards: three Positive Buffer cards at the top and five Negative Friction cards below. Whenever you experience a moment of shared joy or resilience, open a green Positive Buffer card and log it to build emotional strength. Whenever envy, self-doubt, or hostility hits you, open the matching Negative Friction card; you can mark that you are experiencing that friction right now, read the comforting explanation, practice the simple step-by-step antidotes rooted in Patanjali\'s Yoga Sutras, and then tap Mark as Resolved to clear the heaviness from your mind.',
  },
  {
    id: 10,
    title: 'Breathing Sanctum',
    paragraph:
      'When your thoughts are racing too fast to reason with them, the quickest way to quiet the mind is through the breath. Open the Breathing Sanctum two or three times a day—especially before focused work or when stress spikes—and simply follow the expanding and contracting rhythm on screen. Just two minutes of slow, guided breathing softens your heart rate, settles nervous tension, and brings your awareness back into the present moment.',
  },
  {
    id: 11,
    title: 'Vault & Trajectory Analytics',
    paragraph:
      'Your Vault is where your daily efforts come together into a clear 8-day story. The trajectory graph and progression tables show your daily equilibrium alongside your raw sleep hours, focus blocks, and screen time. If you miss a day completely, the graph applies a gentle 5% natural decay—not to punish you, but to honestly reflect how the mind naturally drifts when left unattended. Most importantly, everything in this Vault is 100% private and stored strictly on your own device, working completely offline with zero cloud servers ever touching your personal journey.',
  },
  {
    id: 12,
    title: 'Shastra Lens',
    paragraph:
      'Across every card and feature in BrahmaPath, you will notice a small Shastra Lens button in the corner. Whenever you are curious about the deeper wisdom behind a tool, tap that button. A clean drawer will open showing the original Sanskrit shloka, its English pronunciation, its authentic scriptural meaning, and a simple explanation of why that ancient principle was chosen for your modern daily life.',
  },
];

/**
 * AboutPage: A sequential, plain-language walkthrough of all 12 BrahmaPath features
 * and how they harmonize together for daily equilibrium.
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
            A sequential walkthrough of your 12 inner equilibrium tools
          </p>
        </div>

        {/* 12 Sequential Accordion Items */}
        <div className="space-y-3">
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

                {/* Accordion Body with Smooth Max-Height Animation */}
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

        {/* STEP 2: Static Developer Note (Niṣkāma Bhāva) & Bottom Branding */}
        <div className="pt-6 border-t border-slate-200/90 space-y-4">
          {/* Static Developer Intention Box (Always Visible) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5 shadow-2xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                Built with Niṣkāma Bhāva
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              This application was crafted with <span className="font-semibold text-slate-900">Niṣkāma Bhāva</span>—free from commercial greed, advertisements, subscriptions, or the worldly chase for money and user data. We do not track you, we do not ask for your personal data, and no external server ever watches what you write here. BrahmaPath exists for one quiet reason: to bring the timeless, life-steadying wisdom of our ancient scriptures—which many have forgotten in the noise of the modern world—back into your daily hands as a practical, compassionate companion.
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
