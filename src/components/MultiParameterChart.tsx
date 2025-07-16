import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  
  const getParameterConfig = (key: string): ParameterConfig | undefined => {
    return HOURLY_PARAMETERS.find(p => p.key === key);
  };

  const hasDualAxis = selectedParameters.length === 2;
  const param1 = getParameterConfig(selectedParameters[0]);
  const param2 = getParameterConfig(selectedParameters[1]);

  // Determine Y-axis assignment
  const useRightAxis = hasDualAxis && param1 && param2 && param1.yAxisId !== param2.yAxisId;

  return (
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Hourly Weather Parameters
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={data}
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF'
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
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
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
              color: theme === 'dark' ? '#F9FAFB' : '#111827'
            }}
            formatter={(value: number, name: string) => {
              const config = getParameterConfig(name);
              return [
                `${value}${config?.unit || ''}`, 
                config?.label || name
              ];
            }}
            labelFormatter={(label) => `Time: ${label}`}
          />
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
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      {selectedParameters.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          Please select at least one parameter to display the chart
        </div>
      )}
    </div>
  );
};

export default MultiParameterChart; 