import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherApiResponse } from '../types/weather';
import { DEFAULT_CITY, getDefaultDateRange } from '../constants/cities';
import { fetchDailyWeatherData, transformTemperatureData, transformPrecipitationData, transformWindSpeedData } from '../utils/api';
import CitySelector from '../components/CitySelector';
import DateRangePicker from '../components/DateRangePicker';
import TemperatureChart from '../components/TemperatureChart';
import PrecipitationChart from '../components/PrecipitationChart';
import WindSpeedChart from '../components/WindSpeedChart';
import LoadingSpinner from '../components/LoadingSpinner';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchDailyWeatherData(
        selectedCity.latitude,
        selectedCity.longitude,
        dateRange.start,
        dateRange.end
      );
      setWeatherData(data);
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
      console.error('Error loading weather data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCity.latitude, selectedCity.longitude, dateRange.start, dateRange.end]);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  const temperatureData = weatherData ? transformTemperatureData(weatherData) : [];
  const precipitationData = weatherData ? transformPrecipitationData(weatherData) : [];
  const windSpeedData = weatherData ? transformWindSpeedData(weatherData) : [];

  // Navigation handlers for charts
  const handleTemperatureChartClick = () => {
    navigate('/detailed', { 
      state: { 
        selectedParameters: ['temperature_2m', 'apparent_temperature'],
        selectedCity,
        dateRange 
      }
    });
  };

  const handlePrecipitationChartClick = () => {
    navigate('/detailed', { 
      state: { 
        selectedParameters: ['precipitation'],
        selectedCity,
        dateRange 
      }
    });
  };

  const handleWindSpeedChartClick = () => {
    navigate('/detailed', { 
      state: { 
        selectedParameters: ['wind_speed_10m'],
        selectedCity,
        dateRange 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-3 px-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="font-bold">Weather</span>
          </div>
          <div className="text-sm opacity-90">Overview</div>
        </div>
      </div>
      
      <div className="flex">
        {/* Left Vertical Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7FA' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="14" width="3" height="8" rx="1.5" stroke="#00A7C4" strokeWidth="2" fill="none" />
              <rect x="14.5" y="10" width="3" height="12" rx="1.5" stroke="#00A7C4" strokeWidth="2" fill="none" />
              <rect x="21" y="6" width="3" height="16" rx="1.5" stroke="#00A7C4" strokeWidth="2" fill="none" />
              <line x1="7" y1="25.5" x2="25" y2="25.5" stroke="#00A7C4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Overview Header */}
          <div className="flex items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
          </div>
          
          {/* Filters Row - Simple Horizontal Layout */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex-1 max-w-xs">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                className="w-full"
              />
            </div>
            <div className="flex-1 max-w-xs">
              <CitySelector
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                className="w-full"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-96">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={loadWeatherData}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid - 2x2 Layout with Empty Cell */}
          {!loading && !error && weatherData && (
            <div className="grid grid-cols-2 gap-6">
              {/* Temperature Chart - Top Left */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handleTemperatureChartClick}>
                <TemperatureChart 
                  data={temperatureData} 
                  onClick={handleTemperatureChartClick}
                />
              </div>

              {/* Precipitation Chart - Top Right */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handlePrecipitationChartClick}>
                <PrecipitationChart 
                  data={precipitationData} 
                  onClick={handlePrecipitationChartClick}
                />
              </div>

              {/* Wind Speed Chart - Bottom Left */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handleWindSpeedChartClick}>
                <WindSpeedChart 
                  data={windSpeedData} 
                  onClick={handleWindSpeedChartClick}
                />
              </div>

              {/* Empty Cell - Bottom Right */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-lg font-medium">Additional Chart</div>
                  <div className="text-sm">Coming Soon</div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !weatherData && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500">No weather data available for the selected filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview; 