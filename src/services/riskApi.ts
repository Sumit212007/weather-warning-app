import type { LandslideRiskData, NormalizedRiskLevel } from "../types/risk";

const BASE_URL = import.meta.env.VITE_RISK_API_URL || "https://backend-landslide-monitoring-system.onrender.com";

export async function fetchLandslideRisk(
  latitude: number,
  longitude: number
): Promise<LandslideRiskData> {
  const url = `${BASE_URL}/api/v1/landslide-risk?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error || errorJson.detail || `Server error (${response.status})`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("UNAVAILABLE");
    }
    throw error;
  }
}

/**
 * Creates simulated LandslideRiskData structure for Dev Test Mode testing
 */
export function createMockRiskData(
  latitude: number,
  longitude: number,
  level: NormalizedRiskLevel
): LandslideRiskData {
  let score = 18.5;
  let recommendation = "Normal conditions. Continue standard automated satellite telemetry tracking.";
  let rainfall_30min = 2.1;
  let soil_pct = 32.0;
  let slope_deg = 12.5;
  let rawLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = "LOW";

  if (level === "MEDIUM") {
    score = 38.5;
    rawLevel = "MODERATE";
    recommendation = "Continue routine monitoring. Soil wetness and slope stability are moderately elevated.";
    rainfall_30min = 6.8;
    soil_pct = 58.0;
    slope_deg = 24.0;
  } else if (level === "HIGH") {
    score = 68.0;
    rawLevel = "HIGH";
    recommendation = "Maintain heightened monitoring and issue local warning. Pre-position emergency response resources.";
    rainfall_30min = 18.4;
    soil_pct = 76.0;
    slope_deg = 34.0;
  } else if (level === "VERY HIGH") {
    score = 88.5;
    rawLevel = "CRITICAL";
    recommendation = "Immediate evacuation advisory for high-susceptibility zones. Deploy field response teams and issue emergency broadcast.";
    rainfall_30min = 32.5;
    soil_pct = 89.0;
    slope_deg = 42.0;
  }

  return {
    location: { latitude, longitude },
    risk: {
      score,
      level: rawLevel,
      recommendation,
      breakdown: {
        rainfall_factor: Math.min(100, Math.round((rainfall_30min / 15) * 100)),
        soil_factor: Math.min(100, Math.round(soil_pct)),
        slope_factor: Math.min(100, Math.round((slope_deg / 45) * 100)),
      },
    },
    environmental_data: {
      rainfall: {
        source: "NASA GPM IMERG (Simulated)",
        rainfall: { rainfall_30min_mm: rainfall_30min },
        unit: "mm",
      },
      soil_moisture: {
        source: "NASA GEOS / MERRA-2 (Simulated)",
        soil_moisture: { value: soil_pct / 100, percentage: soil_pct },
      },
      terrain: {
        source: "NASA SRTM (Simulated)",
        terrain: { elevation_m: 1450, slope_degrees: slope_deg },
      },
    },
  };
}
