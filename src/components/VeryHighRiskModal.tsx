import type { LandslideRiskData } from "../types/risk";
import { buildFactualAlertReason } from "../utils/riskUtils";

interface Props {
  data: LandslideRiskData;
  cityName: string;
  onClose: () => void;
  onViewDetails: () => void;
}

export default function VeryHighRiskModal({ data, cityName, onClose, onViewDetails }: Props) {
  const { headline, details } = buildFactualAlertReason(data);
  const score = data.risk?.score ?? 88;
  const recommendation =
    data.risk?.recommendation ||
    "Immediate evacuation advisory for high-susceptibility zones. Stay alert and avoid vulnerable slopes.";

  const rainfallVal = data.environmental_data?.rainfall?.rainfall?.rainfall_30min_mm ?? 0;
  const soilPct = data.environmental_data?.soil_moisture?.soil_moisture?.percentage ?? 0;
  const slopeDeg = data.environmental_data?.terrain?.terrain?.slope_degrees ?? 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl border border-red-100 shadow-2xl max-w-md w-full overflow-hidden transition-all transform scale-100">
        {/* Top danger banner */}
        <div className={`${data.is_demo ? "bg-amber-600" : "bg-red-600"} px-6 py-5 text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">{data.is_demo ? "🧪" : "🚨"}</span>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${data.is_demo ? "bg-amber-800/80" : "bg-red-800/80"} px-2 py-0.5 rounded`}>
                {data.is_demo ? "🧪 DEMO ALERT" : "Emergency Alert"}
              </span>
              <h3 className="text-lg font-black tracking-tight leading-tight mt-0.5">
                VERY HIGH LANDSLIDE RISK
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-100 hover:text-white text-2xl font-bold p-1 rounded-lg hover:bg-red-700/50 transition leading-none"
            aria-label="Close alert"
          >
            ×
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-4 text-slate-800">
          {data.is_demo && (
            <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl text-amber-950 text-xs font-semibold leading-relaxed">
              🧪 <strong>DEMO ALERT:</strong> This is a simulated development alert configured in Risk Alert Test Control.
            </div>
          )}

          {/* Affected Location & Risk Score */}
          <div className="flex items-center justify-between bg-red-50/70 border border-red-100 p-3.5 rounded-2xl">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                Location
              </p>
              <p className="text-base font-extrabold text-slate-800 leading-tight">
                {cityName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                Risk Score
              </p>
              <p className="text-2xl font-black text-red-600 leading-none mt-0.5">
                {score} <span className="text-xs text-red-400 font-semibold">/ 100</span>
              </p>
            </div>
          </div>

          {/* Factual Alert Headline */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Alert Summary
            </h4>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {headline}
            </p>
          </div>

          {/* Environmental breakdown stats */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Environmental Conditions
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Rainfall</p>
                <p className="text-sm font-extrabold text-sky-700 mt-0.5">{rainfallVal} mm</p>
                <p className="text-[9px] text-slate-400">30-min slice</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Soil Wetness</p>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">{soilPct}%</p>
                <p className="text-[9px] text-slate-400">Topsoil sat.</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Slope</p>
                <p className="text-sm font-extrabold text-slate-700 mt-0.5">{slopeDeg}°</p>
                <p className="text-[9px] text-slate-400">DEM gradient</p>
              </div>
            </div>
          </div>

          {/* Backend Recommendation */}
          <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-2xl text-xs text-amber-900 leading-relaxed">
            <p className="font-bold text-amber-950 mb-0.5">⚠️ Advisory Recommendation:</p>
            {recommendation}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onViewDetails}
              className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition text-center"
            >
              View Risk Details
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
