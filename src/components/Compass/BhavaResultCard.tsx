import React, { useState } from 'react';

interface BhavaResultCardProps {
  attitude: string;
  placeholder?: string;
  initialText?: string;
  onSubmit?: (reflectionText: string) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

const attitudeSubtitles: Record<string, string> = {
  Mudita: 'Joy for Others',
  Maitri: 'Friendliness & Warmth',
  Karuna: 'Compassion',
  Upeksha: 'Equanimity',
};

export const BhavaResultCard: React.FC<BhavaResultCardProps> = ({
  attitude = 'Mudita',
  placeholder = 'Acknowledge their effort. Write one virtue they possess...',
  initialText = '',
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const [reflection, setReflection] = useState<string>(initialText);

  const subtitle = attitudeSubtitles[attitude] || 'Inner Harmony';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(reflection);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] w-full">
      {/* Header */}
      <div className="mb-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-charcoal/60 hover:text-charcoal mb-2 inline-flex items-center gap-1"
          >
            &larr; Back to Compass
          </button>
        )}
        <span className="text-[11px] uppercase tracking-wider text-sage font-semibold block mb-0.5">
          Pratipaksha Reframe
        </span>
        <h3 className="font-serif text-xl font-semibold text-charcoal">
          Cultivate {attitude} ({subtitle})
        </h3>
        <p className="text-xs text-charcoal/70 mt-1">
          Redirect the mind from comparison to constructive appreciation.
        </p>
      </div>

      {/* Journaling Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bhava-journal"
            className="block text-xs font-medium text-charcoal/80 mb-1.5"
          >
            Reflective Journaling
          </label>
          <textarea
            id="bhava-journal"
            rows={4}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 bg-[#FDFBF7]/50 p-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all resize-none"
          />
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting || !reflection.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wide shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-terracotta/30 active:scale-95"
          >
            {isSubmitting ? 'Inscribing...' : 'Commit Reflection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BhavaResultCard;
