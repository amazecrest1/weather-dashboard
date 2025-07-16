import React from 'react';
import { render } from '@testing-library/react';
import WindSpeedChart from '../WindSpeedChart';

describe('WindSpeedChart', () => {
  it('renders without crashing', () => {
    render(
      <WindSpeedChart data={[]} />
    );
  });

  it('renders chart title', () => {
    const { getByText } = render(
      <WindSpeedChart data={[]} />
    );
    expect(getByText('Windspeed')).toBeInTheDocument();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(
      <WindSpeedChart data={[]} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with data', () => {
    const mockData = [
      { date: '2024-01-01', value: 15.5 },
      { date: '2024-01-02', value: 12.3 },
      { date: '2024-01-03', value: 18.7 }
    ];
    const { container } = render(
      <WindSpeedChart data={mockData} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 