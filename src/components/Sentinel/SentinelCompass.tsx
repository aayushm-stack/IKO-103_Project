import React, { useState } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { BhavaCardData } from '../../types/iks';
import {
  Compass,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  HeartHandshake,
  Users,
  Heart,
  PhoneCall,
  Clock,
  Sparkle,
} from 'lucide-react';

export interface SentinelCompassProps {
  className?: string;
}

/**
 * 8 Dedicated Unit & Homefront Bhāva Cards for Defense Personnel.
 * 3 Positive Buffer Cards (Maitrī, Muditā, Karuṇā) & 5 Negative Friction Antidotes.
 * Rooted in Patanjali Yoga Sutra 1.33 & Bhagavad Gita.
 */
export const SENTINEL_BHAVA_CARDS: BhavaCardData[] = [
  // --- 3 POSITIVE BUFFER CARDS (+20 Bhāva Surplus) ---
  {
    id: 'pos_1',
    title: 'Unit Brotherhood & Buddy Support (Sahyog)',
    sanskritTrait: 'Maitrī • Active Camaraderie (YS 1.33)',
    isPositive: true,
    appreciationMessage:
      'Strong units are built on quiet brotherhood. Taking a moment to check on a tired buddy, share a laugh in the mess, or stand by a teammate builds deep Sattvic resilience across the entire platoon.',
  },
  {
    id: 'pos_2',
    title: 'Steadiness Under Command & Watch Pressure',
    sanskritTrait: 'Muditā & Sāttvika Dhṛti • BG 18.26',
    isPositive: true,
    appreciationMessage:
      'Honoring your own composure—or appreciating a fellow soldier\'s steady hand during a demanding watch or inspection—anchors your mind in pride rather than exhaustion.',
  },
  {
    id: 'pos_3',
    title: 'Unarmored Warmth with Family Back Home',
    sanskritTrait: 'Karuṇā & Suhṛda • BG 12.13',
    isPositive: true,
    appreciationMessage:
      'Setting down your tactical armor before picking up the phone to speak gently with your spouse, parents, or children protects the sacred bond that gives your service meaning.',
  },

  // --- 5 NEGATIVE FRICTION CARDS (Terracotta/Amber Theme) ---
  {
    id: 'neg_1',
    title: 'Homefront Longing & Helplessness Away from Family',
    sanskritTrait: 'Titikṣā & Impermanence • Bhagavad Gita 2.14',
    isPositive: false,
    explanationText:
      'Being posted far away when a loved one is unwell or missing a family milestone triggers heavy guilt. Bhagavad Gita 2.14 reminds us that painful separations and waves of grief are impermanent; enduring them with steadiness while caring for home from afar is not neglect—it is quiet courage.',
    actionSteps: [
      'Separate what you can control right now (a calm voice note, arranging unit/family assistance) from distance you cannot physically cross today.',
      'Before calling home, take 3 slow breaths so your worry does not turn into sharp tone on the phone.',
      'Remind yourself: "My steady presence on duty and my love for home are not enemies."',
    ],
  },
  {
    id: 'neg_2',
    title: 'Swallowed Anger After Command Reprimand or Leave Delay',
    sanskritTrait: 'Upekṣā & Krodha Restraint • Bhagavad Gita 2.56 & 2.63',
    isPositive: false,
    explanationText:
      'When leave is delayed or a harsh order feels unfair, military discipline forces you to swallow the heat. If left unaddressed, that suppressed anger leaks out toward peers or family. Bhagavad Gita 2.56 points toward Sthitaprajña—a steady mind not shaken by frustration or rage.',
    actionSteps: [
      'Practice 10 minutes of Mauna (deliberate silence) before venting to peers or calling home.',
      'Splash cold water on your face and wrists to cool acute Pitta/Rajas adrenaline.',
      'Release the replay loop in your head so someone else\'s harshness does not occupy your bunk tonight.',
    ],
  },
  {
    id: 'neg_3',
    title: 'Emotional Armor & Irritability Toward Loved Ones',
    sanskritTrait: 'Maitrī & Forgiveness • Bhagavad Gita 12.13',
    isPositive: false,
    explanationText:
      'High-risk duty trains you to stay guarded and tough. Sometimes that armor stays locked on when speaking to family, leaving you feeling cold, misunderstood, or guilty. Bhagavad Gita 12.13 teaches that true strength preserves friendliness (Maitrī), compassion (Karuṇā), and forgiveness.',
    actionSteps: [
      'Pause for 30 seconds before a family call and consciously tell yourself: "I am stepping out of the wire now; this is my home."',
      'If you spoke sharply out of fatigue, send a simple, honest message: "I was exhausted from shift, I care about you."',
      'Forgive yourself for moments of moral or emotional strain and repair the connection gently.',
    ],
  },
  {
    id: 'neg_4',
    title: 'Restless Intrusive Thoughts & Post-Duty Alertness',
    sanskritTrait: 'Abhyāsa & Mind Restraint • Bhagavad Gita 6.26',
    isPositive: false,
    explanationText:
      'After intense duty or stressful events, the mind keeps scanning for danger or replaying heavy moments. Bhagavad Gita 6.26 teaches patience rather than self-criticism: whenever the restless mind wanders, gently restrain it and bring it back to the peaceful Self.',
    actionSteps: [
      'Do not fight the intrusive thought—acknowledge that your nervous system is trying to protect you, then exhale slowly.',
      'Anchor your senses in the present room: name 3 physical objects you can see and feel the weight of your feet.',
      'Open the Breathing Sanctum for 2 minutes of slow down-regulation before lying down.',
    ],
  },
  {
    id: 'neg_5',
    title: 'Field Fatigue, Monotony & Heavy Despondency',
    sanskritTrait: 'Ātma-Bandhu Self-Upliftment • Bhagavad Gita 6.5',
    isPositive: false,
    explanationText:
      'Long deployments and harsh routines can drain energy until everything feels empty and heavy. Bhagavad Gita 6.5 offers a compassionate anchor: uplift yourself by your own mind and never degrade yourself, for your worth is never erased by exhaustion or a difficult season.',
    actionSteps: [
      'Drop all perfectionism today—choose one small, manageable step (drink water, step into sunlight, make your bunk).',
      'Break isolation: sit with your unit buddy for 5 minutes even if you do not feel like talking much.',
      'Speak to yourself as a trusted comrade, never as an enemy.',
    ],
  },
];

