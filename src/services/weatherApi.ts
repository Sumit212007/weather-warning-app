import type { GeoLocation, WeatherData } from "../types/weather";

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function geocodeCity(city: string): Promise<GeoLocation> {
  const res = await fetch(
    `${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  if (!res.ok) throw new Error("Geocoding request failed");

  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("CITY_NOT_FOUND");
  }

  const r = data.results[0];
  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

export async function fetchWeather(location: GeoLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "precipitation",
      "weather_code",
      "is_day",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(","),
    forecast_days: "5",
    timezone: "auto",
  });

  const res = await fetch(`${WEATHER_API}?${params}`);
  if (!res.ok) throw new Error("Weather API request failed");

  const data = await res.json();
  const c = data.current;
  const d = data.daily;

  return {
    location,
    current: {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      windSpeed: Math.round(c.wind_speed_10m),
      precipitation: c.precipitation,
      weatherCode: c.weather_code,
      isDay: c.is_day,
    },
    forecast: d.time.map((date: string, i: number) => ({
      date,
      weatherCode: d.weather_code[i],
      maxTemp: Math.round(d.temperature_2m_max[i]),
      minTemp: Math.round(d.temperature_2m_min[i]),
      precipitationProbability: d.precipitation_probability_max[i],
    })),
  };
}

// Maps Open-Meteo WMO weather codes to icon emoji and label
export function getWeatherInfo(code: number, isDay = 1): { icon: string; label: string } {
  if (code === 0) return { icon: isDay ? "☀️" : "🌙", label: isDay ? "Clear Sky" : "Clear Night" };
  if (code <= 2) return { icon: "🌤️", label: "Mainly Clear" };
  if (code === 3) return { icon: "☁️", label: "Overcast" };
  if (code <= 49) return { icon: "🌫️", label: "Foggy" };
  if (code <= 55) return { icon: "🌦️", label: "Drizzle" };
  if (code <= 67) return { icon: "🌧️", label: "Rain" };
  if (code <= 77) return { icon: "❄️", label: "Snow" };
  if (code <= 82) return { icon: "🌧️", label: "Rain Showers" };
  if (code <= 86) return { icon: "🌨️", label: "Snow Showers" };
  if (code <= 99) return { icon: "⛈️", label: "Thunderstorm" };
  return { icon: "🌡️", label: "Unknown" };
}
