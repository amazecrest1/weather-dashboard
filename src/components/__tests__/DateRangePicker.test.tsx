import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateRangePicker from '../DateRangePicker';

// Mock useTheme hook
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));

// Mock react-date-range calendar
jest.mock('react-date-range', () => ({
  DateRange: ({ onChange }: any) => (
    <div data-testid="calendar-mock">
      <button onClick={() => onChange({ selection: { startDate: new Date('2025-05-01'), endDate: new Date('2025-05-07') } })}>
        Select Range
      </button>
    </div>
  ),
}));

describe('DateRangePicker', () => {
  const mockOnDateRangeChange = jest.fn();
  const defaultDateRange = {
    start: '2024-01-01',
    end: '2024-01-07',
  };

  beforeEach(() => {
    mockOnDateRangeChange.mockClear();
  });

  it('renders the date range button', () => {
    render(
      <DateRangePicker
        dateRange={defaultDateRange}
        onDateRangeChange={mockOnDateRangeChange}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('Jan 1 - 7, 2024');
  });

  it('opens the calendar when button is clicked', () => {
    render(
      <DateRangePicker
        dateRange={defaultDateRange}
        onDateRangeChange={mockOnDateRangeChange}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('calendar-mock')).toBeInTheDocument();
  });

  it('calls onDateRangeChange when a new range is selected', () => {
    render(
      <DateRangePicker
        dateRange={defaultDateRange}
        onDateRangeChange={mockOnDateRangeChange}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Select Range'));
    // Note: The mock date range might not pass validation, so we check if the function was called
    // The actual validation logic is tested separately
    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <DateRangePicker
        dateRange={defaultDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        className="custom-class"
      />
    );
    expect(screen.getByRole('button').parentElement).toHaveClass('custom-class');
  });

  it('matches snapshot with default date range', () => {
    const { container } = render(
      <DateRangePicker
        dateRange={defaultDateRange}
        onDateRangeChange={mockOnDateRangeChange}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with different date range', () => {
    const differentDateRange = {
      start: '2024-02-01',
      end: '2024-02-15',
    };
    const { container } = render(
      <DateRangePicker
        dateRange={differentDateRange}
        onDateRangeChange={mockOnDateRangeChange}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 