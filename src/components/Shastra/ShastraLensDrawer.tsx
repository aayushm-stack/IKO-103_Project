import React, { useEffect } from 'react';
import { X, BookOpen, ScrollText, ShieldCheck } from 'lucide-react';
import { getDailyShloka } from '../../data/dailyQuotes';

export interface ShastraLensDrawerProps {
  verse?: string;
  commentary?: string;
  literalMeaning?: string;
  source?: string;
  transliteration?: string;
  practicalApplication?: string;
  featureKey?: string;
  featureTitle?: string;
  isOpen?: boolean;
  onClose: () => void;
}

const FEATURE_TITLES: Record<string, string> = {
  chariot: 'Katha Upanishad • Chariot Allegory',
  gunas: 'Triguna Harmonizer • Sattva, Rajas & Tamas',
  breathing: 'Prāṇamaya Kosha • Breathing Sanctum',
  trayopastambha: 'Trayopastambha • Daily Sadhana Pillars',
  interceptor: 'Pratipaksha Bhāvana • Impulse Interceptor',
  cascade: 'Bhagavad Gita 2.62-63 • 7-Step Cascade',
  pratipaksha: 'Patanjali Yoga Sutras 2.33 • Cognitive Reframe',
  chitta_prasadanam: 'Chitta Prasādanam • Bhāva Compass',
  brahmacharya: 'Patanjali Yoga Sutras 2.38 • Energy Conservation',
  yukta: 'Bhagavad Gita 6.17 • Balanced Living',
  daily_verse: 'Daily Shloka • Quote of the Day',
  svadhyaya: 'Bhagavad Gita 17.15 • Svādhyāya Pramāṇa',
};

export const ShastraLensDrawer: React.FC<ShastraLensDrawerProps> = ({
  verse,
  commentary,
  literalMeaning,
  source,
  transliteration,
  practicalApplication,
  featureKey,
  featureTitle,
  isOpen = true,
  onClose,
}) => {
  // Prevent background scrolling while drawer is mounted/open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Fallback quote only if zero props were supplied
  const fallbackQuote = getDailyShloka();

  const activeSource = source?.trim() || fallbackQuote.source;
  const activeSanskrit = verse?.trim() || fallbackQuote.sanskrit;
  const activeTransliteration = transliteration?.trim() || fallbackQuote.transliteration;
  const activeMeaning = literalMeaning?.trim() || commentary?.trim() || fallbackQuote.meaning;
  const activeApplication = practicalApplication?.trim() || fallbackQuote.rationale;

  // Dynamic feature title derivation
  const activeTitle =
    featureTitle ||
    (featureKey && FEATURE_TITLES[featureKey]) ||
    (activeSource.toLowerCase().includes('katha')
      ? 'Katha Upanishad • Chariot Allegory'
      : activeSource.toLowerCase().includes('charaka')
      ? 'Ayurveda • Trayopastambha'
      : activeSource.toLowerCase().includes('taittiriya')
      ? 'Taittiriya Upanishad • Prāṇamaya Kosha'
      : activeSource.toLowerCase().includes('patanjali') || activeSource.toLowerCase().includes('yoga sutra')
      ? 'Patanjali Yoga Sutras'
      : activeSource.includes('14.')
      ? 'Bhagavad Gita • Triguna Harmony'
      : activeSource.includes('2.62')
      ? 'Bhagavad Gita • Distraction Cascade'
      : activeSource.includes('6.17')
      ? 'Bhagavad Gita • Yukta Harmony'
      : 'Shastra Lens Exegesis');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop touch dismiss */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Stark Parchment Bottom-Sheet Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Shastra Lens Exegesis - ${activeTitle}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
        className="relative z-10 w-full max-w-md bg-parchment rounded-t-[28px] border-t border-x border-[#E2E8F0] shadow-2xl p-6 max-h-[88vh] overflow-y-auto overscroll-contain pb-12 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300"
      >
        {/* Pull handle indicator */}
        <div className="w-10 h-1 bg-charcoal/20 rounded-full mx-auto" />

        {/* Top Header Row with Close "X" at top right */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]/80">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-100/70 text-terracotta flex items-center justify-center shadow-2xs flex-shrink-0">
              <BookOpen className="w-4 h-4 text-amber-700" />
            </span>
            <h2 className="font-serif text-base sm:text-lg font-bold text-charcoal tracking-tight">
              Shastra Lens Exegesis
            </h2>
          </div>

          {/* Close "X" button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Shastra Lens"
            className="p-1.5 rounded-xl text-charcoal/60 hover:text-charcoal hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Citation Pill */}
        <div className="text-center">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-sage/15 text-sage border border-sage/30 shadow-2xs">
            {activeSource}
          </span>
        </div>

        {/* Centered, Large, Serif Sanskrit Verse */}
        <div className="p-5 bg-white/90 rounded-2xl border border-orange-200/60 shadow-xs text-center flex flex-col gap-2.5">
          <p className="font-serif text-lg sm:text-xl font-bold text-charcoal leading-relaxed tracking-wide whitespace-pre-line">
            {activeSanskrit}
          </p>

          {/* Italicized Transliteration */}
          {activeTransliteration && (
            <p className="font-serif italic text-xs sm:text-sm text-charcoal/70 leading-relaxed whitespace-pre-line pt-1 border-t border-orange-100/60">
              {activeTransliteration}
            </p>
          )}
        </div>

        {/* Scriptural Meaning & Exegesis Box */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal/70 flex items-center gap-1">
            <ScrollText className="w-3.5 h-3.5 text-amber-700" />
            Scriptural Meaning &amp; Exegesis
          </span>
          <div className="p-4 rounded-xl bg-white/90 border border-[#E2E8F0] text-sm text-charcoal/90 leading-relaxed">
            <p>{activeMeaning}</p>
          </div>
        </div>



        {/* Practical Modern Application Box */}
        {activeApplication && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal/70 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Practical Modern Application
            </span>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-charcoal/90 leading-relaxed">
              <p>{activeApplication}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShastraLensDrawer;
