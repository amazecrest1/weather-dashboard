import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemperatureChart from '../TemperatureChart';
import { TemperatureChartData } from '../../types/weather';

jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ name }: { name: string }) => <div data-testid={`line-${name}`}>{name}</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe('TemperatureChart', () => {
  const mockData: TemperatureChartData[] = [
    { date: 'Jan 1', max: 10, min: 2, mean: 6 },
    { date: 'Jan 2', max: 12, min: 4, mean: 8 },
    { date: 'Jan 3', max: 8, min: 1, mean: 4 },
  ];

  it('renders chart title correctly', () => {
    render(<TemperatureChart data={mockData} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<TemperatureChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders temperature lines', () => {
    render(<TemperatureChart data={mockData} />);
    expect(screen.getByTestId('line-Maximum')).toBeInTheDocument();
    expect(screen.getByTestId('line-Minimum')).toBeInTheDocument();
    expect(screen.getByTestId('line-Average')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TemperatureChart data={mockData} className="custom-class" />);
    const wrapper = document.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders with empty data', () => {
    render(<TemperatureChart data={[]} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('matches snapshot with data', () => {
    const { container } = render(<TemperatureChart data={mockData} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(<TemperatureChart data={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with custom className', () => {
    const { container } = render(<TemperatureChart data={mockData} className="custom-class" />);
    expect(container.firstChild).toMatchSnapshot();
  });
}); 