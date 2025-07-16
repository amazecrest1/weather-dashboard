import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CitySelector from '../CitySelector';
import { CITIES } from '../../constants/cities';

describe('CitySelector', () => {
  const mockOnCityChange = jest.fn();
  const defaultProps = {
    selectedCity: CITIES[0],
    onCityChange: mockOnCityChange,
    customCities: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the city dropdown button with selected city', () => {
    render(<CitySelector {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('New York');
    expect(button).toHaveTextContent('United States');
  });

  it('shows dropdown options when button is clicked', () => {
    render(<CitySelector {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('All Cities Selected')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('calls onCityChange when a city is selected', () => {
    render(<CitySelector {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    // Find the city option by label, then click it
    const londonOption = screen.getByText('London');
    expect(londonOption).toBeInTheDocument();
    // Optionally, check its country is rendered as a sibling
    const country = londonOption.parentElement?.querySelector('.text-sm');
    expect(country).toHaveTextContent('United Kingdom');
    fireEvent.click(londonOption);
    expect(mockOnCityChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'London', country: 'United Kingdom' })
    );
  });

  it('calls onCityChange when All Cities Selected is chosen', () => {
    render(<CitySelector {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    const allCitiesOption = screen.getByText('All Cities Selected');
    expect(allCitiesOption).toBeInTheDocument();
    fireEvent.click(allCitiesOption);
    expect(mockOnCityChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'all-cities' })
    );
  });

  it('applies custom className', () => {
    render(<CitySelector {...defaultProps} className="custom-class" />);
    // The outermost wrapper should have the class
    const wrapper = screen.getByRole('button').closest('div.relative.flex.flex-col');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('matches snapshot with default state', () => {
    const { container } = render(<CitySelector {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with dropdown open', () => {
    const { container } = render(<CitySelector {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with different selected city', () => {
    const { container } = render(
      <CitySelector 
        selectedCity={CITIES[1]} 
        onCityChange={mockOnCityChange} 
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 