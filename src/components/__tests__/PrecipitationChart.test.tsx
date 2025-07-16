import React from 'react';
import { render } from '@testing-library/react';
import PrecipitationChart from '../PrecipitationChart';

describe('PrecipitationChart', () => {
  it('renders without crashing', () => {
    render(
      <PrecipitationChart data={[]} />
    );
  });

  it('renders chart title', () => {
    const { getByText } = render(
      <PrecipitationChart data={[]} />
    );
    expect(getByText('Precipitation')).toBeInTheDocument();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(
      <PrecipitationChart data={[]} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with data', () => {
    const mockData = [
      { date: '2024-01-01', value: 5.2 },
      { date: '2024-01-02', value: 0 },
      { date: '2024-01-03', value: 12.8 }
    ];
    const { container } = render(
      <PrecipitationChart data={mockData} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 