import React from 'react';
import { Mountain, Shield, Building2 } from 'lucide-react';
import { useBrahmaPath } from '../../context/BrahmaPathContext';
import {
  DEPLOYMENT_ENVIRONMENTS,
} from '../../data/sentinelShastraData';
import { DeploymentEnvironment } from '../../types/shastra';

export interface PostingEnvironmentBarProps {
  className?: string;
}

const TERRAIN_ICONS: Record<DeploymentEnvironment, React.ElementType> = {
  high_altitude: Mountain,
  active_border: Shield,
  cantonment: Building2,
};

/**
 * Clean, read-only depiction of the currently active Posting Terrain (Stage 2 Sentinel).
 * Portrays the user's operational deployment terrain clearly on the Features page without interactive toggles.
 * Field of focus selection is managed centrally in Settings.
 */
export const PostingEnvironmentBar: React.FC<PostingEnvironmentBarProps> = ({
  className = '',
}) => {
  const { preferences, setActiveView } = useBrahmaPath();
  const currentEnv: DeploymentEnvironment =
    preferences?.deploymentEnvironment ?? 'active_border';

  const activeEnvInfo =
    DEPLOYMENT_ENVIRONMENTS.find((e) => e.id === currentEnv) ??
    DEPLOYMENT_ENVIRONMENTS[1];

  const IconComponent = TERRAIN_ICONS[currentEnv] ?? Shield;

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Current Posting Terrain
        </span>
      </div>

      {/* Prominent Active Terrain Depiction (Read-Only) */}
      <div className="bg-emerald-50/70 border border-emerald-700/20 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-700/20 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
          <IconComponent className="w-5 h-5 text-emerald-800" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {activeEnvInfo.label}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeEnvInfo.summary}
          </p>
        </div>
      </div>

      {/* Bottom Context & Navigation Hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 border-t border-slate-100">
        <span>Adapts all tactical triggers, micro-swaps, and sleep protocols</span>
        <button
          type="button"
          onClick={() => setActiveView('settings')}
          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
        >
          Change in Settings &rarr;
        </button>
      </div>
    </div>
  );
};

export default PostingEnvironmentBar;
