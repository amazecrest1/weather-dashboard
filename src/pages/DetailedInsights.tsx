import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WeatherApiResponse } from '../types/weather';
import { DEFAULT_CITY, getDefaultDateRange } from '../constants/cities';
import { fetchHourlyWeatherData, transformHourlyData } from '../utils/api';
import CitySelector from '../components/CitySelector';
import DateRangePicker from '../components/DateRangePicker';
import ParameterSelector from '../components/ParameterSelector';
import MultiParameterChart from '../components/MultiParameterChart';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper functions for insights
const calculateCorrelation = (data1: number[], data2: number[]): number => {
  if (data1.length !== data2.length || data1.length === 0) return 0;
  
  const n = data1.length;
  const sum1 = data1.reduce((a, b) => a + b, 0);
  const sum2 = data2.reduce((a, b) => a + b, 0);
  const sum1Sq = data1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = data2.reduce((a, b) => a + b * b, 0);
  const pSum = data1.reduce((a, b, i) => a + b * data2[i], 0);
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
};

const getParameterLabel = (param: string): string => {
  const labels: { [key: string]: string } = {
    temperature_2m: 'Temperature',
    relative_humidity_2m: 'Relative Humidity',
    apparent_temperature: 'Apparent Temperature',
    precipitation: 'Precipitation',
    pressure_msl: 'Sea Level Pressure',
    wind_speed_10m: 'Wind Speed (10m)'
  };
  return labels[param] || param;
};

const getParameterUnit = (param: string): string => {
  const units: { [key: string]: string } = {
    temperature_2m: '°C',
    relative_humidity_2m: '%',
    apparent_temperature: '°C',
    precipitation: 'mm',
    pressure_msl: 'hPa',
    wind_speed_10m: 'km/h'
  };
  return units[param] || '';
};

const getTrendDirection = (data: number[]): string => {
  if (data.length < 2) return 'Insufficient data';
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  const percentChange = (diff / firstAvg) * 100;
  
  if (percentChange > 5) return 'Increasing';
  if (percentChange < -5) return 'Decreasing';
  return 'Stable';
};

const DetailedInsights: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state as {
    selectedParameters?: string[];
    selectedCity?: any;
    dateRange?: any;
  } | null;

  const [selectedCity, setSelectedCity] = useState(navigationState?.selectedCity || DEFAULT_CITY);
  const [dateRange, setDateRange] = useState(navigationState?.dateRange || getDefaultDateRange());
  const [selectedParameters, setSelectedParameters] = useState<string[]>(
    navigationState?.selectedParameters || ['temperature_2m']
  );
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchHourlyWeatherData(
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

  const chartData = weatherData ? transformHourlyData(weatherData, selectedParameters) : [];

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
          <div className="text-sm opacity-90">Detailed Insights</div>
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
          {/* Detailed Insights Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Detailed Insights</h1>
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded transition-colors text-sm font-medium"
            >
              ← Back to Overview
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="flex items-center gap-6 mb-4">
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
              <div className="flex-1 flex justify-end">
                <ParameterSelector
                  selectedParameters={selectedParameters}
                  onParametersChange={setSelectedParameters}
                />
              </div>
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

          {/* Chart */}
          {!loading && !error && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <MultiParameterChart
                data={chartData}
                selectedParameters={selectedParameters}
              />
            </div>
          )}

          {/* Comparison Insights */}
          {!loading && !error && selectedParameters.length === 2 && chartData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const param1 = selectedParameters[0];
                  const param2 = selectedParameters[1];
                  const param1Data = chartData.map(d => d[param1]).filter(v => typeof v === 'number') as number[];
                  const param2Data = chartData.map(d => d[param2]).filter(v => typeof v === 'number') as number[];
                  
                  // Calculate insights
                  const param1Avg = param1Data.reduce((a, b) => a + b, 0) / param1Data.length;
                  const param2Avg = param2Data.reduce((a, b) => a + b, 0) / param2Data.length;
                  const param1Max = Math.max(...param1Data);
                  const param2Max = Math.max(...param2Data);
                  const param1Min = Math.min(...param1Data);
                  const param2Min = Math.min(...param2Data);
                  
                  // Calculate correlation
                  const correlation = calculateCorrelation(param1Data, param2Data);
                  
                  return (
                    <>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Correlation Analysis</h3>
                        <div className="text-2xl font-bold text-blue-700">
                          {correlation > 0.7 ? 'Strong Positive' : 
                           correlation > 0.3 ? 'Moderate Positive' :
                           correlation > -0.3 ? 'Weak' :
                           correlation > -0.7 ? 'Moderate Negative' : 'Strong Negative'}
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                          Correlation: {correlation.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-2">Average Values</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-green-700">{getParameterLabel(param1)}:</span>
                            <span className="font-medium text-green-900">{param1Avg.toFixed(1)} {getParameterUnit(param1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-green-700">{getParameterLabel(param2)}:</span>
                            <span className="font-medium text-green-900">{param2Avg.toFixed(1)} {getParameterUnit(param2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium text-purple-900 mb-2">Peak Values</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-700">{getParameterLabel(param1)} Max:</span>
                            <span className="font-medium text-purple-900">{param1Max.toFixed(1)} {getParameterUnit(param1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-700">{getParameterLabel(param2)} Max:</span>
                            <span className="font-medium text-purple-900">{param2Max.toFixed(1)} {getParameterUnit(param2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-medium text-orange-900 mb-2">Key Insights</h3>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {correlation > 0.5 && (
                            <li>• {getParameterLabel(param1)} and {getParameterLabel(param2)} tend to increase together</li>
                          )}
                          {correlation < -0.5 && (
                            <li>• {getParameterLabel(param1)} and {getParameterLabel(param2)} have inverse relationship</li>
                          )}
                          {Math.abs(correlation) < 0.3 && (
                            <li>• {getParameterLabel(param1)} and {getParameterLabel(param2)} show little correlation</li>
                          )}
                          {param1Max > param1Avg * 1.5 && (
                            <li>• {getParameterLabel(param1)} shows significant peak values</li>
                          )}
                          {param2Max > param2Avg * 1.5 && (
                            <li>• {getParameterLabel(param2)} shows significant peak values</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-medium text-red-900 mb-2">Data Range</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-red-700">{getParameterLabel(param1)}:</span>
                            <span className="font-medium text-red-900">{param1Min.toFixed(1)} - {param1Max.toFixed(1)} {getParameterUnit(param1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-red-700">{getParameterLabel(param2)}:</span>
                            <span className="font-medium text-red-900">{param2Min.toFixed(1)} - {param2Max.toFixed(1)} {getParameterUnit(param2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="font-medium text-indigo-900 mb-2">Trend Analysis</h3>
                        <div className="text-sm text-indigo-700">
                          {param1Data.length > 10 && (
                            <div className="mb-2">
                              <div className="flex justify-between">
                                <span>{getParameterLabel(param1)} trend:</span>
                                <span className="font-medium">{getTrendDirection(param1Data)}</span>
                              </div>
                            </div>
                          )}
                          {param2Data.length > 10 && (
                            <div>
                              <div className="flex justify-between">
                                <span>{getParameterLabel(param2)} trend:</span>
                                <span className="font-medium">{getTrendDirection(param2Data)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
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

          {/* Parameter Selection Helper */}
          {selectedParameters.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Select Parameters</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please select at least one parameter to display the chart.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedInsights; 