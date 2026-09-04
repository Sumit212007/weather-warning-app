import type { LandslideRiskData } from "../types/risk";
import { normalizeRiskLevel } from "../utils/riskUtils";

interface Props {
  data: LandslideRiskData | null;
  loading: boolean;
  error: boolean;
  onOpenVeryHighModal?: () => void;
}

export default function RiskStatusCard({ data, loading, error, onOpenVeryHighModal }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 w-full">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Checking environmental risk...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 w-full">
        <div className="flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <p className="text-xs font-medium text-slate-500">
            Environmental risk information is currently unavailable.
          </p>
        </div>
      </div>
    );
  }

  const level = normalizeRiskLevel(data.risk.level);
  const score = data.risk.score;

  // Colors & badges by normalized level
  const themeMap = {
    LOW: {
      border: "border-emerald-100",
      bg: "bg-emerald-50/50",
      badgeBg: "bg-emerald-100 text-emerald-800",
      scoreColor: "text-emerald-700",
      icon: "✓",
      label: "Low Risk",
    },
    MEDIUM: {
      border: "border-amber-100",
      bg: "bg-amber-50/50",
      badgeBg: "bg-amber-100 text-amber-800",
      scoreColor: "text-amber-700",
      icon: "⚠️",
      label: "Medium Risk",
    },
    HIGH: {
      border: "border-orange-200",
      bg: "bg-orange-50/50",
      badgeBg: "bg-orange-100 text-orange-800",
      scoreColor: "text-orange-700",
      icon: "⚠️",
      label: "High Risk",
    },
    "VERY HIGH": {
      border: "border-red-200",
      bg: "bg-red-50/50",
      badgeBg: "bg-red-100 text-red-800 animate-pulse",
      scoreColor: "text-red-700",
      icon: "🚨",
      label: "Very High Risk",
    },
  };

  const theme = themeMap[level];

  return (
    <div id="risk-status-card" className={`bg-white rounded-2xl border ${theme.border} shadow-sm p-5 w-full transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">{data?.is_demo ? "🧪" : theme.icon}</span>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            Landslide Risk
            {data?.is_demo && (
              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded">
                🧪 DEMO ALERT
              </span>
            )}
          </h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${theme.badgeBg}`}>
          {theme.label}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <p className={`text-2xl font-extrabold ${theme.scoreColor}`}>
            {level}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Risk Score: <span className="font-bold text-slate-700">{score} / 100</span>
          </p>
        </div>

        {level === "VERY HIGH" && onOpenVeryHighModal && (
          <button
            onClick={onOpenVeryHighModal}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-100/70 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
          >
            🚨 View Alert Popup
          </button>
        )}
      </div>

      {/* Environmental breakdown summary */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-[10px] uppercase font-bold text-slate-400">Rainfall</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            {data.environmental_data?.rainfall?.rainfall?.rainfall_30min_mm ?? 0} mm
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-[10px] uppercase font-bold text-slate-400">Soil Wetness</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            {data.environmental_data?.soil_moisture?.soil_moisture?.percentage ?? 0}%
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-[10px] uppercase font-bold text-slate-400">Slope</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            {data.environmental_data?.terrain?.terrain?.slope_degrees ?? 0}°
          </p>
        </div>
      </div>
    </div>
  );
}
