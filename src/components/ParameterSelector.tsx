import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HOURLY_PARAMETERS } from '../constants/cities';

interface ParameterSelectorProps {
  selectedParameters: string[];
  onParametersChange: (parameters: string[]) => void;
}

const ParameterSelector: React.FC<ParameterSelectorProps> = ({ selectedParameters, onParametersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleToggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const handleRemove = (paramValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onParametersChange(selectedParameters.filter((p) => p !== paramValue));
  };

  const displayText = selectedParameters.length === 0
    ? 'Select up to 2 parameters...'
    : '';

  return (
    <div className="relative w-full" ref={dropdownRef} style={{ zIndex: 99999 }}>
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className="w-full px-4 sm:px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-left flex items-center justify-between shadow-lg dark:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 font-medium text-sm sm:text-base min-h-[56px] backdrop-blur-sm"
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
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm shadow-sm border border-blue-200 dark:border-blue-700"
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
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg dark:shadow-gray-900/50 max-h-60 overflow-y-auto backdrop-blur-sm"
          style={{ 
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 999999
          }}
        >
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
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-r-2 border-blue-500 dark:border-blue-400' 
                      : isDisabled
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default ParameterSelector; 