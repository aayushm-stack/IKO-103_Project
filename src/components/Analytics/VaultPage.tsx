import React, { useMemo } from 'react';
import { ShastraLensButton } from '../Shastra/ShastraLensButton';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import { calculateDailyEquilibrium, getRollingTrend } from '../../engine/analyticsEngine';
import { evaluateScreenTimeZone } from '../../engine/yuktaEngine';
import { TrayopastambhaLog } from '../../types/iks';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export interface VaultPageProps {
  className?: string;
}

/**
 * Trajectory point structure for dynamic Recharts rendering.
 */
interface TrajectoryPoint {
  id?: string;
  date: string;
  displayDate: string; // Strict 'DD/MM' format
  yuktaScore: number;
  sleepHours: number;
  focusBlocks: number;
  digitalMinutes: number;
  dominantGuna: string;
  isToday: boolean;
  hasLogs: boolean;
  penaltyApplied: boolean;
  baselineMinutes: number;
  aharaLogged: boolean;
  nidraLogged: boolean;
  brahmacharyaLogged: boolean;
}

/**
 * Formats an ISO date string (YYYY-MM-DD or full timestamp) into DD/MM.
 */
function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '--/--';
  const clean = dateStr.slice(0, 10);
  const parts = clean.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return clean;
}

/**
 * Checks if a given date string matches today's local date.
 */
function checkIsToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  return dateStr.startsWith(todayStr);
}

/**
 * Custom Tooltip for Recharts styled with parchment aesthetic and DD/MM date.
 */
