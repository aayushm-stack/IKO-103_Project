import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, User, Shield, Wrench, Check, AlertCircle } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDevHarness?: () => void;
}

/**
 * Global Application Settings view.
 * Kept strictly isolated from the daily sadhana and goal flows
 * to protect the user's cognitive budget.
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenDevHarness,
}) => {
  const { userName, setUserName } = useAccount();

  // Local state for Name field with empty string validation
  const [nameInput, setNameInput] = useState<string>(userName || '');
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    if (userName && userName !== nameInput && !nameError) {
      setNameInput(userName);
    }
  }, [userName]);

  const handleNameChange = (val: string) => {
    setNameInput(val);
    const trimmed = val.trim();
    if (trimmed.length === 0) {
      setNameError('Name cannot be empty. Please enter your name.');
    } else {
      setNameError('');
      setUserName(trimmed);
    }
  };

  const handleNameBlur = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length === 0) {
      setNameError('Name cannot be empty. Please enter your name.');
      const fallback = userName.trim() || 'Sadhaka';
      setNameInput(fallback);
      setUserName(fallback);
      setTimeout(() => setNameError(''), 2500);
    } else {
      setNameError('');
      setUserName(trimmed);
    }
  };

  // Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop touch dismiss */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Application Settings"
        className="relative z-10 w-full max-w-md bg-parchment rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100/70 text-terracotta flex items-center justify-center">
              <SettingsIcon className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-base font-semibold text-charcoal">
                Global Settings
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-charcoal/50">
                Cognitive Budget Protected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-xl text-charcoal/60 hover:text-charcoal hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cognitive Budget Protection Pill */}
        <div className="p-3 bg-sage/5 border border-sage/20 rounded-xl flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
          <p className="text-xs text-charcoal/80 leading-relaxed">
            Account settings are kept strictly out of your daily sadhana and task workflows to protect your cognitive budget.
          </p>
        </div>

        {/* Account Identity Section - Preferred Name Input */}
        <div className="p-4 bg-white/80 rounded-xl border border-[#E2E8F0] space-y-3">
          <div className="flex items-center gap-2 text-charcoal">
            <User className="w-4 h-4 text-terracotta" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
              Account &amp; Identity
            </h3>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="preferred-name-input"
              className="text-xs font-medium text-charcoal/80 block"
            >
              Preferred Name
            </label>
            <input
              id="preferred-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Enter your name"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-charcoal transition shadow-xs focus:outline-none ${
                nameError
                  ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400/30 focus:border-red-500'
                  : 'border-[#E2E8F0] bg-white placeholder:text-charcoal/30 focus:ring-2 focus:ring-terracotta/40'
              }`}
            />
            {nameError ? (
              <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>{nameError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-charcoal/50">
                Updates your global account state across all reflections and personal prompts.
              </p>
            )}
          </div>

          {/* Dynamic greeting preview */}
          <div className="pt-2 border-t border-[#E2E8F0]/70 flex items-center justify-between text-xs text-charcoal/70">
            <span className="text-[11px] text-charcoal/50">Greeting Preview:</span>
            <span className="font-serif italic font-medium text-terracotta">
              Namaste, {nameInput.trim() ? nameInput.trim() : (userName.trim() || 'Sadhaka')} 🙏
            </span>
          </div>
        </div>

        {/* Developer / Evaluation Harness Option */}
        {onOpenDevHarness && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-700">Dev / Judge Test Harness</p>
                <p className="text-[10px] text-slate-400">Low-level test controls &amp; state seeders</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDevHarness();
              }}
              className="px-2.5 py-1 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer"
            >
              Launch
            </button>
          </div>
        )}

        {/* Done / Save Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save &amp; Close</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
