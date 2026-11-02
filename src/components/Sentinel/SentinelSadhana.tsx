import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { getTodayDateString } from '../../hooks/useSadhanaData';
import {
  GunaType,
  AharaLog,
  NidraLog,
  BrahmacharyaLog,
  WatchStimulantProfile,
  WatchRestProtocol,
  SahyogCohesionState,
} from '../../types/iks';
import {
  evaluateScreenTimeZone,
  getPillarScores,
  computeYuktaScore,
} from '../../engine/yuktaEngine';
import {
  Shield,
  Utensils,
  Moon,
  Zap,
  BookOpen,
  CheckCircle2,
  Heart,
  ChevronDown,
  Check,
  Activity,
} from 'lucide-react';

export interface SentinelSadhanaProps {
  className?: string;
}

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface SentinelDropdownProps<T extends string> {
  value: T;
  onChange: (val: T) => void;
  options: DropdownOption<T>[];
  className?: string;
}

/**
 * Custom Dropdown Menu for Sentinel Sadhana Hub.
 * Replicates the exact visual geometry of SadhanaMobile (12px container, 8px floating pills).
 */
function SentinelDropdown<T extends string>({
  value,
  onChange,
  options,
  className = '',
}: SentinelDropdownProps<T>) {
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

      {isOpen && (
        <div
          role="listbox"
          style={{
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          }}
          className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-lg p-2 space-y-1 max-h-64 overflow-y-auto"
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
                className={`w-full px-3 py-2 text-xs rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between gap-2 select-none hover:bg-emerald-50/90 hover:text-emerald-950 ${
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

/**
 * SentinelSadhana: Operational Sadhana Hub for defense and uniformed personnel.
 * Evaluates watch stimulant loads, split-watch Kūrma sleep down-regulation,
 * and Sahyog unit cohesion while keeping 100% mathematical parity with BrahmaPath engines.
 */
export const SentinelSadhana: React.FC<SentinelSadhanaProps> = ({ className = '' }) => {
  const { todayLog, logs, logSadhanaPillar, openShastraLens, preferences } = useBrahmaPath();

  const baselineHours = preferences?.averageScreenTimeHours ?? 6;
  const baselineMinutes = Math.round(baselineHours * 60);
  const maxSliderMinutes = Math.min(16 * 60, (baselineHours + 4) * 60);

  // ================= 1. AHARA STATE =================
  const [watchStimulantProfile, setWatchStimulantProfile] = useState<WatchStimulantProfile>(
    todayLog?.ahara?.watchStimulantProfile ?? 'balanced_ration'
  );
  const [nutritionQuality, setNutritionQuality] = useState<'Sattvic' | 'Rajasic' | 'Tamasic'>(
    todayLog?.ahara?.nutritionQuality ?? 'Sattvic'
  );
  const [digitalMinutes, setDigitalMinutes] = useState<number>(
    todayLog?.ahara?.digitalConsumptionMinutes ?? baselineMinutes
  );
  const [mindfulnessScore, setMindfulnessScore] = useState<number>(
    todayLog?.ahara?.sensoryMindfulnessScore ?? 4
  );

  // ================= 2. NIDRA STATE =================
  const [hoursSlept, setHoursSlept] = useState<number>(todayLog?.nidra?.hoursSlept ?? 7.0);
  const [watchRestProtocol, setWatchRestProtocol] = useState<WatchRestProtocol>(
    todayLog?.nidra?.watchRestProtocol ?? 'continuous_bunk'
  );
  const [bedtimeConsistency, setBedtimeConsistency] = useState<boolean>(
    todayLog?.nidra?.bedtimeConsistency ?? true
  );
  const [recoveryDepth, setRecoveryDepth] = useState<'Restorative' | 'Fragmented' | 'Depleted'>(() => {
    const raw = todayLog?.nidra?.restQuality;
    if (raw === 'Disturbed') return 'Fragmented';
    if (raw === 'Lethargic') return 'Depleted';
    return 'Restorative';
  });
  const [restQuality, setRestQuality] = useState<'Restorative' | 'Disturbed' | 'Lethargic'>(
    todayLog?.nidra?.restQuality ?? 'Restorative'
  );

  // ================= 3. BRAHMACHARYA STATE =================
  const [energyScore, setEnergyScore] = useState<number>(
    todayLog?.brahmacharya?.energyConservationRating ?? 4
  );
  const [focusBlocks, setFocusBlocks] = useState<number>(
    todayLog?.brahmacharya?.focusedStudyBlocks ?? 4
  );
  const [sahyogCohesion, setSahyogCohesion] = useState<SahyogCohesionState>(
    todayLog?.brahmacharya?.sahyogCohesion ?? 'sahyog_connected'
  );
  const [dominantGuna, setDominantGuna] = useState<GunaType>(
    todayLog?.brahmacharya?.dominantGuna ?? 'Sattva'
  );

  // ================= 4. AFTER-ACTION INNER DEBRIEF STATE =================
  const [reflection, setReflection] = useState<string>(todayLog?.generalReflection ?? '');
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

  // 1-Day rolling memory: retrieves previous day's saved note
  const previousDayEntry = useMemo(() => {
    const today = getTodayDateString();
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
    return null;
  }, [logs]);

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

  // Sync state if todayLog changes
  useEffect(() => {
    if (todayLog) {
      if (todayLog.ahara) {
        setWatchStimulantProfile(todayLog.ahara.watchStimulantProfile ?? 'balanced_ration');
        setNutritionQuality(todayLog.ahara.nutritionQuality ?? 'Sattvic');
        setDigitalMinutes(todayLog.ahara.digitalConsumptionMinutes ?? baselineMinutes);
        setMindfulnessScore(todayLog.ahara.sensoryMindfulnessScore ?? 4);
      }
      if (todayLog.nidra) {
        setHoursSlept(todayLog.nidra.hoursSlept ?? 7.0);
        setWatchRestProtocol(todayLog.nidra.watchRestProtocol ?? 'continuous_bunk');
        setBedtimeConsistency(todayLog.nidra.bedtimeConsistency ?? true);
        const rq = todayLog.nidra.restQuality;
        setRestQuality(rq ?? 'Restorative');
        setRecoveryDepth(rq === 'Disturbed' ? 'Fragmented' : rq === 'Lethargic' ? 'Depleted' : 'Restorative');
      }
      if (todayLog.brahmacharya) {
        setEnergyScore(todayLog.brahmacharya.energyConservationRating ?? 4);
        setFocusBlocks(todayLog.brahmacharya.focusedStudyBlocks ?? 4);
        setDominantGuna(todayLog.brahmacharya.dominantGuna ?? 'Sattva');
        setSahyogCohesion(todayLog.brahmacharya.sahyogCohesion ?? 'sahyog_connected');
      }
      setReflection(todayLog.generalReflection ?? '');
    }
  }, [todayLog, baselineMinutes]);

  // Determine logged status
  const isAharaLogged = Boolean(
    todayLog?.loggedPillars ? todayLog.loggedPillars.ahara : todayLog?.ahara
  );
  const isNidraLogged = Boolean(
    todayLog?.loggedPillars ? todayLog.loggedPillars.nidra : todayLog?.nidra
  );
  const isBrahmacharyaLogged = Boolean(
    todayLog?.loggedPillars ? todayLog.loggedPillars.brahmacharya : todayLog?.brahmacharya
  );
  const activePillarsCount = [isAharaLogged, isNidraLogged, isBrahmacharyaLogged].filter(
    Boolean
  ).length;

  // Active Live Pillar Objects
  const currentAhara: AharaLog = useMemo(
    () => ({
      nutritionQuality,
      digitalConsumptionMinutes: Number(digitalMinutes),
      sensoryMindfulnessScore: Number(mindfulnessScore),
      baselineMinutesAtLog: baselineMinutes,
      watchStimulantProfile,
    }),
    [nutritionQuality, digitalMinutes, mindfulnessScore, baselineMinutes, watchStimulantProfile]
  );

  const currentNidra: NidraLog = useMemo(
    () => ({
      hoursSlept: Number(hoursSlept),
      bedtimeConsistency: watchRestProtocol !== 'post_watch_hypervigilance',
      restQuality,
      watchRestProtocol,
    }),
    [hoursSlept, watchRestProtocol, restQuality]
  );

  const currentBrahmacharya: BrahmacharyaLog = useMemo(
    () => ({
      energyConservationRating: Number(energyScore),
      focusedStudyBlocks: Number(focusBlocks),
      dominantGuna,
      sahyogCohesion,
    }),
    [energyScore, focusBlocks, dominantGuna, sahyogCohesion]
  );

  // Live score calculation
  const livePillarScores = useMemo(() => {
    return getPillarScores(currentAhara, currentNidra, currentBrahmacharya);
  }, [currentAhara, currentNidra, currentBrahmacharya]);

  const liveEquilibriumScore = useMemo(() => {
    return computeYuktaScore(currentAhara, currentNidra, currentBrahmacharya);
  }, [currentAhara, currentNidra, currentBrahmacharya]);

  // ================= SUBMISSION HANDLER =================
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
      {/* ================= TOP LIVE EQUILIBRIUM BANNER ================= */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-800 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight whitespace-nowrap">
              Sentinel Sadhana Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Charaka Samhita • Operational Duty, Split-Watch Recovery &amp; Composure
          </p>
        </div>
        <ShastraLensButton
          onClick={() => openShastraLens('trayopastambha')}
          className="ml-2 flex-shrink-0"
        />
      </div>

      {/* Live Operational Telemetry Strip */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs shadow-2xs">
        {/* Equilibrium Score */}
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Equilibrium Score
          </span>
          <span className="font-extrabold text-emerald-800 font-mono text-xs sm:text-sm">
            {liveEquilibriumScore}/100
          </span>
        </div>

        {/* Ahara Subscore */}
        <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Āhāra (Ration)
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
            {livePillarScores.ahara}/34
          </span>
        </div>

        {/* Nidra Subscore */}
        <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-1 sm:pt-0 pl-0 sm:pl-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Nidrā (Rest)
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
            {livePillarScores.nidra}/33
          </span>
        </div>

        {/* Brahmacharya Subscore */}
        <div className="space-y-0.5 border-t sm:border-t-0 border-l border-slate-200/80 pt-1 sm:pt-0 pl-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Brahmacharya
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
            {livePillarScores.brahmacharya}/33
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        {/* ============================================================== */}
        {/* CARD 1 — ĀHĀRA: RATION, STIMULANT & OFF-WATCH SENSORY INTAKE   */}
        {/* ============================================================== */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-4 h-4 text-amber-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Āhāra</h3>
                <p className="text-xs text-slate-500 font-normal">
                  Ration, Stimulant &amp; Off-Watch Sensory Intake (Max 34 pts)
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              Sensory &amp; Ration
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Input 1A — Mess Ration & Watch Stimulant Profile */}
            <div className="flex flex-col space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Mess Ration &amp; Watch Stimulant Load
              </label>
              <p className="text-[11px] text-slate-500">
                Select how your meals and watch-duty caffeine/tea intake were balanced today.
              </p>
              <SentinelDropdown<WatchStimulantProfile>
                value={watchStimulantProfile}
                onChange={(val) => {
                  setWatchStimulantProfile(val);
                  if (val === 'balanced_ration') setNutritionQuality('Sattvic');
                  else if (val === 'high_watch_caffeine') setNutritionQuality('Rajasic');
                  else setNutritionQuality('Tamasic');
                }}
                options={[
                  {
                    value: 'balanced_ration',
                    label: 'Balanced Mess Ration & Hydration — Fresh meals, steady energy, low stimulant reliance',
                  },
                  {
                    value: 'high_watch_caffeine',
                    label: 'Heavy Watch Stimulants — Excess sentry tea/coffee, energy drinks, or spicy/fried canteen intake',
                  },
                  {
                    value: 'irregular_missed',
                    label: 'Irregular / Skipped Ration — Missed meal after shift, stale food, or heavy lethargy',
                  },
                ]}
              />
            </div>

            {/* Input 1B — Off-Watch & Bunk Screen Time */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Off-Watch Digital Drift
                </label>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  {(digitalMinutes / 60).toFixed(1).replace(/\.0$/, '')} hrs (Avg: {baselineHours}h)
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
                <span className="text-left text-slate-400 font-medium">0h (Clean Wind-Down)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shadow-2xs inline-block">
                    Avg: {baselineHours}h
                  </span>
                </div>
                <span className="text-right text-slate-400 font-medium">
                  {(maxSliderMinutes / 60).toFixed(0)}h max
                </span>
              </div>

              {/* Psychological Feedback Banner */}
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

            {/* Input 1C — Off-Duty Sensory Shielding / Pratyāhāra (1 to 5) */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    3. Sensory Shielding (Pratyāhāra)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    How well did you guard your mind from outrage feeds, rumor loops, or heated arguments while off watch?
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 whitespace-nowrap ml-2">
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
                <span className="text-left text-slate-400 font-medium">1 (Reactive / Exposed)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    4–5 (Yukta Target)
                  </span>
                </div>
                <span className="text-right text-slate-600 font-semibold">5 (Deeply Shielded)</span>
              </div>
            </div>

            {/* Card 1 Status Box & Submit Button */}
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
                      ✓ Āhāra logged today
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
                  <span>Log Āhāra Intake (Max 34 pts)</span>
                ) : (
                  <span>Update Āhāra Intake (Max 34 pts)</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 2 — NIDRĀ: TACTICAL REST & POST-WATCH DOWN-REGULATION     */}
        {/* ============================================================== */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-slate-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Nidrā</h3>
                <p className="text-xs text-slate-500 font-normal">
                  Tactical Rest &amp; Post-Watch Down-Regulation (Max 33 pts)
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              Tactical Rest
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Input 2A — Cumulative 24-Hour Rest (0 to 12 hrs, step 0.5) */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    1. Cumulative 24-Hour Rest (Including Post-Watch Recovery)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Count both night bunk sleep and daytime tactical recovery rest after sentry/patrol shifts.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 whitespace-nowrap ml-2">
                  {hoursSlept} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={hoursSlept}
                onChange={(e) => setHoursSlept(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">0h (Severe Deficit)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    5h–8h (Optimal Recovery)
                  </span>
                </div>
                <span className="text-right text-slate-400 font-medium">12h (Extended Deep Rest)</span>
              </div>
            </div>

            {/* Input 2B — Duty Watch & Kūrma Decompression Protocol */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Watch Rest Pattern &amp; Sensory Withdrawal (BG 2.58)
              </label>
              <p className="text-[11px] text-slate-500">
                Soldiers on split night-watch earn full discipline credit when practicing Kūrma sensory withdrawal after duty.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  {
                    id: 'continuous_bunk' as WatchRestProtocol,
                    title: 'Continuous Bunk Rest',
                    desc: 'Unbroken night sleep schedule without interrupted sentry rotation.',
                    badge: 'Circadian Steady',
                  },
                  {
                    id: 'split_sentry_kurma' as WatchRestProtocol,
                    title: 'Split-Sentry Watch + Kūrma Decompression',
                    desc: 'Retracted senses immediately after watch without scrolling; disciplined sensory shutdown.',
                    badge: 'Full Credit + Tactical Bonus',
                  },
                  {
                    id: 'post_watch_hypervigilance' as WatchRestProtocol,
                    title: 'Post-Watch Hyper-Vigilance',
                    desc: 'Lay wired in bunk scanning thoughts, over-stimulated by tea or scrolling late into the night.',
                    badge: 'High Arousal',
                  },
                ].map((p) => {
                  const isSelected = watchRestProtocol === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setWatchRestProtocol(p.id);
                        setBedtimeConsistency(p.id !== 'post_watch_hypervigilance');
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-700 ring-2 ring-emerald-700/20 text-emerald-950 font-semibold shadow-xs'
                          : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{p.title}</span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2C — Autonomic Recovery Depth */}
            <div className="flex flex-col space-y-1.5 pt-3 border-t border-slate-200/70">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Autonomic Recovery Depth
              </label>
              <SentinelDropdown<'Restorative' | 'Fragmented' | 'Depleted'>
                value={recoveryDepth}
                onChange={(val) => {
                  setRecoveryDepth(val);
                  if (val === 'Restorative') setRestQuality('Restorative');
                  else if (val === 'Fragmented') setRestQuality('Disturbed');
                  else setRestQuality('Lethargic');
                }}
                options={[
                  {
                    value: 'Restorative',
                    label: 'Restorative — Nervous system settled, alert and steady for duty',
                  },
                  {
                    value: 'Fragmented',
                    label: 'Fragmented — Light sleep, woke repeatedly to noise or operational tension',
                  },
                  {
                    value: 'Depleted',
                    label: 'Depleted — Exhausted body, heavy post-watch brain fog',
                  },
                ]}
              />
            </div>

            {/* Card 2 Status Box & Submit Button */}
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
                      ✓ Nidrā logged today
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
                  <span>Log Nidrā Recovery (Max 33 pts)</span>
                ) : (
                  <span>Update Nidrā Recovery (Max 33 pts)</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 3 — BRAHMACHARYA: VIGILANCE, DRILL & SAHYOG COHESION      */}
        {/* ============================================================== */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-800" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Brahmacharya</h3>
                <p className="text-xs text-slate-500 font-normal">
                  Vigilance, Drill &amp; Sahyog Unit Cohesion (Max 33 pts)
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              Kshatra Vitality
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Input 3A — Operational Composure & Vital Stamina (1 to 5) */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    1. Composure &amp; Vital Energy Stewardship (1–5)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    How well did you conserve inner stamina across duty hours without leaking energy into anger or impulse?
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 whitespace-nowrap ml-2">
                  {energyScore} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyScore}
                onChange={(e) => setEnergyScore(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">1 (Drained / Irritable)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    4–5 (Yukta Target)
                  </span>
                </div>
                <span className="text-right text-slate-600 font-semibold">5 (Steadfast &amp; Conserved)</span>
              </div>
            </div>

            {/* Input 3B — Focused Watch, Drill & Duty Readiness Blocks (0 to 10) */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Dedicated Watch, Training, PT &amp; Maintenance Blocks
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Count completed sentry shifts, tactical drills, physical training (PT), and gear maintenance intervals.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 whitespace-nowrap ml-2">
                  {focusBlocks} {focusBlocks === 1 ? 'block' : 'blocks'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={focusBlocks}
                onChange={(e) => setFocusBlocks(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="grid grid-cols-3 items-center text-[11px] pt-1 px-0.5">
                <span className="text-left text-slate-400 font-medium">0 (Off Duty)</span>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs inline-block">
                    4–6 (Optimal Readiness)
                  </span>
                </div>
                <span className="text-right text-slate-400 font-medium">10 (High Tempo)</span>
              </div>
            </div>

            {/* Input 3C — Sahyog Buddy Check & Operational Mind-State */}
            <div className="flex flex-col space-y-1.5 pt-3 border-t border-slate-200/70">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Sahyog Unit Cohesion &amp; Dominant Guna
              </label>
              <SentinelDropdown<SahyogCohesionState>
                value={sahyogCohesion}
                onChange={(val) => {
                  setSahyogCohesion(val);
                  if (val === 'sahyog_connected') setDominantGuna('Sattva');
                  else if (val === 'command_friction') setDominantGuna('Rajas');
                  else setDominantGuna('Tamas');
                }}
                options={[
                  {
                    value: 'sahyog_connected',
                    label: 'Sattva • Sahyog Connected — Checked in with unit buddy, steady & supportive presence',
                  },
                  {
                    value: 'command_friction',
                    label: 'Rajas • Agitated / Command Friction — Restless heat, irritation, or peer strain',
                  },
                  {
                    value: 'barracks_isolated',
                    label: 'Tamas • Barracks Isolation — Withdrawn from unit mates, heavy field fatigue',
                  },
                ]}
              />
            </div>

            {/* Card 3 Status Box & Submit Button */}
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
                      ✓ Brahmacharya logged today
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
                  <span>Log Brahmacharya Readiness (Max 33 pts)</span>
                ) : (
                  <span>Update Brahmacharya Readiness (Max 33 pts)</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 4 — AFTER-ACTION INNER DEBRIEF & MINDFUL NOTE             */}
        {/* ============================================================== */}
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col space-y-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <div>
              <label className="block font-bold text-slate-900 text-sm">
                After-Action Inner Debrief &amp; Mindful Note
              </label>
              <p className="text-xs text-slate-500 font-normal">
                Offload heavy thoughts from today&apos;s duty or a phone call home so you do not carry them into your bunk.
              </p>
            </div>
          </div>

          {/* Compassionate Operational Care Callout */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5 fill-amber-700/10" />
            <p className="text-xs text-amber-950 leading-relaxed italic">
              In military operational psychology, active cognitive offloading post-watch discharges autonomic tension, lowers hyperarousal, and prevents operational strain from infiltrating restorative sleep. Write freely—everything remains 100% offline on your device.
            </p>
          </div>

          <textarea
            rows={3}
            placeholder="How was the watch today? Offload any friction, longing for home, or operational weight here before resting..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-xl bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none leading-relaxed transition shadow-2xs"
          />

          {/* Previous Day Note Accordion Toggle Button */}
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
                  ? "Hide Previous Day's Debrief Note"
                  : "Show Previous Day's Debrief Note"}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                showPreviousNote ? 'rotate-180 text-amber-700' : ''
              }`}
            />
          </button>

          {/* Smooth Expanding Accordion Box */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showPreviousNote ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                  Previous Day&apos;s Debrief ({formattedPreviousDate})
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
                    No debrief recorded on the previous day. As you save your reflections daily, yesterday&apos;s note will automatically appear here.
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
              <span>Save Inner Debrief</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentinelSadhana;