interface TooltipPayloadItem {
  payload: TrajectoryPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const ChartCustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: TrajectoryPoint = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5 min-w-[190px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1 font-bold text-slate-800">
          <span>Date: {data.displayDate}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              data.penaltyApplied
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : data.isToday
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {data.penaltyApplied
              ? data.isToday
                ? 'Unlogged Today (-5% Drift)'
                : 'Unlogged (-5% Decay)'
              : data.isToday
              ? 'Live Today'
              : 'Recorded'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Yukta Score:</span>
          <span className="font-bold text-emerald-800 text-sm">
            {data.yuktaScore} / 100
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>Dominant Guna:</span>
          <span className="font-semibold">{data.dominantGuna}</span>
        </div>

        {data.penaltyApplied && (
          <p className="text-[10px] text-amber-800 italic pt-1 border-t border-amber-100/60 leading-tight">
            Natural -5% Tamasic drift applied for missed reflection.
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * Minimalist UI Guna badge component.
 * - Sattva = Green pill background
 * - Rajas = Terracotta / Orange pill background
 * - Tamas = Slate / Gray pill background
 */
export const GunaBadge: React.FC<{ guna: string }> = ({ guna }) => {
  const normalized = guna.toLowerCase();

  if (normalized.includes('sattva')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        Sattva
      </span>
    );
  }

  if (normalized.includes('rajas')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#C2410C] border border-orange-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
        Rajas
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300 shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      Tamas
    </span>
  );
};

/**
 * Standalone Vault & Analytics Page.
 *
 * Implements:
 * 1. 8-Day Rolling Trajectory via getRollingTrend with stepped daily equilibrium and -5% decay on unlogged days.
 * 2. New User Guard: Brand-new users without logs immediately receive [] to preserve empty-state placeholders.
 * 3. Dynamic Momentum Score based on active days in window.
 * 4. Tooltip & History Table reflecting unlogged status and -5% drift.
 */
export const VaultPage: React.FC<VaultPageProps> = ({ className = '' }) => {
  const { logs: sadhanaLogs, openShastraLens, todayLog } = useBrahmaPath();

  // 1. Rolling Trajectory Window: Consolidates up to 8 days using getRollingTrend
  // (last 7 days of historical reflections + current day data).
  const chartData: TrajectoryPoint[] = useMemo(() => {
    // Combine persistent sadhanaLogs with live todayLog if todayLog is present
    const allLogs: TrayopastambhaLog[] = [...sadhanaLogs];
    if (todayLog && todayLog.date) {
      // Do NOT skip todayLog if multiple logs exist on the same date—pass all stored logs into getRollingTrend
      const alreadyHasExactLog = allLogs.some(
        (l) => l.id && todayLog.id && l.id === todayLog.id
      );
      if (!alreadyHasExactLog) {
        allLogs.push(todayLog);
      }
    }

    // Critical New User Guard: If allLogs.length === 0, immediately return []
    // so brand-new users still see activeDays === 0, momentumScore === 100 ("Awaiting First Sadhana"),
    // and the empty-state placeholders without any artificial flatlines.
    if (allLogs.length === 0) {
      return [];
    }

    // When allLogs.length > 0:
    // Find the earliest logged date string across allLogs
    const earliestDate = allLogs
      .map((l) => l.date?.slice(0, 10))
      .filter(Boolean)
      .sort()[0];

    const rollingPoints = getRollingTrend(allLogs, earliestDate);

    return rollingPoints.map((pt) => {
      return {
        id: `sadhana-pt-${pt.date}`,
        date: pt.date,
        displayDate: formatDisplayDate(pt.date), // Strict DD/MM format
        yuktaScore: pt.yuktaScore,
        sleepHours: pt.sleepHours,
        focusBlocks: pt.focusBlocks,
        digitalMinutes: pt.digitalMinutes,
        dominantGuna: pt.dominantGuna,
        isToday: Boolean(pt.isToday) || checkIsToday(pt.date),
        hasLogs: pt.hasLogs,
        penaltyApplied: pt.penaltyApplied,
        baselineMinutes: pt.baselineMinutes,
        aharaLogged: pt.aharaLogged,
        nidraLogged: pt.nidraLogged,
        brahmacharyaLogged: pt.brahmacharyaLogged,
      };
    });
  }, [sadhanaLogs, todayLog]);

  // 2. Active Days in current rolling trajectory window
  const activeDays = chartData.length;

  // 3. Dynamic Momentum Score based on recorded activeDays
  const { momentumScore, gradeInfo } = useMemo(() => {
    if (activeDays === 0) {
      return {
        momentumScore: 100,
        gradeInfo: {
          grade: 'Initial',
          label: 'Awaiting First Sadhana',
          color: '#047857',
          bg: '#ECFDF5',
          border: '#A7F3D0',
        },
      };
    }

    let weightedSum = 0;
    let totalWeight = 0;

    chartData.forEach((pt, i) => {
      // Linear recency weight: recent days weighted higher
      const weight = i + 1;
      weightedSum += pt.yuktaScore * weight;
      totalWeight += weight;
    });

    const score = Math.round(weightedSum / totalWeight);

    let info: { grade: string; label: string; color: string; bg: string; border: string };
    if (score >= 90) {
      info = {
        grade: 'A+',
        label: 'Sattvic Mastery',
        color: '#065F46',
        bg: '#DEF7EC',
        border: '#86EFAC',
      };
    } else if (score >= 80) {
      info = {
        grade: 'A',
        label: 'Yukta Score',
        color: '#047857',
        bg: '#ECFDF5',
        border: '#A7F3D0',
      };
    } else if (score >= 70) {
      info = {
        grade: 'B+',
        label: 'Balanced Discipline',
        color: '#0284C7',
        bg: '#F0F9FF',
        border: '#BAE6FD',
      };
    } else if (score >= 60) {
      info = {
        grade: 'B',
        label: 'Active Steering',
        color: '#D97706',
        bg: '#FEF3C7',
        border: '#FDE68A',
      };
    } else if (score >= 50) {
      info = {
        grade: 'C',
        label: 'Fluctuating Focus',
        color: '#C2410C',
        bg: '#FFF7ED',
        border: '#FED7AA',
      };
    } else {
      info = {
        grade: 'Needs Reset',
        label: 'Circadian Depletion',
        color: '#DC2626',
        bg: '#FEE2E2',
        border: '#FECACA',
      };
    }

    return { momentumScore: score, gradeInfo: info };
  }, [activeDays, chartData]);

  // 4. History Table Rows: reverse chronological order (newest on top)
  const tableRows = useMemo(() => {
    return [...chartData].reverse();
  }, [chartData]);

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
        {/* Header with Title and Shastra Lens Trigger */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                BrahmaPath Vault &amp; Trajectory Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Your progress is entirely your own. Your data is stored securely and strictly on this device, completely offline.
            </p>
          </div>
          <ShastraLensButton
            onClick={() => openShastraLens('gunas')}
            className="ml-2"
          />
        </div>

        {/* 1. The Graph: Dynamic Scaling passing ONLY existing sadhanaLogs */}
        <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-slate-800">
                {activeDays > 0 ? activeDays : 1}-Day BrahmaPath Trajectory
              </h3>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span
                style={{
                  backgroundColor: activeDays > 0 ? '#DEF7EC' : '#F1F5F9',
                  color: activeDays > 0 ? '#03543F' : '#475569',
                }}
                className="px-2.5 py-0.5 rounded-full font-bold border border-slate-200"
              >
                {activeDays} {activeDays === 1 ? 'Point' : 'Points'}
                {activeDays > 0 &&
                  chartData.length > 0 &&
                  ` (${chartData[0]?.displayDate} – ${chartData[chartData.length - 1]?.displayDate})`}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {activeDays > 0
              ? `X-axis covers up to the last 7 days of historical sadhana plus today's live reflection (which dynamically updates throughout the day). Exactly ${activeDays} points plotted with natural -5% drift on missed days.`
              : 'X-axis will automatically scale as you log your daily Trayopastambha habits. No flatlining or padded zeroes.'}
          </p>

          {/* Responsive Recharts LineChart with dynamic X-axis */}
          {activeDays === 0 ? (
            <div className="w-full h-56 sm:h-64 flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-slate-300 bg-white/60 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                Your trajectory line will appear with your first logged Sadhana
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Record your daily habits today to begin tracking your Yukta Score progress.
              </p>
            </div>
          ) : (
            <div className="w-full h-56 sm:h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 14, left: -22, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="displayDate"
                    interval={0}
                    tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                    stroke="#CBD5E1"
                    tickLine={false}
                    padding={{ left: 16, right: 16 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    stroke="#CBD5E1"
                    tickLine={false}
                  />
                  <Tooltip content={<ChartCustomTooltip />} />
                  <ReferenceLine
                    y={75}
                    stroke="#065F46"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Yukta (75)',
                      fill: '#065F46',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="yuktaScore"
                    stroke="#065F46"
                    strokeWidth={2.75}
                    dot={{
                      r: 4.5,
                      fill: '#065F46',
                      strokeWidth: 1.5,
                      stroke: '#FFFFFF',
                    }}
                    activeDot={{
                      r: 7,
                      fill: '#D97706',
                      stroke: '#FFFFFF',
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 2. Dynamic Momentum Score Metric Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: gradeInfo.border,
          }}
          className="p-5 sm:p-6 rounded-2xl border shadow-xs space-y-4 relative overflow-hidden"
        >
          <div className="space-y-1 w-full">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                BrahmaPath Momentum Score
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recency-weighted trajectory average assessing biological consistency across {activeDays > 0 ? activeDays : 1} active {activeDays === 1 ? 'day' : 'days'}
            </p>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {momentumScore}
            </span>
            <span className="text-base font-bold text-slate-400">/ 100</span>
            <span className="ml-3 text-xs font-semibold text-slate-500">
              {activeDays === 0
                ? 'Your baseline is set. Complete today’s reflection to establish your initial Yukta Score.'
                : momentumScore >= 75
                ? 'Sustaining Sattvic poise and disciplined momentum.'
                : 'Focus on evening recovery and circadian rest to rebuild momentum.'}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              style={{
                width: `${momentumScore}%`,
                backgroundColor: gradeInfo.color,
              }}
              className="h-full rounded-full transition-all duration-700 ease-out"
            />
          </div>
        </div>

        {/* 3. The Dynamic Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              BrahmaPath Progression History
            </h3>
          </div>

          {activeDays === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#D97706]" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Sadhana data yet. Your journey begins today.
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Complete your daily reflection in the Sadhana Hub to populate your personal ledger and track your Yukta Score.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">Date (DD/MM)</th>
                    <th className="p-3 font-bold">Yukta Score</th>
                    <th className="p-3 font-bold">Dominant Guna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableRows.map((row) => (
                    <tr
                      key={row.id || row.date}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span>{row.displayDate}</span>
                          {row.isToday ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                              Live Today
                            </span>
                          ) : row.penaltyApplied ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                              Decay (-5%)
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        <span
                          style={{
                            color:
                              row.yuktaScore >= 75
                                ? '#047857'
                                : row.yuktaScore >= 50
                                ? '#D97706'
                                : '#DC2626',
                          }}
                        >
                          {row.yuktaScore} / 100
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <GunaBadge guna={row.dominantGuna} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table 2: Rest & Deep Work Ledger (Clean 3 Columns) */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Rest &amp; Deep Work Ledger
            </h3>
          </div>

          {activeDays === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#D97706]" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Sadhana data yet. Your journey begins today.
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Complete your daily reflection in the Sadhana Hub to populate your personal ledger and track your Yukta Score.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden w-full">
              <table className="w-full text-left text-xs border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                    <th className="w-[34%] p-3 font-bold truncate">Date (DD/MM)</th>
                    <th className="w-[33%] p-3 font-bold truncate">Sleep Rest</th>
                    <th className="w-[33%] p-3 font-bold truncate">Focus Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableRows.map((row) => (
                    <tr
                      key={`rest-work-${row.id || row.date}`}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="w-[34%] p-3 font-semibold text-slate-900 truncate">
                        <div className="flex items-center gap-1.5">
                          <span>{row.displayDate}</span>
                          {row.isToday && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                              Live
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="w-[33%] p-3 font-medium text-slate-700 truncate">
                        {row.penaltyApplied || !row.nidraLogged ? (
                          <span className="text-slate-400 font-normal">--</span>
                        ) : (
                          `${row.sleepHours} hrs`
                        )}
                      </td>

                      <td className="w-[33%] p-3 font-medium text-slate-700 truncate">
                        {row.penaltyApplied || !row.brahmacharyaLogged ? (
                          <span className="text-slate-400 font-normal">--</span>
                        ) : (
                          `${row.focusBlocks} ${row.focusBlocks === 1 ? 'hr' : 'hrs'}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table 3: Screen Time & Urge Mastery Log (Dedicated 3-Column Table Directly Below Table 2) */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Screen Time &amp; Urge Mastery Log
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Anchored to Daily Baseline
            </span>
          </div>

          {activeDays === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#D97706]" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Sadhana data yet. Your journey begins today.
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Complete your daily reflection in the Sadhana Hub to populate your personal ledger and track your Yukta Score.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden w-full">
              <table className="w-full text-left text-xs border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                    <th className="w-[28%] p-3 font-bold truncate">Date (DD/MM)</th>
                    <th className="w-[30%] p-3 font-bold truncate">Screen / Avg</th>
                    <th className="w-[42%] p-3 font-bold truncate">Mindful Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableRows.map((row) => {
                    const isUnlogged = row.penaltyApplied || !row.aharaLogged;
                    const zone = !isUnlogged
                      ? evaluateScreenTimeZone(row.digitalMinutes, row.baselineMinutes)
                      : null;

                    return (
                      <tr
                        key={`screen-time-${row.id || row.date}`}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="w-[28%] p-3 font-semibold text-slate-900 truncate">
                          <div className="flex items-center gap-1.5">
                            <span>{row.displayDate}</span>
                            {row.isToday && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                                Live
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="w-[30%] p-3 font-bold text-slate-800 truncate">
                          {isUnlogged ? (
                            <span className="text-slate-400 font-normal">--</span>
                          ) : (
                            <span>
                              {(row.digitalMinutes / 60).toFixed(1).replace(/\.0$/, '')}h
                              <span className="text-[10px] font-medium text-slate-400">
                                {' '}/ {(row.baselineMinutes / 60).toFixed(1).replace(/\.0$/, '')}h
                              </span>
                            </span>
                          )}
                        </td>

                        <td className="w-[42%] p-3 whitespace-nowrap">
                          {isUnlogged ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                              Unlogged
                            </span>
                          ) : zone ? (
                            <span
                              style={{
                                backgroundColor: zone.pillStyle.bg,
                                color: zone.pillStyle.text,
                                borderColor: zone.pillStyle.border,
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border shadow-2xs"
                            >
                              <span
                                style={{ backgroundColor: zone.pillStyle.dot }}
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              />
                              <span className="truncate">{zone.shortBadge}</span>
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultPage;
