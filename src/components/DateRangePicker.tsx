import React, { useState } from 'react';
import { DateRange } from '../types/weather';
import { addDays, format, parseISO } from 'date-fns';
import { DateRange as RDRDateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { MAX_DATE_RANGE_DAYS } from '../constants/cities';
import { validateDateRange, getRecommendedEndDate, includesCurrentDay } from '../utils/api';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  dateRange, 
  onDateRangeChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Convert string dates to Date objects for react-date-range
  const startDate = parseISO(dateRange.start);
  const endDate = parseISO(dateRange.end);

  // Format for display
  const displayRange = `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

  // Handle selection from calendar
  const handleSelect = (ranges: any) => {
    const range = ranges.selection;
    if (range.startDate && range.endDate) {
      const newDateRange = {
        start: format(range.startDate, 'yyyy-MM-dd'),
        end: format(range.endDate, 'yyyy-MM-dd'),
      };
      
      // Validate the date range
      const validation = validateDateRange(newDateRange.start, newDateRange.end, MAX_DATE_RANGE_DAYS);
      
      if (validation.isValid) {
        onDateRangeChange(newDateRange);
      } else {
        // Show error message (you could add a toast notification here)
        console.warn('Date range validation failed:', validation.message);
      }
    }
  };

  // Check if current selection includes today
  const hasCurrentDay = includesCurrentDay(dateRange.start, dateRange.end);
  const recommendedEndDate = getRecommendedEndDate();

  return (
    <div className={`relative flex flex-col ${className}`}>  
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between shadow-lg hover:border-gray-300 transition-colors font-medium"
        type="button"
        style={{ minHeight: 56 }}
      >
        <span className="truncate">{displayRange}</span>
        <span className="flex items-center justify-center ml-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 w-auto bg-white border border-gray-200 rounded-xl shadow-xl p-4" style={{ minWidth: 340 }}>
          <RDRDateRange
            ranges={[{
              startDate,
              endDate,
              key: 'selection',
              color: '#2563eb', // blue-600
            }]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            showMonthAndYearPickers={true}
            showDateDisplay={false}
            rangeColors={["#2563eb"]}
            months={2}
            direction="horizontal"
            maxDate={addDays(new Date(), 0)}
            minDate={addDays(new Date(), -MAX_DATE_RANGE_DAYS)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      {/* Helpful message for current day selection */}
      {hasCurrentDay && (
        <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>
              Today's data may be incomplete. For complete data, consider ending on {format(parseISO(recommendedEndDate), 'MMM d, yyyy')}.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 