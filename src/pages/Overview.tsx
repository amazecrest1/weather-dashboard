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
import ThemeToggle from '../components/ThemeToggle';

const Overview = () => {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Bar */}
      <div className="bg-gray-800 dark:bg-gray-950 text-white py-3 px-4 sm:px-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="font-bold text-sm sm:text-base">Weather</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm opacity-90 hidden sm:block">Overview</div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Left Vertical Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col items-center py-4">
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
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Overview Header */}
          <div className="flex items-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-blue-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Overview</h1>
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

          {/* Charts Grid with Filters at Top */}
          {!loading && !error && weatherData && (
            <div className="space-y-4 sm:space-y-6">
              {/* Filters Row - Stacked on mobile, side by side on tablet/desktop, half width on desktop */}
              <div className="w-full sm:w-1/2 mb-6 sm:mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <DateRangePicker
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                      className="w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <CitySelector
                      selectedCity={selectedCity}
                      onCityChange={setSelectedCity}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Charts Grid - 2x2 Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Temperature Chart */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm" onClick={handleTemperatureChartClick}>
                  <TemperatureChart 
                    data={temperatureData} 
                    onClick={handleTemperatureChartClick}
                  />
                </div>

                {/* Precipitation Chart */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm" onClick={handlePrecipitationChartClick}>
                  <PrecipitationChart 
                    data={precipitationData} 
                    onClick={handlePrecipitationChartClick}
                  />
                </div>

                {/* Wind Speed Chart */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm" onClick={handleWindSpeedChartClick}>
                  <WindSpeedChart 
                    data={windSpeedData} 
                    onClick={handleWindSpeedChartClick}
                  />
                </div>

                {/* Empty Cell - Always shown in 2x2 grid */}
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 flex items-center justify-center">
                  <div className="text-gray-400 dark:text-gray-500 text-center">
                    <div className="text-base sm:text-lg font-medium">Additional Chart</div>
                    <div className="text-xs sm:text-sm">Coming Soon</div>
                  </div>
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