import React from 'react';
import { BookOpen } from 'lucide-react';

export interface ShastraLensButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Standardized Shastra Lens trigger button.
 * Ensures global visual and cognitive consistency across all modules:
 * - Uniform label: "Shastra Lens" (no square brackets)
 * - Uniform canonical icon: BookOpen (representing authentic scriptural exegesis)
 * - Pill shape styling: soft emerald background, emerald border, and deep emerald text (#065F46)
 */
export const ShastraLensButton: React.FC<ShastraLensButtonProps> = ({
  onClick,
  label = 'Shastra Lens',
  className = '',
  icon = <BookOpen className="w-3.5 h-3.5 stroke-[2] flex-shrink-0" />,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-emerald-50 text-[#065F46] border border-emerald-200/90 hover:bg-emerald-100 hover:border-emerald-300 text-xs font-semibold shadow-2xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 active:scale-95 cursor-pointer flex-shrink-0 ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ShastraLensButton;
