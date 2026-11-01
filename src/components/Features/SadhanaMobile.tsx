import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { getTodayDateString } from '../../hooks/useSadhanaData';
import { GunaType, AharaLog, NidraLog, BrahmacharyaLog } from '../../types/iks';
import { evaluateScreenTimeZone } from '../../engine/yuktaEngine';
import { Utensils, Moon, Zap, BookOpen, CheckCircle2, Heart, ChevronDown, Check, Sun } from 'lucide-react';

export interface SadhanaMobileProps {
  className?: string;
}

/**
 * Mobile-first Trayopastambha Sadhana Hub reflection form.
 * Designed with compassionate, non-judgmental guidance for daily self-observation
 * based on Charaka Samhita 11.35 and Gita 6.17 Yukta moderation.
 */
interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface SadhanaDropdownProps<T extends string> {
  value: T;
  onChange: (val: T) => void;
  options: DropdownOption<T>[];
  className?: string;
}

/**
 * Custom Dropdown Menu for Sadhana Hub.
 * Features:
 * - Rounded-xl (12px) container with subtle drop shadow
 * - 6px internal padding preventing options from touching borders
 * - Rounded-lg (8px) floating pill list items with modern hover highlight
 */
function SadhanaDropdown<T extends string>({
  value,
  onChange,
  options,
  className = '',
}: SadhanaDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Dropdown Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ borderRadius: '12px' }}
        className="w-full p-3 border border-slate-300 rounded-xl bg-white text-xs text-slate-800 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition cursor-pointer shadow-2xs hover:border-slate-400"
      >
        <span className="truncate pr-2 font-medium">{selectedOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-800' : ''
          }`}
        />
      </button>

      {/* Main Dropdown Menu Container: rounded-xl (12px), subtle drop shadow, internal padding */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          }}
          className="sadhana-dropdown-menu absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-lg p-2 space-y-1 max-h-64 overflow-y-auto"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{ borderRadius: '8px' }}
                className={`sadhana-dropdown-item w-full px-3 py-2 text-xs rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between gap-2 select-none hover:bg-emerald-50/90 hover:text-emerald-950 ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-700'
                }`}
              >
                <span className="leading-relaxed">{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const SadhanaMobile: React.FC<SadhanaMobileProps> = ({ className = '' }) => {
  const { todayLog, logs, logSadhanaPillar, addOrUpdateDailyLog, openShastraLens, preferences } = useBrahmaPath();

  const baselineHours = preferences?.averageScreenTimeHours ?? 6;
  const baselineMinutes = Math.round(baselineHours * 60);
  const maxSliderMinutes = Math.min(16 * 60, (baselineHours + 4) * 60);

  // --- AHARA STATE ---
  const [nutritionQuality, setNutritionQuality] = useState<'Sattvic' | 'Rajasic' | 'Tamasic'>(
    todayLog?.ahara?.nutritionQuality ?? 'Sattvic'
  );
  const [digitalMinutes, setDigitalMinutes] = useState<number>(
    todayLog?.ahara?.digitalConsumptionMinutes ?? baselineMinutes
  );
  const [mindfulnessScore, setMindfulnessScore] = useState<number>(
    todayLog?.ahara?.sensoryMindfulnessScore ?? 4
  );

  // --- NIDRA STATE ---
  const [hoursSlept, setHoursSlept] = useState<number>(todayLog?.nidra?.hoursSlept ?? 7.5);
  const [bedtimeConsistency, setBedtimeConsistency] = useState<boolean>(
    todayLog?.nidra?.bedtimeConsistency ?? true
  );
  const [restQuality, setRestQuality] = useState<'Restorative' | 'Disturbed' | 'Lethargic'>(
    todayLog?.nidra?.restQuality ?? 'Restorative'
  );

  // --- BRAHMACHARYA STATE ---
  const [energyRating, setEnergyRating] = useState<number>(
    todayLog?.brahmacharya?.energyConservationRating ?? 4
  );
  const [studyBlocks, setStudyBlocks] = useState<number>(
    todayLog?.brahmacharya?.focusedStudyBlocks ?? 4
  );
  const [dominantGuna, setDominantGuna] = useState<GunaType>(
    todayLog?.brahmacharya?.dominantGuna ?? 'Sattva'
  );

  // --- NOTE / REFLECTION STATE ---
  const [reflection, setReflection] = useState<string>(
    todayLog?.generalReflection ?? ''
  );
  const [activeFeedbackPillar, setActiveFeedbackPillar] = useState<
    'ahara' | 'nidra' | 'brahmacharya' | 'reflection' | null
  >(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPreviousNote, setShowPreviousNote] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  // Strictly 1-day rolling history: retrieves yesterday's saved note (automatically superseding any older notes)
  const previousDayEntry = useMemo(() => {
    const today = getTodayDateString();

    // 1. Check in sadhana logs for the most recent log strictly before today with a non-empty reflection
    if (Array.isArray(logs)) {
      const pastWithReflection = logs
        .filter(
          (l) =>
            l.date &&
            l.date.slice(0, 10) < today &&
            l.generalReflection &&
            l.generalReflection.trim().length > 0
        )
        .sort((a, b) => b.date.localeCompare(a.date));

      if (pastWithReflection.length > 0) {
        return {
          date: pastWithReflection[0].date.slice(0, 10),
          text: pastWithReflection[0].generalReflection!.trim(),
        };
      }
    }

    // 2. Check dedicated localStorage backup
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem('brahmapath_yesterday_reflection_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.date && parsed.date < today && parsed?.text?.trim()) {
            return {
              date: parsed.date,
              text: parsed.text.trim(),
            };
          }
        }
      }
    } catch {
      // ignore
    }

    return null;
  }, [logs]);

  // Formatted date label for previous day's reflection
  const formattedPreviousDate = useMemo(() => {
    if (!previousDayEntry?.date) return 'Yesterday';
    try {
      const [y, m, d] = previousDayEntry.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      });
    } catch {
      return previousDayEntry.date;
    }
  }, [previousDayEntry]);

  // Sync local useState fields when todayLog updates or resets to undefined
  useEffect(() => {
    if (todayLog) {
      if (todayLog.ahara) {
        setNutritionQuality(todayLog.ahara.nutritionQuality ?? 'Sattvic');
        setDigitalMinutes(todayLog.ahara.digitalConsumptionMinutes ?? baselineMinutes);
        setMindfulnessScore(todayLog.ahara.sensoryMindfulnessScore ?? 4);
      }
      if (todayLog.nidra) {
        setHoursSlept(todayLog.nidra.hoursSlept ?? 7.5);
        setBedtimeConsistency(todayLog.nidra.bedtimeConsistency ?? true);
        setRestQuality(todayLog.nidra.restQuality ?? 'Restorative');
      }
      if (todayLog.brahmacharya) {
        setEnergyRating(todayLog.brahmacharya.energyConservationRating ?? 4);
        setStudyBlocks(todayLog.brahmacharya.focusedStudyBlocks ?? 4);
        setDominantGuna(todayLog.brahmacharya.dominantGuna ?? 'Sattva');
      }
      setReflection(todayLog.generalReflection ?? '');
    } else {
      setNutritionQuality('Sattvic');
      setDigitalMinutes(baselineMinutes);
      setMindfulnessScore(4);
      setHoursSlept(7.5);
      setBedtimeConsistency(true);
      setRestQuality('Restorative');
      setEnergyRating(4);
      setStudyBlocks(4);
      setDominantGuna('Sattva');
      setReflection('');
    }
  }, [todayLog]);

  // Determine which pillars are already logged today
  const isAharaLogged = Boolean(
    todayLog?.loggedPillars ? todayLog.loggedPillars.ahara : todayLog
  );
  const isNidraLogged = Boolean(
    todayLog?.loggedPillars ? todayLog.loggedPillars.nidra : todayLog
  );
  const isBrahmacharyaLogged = Boolean(
    todayLog?.loggedPillars ? todayLog.loggedPillars.brahmacharya : todayLog
  );

  // Active pillars count for the top summary strip
  const activePillarsCount = [isAharaLogged, isNidraLogged, isBrahmacharyaLogged].filter(
    Boolean
  ).length;

  // Build current pillar objects
  const currentAhara: AharaLog = useMemo(
    () => ({
      nutritionQuality,
      digitalConsumptionMinutes: Number(digitalMinutes),
      sensoryMindfulnessScore: Number(mindfulnessScore),
      baselineMinutesAtLog: baselineMinutes,
    }),
    [nutritionQuality, digitalMinutes, mindfulnessScore, baselineMinutes]
  );

  const currentNidra: NidraLog = useMemo(
    () => ({
      hoursSlept: Number(hoursSlept),
      bedtimeConsistency,
      restQuality,
    }),
    [hoursSlept, bedtimeConsistency, restQuality]
  );

  const currentBrahmacharya: BrahmacharyaLog = useMemo(
    () => ({
      energyConservationRating: Number(energyRating),
      focusedStudyBlocks: Number(studyBlocks),
      dominantGuna,
    }),
    [energyRating, studyBlocks, dominantGuna]
  );

  // Handle logging / updating an individual pillar or note
  const handlePillarSubmit = (
    pillar: 'ahara' | 'nidra' | 'brahmacharya' | 'reflection'
  ) => {
    if (pillar === 'ahara') {
      logSadhanaPillar('ahara', {
        ahara: currentAhara,
        generalReflection: reflection,
      });
      setActiveFeedbackPillar('ahara');
    } else if (pillar === 'nidra') {
      logSadhanaPillar('nidra', {
        nidra: currentNidra,
        generalReflection: reflection,
      });
      setActiveFeedbackPillar('nidra');
    } else if (pillar === 'brahmacharya') {
      logSadhanaPillar('brahmacharya', {
        brahmacharya: currentBrahmacharya,
        generalReflection: reflection,
      });
      setActiveFeedbackPillar('brahmacharya');
    } else if (pillar === 'reflection') {
      logSadhanaPillar('reflection', {
        generalReflection: reflection,
      });
      try {
        if (typeof window !== 'undefined') {
          const today = getTodayDateString();
          window.localStorage.setItem(
            'brahmapath_yesterday_reflection_v1',
            JSON.stringify({ date: today, text: reflection })
          );
        }
      } catch {
        // ignore
      }
      setActiveFeedbackPillar('reflection');
    }

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setActiveFeedbackPillar(null);
    }, 3000);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      className={`p-6 rounded-3xl border shadow-xs space-y-6 ${className}`}
    >
      {/* Header with Title and Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight whitespace-nowrap">
              Daily Sadhana Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            A gentle check-in with your body, mind, and rhythm
          </p>
        </div>
        <ShastraLensButton
          onClick={() => openShastraLens('trayopastambha')}
          className="ml-2 flex-shrink-0"
        />
      </div>

      {/* 2-Cell Live Sadhana Telemetry Strip */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-2 gap-2 text-center text-xs shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Yukta Score
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
            {todayLog?.yuktaScore ?? 0}/100
          </span>
        </div>

        <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Daily Disciplines
          </span>
          <span className="font-extrabold text-emerald-700 font-mono text-xs sm:text-sm">
            {activePillarsCount} / 3 Logged
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        {/* ================= 1. AHARA PILLAR ================= */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-4 h-4 text-amber-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Āhāra
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Nourishment &amp; sensory input
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              Sensory Diet
            </span>
          </div>

          {/* Compassionate Sensory Prompt & Helper Subtext */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-xs font-semibold text-slate-800">
              How did you nourish yourself today?
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              In Ayurveda, Āhāra encompasses everything we take in through all five senses—the food on our plate, the conversations we engage in, and the digital media we absorb.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Nutrition Quality Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Nutritional Quality (Food intake)
              </label>
              <SadhanaDropdown
                value={nutritionQuality}
                onChange={(val) => setNutritionQuality(val)}
                options={[
                  { value: 'Sattvic', label: 'Sattvic (Fresh, wholesome, nourishing, light)' },
                  { value: 'Rajasic', label: 'Rajasic (Stimulating, spicy, caffeine-heavy, rushed)' },
                  { value: 'Tamasic', label: 'Tamasic (Processed, heavy, dulling, overeaten)' },
                ]}
              />
            </div>

            {/* Digital Screen Consumption Slider (Self-Anchored Relative Model) */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">
                  Digital Screen Consumption
                </label>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {(digitalMinutes / 60).toFixed(1).replace(/\.0$/, '')} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={maxSliderMinutes}
                step="30"
                value={Math.min(digitalMinutes, maxSliderMinutes)}
                onChange={(e) => setDigitalMinutes(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">0h (Minimal)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shadow-2xs inline-block">
                    Avg: {baselineHours}h
                  </span>
                </div>
                <span className="text-right text-slate-400 font-medium">{(maxSliderMinutes / 60).toFixed(0)}h max</span>
              </div>

              {/* Live Psychological Feedback Banner Directly Below the Slider */}
              {(() => {
                const screenZone = evaluateScreenTimeZone(digitalMinutes, baselineMinutes);
                return (
                  <div
                    style={{
                      backgroundColor: screenZone.pillStyle.bg,
                      borderColor: screenZone.pillStyle.border,
                      color: screenZone.pillStyle.text,
                    }}
                    className="p-3 rounded-xl border text-xs space-y-1 transition-colors duration-200 mt-2"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <span
                          style={{ backgroundColor: screenZone.pillStyle.dot }}
                          className="w-2 h-2 rounded-full"
                        />
                        {screenZone.shortBadge}
                      </span>
                      <span className="text-[11px] opacity-85">
                        {(digitalMinutes / 60).toFixed(1).replace(/\.0$/, '')}h vs {baselineHours}h baseline
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-95">
                      {screenZone.sadhanaFeedback}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Sensory Mindfulness Slider */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">
                  Sensory Mindfulness &amp; Intentionality
                </label>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {mindfulnessScore} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={mindfulnessScore}
                onChange={(e) => setMindfulnessScore(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">1 (Reactive)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    4–5 (Yukta Target)
                  </span>
                </div>
                <span className="text-right text-slate-600 font-semibold">5 (Deeply Anchored)</span>
              </div>
            </div>

            {/* Card 1 Bottom Status Box & Log Button */}
            <div className="pt-3 border-t border-slate-200/70 space-y-3">
              {!isAharaLogged ? (
                <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200/90 text-slate-600 text-xs flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 ml-1" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-xs sm:text-sm">
                      Not logged today
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Start logging to include in your Yukta Score
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      Āhāra logged today
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Can be updated anytime
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handlePillarSubmit('ahara')}
                style={{
                  backgroundColor: activeFeedbackPillar === 'ahara' ? '#059669' : '#065F46',
                  color: '#FFFFFF',
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs hover:opacity-95 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {activeFeedbackPillar === 'ahara' ? (
                  <span>✓ Āhāra Recorded!</span>
                ) : !isAharaLogged ? (
                  <span>Log Āhāra Entry</span>
                ) : (
                  <span>Update Āhāra Entry</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= 2. NIDRA PILLAR ================= */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-slate-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Nidrā
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Circadian rest &amp; somatic recovery
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              Night Rhythm
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Hours Slept Slider */}
            {/* Hours Slept Slider (Range 3h to 15h) */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">
                  Hours Slept
                </label>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {hoursSlept} hrs
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={hoursSlept}
                onChange={(e) => setHoursSlept(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">3h (Min Deficit)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    6.5h–8h (Yukta Optimal)
                  </span>
                </div>
                <span className="text-right text-slate-400 font-medium">15h (Deep Rest)</span>
              </div>
            </div>

            {/* Bedtime Consistency Checkbox */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Consistent Bedtime Schedule
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fell asleep within 30 minutes of intended target
                </p>
              </div>
              <input
                type="checkbox"
                checked={bedtimeConsistency}
                onChange={(e) => setBedtimeConsistency(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer accent-[#065F46]"
              />
            </div>

            {/* Rest Quality Dropdown */}
            <div className="flex flex-col space-y-1.5 pt-3 border-t border-slate-200/70">
              <label className="block text-xs font-medium text-slate-700">
                Subjective Rest Quality
              </label>
              <SadhanaDropdown
                value={restQuality}
                onChange={(val) => setRestQuality(val)}
                options={[
                  { value: 'Restorative', label: 'Restorative (Woke refreshed and clear)' },
                  { value: 'Disturbed', label: 'Disturbed (Restless, interrupted, waking often)' },
                  { value: 'Lethargic', label: 'Lethargic (Overslept, heavy, unrefreshed)' },
                ]}
              />
            </div>

            {/* Card 2 Bottom Status Box & Log Button */}
            <div className="pt-3 border-t border-slate-200/70 space-y-3">
              {!isNidraLogged ? (
                <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200/90 text-slate-600 text-xs flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 ml-1" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-xs sm:text-sm">
                      Not logged today
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Start logging to include in your Yukta Score
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      Nidrā logged today
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Can be updated anytime
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handlePillarSubmit('nidra')}
                style={{
                  backgroundColor: activeFeedbackPillar === 'nidra' ? '#059669' : '#065F46',
                  color: '#FFFFFF',
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs hover:opacity-95 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {activeFeedbackPillar === 'nidra' ? (
                  <span>✓ Nidrā Recorded!</span>
                ) : !isNidraLogged ? (
                  <span>Log Nidrā Entry</span>
                ) : (
                  <span>Update Nidrā Entry</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= 3. BRAHMACHARYA PILLAR ================= */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Brahmacharya
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Energy stewardship &amp; sublimated focus
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              Vitality Flow
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Energy Conservation Rating */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">
                  Inner Vitality Rating
                </label>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {energyRating} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyRating}
                onChange={(e) => setEnergyRating(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">
                  1 (Drained / Leaking)
                </span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    4–5 (Yukta Optimal)
                  </span>
                </div>
                <span className="text-right text-slate-600 font-semibold">
                  5 (Luminous &amp; Conserved)
                </span>
              </div>
            </div>

            {/* Focused Study & Deep Work Hours Slider */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">
                  Focused Study &amp; Deep Work
                </label>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {studyBlocks} {studyBlocks === 1 ? 'hr' : 'hrs'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={studyBlocks}
                onChange={(e) => setStudyBlocks(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">0h (Rest / Recovery)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    4h–6h (Yukta Optimal)
                  </span>
                </div>
                <span className="text-right text-slate-400 font-medium">12h (Max Limit)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Tracks total hours of deep work and professional focus, accommodating natural work-pause rhythms (e.g. 25m work + 5m rest or 50m work + 10m rest).
              </p>
            </div>

            {/* Dominant Observed Guna Select */}
            <div className="flex flex-col space-y-1.5 pt-3 border-t border-slate-200/70">
              <label className="block text-xs font-medium text-slate-700">
                Dominant Mental Quality (Observed Guna)
              </label>
              <SadhanaDropdown
                value={dominantGuna}
                onChange={(val) => setDominantGuna(val)}
                options={[
                  { value: 'Sattva', label: 'Sattva (Calm, lucid, quietly absorbed, harmonious)' },
                  { value: 'Rajas', label: 'Rajas (Driven, restless, hyperactive multitasking)' },
                  { value: 'Tamas', label: 'Tamas (Fatigued, procrastination, inertia, dullness)' },
                ]}
              />
            </div>

            {/* Card 3 Bottom Status Box & Log Button */}
            <div className="pt-3 border-t border-slate-200/70 space-y-3">
              {!isBrahmacharyaLogged ? (
                <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200/90 text-slate-600 text-xs flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 ml-1" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-xs sm:text-sm">
                      Not logged today
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Start logging to include in your Yukta Score
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      Brahmacharya logged today
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Can be updated anytime
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handlePillarSubmit('brahmacharya')}
                style={{
                  backgroundColor: activeFeedbackPillar === 'brahmacharya' ? '#059669' : '#065F46',
                  color: '#FFFFFF',
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs hover:opacity-95 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {activeFeedbackPillar === 'brahmacharya' ? (
                  <span>✓ Brahmacharya Recorded!</span>
                ) : !isBrahmacharyaLogged ? (
                  <span>Log Brahmacharya Entry</span>
                ) : (
                  <span>Update Brahmacharya Entry</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4. DAILY REFLECTION ================= */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <div>
              <label className="block font-bold text-slate-900 text-sm">
                Daily Reflection &amp; Mindful Note
              </label>
              <p className="text-xs text-slate-500 font-normal">
                Self-observation &amp; compassionate release
              </p>
            </div>
          </div>

          {/* Compassionate Psychological Care Callout */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5 fill-amber-700/10" />
            <p className="text-xs text-amber-950 leading-relaxed italic">
              Psychological research shows that expressing your inner thoughts in writing externalizes mental tension, calms the nervous system, and provides the soothing comfort of feeling heard and cared for. Whatever arose today, meet yourself with kindness—note it, and gently move forward.
            </p>
          </div>

          <textarea
            rows={3}
            placeholder="How is your inner weather right now? Acknowledge what felt peaceful today and gently release whatever felt heavy..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-xl bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none leading-relaxed transition shadow-2xs"
          />

          {/* Previous Day Note Accordion Toggle Button (Placed Just Before Save Button) */}
          <button
            type="button"
            onClick={() => setShowPreviousNote((prev) => !prev)}
            className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition cursor-pointer shadow-2xs hover:border-slate-400 active:scale-[0.99]"
            aria-expanded={showPreviousNote}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
              <span>
                {showPreviousNote
                  ? "Hide Previous Day's Reflection Note"
                  : "Show Previous Day's Reflection Note"}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                showPreviousNote ? 'rotate-180 text-amber-700' : ''
              }`}
            />
          </button>

          {/* Smooth Expanding Accordion Box (Enclosed within Card, Growing Gracefully) */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showPreviousNote ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                  Previous Day&apos;s Entry ({formattedPreviousDate})
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  1-Day Memory
                </span>
              </div>

              {previousDayEntry ? (
                <p className="text-xs text-slate-800 leading-relaxed italic bg-slate-50/80 p-3 rounded-lg border border-slate-200/70 whitespace-pre-wrap">
                  &ldquo;{previousDayEntry.text}&rdquo;
                </p>
              ) : (
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    No reflection recorded on the previous day. As you save your reflections daily, yesterday&apos;s note will automatically appear here for compassionate self-observation.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handlePillarSubmit('reflection')}
            style={{
              backgroundColor: activeFeedbackPillar === 'reflection' ? '#059669' : '#065F46',
              color: '#FFFFFF',
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs hover:opacity-95 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {activeFeedbackPillar === 'reflection' ? (
              <span>✓ Saved successfully</span>
            ) : (
              <span>Save Reflection Note</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { SadhanaDropdown, type DropdownOption, type SadhanaDropdownProps };
export default SadhanaMobile;
