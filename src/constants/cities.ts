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
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    latitude: 52.5200,
    longitude: 13.4050,
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    country: 'China',
    latitude: 22.3193,
    longitude: 114.1694,
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    latitude: 37.5665,
    longitude: 126.9780,
  },
  {
    id: 'beijing',
    name: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'China',
    latitude: 31.2304,
    longitude: 121.4737,
  },
  {
    id: 'moscow',
    name: 'Moscow',
    country: 'Russia',
    latitude: 55.7558,
    longitude: 37.6176,
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    latitude: 41.0082,
    longitude: 28.9784,
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    latitude: 30.0444,
    longitude: 31.2357,
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    country: 'South Africa',
    latitude: -26.2041,
    longitude: 28.0473,
  },
  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    latitude: -34.6118,
    longitude: -58.3960,
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    latitude: 49.2827,
    longitude: -123.1207,
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    id: 'houston',
    name: 'Houston',
    country: 'United States',
    latitude: 29.7604,
    longitude: -95.3698,
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'United States',
    latitude: 25.7617,
    longitude: -80.1918,
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