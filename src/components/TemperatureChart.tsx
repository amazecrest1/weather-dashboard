import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TemperatureChartData } from '../types/weather';

interface TemperatureChartProps {
  data: TemperatureChartData[];
  className?: string;
  onClick?: () => void;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, className = '', onClick }) => {
  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {/* Thermometer icon */}
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C10.34 2 9 3.34 9 5v6.5c-1.21.91-2 2.37-2 3.5a5 5 0 0 0 10 0c0-1.13-.79-2.59-2-3.5V5c0-1.66-1.34-3-3-3zm-1 3h2v2h-2V5zm0 3h2v2h-2V8zm0 3h2v2h-2v-2z"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            Temperature
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
                value: 'Temperature (°C)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
                offset: -5
              }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}°C`, 
                name.charAt(0).toUpperCase() + name.slice(1) // Capitalize name for display
              ]}
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
              dataKey="max" 
              stroke="#fbbf24" // Amber 400
              strokeWidth={2.5}
              name="Maximum"
              dot={false}
              activeDot={{ r: 4, fill: '#fbbf24' }}
            />
            <Line 
              type="monotone" 
              dataKey="mean" 
              stroke="#fcd34d" // Amber 300
              strokeWidth={2.5}
              name="Average"
              dot={false}
              activeDot={{ r: 4, fill: '#fcd34d' }}
            />
            <Line 
              type="monotone" 
              dataKey="min" 
              stroke="#f59e0b" // Amber 500
              strokeWidth={2.5}
              name="Minimum"
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart; 