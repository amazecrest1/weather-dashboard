import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types/weather';

interface WindSpeedChartProps {
  data: ChartDataPoint[];
  className?: string;
  onClick?: () => void;
}

const WindSpeedChart: React.FC<WindSpeedChartProps> = ({ data, className = '', onClick }) => {
  return (
    <div className={className}>
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-teal-200 bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
            Windspeed
          </h3>
        </div>
      </div>
      <div style={{ width: '100%', height: '250px', minHeight: '200px' }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
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
                value: 'Wind Speed (km/h)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 10 },
                offset: -5
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} km/h`, 'Max Wind Speed']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long', 
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
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8BADA9"
              strokeWidth={2.5}
              name="Maximum"
              dot={false}
              activeDot={{ r: 4, fill: '#8BADA9' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WindSpeedChart; 