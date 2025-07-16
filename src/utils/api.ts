import { WeatherApiParams, WeatherApiResponse, ChartDataPoint, TemperatureChartData, MultiParameterChartData } from '../types/weather';
import { API_BASE_URL } from '../constants/cities';

// Fetch weather data from Open-Meteo Archive API
export const fetchWeatherData = async (params: WeatherApiParams): Promise<WeatherApiResponse> => {
  const url = new URL(API_BASE_URL);
  
  // Add parameters to URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Fetch daily weather data for Overview page
export const fetchDailyWeatherData = async (
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherApiResponse> => {
  const params: WeatherApiParams = {
    latitude,
    longitude,
    start_date: startDate,
    end_date: endDate,
    daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max',
    timezone: 'auto'
  };
  
  return fetchWeatherData(params);
};

// Fetch hourly weather data for Detailed Insights page
export const fetchHourlyWeatherData = async (
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherApiResponse> => {
  const params: WeatherApiParams = {
    latitude,
    longitude,
    start_date: startDate,
    end_date: endDate,
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,pressure_msl,wind_speed_10m',
    timezone: 'auto'
  };
  
  return fetchWeatherData(params);
};

// Transform daily data for temperature chart
export const transformTemperatureData = (data: WeatherApiResponse): TemperatureChartData[] => {
  if (!data.daily) return [];
  
  return data.daily.time.map((date, index) => ({
    date: formatDate(date),
    max: data.daily!.temperature_2m_max[index],
    min: data.daily!.temperature_2m_min[index],
    mean: data.daily!.temperature_2m_mean[index],
  }));
};

// Transform daily data for precipitation chart
export const transformPrecipitationData = (data: WeatherApiResponse): ChartDataPoint[] => {
  if (!data.daily) return [];
  
  return data.daily.time.map((date, index) => ({
    date: formatDate(date),
    value: data.daily!.precipitation_sum[index],
  }));
};

// Transform daily data for wind speed chart
export const transformWindSpeedData = (data: WeatherApiResponse): ChartDataPoint[] => {
  if (!data.daily) return [];
  
  return data.daily.time.map((date, index) => ({
    date: formatDate(date),
    value: data.daily!.wind_speed_10m_max[index],
  }));
};

// Transform hourly data for detailed insights
export const transformHourlyData = (
  data: WeatherApiResponse,
  selectedParameters: string[]
): MultiParameterChartData[] => {
  if (!data.hourly || selectedParameters.length === 0) return [];
  
  return data.hourly.time.map((time, index) => {
    const dataPoint: MultiParameterChartData = {
      time: formatDateTime(time),
    };
    
    selectedParameters.forEach(param => {
      if (data.hourly && data.hourly[param as keyof typeof data.hourly]) {
        const values = data.hourly[param as keyof typeof data.hourly] as number[];
        dataPoint[param] = values[index];
      }
    });
    
    return dataPoint;
  });
};

// Format date for display (YYYY-MM-DD to MMM DD)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Format datetime for display (YYYY-MM-DDTHH:mm to MMM DD HH:mm)
export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate date difference in days
export const getDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get minimum allowed date (90 days ago)
export const getMinimumDate = (maxDaysBack: number = 90): string => {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - maxDaysBack);
  return minDate.toISOString().split('T')[0];
};

// Validate date range
export const validateDateRange = (startDate: string, endDate: string, maxDays: number): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  const minAllowedDate = new Date(getMinimumDate(90));
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  
  // Check if start date is before end date
  if (start >= end) {
    return false;
  }
  
  // Check if dates are not in the future
  if (start > today || end > today) {
    return false;
  }
  
  // Check if dates are not older than 90 days
  if (start < minAllowedDate || end < minAllowedDate) {
    return false;
  }
  
  // Check if date range is within limits
  if (getDaysDifference(startDate, endDate) > maxDays) {
    return false;
  }
  
  return true;
}; 