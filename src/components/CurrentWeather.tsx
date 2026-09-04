import type { WeatherData } from "../types/weather";
import { getWeatherInfo } from "../services/weatherApi";

interface Props {
  data: WeatherData;
}

export default function CurrentWeather({ data }: Props) {
  const { location, current } = data;
  const { icon, label } = getWeatherInfo(current.weatherCode, current.isDay);
  const dayNight = current.isDay ? "Day" : "Night";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-full">
      {/* City + country */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
          {location.name}
        </h2>
        <p className="text-slate-500 text-sm font-medium mt-0.5">
          {location.country} · {dayNight}
        </p>
      </div>

      {/* Main temperature */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <span className="text-7xl leading-none" role="img" aria-label={label}>
          {icon}
        </span>
        <p className="text-6xl font-bold text-slate-800 mt-3">
          {current.temperature}°<span className="text-3xl text-slate-500">C</span>
        </p>
        <p className="text-slate-500 font-medium text-base">{label}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Feels like" value={`${current.feelsLike}°C`} icon="🌡️" />
        <Stat label="Humidity" value={`${current.humidity}%`} icon="💧" />
        <Stat label="Wind" value={`${current.windSpeed} km/h`} icon="💨" />
        <Stat label="Precipitation" value={`${current.precipitation} mm`} icon="🌧️" />
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-xl" role="img" aria-label={label}>{icon}</span>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-slate-800 font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