/**
 * Mobile-first Sentinel Bhāva Compass.
 * Unit Camaraderie, Command Equilibrium, and Homefront Warmth.
 */
export const SentinelCompass: React.FC<SentinelCompassProps> = ({ className = '' }) => {
  const {
    openShastraLens,
    todayBhavaLogs,
    togglePositiveBhava,
    logNegativeBhavaEncounter,
    toggleNegativeBhavaResolution,
    clearBhavaCardToday,
    chariotStatus,
  } = useBrahmaPath();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Compute live telemetry counts from todayBhavaLogs
  const positiveCount =
    todayBhavaLogs?.filter(
      (l) => l.isPositive || l.interactionType === 'positive_buffer'
    ).length || 0;

  const negativeLogs =
    todayBhavaLogs?.filter(
      (l) => !l.isPositive && l.interactionType !== 'positive_buffer'
    ) || [];
  const resolvedNegCount = negativeLogs.filter((l) => Boolean(l.isResolved)).length;

  const handleToggleExpand = (cardId: string) => {
    setExpandedId((prev) => (prev === cardId ? null : cardId));
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      className={`p-5 sm:p-6 rounded-3xl border shadow-xs overflow-y-auto pb-12 space-y-6 ${className}`}
    >
      {/* Header with Title and Shastra Lens Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-800 flex-shrink-0 animate-spin-slow" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Unit &amp; Homefront Bhāva Compass
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Bhagavad Gita &amp; Patanjali YS 1.33 • Tactical Composure &amp; Emotional Equilibrium
          </p>
        </div>

        {openShastraLens && (
          <ShastraLensButton
            onClick={() => openShastraLens('chitta_prasadanam')}
            className="ml-2 flex-shrink-0"
          />
        )}
      </div>

      {/* 2-Cell Live Bhāva Telemetry Strip */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-2 gap-2 text-center text-xs shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Bhāva Score
          </span>
          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
            {chariotStatus?.bhavaScore ?? 0}/100
          </span>
        </div>

        <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Harmonized Bhāvas
          </span>
          <span className="font-extrabold text-emerald-700 font-mono text-xs sm:text-sm">
            {(todayBhavaLogs || []).length === 0
              ? '0 Logged'
              : `${positiveCount + resolvedNegCount} / ${todayBhavaLogs.length} Harmonized`}
          </span>
        </div>
      </div>

      {/* Accordion List for the 8 SENTINEL_BHAVA_CARDS */}
      <div className="space-y-3">
        {SENTINEL_BHAVA_CARDS.map((card) => {
          const isExpanded = expandedId === card.id;

          // Check positive log status
          const positiveLoggedItem = card.isPositive
            ? todayBhavaLogs?.find(
                (l) =>
                  (l.cardId === card.id || l.id === card.id) &&
                  (l.isPositive || l.interactionType === 'positive_buffer')
              )
            : undefined;
          const isPositiveActive = Boolean(positiveLoggedItem);

          // Check negative log status
          const negativeLoggedItem = !card.isPositive
            ? todayBhavaLogs?.find(
                (l) =>
                  (l.cardId === card.id || l.id === card.id) &&
                  !l.isPositive &&
                  l.interactionType !== 'positive_buffer'
              )
            : undefined;
          const isEncountered = Boolean(negativeLoggedItem);
          const isCardResolved = Boolean(negativeLoggedItem?.isResolved);

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all duration-300 shadow-2xs ${
                isExpanded
                  ? card.isPositive
                    ? isPositiveActive
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                      : 'border-green-300 bg-green-50/20 shadow-xs'
                    : isEncountered && isCardResolved
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                      : isEncountered
                        ? 'border-amber-400 bg-amber-50/20 shadow-xs'
                        : 'border-orange-300 bg-orange-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Accordion Card Header / Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggleExpand(card.id)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
                aria-expanded={isExpanded}
              >
                <div className="flex flex-col space-y-1 pr-3 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {card.sanskritTrait}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {/* Status Badge */}
                  {card.isPositive ? (
                    isPositiveActive ? (
                      <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                        Buffer Logged
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                        Positive Buffer
                      </span>
                    )
                  ) : isEncountered && !isCardResolved ? (
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                      Unresolved Friction
                    </span>
                  ) : isEncountered && isCardResolved ? (
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                      Resolved
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-orange-100 text-orange-900 border border-orange-200 shadow-2xs">
                      Negative Friction
                    </span>
                  )}

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                      isExpanded
                        ? card.isPositive
                          ? 'rotate-180 text-emerald-700'
                          : 'rotate-180 text-orange-700'
                        : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Content Shell with Smooth Max-Height Animation */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-2 pb-5 border-t border-slate-100/90">
                  {/* POSITIVE CARD: Appreciation message and Action Button */}
                  {card.isPositive && (
                    <div className="space-y-3">
                      {card.appreciationMessage && (
                        <div className="bg-green-50/90 border border-green-200/90 rounded-2xl p-4 sm:p-5 text-green-900 shadow-2xs space-y-2">
                          <div className="flex items-center gap-2 text-green-800 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-green-600" />
                            <span>Appreciation &amp; Camaraderie Buffer</span>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed text-green-800 font-serif italic">
                            &ldquo;{card.appreciationMessage}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Full-width action button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePositiveBhava(card);
                        }}
                        className={`w-full py-3 px-4 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] ${
                          isPositiveActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm'
                        }`}
                      >
                        {isPositiveActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">Positive Buffer Logged (+20)</span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-emerald-100">Tap to undo</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                            <span>Log Positive Buffer (+20 Bhāva Surplus)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* NEGATIVE CARD: Explanation, Action Steps, and Controls */}
                  {!card.isPositive && (
                    <div className="space-y-4 pt-1">
                      {/* Explanation of what they are experiencing */}
                      {card.explanationText && (
                        <div className="space-y-1.5">
                          <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                            Operational Context &amp; Shastra Reflection:
                          </h4>
                          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                            {card.explanationText}
                          </div>
                        </div>
                      )}

                      {/* Action Steps Bulleted List */}
                      {card.actionSteps && card.actionSteps.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                            Actionable Antidotes:
                          </h4>
                          <ul className="space-y-2">
                            {card.actionSteps.map((step, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 flex-shrink-0" />
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Explicit Negative Card Controls */}
                      {!isEncountered && (
                        // Case 1: Card is expanded for reading, not yet logged today
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              logNegativeBhavaEncounter(card);
                            }}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <AlertTriangle className="w-4 h-4 text-white" />
                            <span>I Am Experiencing This Friction</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNegativeBhavaResolution(card);
                            }}
                            className="flex-1 py-3 px-4 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-[#D97706] hover:bg-[#B45309] text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">Practiced Antidote</span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-amber-100">Mark resolved</span>
                            </div>
                          </button>
                        </div>
                      )}

                      {isEncountered && !isCardResolved && (
                        // Case 2: Currently experiencing unresolved friction
                        <div className="space-y-3 pt-1">
                          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2 shadow-2xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              Active Unresolved Friction — Pulling Composure Score down. Practice the antidotes above, then mark resolved.
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNegativeBhavaResolution(card);
                              }}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] bg-[#D97706] hover:bg-[#B45309] text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>✓ Mark as Resolved (Restore Sattva)</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearBhavaCardToday(card.id);
                              }}
                              className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                              title="Undo / Remove from today's logs"
                            >
                              Undo / Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {isEncountered && isCardResolved && (
                        // Case 3: Friction resolved
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNegativeBhavaResolution(card);
                            }}
                            className="flex-1 py-3 px-4 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                            <div className="flex flex-col text-center leading-tight">
                              <span className="font-bold text-xs sm:text-sm">Intellect Resolved</span>
                              <span className="text-[10px] sm:text-[11px] font-normal text-emerald-100">Tap to reopen</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearBhavaCardToday(card.id);
                            }}
                            className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                            title="Clear from today's logs"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Responsible-Use & Crisis Safeguard Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Operational Care &amp; Responsible Use Safeguard</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          These Bhagavad Gita reflections are philosophical companions for daily composure—they never replace medical or trauma-informed care, and you should never feel pressured to endure severe distress in silence. If you or a unit mate are experiencing persistent trauma symptoms, severe depression, or thoughts of self-harm, please reach out immediately to your Unit Buddy, Regimental Medical Officer (RMO), Mansik Sahayata Helpline, or Tele-MANAS (Dial 14416 — 24x7 free, confidential national support).
        </p>
      </div>
    </div>
  );
};

export default SentinelCompass;
