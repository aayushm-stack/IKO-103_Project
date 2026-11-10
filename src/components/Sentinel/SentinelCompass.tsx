import React, { useState } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { PostingEnvironmentBar } from './PostingEnvironmentBar';
import { DeploymentEnvironment } from '../../types/shastra';
import { BhavaCardData } from '../../types/iks';
import {
  Compass,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Check,
  LifeBuoy,
} from 'lucide-react';

export interface SentinelCompassProps {
  className?: string;
}

export interface SentinelBhavaCardDef {
  id: string;
  title: string;
  sanskritTrait: string;
  isPositive: boolean;
  appreciationMessage?: string;
  getOpeningLine?: (env: DeploymentEnvironment) => string;
  buddyReflection?: string;
  scriptBox?: string;
  kitTitle?: string;
  actionSteps?: string[];
}

export const SENTINEL_COMPASS_CARDS: SentinelBhavaCardDef[] = [
  // --- 3 POSITIVE BUFFER CARDS (+20 Bhāva Surplus) ---
  {
    id: 'pos_1',
    title: 'Unit Brotherhood & Sahyog Camaraderie',
    sanskritTrait: 'Maitrī • YS 1.33',
    isPositive: true,
    appreciationMessage:
      "Checking on a tired buddy after watch, sharing tea in the mess, or covering a comrade's gear builds the quiet brotherhood that carries a unit through any posting.",
  },
  {
    id: 'pos_2',
    title: 'Quiet Pride & Steadiness Under Duty',
    sanskritTrait: 'Muditā & Sāttvika Dhṛti • BG 18.26',
    isPositive: true,
    appreciationMessage:
      'Holding your poise during a tough shift, inspection, or weather spell—without needing applause—anchors your mind in self-respect.',
  },
  {
    id: 'pos_3',
    title: 'Warm, Unarmored Connection with Home',
    sanskritTrait: 'Karuṇā & Suhṛda • BG 12.13',
    isPositive: true,
    appreciationMessage:
      'Setting down the roughness of duty before picking up the phone so your spouse, parents, or children hear your warmth is a victory of the heart.',
  },

  // --- 5 NEGATIVE FRICTION CARDS ---
  {
    id: 'neg_1',
    title: 'Homefront Helplessness & Leave-Delay Guilt',
    sanskritTrait: 'Titikṣā & Suhṛd Bridge • Bhagavad Gita 2.14',
    isPositive: false,
    getOpeningLine: (env: DeploymentEnvironment) => {
      if (env === 'high_altitude') {
        return 'When weather and snow cut you off at high altitude and someone at home falls ill, the distance feels crushing.';
      }
      if (env === 'cantonment') {
        return 'When leave is deferred due to inspections or commitments while your family is counting on you at home, guilt hits hard.';
      }
      return 'When your phone brings real-time family worries right to the border fence while duty keeps you locked on post, anyone would feel torn inside.';
    },
    buddyReflection:
      "Brother, feeling a knot in your chest right now doesn't mean you are weak—it proves how deeply you love your family. Bhagavad Gita 2.14 teaches us to endure temporary waves of separation without condemning ourselves, while taking warm, practical steps to stay connected.",
    scriptBox:
      "“I hate that duty has me pinned down here while you are carrying this alone at home. Don't worry in silence—let's handle today's step together over the phone, and I am following up on my leave window.”",
    kitTitle: 'Interactive 3-Step Homefront Bridge Checklist',
    actionSteps: [
      'Drop the self-blame: Being posted far away is a weight of the uniform, never a failure of your love.',
      'Send or speak the 2-sentence reassurance above so your family feels your warmth instead of your stress.',
      'Message one trusted relative, neighbor, or unit welfare buddy to assist physically at home today, then let your chest breathe.',
    ],
  },
  {
    id: 'neg_2',
    title: 'Swallowed Heat After Reprimand or Unfair Roster',
    sanskritTrait: 'Sthitaprajña Poise • Bhagavad Gita 2.56',
    isPositive: false,
    getOpeningLine: (env: DeploymentEnvironment) => {
      if (env === 'high_altitude') {
        return 'Inside a freezing, cramped fiberglass bunker, a sharp reprimand or unfair duty assignment stews and echoes in silence.';
      }
      if (env === 'cantonment') {
        return 'When parade-ground heat, inspection fault-finding, or working parties feel unjust, swallowing the anger leaves a bitter taste.';
      }
      return 'When sudden roster changes hand you the worst night-watch picket while others rest, internal heat spikes quickly.';
    },
    buddyReflection:
      "In uniform, you have to say 'Yes Sir' and swallow the anger on the spot. Bhagavad Gita 2.56 describes Sthitaprajña—not as suppressing your feelings like a stone, but refusing to let someone else's harshness take over your inner peace.",
    kitTitle: 'Interactive 3-Step Cooldown Kit',
    actionSteps: [
      'Separate the rank from your worth: You respected the chain of command; now evict their bad mood from your bunk tonight.',
      'Wait 15 minutes and drink water before calling home so command frustration never spills onto your family.',
      'Do 5 slow extended exhalations to clear the adrenaline from your shoulders and jaw.',
    ],
  },
  {
    id: 'neg_3',
    title: "Taking Off the 'Uniform Armor' With Loved Ones",
    sanskritTrait: 'Maitrī & Karuṇā • Bhagavad Gita 12.13',
    isPositive: false,
    getOpeningLine: (env: DeploymentEnvironment) => {
      if (env === 'high_altitude') {
        return 'Glacier survival requires hard mental toughness, but holding onto that frozen barrier during satellite phone calls leaves loved ones feeling shut out.';
      }
      if (env === 'cantonment') {
        return 'Carrying military command tones, strict timing, and fatigue into family quarters or phone calls strains the gentle warmth your loved ones need.';
      }
      return 'Staying hyper-vigilant behind wire makes you speak in short, commanding bursts—which sounds harsh to someone calling with affection from home.';
    },
    buddyReflection:
      'Months of staying hard and guarded on duty can make you sound sharp, cold, or distant when talking to your spouse, parents, or kids. Bhagavad Gita 12.13 reminds us that the highest strength preserves friendliness (Maitrī), tenderness (Karuṇā), and forgiveness.',
    kitTitle: 'Interactive 3-Step De-Armoring Kit',
    actionSteps: [
      "Before dialing home, pause for 20 seconds and tell yourself: 'My family is not my squad—I can set my armor down here.'",
      "If you snapped earlier out of watch exhaustion, repair it simply: 'I was dead tired after duty earlier, I'm sorry—I care about you.'",
      'Listen for 2 minutes without trying to bark orders or fix everything immediately.',
    ],
  },
  {
    id: 'neg_4',
    title: 'Post-Patrol Intrusive Loops & Night Alertness',
    sanskritTrait: 'Abhyāsa Mind Return • Bhagavad Gita 6.26',
    isPositive: false,
    getOpeningLine: (env: DeploymentEnvironment) => {
      if (env === 'high_altitude') {
        return 'When wind howls against the shelter and blizzard isolation deepens, old patrol memories and danger thoughts circle relentlessly.';
      }
      if (env === 'cantonment') {
        return 'Even in the peace of the lines, high-alert training memories and sudden operational worries can start pounding in your chest at 2 AM.';
      }
      return 'After stepping off a tense night border watch, ears keep straining for noises in the dark and the threat-radar refuses to power down.';
    },
    buddyReflection:
      'When you come off high-risk duty, your brain stays on threat-radar even inside a safe bunk. Bhagavad Gita 6.26 teaches gentle patience rather than self-attack: whenever the restless mind wanders into heavy memories or alertness, gently bring it back to rest.',
    kitTitle: "Interactive 3-Step 'Gear-Off, Radar-Off' Kit",
    actionSteps: [
      "When you unlace your boots, mentally tell your body: 'The next sentry has the watch; my shift is over.'",
      'Do not fight intrusive thoughts—acknowledge them quietly, then feel the physical weight of your blanket and bunk.',
      'Spend 2 minutes in the Breathing Sanctum to shift your heart rate from patrol mode to rest mode.',
    ],
  },
  {
    id: 'neg_5',
    title: 'Field Fatigue, Monotony & Heavy Emptiness',
    sanskritTrait: 'Ātma-Bandhu Self-Upliftment • Bhagavad Gita 6.5',
    isPositive: false,
    getOpeningLine: (env: DeploymentEnvironment) => {
      if (env === 'high_altitude') {
        return 'Sub-zero glacier cold, thin oxygen, and endless snow whiteout wear down the brightest spirits until everything feels completely numb.';
      }
      if (env === 'cantonment') {
        return 'Prolonged station tenure, routine fatigues, and repetitive roll-calls make days blur together into heavy emotional exhaustion.';
      }
      return 'Endless fence monotony, repetitive watch cycles, and unchanging picket posts can hollow out your motivation.';
    },
    buddyReflection:
      'When days blur together and your energy hits rock bottom, it is easy to feel empty and hard on yourself. Bhagavad Gita 6.5 gives a sacred promise: uplift yourself as your own friend and never degrade yourself—your worth is never erased by exhaustion.',
    kitTitle: 'Interactive 3-Step Zero-Pressure Bunker Reset',
    actionSteps: [
      'Drop all guilt about feeling low today—exhaustion after long service is physical, not a moral failure.',
      'Do just one tiny physical warmth action right now: sip warm water/tea, step into daylight for 3 minutes, or tidy your bunk corner.',
      "Sit beside your unit buddy for 5 minutes—you don't even have to talk about anything heavy.",
    ],
  },
];

