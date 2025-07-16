import { City, ParameterConfig } from '../types/weather';

// Predefined cities with coordinates
export const CITIES: City[] = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
  },
];

// Default city (New York)
export const DEFAULT_CITY = CITIES[0];

// Hourly parameter configurations for detailed insights
export const HOURLY_PARAMETERS: ParameterConfig[] = [
  {
    key: 'temperature_2m',
    label: 'Temperature',
    unit: '°C',
    color: '#ef4444',
    yAxisId: 'temperature',
  },
  {
    key: 'relative_humidity_2m',
    label: 'Relative Humidity',
    unit: '%',
    color: '#3b82f6',
    yAxisId: 'humidity',
  },
  {
    key: 'apparent_temperature',
    label: 'Apparent Temperature',
    unit: '°C',
    color: '#f59e0b',
    yAxisId: 'temperature',
  },
  {
    key: 'precipitation',
    label: 'Precipitation',
    unit: 'mm',
    color: '#06b6d4',
    yAxisId: 'precipitation',
  },
  {
    key: 'pressure_msl',
    label: 'Sea Level Pressure',
    unit: 'hPa',
    color: '#8b5cf6',
    yAxisId: 'pressure',
  },
  {
    key: 'wind_speed_10m',
    label: 'Wind Speed (10m)',
    unit: 'km/h',
    color: '#10b981',
    yAxisId: 'wind',
  },
];

// Chart colors
export const CHART_COLORS = {
  temperature: {
    max: '#ef4444',
    min: '#3b82f6',
    mean: '#f59e0b',
  },
  precipitation: '#06b6d4',
  windSpeed: '#10b981',
  humidity: '#8b5cf6',
  pressure: '#f97316',
};

// API endpoints
export const API_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

// Date range limits
export const MAX_DATE_RANGE_DAYS = 90; // 3 months

// Default date range (last 7 days)
export const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}; 