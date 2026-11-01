import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { getNextRandomGitaQuote, GitaQuoteItem } from '../../data/dailyQuotes';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';

export interface DailyVerse {
  id?: string;
  sanskrit: string;
  transliteration: string;
  meaning?: string;
  translation?: string;
  source?: string;
  verse?: string;
  lifeMeaning?: string;
  rationale?: string;
}

export interface DailyVerseCardProps {
  onOpenShastraLens?: () => void;
  className?: string;
}

/**
 * Daily Bhagavad Gita Quote Card.
 *
 * Implements:
 * 1. Zero-Repeat Random Quote on Every App Mount / Reload via lazy state initializer:
 *    `const [currentQuote, setCurrentQuote] = useState<GitaQuoteItem>(() => getNextRandomGitaQuote());`
 * 2. Standardized Card Header:
 *    - Left: BookOpen icon + "Daily Shastra Verse" + grey contemplative subheading
 *    - Right: ShastraLensButton trigger for 'svadhyaya'
 * 3. 5 Clean Display Elements (Parchment #FDFBF7, Slate #1E293B, Terracotta #D97706):
 *    - Top Header Pill: `currentQuote.verse` (e.g., Bhagavad Gita 18.37)
 *    - Sanskrit Shloka: `currentQuote.sanskrit`
 *    - English Pronunciation: `currentQuote.transliteration`
 *    - English Translation: `currentQuote.translation`
 *    - Path & Purpose Callout Box: `bg-[#F5F1E8]/70 border-l-4 border-[#D97706] p-3.5 rounded-r-xl text-sm`
 *      with label "PATH & PURPOSE (MEANING FOR LIFE)" followed by `currentQuote.lifeMeaning`
 * 4. Decoupled Shastra Lens Trigger:
 *    - Button strictly calls `openShastraLens('svadhyaya')`.
 *    - Never passes `currentQuote` into the lens modal, ensuring the static BG 17.15 Svādhyāya lens
 *      remains permanent while the quote card itself rotates through the 12 Bhagavad Gita shlokas on every reload.
 */
export const DailyVerseCard: React.FC<DailyVerseCardProps> = ({
  onOpenShastraLens,
  className = '',
}) => {
  const { openShastraLens } = useBrahmaPath();

  // Lazy initializer guarantees a fresh non-repeating quote on every app mount / reload
  const [currentQuote] = useState<GitaQuoteItem>(() =>
    getNextRandomGitaQuote()
  );

  const handleInspectLens = () => {
    if (onOpenShastraLens) {
      onOpenShastraLens();
    } else {
      openShastraLens('svadhyaya');
    }
  };

  return (
    <article
      className={`bg-white shadow-xs rounded-3xl p-5 sm:p-6 border border-slate-200/90 flex flex-col items-center space-y-4 ${className}`}
    >
      {/* 1. Standard Feature Card Header with Icon, Heading, Lighter Subheading & Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5 w-full">
        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Daily Shastra Verse
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Timeless contemplative wisdom for daily reflection and grounding
          </p>
        </div>

        <ShastraLensButton
          onClick={handleInspectLens}
          className="ml-2 flex-shrink-0"
        />
      </div>

      {/* 2. Top Header Pill */}
      <div>
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 tracking-wide uppercase shadow-2xs">
          {currentQuote.verse}
        </span>
      </div>

      {/* 3. Sanskrit Shloka */}
      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1E293B] leading-relaxed tracking-wide text-center px-2">
        {currentQuote.sanskrit}
      </h2>

      {/* 4. English Pronunciation */}
      <p className="font-serif italic text-xs sm:text-sm text-[#1E293B]/70 leading-relaxed text-center px-2">
        {currentQuote.transliteration}
      </p>

      {/* 5. English Translation */}
      <div className="w-full text-left">
        <p className="text-sm text-[#1E293B] leading-relaxed">
          {currentQuote.translation}
        </p>
      </div>

      {/* 6. Meaning for Life & Goal Attainment Callout Box */}
      <div className="w-full bg-[#F5F1E8]/70 border-l-4 border-[#D97706] p-3.5 rounded-r-xl text-sm text-left space-y-1.5 shadow-2xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
          PATH &amp; PURPOSE (MEANING FOR LIFE)
        </span>
        <p className="text-xs text-[#1E293B]/85 leading-relaxed">
          {currentQuote.lifeMeaning}
        </p>
      </div>
    </article>
  );
};

export default DailyVerseCard;
