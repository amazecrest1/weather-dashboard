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
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            Windspeed
          </h3>
        </div>
      </div>
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 30 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
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
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ 
                value: 'Wind Speed (km/h)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              cursor={{ stroke: '#D1D5DB', strokeWidth: 1, strokeDasharray: '3 3' }}
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