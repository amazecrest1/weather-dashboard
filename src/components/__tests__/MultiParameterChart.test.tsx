import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiParameterChart from '../MultiParameterChart';

// Mock useTheme hook
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));

jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ name }: { name: string }) => <div data-testid={`line-${name}`}>{name}</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe('MultiParameterChart', () => {
  const mockData = [
    { time: '2024-01-01T00:00', temperature_2m: 10, wind_speed_10m: 5 },
    { time: '2024-01-01T01:00', temperature_2m: 12, wind_speed_10m: 6 },
  ];

  it('renders with one parameter', () => {
    render(<MultiParameterChart data={mockData} selectedParameters={['temperature_2m']} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders with two parameters', () => {
    render(<MultiParameterChart data={mockData} selectedParameters={['temperature_2m', 'wind_speed_10m']} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('y-axis').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<MultiParameterChart data={[]} selectedParameters={['temperature_2m']} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('matches snapshot with one parameter', () => {
    const { container } = render(<MultiParameterChart data={mockData} selectedParameters={['temperature_2m']} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with two parameters', () => {
    const { container } = render(<MultiParameterChart data={mockData} selectedParameters={['temperature_2m', 'wind_speed_10m']} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(<MultiParameterChart data={[]} selectedParameters={['temperature_2m']} />);
    expect(container.firstChild).toMatchSnapshot();
  });
}); 