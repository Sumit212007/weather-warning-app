export interface GeoLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitationProbability: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  forecast: DailyForecast[];
}
