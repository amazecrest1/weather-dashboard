import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { MultiParameterChartData, ParameterConfig } from '../types/weather';
import { HOURLY_PARAMETERS } from '../constants/cities';
import { useTheme } from '../hooks/useTheme';

interface MultiParameterChartProps {
  data: MultiParameterChartData[];
  selectedParameters: string[];
  className?: string;
}

const MultiParameterChart = ({ 
  data, 
  selectedParameters, 
  className = '' 
}: MultiParameterChartProps) => {
  const { theme } = useTheme();
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: any } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const getParameterConfig = (key: string): ParameterConfig | undefined => {
    return HOURLY_PARAMETERS.find(p => p.key === key);
  };

  const hasDualAxis = selectedParameters.length === 2;
  const param1 = getParameterConfig(selectedParameters[0]);
  const param2 = getParameterConfig(selectedParameters[1]);

  const useRightAxis = hasDualAxis && param1 && param2 && param1.yAxisId !== param2.yAxisId;

  useEffect(() => {
    const handleMouseLeave = () => {
      setHoveredPoint(null);
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        chartElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handleChartMouseMove = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0 && e.activeCoordinate) {
      setHoveredPoint({
        x: e.activeCoordinate.x,
        y: e.activeCoordinate.y,
        data: e.activePayload[0].payload
      });
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className={`card p-2 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Hourly Weather Parameters
      </h3>
      <div 
        ref={chartRef}
        className={`rounded-xl p-1 sm:p-4 relative ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600 shadow-xl shadow-gray-900/50 backdrop-blur-sm' 
            : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-lg backdrop-blur-sm'
        }`}
        style={{ minHeight: '400px', height: '400px' }}
      >
        <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 30, right: 15, left: 10, bottom: 20 }}
          key={`chart-${selectedParameters.join('-')}-${data.length}`}
          onMouseMove={handleChartMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
            strokeOpacity={theme === 'dark' ? 0.3 : 0.5}
          />
          <XAxis 
            dataKey="time" 
            tick={{ 
              fontSize: window.innerWidth < 768 ? 7 : 12, 
              fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' 
            }}
            angle={window.innerWidth < 768 ? -90 : -45}
            textAnchor="end"
            height={window.innerWidth < 768 ? 50 : 60}
            interval="preserveStartEnd"
            stroke={theme === 'dark' ? '#4B5563' : '#D1D5DB'}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={{ 
              fontSize: window.innerWidth < 768 ? 8 : 12, 
              fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' 
            }}
            stroke={theme === 'dark' ? '#4B5563' : '#D1D5DB'}
            label={{ 
              value: param1 ? `${param1.label} (${param1.unit})` : '', 
              angle: -90, 
              position: 'insideLeft',
              fill: theme === 'dark' ? '#E5E7EB' : '#6B7280',
              fontSize: window.innerWidth < 768 ? 8 : 12
            }}
          />
          {useRightAxis && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ 
                fontSize: window.innerWidth < 768 ? 8 : 12, 
                fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' 
              }}
              stroke={theme === 'dark' ? '#6B7280' : '#D1D5DB'}
              label={{ 
                value: param2 ? `${param2.label} (${param2.unit})` : '', 
                angle: 90, 
                position: 'insideRight',
                fill: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                fontSize: window.innerWidth < 768 ? 8 : 12
              }}
            />
          )}
          <Legend 
            wrapperStyle={{
              color: theme === 'dark' ? '#F9FAFB' : '#111827',
              fontSize: window.innerWidth < 768 ? '9px' : '12px',
              paddingTop: '30px',
              marginBottom: '2px'
            }}
            verticalAlign="bottom"
            align="center"
          />
          {selectedParameters.map((paramKey, index) => {
            const config = getParameterConfig(paramKey);
            if (!config) return null;

            const yAxisId = useRightAxis && index === 1 ? 'right' : 'left';

            return (
              <Line
                key={paramKey}
                type="monotone"
                dataKey={paramKey}
                stroke={config.color}
                strokeWidth={2.5}
                name={config.label}
                yAxisId={yAxisId}
                dot={false}
                connectNulls={false}
                activeDot={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
        </ResponsiveContainer>
        
        {/* Custom Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: hoveredPoint.x + 10,
              top: hoveredPoint.y - 40,
              backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '12px 16px',
              color: theme === 'dark' ? '#F9FAFB' : '#111827',
              boxShadow: theme === 'dark' ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '12px',
              zIndex: 10,
              pointerEvents: 'none',
              maxWidth: '200px',
              backdropFilter: theme === 'dark' ? 'blur(12px)' : 'blur(8px)',
              borderWidth: '2px'
            }}
          >
            <div style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
              Time: {hoveredPoint.data.time}
            </div>
            {selectedParameters.map((paramKey) => {
              const config = getParameterConfig(paramKey);
              const value = hoveredPoint.data[paramKey];
              if (value === undefined || value === null) return null;
              return (
                <div key={paramKey} style={{ margin: '2px 0', color: config?.color }}>
                  {config?.label}: {value}{config?.unit}
                </div>
              );
            })}
          </div>
        )}
        
        {selectedParameters.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Please select at least one parameter to display the chart
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiParameterChart; 