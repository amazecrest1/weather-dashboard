import React, { useState } from 'react';
import { DateRange } from '../types/weather';
import { addDays, format, parseISO } from 'date-fns';
import { DateRange as RDRDateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { MAX_DATE_RANGE_DAYS } from '../constants/cities';

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
      onDateRangeChange({
        start: format(range.startDate, 'yyyy-MM-dd'),
        end: format(range.endDate, 'yyyy-MM-dd'),
      });
    }
  };

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
    </div>
  );
};

export default DateRangePicker; 