/**
 * Maps definition into BhavaCardData expected by BrahmaPathContext.
 */
function toBhavaCardData(
  card: SentinelBhavaCardDef,
  env: DeploymentEnvironment
): BhavaCardData {
  return {
    id: card.id,
    title: card.title,
    sanskritTrait: card.sanskritTrait,
    isPositive: card.isPositive,
    appreciationMessage: card.appreciationMessage,
    explanationText: card.getOpeningLine
      ? `${card.getOpeningLine(env)} ${card.buddyReflection || ''}`
      : card.buddyReflection,
    actionSteps: card.actionSteps,
  };
}

/**
 * Mobile-first Sentinel Bhāva Compass.
 * Unit Camaraderie, Command Poise, and Homefront Warmth.
 * Upgraded with Battle-Buddy empathy, terrain adaptation, and interactive checklists.
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
    preferences,
  } = useBrahmaPath();

  const env: DeploymentEnvironment = preferences?.deploymentEnvironment ?? 'active_border';

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

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

  const toggleStepCheck = (stepKey: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const renderCard = (card: SentinelBhavaCardDef) => {
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

    const openingLine = card.getOpeningLine ? card.getOpeningLine(env) : '';
    const cardData = toBhavaCardData(card, env);

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
                  ✓ Buffer Logged
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  Positive Buffer
                </span>
              )
            ) : isEncountered && !isCardResolved ? (
              <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                Active Friction
              </span>
            ) : isEncountered && isCardResolved ? (
              <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                ✓ Resolved
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-orange-100 text-orange-900 border border-orange-200 shadow-2xs">
                Emotional Friction
              </span>
            )}

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                isExpanded
                  ? card.isPositive
                    ? 'rotate-180 text-emerald-700'
                    : 'rotate-180 text-amber-700'
                  : ''
              }`}
            />
          </div>
        </button>

        {/* Accordion Expanded Body */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3.5">
            {/* Positive Card Body */}
            {card.isPositive && (
              <>
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed font-medium">
                  {card.appreciationMessage}
                </div>

                <button
                  type="button"
                  onClick={() => togglePositiveBhava(cardData)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    isPositiveActive
                      ? 'bg-emerald-700 text-white shadow-xs hover:bg-emerald-800'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {isPositiveActive
                      ? '✓ Buffer Active Today'
                      : 'Log Positive Buffer'}
                  </span>
                </button>
              </>
            )}

            {/* Negative Friction Card Body */}
            {!card.isPositive && (
              <>
                {/* Terrain-Adaptive Opening Line */}
                {openingLine && (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-950 leading-relaxed font-medium">
                    <span className="font-bold block pb-0.5 text-amber-900">
                      Current Posting Reality:
                    </span>
                    {openingLine}
                  </div>
                )}

                {/* Sahyogi Buddy Reflection */}
                {card.buddyReflection && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Sahyogi Buddy Reflection:
                    </span>
                    <p>{card.buddyReflection}</p>
                  </div>
                )}

                {/* Dedicated 2-Sentence Script Box for neg_1 */}
                {card.scriptBox && (
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      2-Sentence Homefront Reassurance Script (Say or Text This Tonight):
                    </span>
                    <p className="italic leading-relaxed text-slate-900 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                      {card.scriptBox}
                    </p>
                  </div>
                )}

                {/* Interactive 3-Step Buddy Kit Checklist */}
                {card.actionSteps && card.actionSteps.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {card.kitTitle || 'Interactive 3-Step Buddy Kit'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Tap to check off
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {card.actionSteps.map((step, sIdx) => {
                        const stepKey = `${card.id}_step_${sIdx}`;
                        const isChecked = Boolean(checkedSteps[stepKey]);
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => toggleStepCheck(stepKey)}
                            className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                              isChecked
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-700 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && (
                                <Check className="w-3 h-3 text-white stroke-[3]" />
                              )}
                            </div>
                            <span className="text-xs leading-relaxed flex-1">
                              {step}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Log Friction, Resolve, Clear */}
                <div className="pt-2 border-t border-slate-200/70 space-y-2">
                  {!isEncountered ? (
                    <button
                      type="button"
                      onClick={() => logNegativeBhavaEncounter(cardData)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-orange-50 text-orange-900 border border-orange-300 hover:bg-orange-100 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-orange-700 flex-shrink-0" />
                      <span>Experiencing This Friction</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleNegativeBhavaResolution(cardData)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                          isCardResolved
                            ? 'bg-emerald-700 text-white shadow-xs hover:bg-emerald-800'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {isCardResolved
                            ? '✓ Friction Resolved'
                            : '✓ Mark as Resolved'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => clearBhavaCardToday(card.id)}
                        className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* ================= TOP SECTION: POSTING ENVIRONMENT BAR ================= */}
      <PostingEnvironmentBar />

      {/* ================= MASTER COMPASS CARD ================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
        className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6"
      >
        {/* Header with Title and Shastra Lens Trigger */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-800 flex-shrink-0 animate-spin-slow" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Unit &amp; Homefront Bhāva Compass
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Ground your mind in unit brotherhood, command poise, and gentle connection with home.
            </p>
          </div>

          {openShastraLens && (
            <ShastraLensButton
              onClick={() => openShastraLens('chitta_prasadanam')}
              className="ml-2 flex-shrink-0"
            />
          )}
        </div>

        {/* 3-Column Live Bhāva Telemetry Strip */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Net Balance
            </span>
            <span className="font-extrabold text-emerald-800 font-mono text-sm sm:text-base">
              {chariotStatus?.bhavaScore ?? 0}/100
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Positive Buffers
            </span>
            <span className="font-extrabold text-slate-900 font-mono text-sm sm:text-base">
              {positiveCount} Logged
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Frictions
            </span>
            <span className="font-extrabold text-amber-700 font-mono text-sm sm:text-base">
              {negativeLogs.length === 0 ? '0 Logged' : `${resolvedNegCount} of ${negativeLogs.length} Resolved`}
            </span>
          </div>
        </div>

        {/* Accordions Container */}
        <div className="space-y-6">
          {/* SECTION 1: 3 POSITIVE BUFFER ACCORDION CARDS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Positive Buffers
              </h3>
            </div>

            <div className="space-y-3">
              {SENTINEL_COMPASS_CARDS.filter((c) => c.isPositive).map(renderCard)}
            </div>
          </div>

          {/* SECTION 2: 5 NEGATIVE FRICTION ACCORDION CARDS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Emotional Frictions &amp; Operational Grounding
              </h3>
            </div>

            <div className="space-y-3">
              {SENTINEL_COMPASS_CARDS.filter((c) => !c.isPositive).map(renderCard)}
            </div>
          </div>
        </div>

                {/* ================= STATIC SAFEGUARD & CRISIS SUPPORT CARD ================= */}
        <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-emerald-800 flex-shrink-0" />
            <h4 className="font-bold text-slate-800">
              Companion Care &amp; Urgent Support Safeguard
            </h4>
          </div>
          <p className="leading-relaxed">
            These Bhagavad Gita reflections are philosophical companions for daily steadiness—never a substitute for medical or trauma care. A soldier should never feel pressured to endure severe trauma, persistent insomnia, or depression in silence. If you or a buddy feel overwhelmed or have thoughts of self-harm, reach out immediately to your Unit Buddy, Regimental Medical Officer (RMO), Mansik Sahayata Helpline, or Tele-MANAS (Dial 14416 — 24x7 free, confidential support).
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentinelCompass;
