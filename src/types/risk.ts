export type RawRiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | "MEDIUM" | "VERY HIGH";
export type NormalizedRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH";

export interface EnvironmentalBreakdown {
  rainfall_factor: number;
  soil_factor: number;
  slope_factor: number;
}

export interface RiskSummary {
  score: number;
  level: RawRiskLevel;
  recommendation: string;
  reason?: string;
  breakdown: EnvironmentalBreakdown;
}

export interface DemoInfo {
  test_alert_id?: string;
  location_name?: string;
  reason?: string;
  message?: string;
}

export interface RainfallInfo {
  source: string;
  product?: string;
  mode?: string;
  rainfall: {
    rainfall_30min_mm: number;
    rainfall_24h_mm?: number;
  };
  unit?: string;
}

export interface SoilMoistureInfo {
  source: string;
  product?: string;
  mode?: string;
  soil_moisture: {
    value: number;
    percentage: number;
    unit?: string;
  };
}

export interface TerrainInfo {
  source: string;
  product?: string;
  mode?: string;
  terrain: {
    elevation_m: number;
    slope_degrees: number;
  };
}

export interface LandslideRiskData {
  location: {
    latitude: number;
    longitude: number;
    location_name?: string;
  };
  risk: RiskSummary;
  environmental_data: {
    rainfall: RainfallInfo;
    soil_moisture: SoilMoistureInfo;
    terrain: TerrainInfo;
  };
  is_demo?: boolean;
  demo_info?: DemoInfo;
}
