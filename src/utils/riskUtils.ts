import type { LandslideRiskData, NormalizedRiskLevel, RawRiskLevel } from "../types/risk";

export function normalizeRiskLevel(level: RawRiskLevel | NormalizedRiskLevel): NormalizedRiskLevel {
  if (level === "CRITICAL" || level === "VERY HIGH") return "VERY HIGH";
  if (level === "HIGH") return "HIGH";
  if (level === "MODERATE" || level === "MEDIUM") return "MEDIUM";
  return "LOW";
}

export function buildFactualAlertReason(data: LandslideRiskData): {
  headline: string;
  details: string[];
} {
  if (data.is_demo) {
    return {
      headline: data.demo_info?.reason || data.risk?.reason || "Heavy rainfall and high soil wetness",
      details: [
        data.demo_info?.message || data.risk?.recommendation || "Dangerous environmental conditions have been detected."
      ]
    };
  }

  const rainfall = data.environmental_data?.rainfall?.rainfall?.rainfall_30min_mm ?? 0;
  const soilPct = data.environmental_data?.soil_moisture?.soil_moisture?.percentage ?? 0;
  const slopeDeg = data.environmental_data?.terrain?.terrain?.slope_degrees ?? 0;
  const breakdown = data.risk?.breakdown;

  const factors: string[] = [];
  const details: string[] = [];

  if (rainfall >= 10 || (breakdown && breakdown.rainfall_factor >= 50)) {
    factors.push("heavy rainfall");
    details.push(`High 30-min rainfall intensity: ${rainfall} mm`);
  } else if (rainfall >= 5 || (breakdown && breakdown.rainfall_factor >= 30)) {
    factors.push("moderate rainfall");
    details.push(`30-min rainfall intensity: ${rainfall} mm`);
  }

  if (soilPct >= 65 || (breakdown && breakdown.soil_factor >= 65)) {
    factors.push("high soil wetness");
    details.push(`Topsoil moisture saturation: ${soilPct}%`);
  } else if (soilPct >= 50) {
    factors.push("elevated soil moisture");
    details.push(`Topsoil moisture saturation: ${soilPct}%`);
  }

  if (slopeDeg >= 25 || (breakdown && breakdown.slope_factor >= 50)) {
    factors.push("steep terrain conditions");
    details.push(`Terrain slope gradient: ${slopeDeg}°`);
  }

  let headline = "";
  if (factors.length === 0) {
    headline = "Environmental parameters are currently within safe baseline thresholds.";
  } else if (factors.length === 1) {
    headline = `${capitalize(factors[0])} detected in this area may increase landslide risk.`;
  } else if (factors.length === 2) {
    headline = `${capitalize(factors[0])} and ${factors[1]} are contributing to the elevated risk.`;
  } else {
    headline = `${capitalize(factors[0])}, ${factors[1]}, and ${factors[2]} indicate heightened landslide susceptibility.`;
  }

  if (details.length === 0) {
    details.push(`Rainfall: ${rainfall} mm`);
    details.push(`Soil wetness: ${soilPct}%`);
    details.push(`Slope: ${slopeDeg}°`);
  }

  return { headline, details };
}

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
