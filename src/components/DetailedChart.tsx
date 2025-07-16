import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MultiParameterChartData } from '../types/weather';

interface DetailedChartProps {
  data: MultiParameterChartData[];
  parameters: string[];
}

const PARAMETER_CONFIG: { [key: string]: { color: string; unit: string; label: string } } = {
  temperature_2m: { color: '#FFD700', unit: '°C', label: 'Temperature' },
  relative_humidity_2m: { color: '#8884d8', unit: '%', label: 'Relative Humidity' },
  apparent_temperature: { color: '#ff7300', unit: '°C', label: 'Apparent Temperature' },
  precipitation: { color: '#82ca9d', unit: 'mm', label: 'Precipitation' },
  pressure_msl: { color: '#A52A2A', unit: 'hPa', label: 'Sea Level Pressure' },
  wind_speed_10m: { color: '#00BFFF', unit: 'km/h', label: 'Wind Speed' },
};

const getLabelFontSize = (label: string) => (label.length > 20 ? 10 : 12);

const DetailedChart: React.FC<DetailedChartProps> = ({ data, parameters }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 80,
          left: 80,
          bottom: 8,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis
          dataKey="time"
          stroke="#ccc"
          tick={{ fill: '#ccc' }}
          tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />
        <YAxis
          yAxisId="left"
          stroke={PARAMETER_CONFIG[parameters[0]]?.color || '#ccc'}
          tick={{ fill: PARAMETER_CONFIG[parameters[0]]?.color || '#ccc', fontSize: 12 }}
          label={{
            value: `${PARAMETER_CONFIG[parameters[0]]?.label || parameters[0]} (${PARAMETER_CONFIG[parameters[0]]?.unit || ''})`,
            angle: -90,
            position: 'outsideLeft',
            fill: PARAMETER_CONFIG[parameters[0]]?.color || '#ccc',
            style: { textAnchor: 'middle', fontSize: getLabelFontSize(`${PARAMETER_CONFIG[parameters[0]]?.label || parameters[0]} (${PARAMETER_CONFIG[parameters[0]]?.unit || ''})`) },
            offset: -5
          }}
        />
        {parameters.length > 1 && (
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={PARAMETER_CONFIG[parameters[1]]?.color || '#ccc'}
            tick={{ fill: PARAMETER_CONFIG[parameters[1]]?.color || '#ccc', fontSize: 12 }}
            label={{
              value: `${PARAMETER_CONFIG[parameters[1]]?.label || parameters[1]} (${PARAMETER_CONFIG[parameters[1]]?.unit || ''})`,
              angle: 90,
              position: 'outsideRight',
              fill: PARAMETER_CONFIG[parameters[1]]?.color || '#ccc',
              style: { textAnchor: 'middle', fontSize: getLabelFontSize(`${PARAMETER_CONFIG[parameters[1]]?.label || parameters[1]} (${PARAMETER_CONFIG[parameters[1]]?.unit || ''})`) },
              offset: -5
            }}
          />
        )}
        <Tooltip
          contentStyle={{ backgroundColor: '#222', border: '1px solid #555' }}
          labelStyle={{ color: '#eee' }}
        />
        <Legend wrapperStyle={{ color: '#ccc', paddingTop: '20px' }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={parameters[0]}
          stroke={PARAMETER_CONFIG[parameters[0]]?.color || '#ccc'}
          strokeWidth={2.5}
          dot={false}
          name={`${PARAMETER_CONFIG[parameters[0]]?.label || parameters[0]} (${PARAMETER_CONFIG[parameters[0]]?.unit || ''})`}
        />
        {parameters.length > 1 && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={parameters[1]}
            stroke={PARAMETER_CONFIG[parameters[1]]?.color || '#ccc'}
            strokeWidth={2.5}
            dot={false}
            name={`${PARAMETER_CONFIG[parameters[1]]?.label || parameters[1]} (${PARAMETER_CONFIG[parameters[1]]?.unit || ''})`}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DetailedChart;
