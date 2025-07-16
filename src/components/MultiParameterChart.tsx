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
  
  // Debug: Log the current theme
  console.log('Current theme:', theme);
  console.log('Document classes:', document.documentElement.classList.toString());
  
  const getParameterConfig = (key: string): ParameterConfig | undefined => {
    return HOURLY_PARAMETERS.find(p => p.key === key);
  };

  const hasDualAxis = selectedParameters.length === 2;
  const param1 = getParameterConfig(selectedParameters[0]);
  const param2 = getParameterConfig(selectedParameters[1]);

  // Determine Y-axis assignment
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
    // Only show tooltip if we have valid data
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
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Hourly Weather Parameters
      </h3>
      <div 
        ref={chartRef}
        className={`rounded-lg p-4 relative ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}
      >
        <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          key={`chart-${selectedParameters.join('-')}-${data.length}`}
          onMouseMove={handleChartMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} 
          />
          <XAxis 
            dataKey="time" 
            tick={{ 
              fontSize: 12, 
              fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' 
            }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
            stroke={theme === 'dark' ? '#6B7280' : '#D1D5DB'}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={{ 
              fontSize: 12, 
              fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' 
            }}
            stroke={theme === 'dark' ? '#6B7280' : '#D1D5DB'}
            label={{ 
              value: param1 ? `${param1.label} (${param1.unit})` : '', 
              angle: -90, 
              position: 'insideLeft',
              fill: theme === 'dark' ? '#9CA3AF' : '#6B7280'
            }}
          />
          {useRightAxis && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ 
                fontSize: 12, 
                fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' 
              }}
              stroke={theme === 'dark' ? '#6B7280' : '#D1D5DB'}
              label={{ 
                value: param2 ? `${param2.label} (${param2.unit})` : '', 
                angle: 90, 
                position: 'insideRight',
                fill: theme === 'dark' ? '#9CA3AF' : '#6B7280'
              }}
            />
          )}
          <Legend 
            wrapperStyle={{
              color: theme === 'dark' ? '#F9FAFB' : '#111827'
            }}
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
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '8px 12px',
              color: theme === 'dark' ? '#F9FAFB' : '#111827',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
              zIndex: 1000,
              pointerEvents: 'none',
              maxWidth: '200px'
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
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            Please select at least one parameter to display the chart
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiParameterChart; 