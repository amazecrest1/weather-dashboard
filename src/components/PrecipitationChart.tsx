import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types/weather';

interface PrecipitationChartProps {
  data: ChartDataPoint[];
  className?: string;
  onClick?: () => void;
}

const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ data, className = '', onClick }) => {
  return (
    <div className={className}>
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-blue-200 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Precipitation
          </h3>
        </div>
      </div>
      <div style={{ width: '100%', height: '250px', minHeight: '200px' }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              label={{ 
                value: 'Precipitation (mm)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 10 },
                offset: -5
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} mm`, 'Precipitation']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, rgba(255, 255, 255, 0.95))',
                border: 'var(--tooltip-border, 1px solid #e5e7eb)',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: 'var(--tooltip-text, #374151)'
              }}
              cursor={false}
              isAnimationActive={false}
              animationDuration={0}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="#007C9E"
              radius={[5, 5, 0, 0]}
              name="Precipitation"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PrecipitationChart; 