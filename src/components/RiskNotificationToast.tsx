import type { LandslideRiskData } from "../types/risk";
import { normalizeRiskLevel, buildFactualAlertReason } from "../utils/riskUtils";

interface Props {
  data: LandslideRiskData;
  cityName: string;
  onDismiss: () => void;
}

export default function RiskNotificationToast({ data, cityName, onDismiss }: Props) {
  const level = normalizeRiskLevel(data.risk.level);

  if (level === "LOW" || level === "VERY HIGH") {
    return null; // LOW gets no notification; VERY HIGH gets the emergency modal
  }

  const { headline } = buildFactualAlertReason(data);

  const isHigh = level === "HIGH";

  return (
    <div
      className={`w-full max-w-lg rounded-2xl border shadow-md p-4 transition-all animate-fade-in ${
        isHigh
          ? "bg-orange-50 border-orange-200 text-orange-950"
          : "bg-amber-50 border-amber-200 text-amber-950"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="text-xl leading-none mt-0.5">{data.is_demo ? "🧪" : "⚠️"}</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight">
                {data.is_demo
                  ? "🧪 DEMO RISK ALERT"
                  : isHigh
                  ? "HIGH LANDSLIDE RISK"
                  : "Medium Environmental Risk"}
              </h4>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  isHigh ? "bg-orange-200 text-orange-900" : "bg-amber-200 text-amber-900"
                }`}
              >
                {cityName}
              </span>
            </div>
            <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">
              {headline ||
                (isHigh
                  ? `Environmental conditions indicate an increased landslide risk in ${cityName}. Please stay alert near vulnerable slopes.`
                  : `Some environmental conditions may increase landslide risk in ${cityName}.`)}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 text-lg leading-none p-1 rounded hover:bg-slate-200/50 transition"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
