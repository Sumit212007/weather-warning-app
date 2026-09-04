import type { DailyForecast } from "../types/weather";
import { getWeatherInfo } from "../services/weatherApi";

interface Props {
  day: DailyForecast;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ForecastCard({ day }: Props) {
  const { icon, label } = getWeatherInfo(day.weatherCode);
  const date = new Date(day.date + "T12:00:00");
  const dayName = DAY_NAMES[date.getDay()];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{dayName}</p>
      <span className="text-3xl" role="img" aria-label={label}>{icon}</span>
      <p className="text-xs text-slate-400 text-center leading-tight">{label}</p>
      <div className="flex gap-2 items-baseline mt-auto">
        <span className="text-slate-800 font-bold text-sm">{day.maxTemp}°</span>
        <span className="text-slate-400 text-xs">{day.minTemp}°</span>
      </div>
      {day.precipitationProbability > 0 && (
        <p className="text-xs text-sky-500 font-medium">💧 {day.precipitationProbability}%</p>
      )}
    </div>
  );
}
