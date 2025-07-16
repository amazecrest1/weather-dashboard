import React, { useState, useRef, useEffect } from 'react';
import { HOURLY_PARAMETERS } from '../constants/cities';

interface ParameterSelectorProps {
  selectedParameters: string[];
  onParametersChange: (parameters: string[]) => void;
}

const ParameterSelector: React.FC<ParameterSelectorProps> = ({ selectedParameters, onParametersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (paramValue: string) => {
    if (selectedParameters.includes(paramValue)) return;
    if (selectedParameters.length < 2) {
      onParametersChange([...selectedParameters, paramValue]);
    }
  };

  const handleRemove = (paramValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onParametersChange(selectedParameters.filter((p) => p !== paramValue));
  };

  const displayText = selectedParameters.length === 0
    ? 'Select up to 2 parameters...'
    : '';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between shadow-lg hover:border-gray-300 transition-colors font-medium min-h-[56px]"
        type="button"
      >
        <div className="flex flex-wrap gap-2 items-center min-h-[24px]">
          {selectedParameters.length === 0 && (
            <span className="text-gray-500">{displayText}</span>
          )}
          {selectedParameters.map((param) => {
            const paramObj = HOURLY_PARAMETERS.find(hp => hp.key === param);
            return (
              <span
                key={param}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm shadow-sm border border-blue-200"
              >
                {paramObj?.label || param}
                <button
                  type="button"
                  className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                  onClick={e => handleRemove(param, e)}
                  tabIndex={-1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
        <span className="flex items-center justify-center ml-3">
          <svg className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <div className="py-2">
            {HOURLY_PARAMETERS.map((param) => {
              const isSelected = selectedParameters.includes(param.key);
              const isDisabled = selectedParameters.length >= 2 && !isSelected;
              return (
                <div
                  key={param.key}
                  onClick={() => !isDisabled && handleSelect(param.key)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border-r-2 border-blue-500' 
                      : isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-gray-50 text-gray-900'
                  }`}
                  style={{ opacity: isDisabled ? 0.5 : 1 }}
                >
                  <span className="font-medium">{param.label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-blue-500 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterSelector; 