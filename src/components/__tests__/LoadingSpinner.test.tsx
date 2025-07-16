import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies default medium size', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies small size when specified', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('applies large size when specified', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    
    const spinnerContainer = container.querySelector('.flex');
    expect(spinnerContainer).toHaveClass('custom-class');
  });

  it('has proper styling classes', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinnerContainer = container.querySelector('.flex');
    expect(spinnerContainer).toHaveClass('flex', 'items-center', 'justify-center');
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'border-b-2',
      'border-primary-600'
    );
  });

  it('combines custom className with default classes', () => {
    const { container } = render(<LoadingSpinner className="mt-4 custom-spacing" />);
    
    const spinnerContainer = container.querySelector('.flex');
    expect(spinnerContainer).toHaveClass('flex', 'items-center', 'justify-center');
    expect(spinnerContainer).toHaveClass('mt-4', 'custom-spacing');
  });

  it('matches snapshot with default size', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toMatchSnapshot();
  });
}); 