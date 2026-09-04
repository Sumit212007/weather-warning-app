import { useState, useEffect } from "react";
import type { WeatherData } from "./types/weather";
import type { LandslideRiskData, NormalizedRiskLevel } from "./types/risk";
import { geocodeCity, fetchWeather } from "./services/weatherApi";
import { fetchLandslideRisk } from "./services/riskApi";
import { normalizeRiskLevel } from "./utils/riskUtils";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import ForecastCard from "./components/ForecastCard";
import Loading from "./components/Loading";
import RiskStatusCard from "./components/RiskStatusCard";
import RiskNotificationToast from "./components/RiskNotificationToast";
import VeryHighRiskModal from "./components/VeryHighRiskModal";


type AppError = "city_not_found" | "weather_error" | null;

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>(null);

  // Landslide Risk State
  const [riskData, setRiskData] = useState<LandslideRiskData | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState(false);



  // Alert Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastDismissedFor, setToastDismissedFor] = useState<string | null>(null);
  const [shownModalKey, setShownModalKey] = useState<string | null>(null);

  async function handleSearch(city: string) {
    setLoading(true);
    setRiskLoading(true);
    setError(null);
    setRiskError(false);
    setRiskData(null);
    setIsModalOpen(false);

    try {
      // 1. Geocode City
      const location = await geocodeCity(city);
      
      // 2. Fetch Weather Data
      const weatherRes = await fetchWeather(location);
      setWeather(weatherRes);
      setLoading(false);

      // 3. Fetch Landslide & Environmental Risk from FastAPI Backend
      try {
        const riskRes = await fetchLandslideRisk(location.latitude, location.longitude);
        setRiskData(riskRes);
      } catch (err) {
        console.warn("Landslide risk API unavailable:", err);
        setRiskError(true);
      } finally {
        setRiskLoading(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(msg === "CITY_NOT_FOUND" ? "city_not_found" : "weather_error");
      setWeather(null);
      setLoading(false);
      setRiskLoading(false);
    }
  }

  // Active risk data from backend (includes demo overrides from Landslide Monitoring System)
  const activeRiskData: LandslideRiskData | null = weather ? riskData : null;

  const activeLevel: NormalizedRiskLevel | null = activeRiskData
    ? normalizeRiskLevel(activeRiskData.risk.level)
    : null;

  // Search key identifying current location + level combo
  const currentSearchKey = weather
    ? `${weather.location.name}_${weather.location.latitude}_${weather.location.longitude}_${activeLevel}`
    : "";

  // Trigger VERY HIGH popup without spamming on re-renders
  useEffect(() => {
    if (activeLevel === "VERY HIGH" && currentSearchKey && shownModalKey !== currentSearchKey) {
      setIsModalOpen(true);
      setShownModalKey(currentSearchKey);
    }
  }, [activeLevel, currentSearchKey, shownModalKey]);

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 to-slate-100 flex flex-col items-center px-4 py-10 gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Weather App</h1>
        <p className="text-slate-500 text-sm mt-1">
          Search any city for current conditions & environmental risk
        </p>
      </div>

      {/* Search */}
      <SearchBar onSearch={handleSearch} loading={loading} />



      {/* States */}
      {loading && <Loading />}

      {error === "city_not_found" && (
        <ErrorCard message="City not found. Please try another location." />
      )}

      {error === "weather_error" && (
        <ErrorCard message="Unable to fetch weather data. Please try again." />
      )}

      {!loading && weather && (
        <div className="w-full max-w-lg flex flex-col gap-4">
          {/* Current Weather Card */}
          <CurrentWeather data={weather} />

          {/* Non-blocking Risk Notification Toast (MEDIUM / HIGH) */}
          {activeRiskData && toastDismissedFor !== currentSearchKey && (
            <RiskNotificationToast
              data={activeRiskData}
              cityName={weather.location.name}
              onDismiss={() => setToastDismissedFor(currentSearchKey)}
            />
          )}

          {/* Risk Status Card (between Current Weather and 5-day Forecast) */}
          <RiskStatusCard
            data={activeRiskData}
            loading={riskLoading}
            error={riskError}
            onOpenVeryHighModal={() => setIsModalOpen(true)}
          />

          {/* 5-day forecast */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              5-Day Forecast
            </h3>
            <div className="flex gap-2">
              {weather.forecast.map((day) => (
                <ForecastCard key={day.date} day={day} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !weather && !error && (
        <div className="text-center text-slate-400 mt-8">
          <p className="text-5xl mb-4">🌍</p>
          <p className="text-sm font-medium">Enter a city to get started</p>
          <p className="text-xs text-slate-300 mt-1">Try Delhi, Dehradun, Shimla, or Kathmandu</p>
        </div>
      )}

      {/* VERY HIGH Emergency Modal / Popup */}
      {isModalOpen && activeRiskData && (
        <VeryHighRiskModal
          data={activeRiskData}
          cityName={weather?.location.name || "Selected City"}
          onClose={() => setIsModalOpen(false)}
          onViewDetails={() => {
            setIsModalOpen(false);
            const el = document.getElementById("risk-status-card");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="w-full max-w-lg bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-center">
      <p className="text-sm font-medium text-red-600">⚠️ {message}</p>
    </div>
  );
}
