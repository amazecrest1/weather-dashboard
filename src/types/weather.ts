// Weather API response types
export interface DailyWeatherData {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  temperature_2m_mean: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  time: string[];
}

export interface HourlyWeatherData {
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation: number[];
  pressure_msl: number[];
  wind_speed_10m: number[];
  time: string[];
}

export interface WeatherApiResponse {
  daily?: DailyWeatherData;
  hourly?: HourlyWeatherData;
  daily_units?: Record<string, string>;
  hourly_units?: Record<string, string>;
}

// City type
export interface City {
  id: string;
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  isCustom?: boolean;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TemperatureChartData {
  date: string;
  max: number;
  min: number;
  mean: number;
}

export interface MultiParameterChartData {
  time: string;
  [key: string]: number | string;
}

// Filter types
export interface DateRange {
  start: string;
  end: string;
}

export interface WeatherFilters {
  city: City;
  dateRange: DateRange;
  selectedParameters?: string[];
}

// Parameter configuration
export interface ParameterConfig {
  key: string;
  label: string;
  unit: string;
  color: string;
  yAxisId?: string;
}

// API request parameters
export interface WeatherApiParams {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  daily?: string;
  hourly?: string;
  timezone?: string;
} 