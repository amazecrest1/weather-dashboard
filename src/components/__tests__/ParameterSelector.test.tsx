import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ParameterSelector from '../ParameterSelector';

describe('ParameterSelector', () => {
  it('renders without crashing and displays placeholder', () => {
    const { getByText } = render(
      <ParameterSelector selectedParameters={[]} onParametersChange={() => {}} />
    );
    expect(getByText('Select up to 2 parameters...')).toBeInTheDocument();
  });

  it('renders selected parameters as chips', () => {
    const { getByText } = render(
      <ParameterSelector selectedParameters={['temperature_2m']} onParametersChange={() => {}} />
    );
    expect(getByText('Temperature')).toBeInTheDocument();
  });

  it('opens dropdown on button click', () => {
    const { getByRole, getByText } = render(
      <ParameterSelector selectedParameters={[]} onParametersChange={() => {}} />
    );
    fireEvent.click(getByRole('button'));
    expect(getByText('Relative Humidity')).toBeInTheDocument();
  });

  it('matches snapshot with empty selection', () => {
    const { container } = render(
      <ParameterSelector selectedParameters={[]} onParametersChange={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with one parameter selected', () => {
    const { container } = render(
      <ParameterSelector selectedParameters={['temperature_2m']} onParametersChange={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with two parameters selected', () => {
    const { container } = render(
      <ParameterSelector selectedParameters={['temperature_2m', 'relative_humidity_2m']} onParametersChange={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 