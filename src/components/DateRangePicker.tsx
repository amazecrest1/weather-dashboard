import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DateRange } from '../types/weather';
import { addDays, format, parseISO, isToday, isYesterday, isSameDay } from 'date-fns';
import { DateRange as RDRDateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { MAX_DATE_RANGE_DAYS } from '../constants/cities';
import { validateDateRange, getRecommendedEndDate, includesCurrentDay } from '../utils/api';
import { useTheme } from '../hooks/useTheme';

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [dropdownStyle, setDropdownStyle] = useState({ 
    height: 'auto' as string, 
    maxHeight: '400px',
    calendarHeight: '350px',
    showScroll: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRange);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Force dark theme styles on calendar elements
  const applyDarkTheme = () => {
    if (theme === 'dark' && dropdownRef.current) {
      const calendarElements = dropdownRef.current.querySelectorAll('.rdrDateRangeWrapper, .rdrCalendarWrapper, .rdrMonth');
      calendarElements.forEach((element) => {
        (element as HTMLElement).style.setProperty('background-color', '#23293a', 'important');
        (element as HTMLElement).style.setProperty('color', '#F3F4F6', 'important');
        (element as HTMLElement).style.setProperty('border-radius', '18px', 'important');
        (element as HTMLElement).style.setProperty('box-shadow', '0 8px 32px 0 rgba(0,0,0,0.25)', 'important');
      });

      // Style month name
      const monthNames = dropdownRef.current.querySelectorAll('.rdrMonthName');
      monthNames.forEach((element) => {
        (element as HTMLElement).style.setProperty('color', '#e0e7ef', 'important');
        (element as HTMLElement).style.setProperty('font-weight', '600', 'important');
      });

      // Style weekdays
      const weekdays = dropdownRef.current.querySelectorAll('.rdrWeekDays');
      weekdays.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', 'transparent', 'important');
        (element as HTMLElement).style.setProperty('color', '#a3aed6', 'important');
      });

      const weekdayCells = dropdownRef.current.querySelectorAll('.rdrWeekDay');
      weekdayCells.forEach((element) => {
        (element as HTMLElement).style.setProperty('color', '#a3aed6', 'important');
      });

      // Style days
      const days = dropdownRef.current.querySelectorAll('.rdrDays');
      days.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', 'transparent', 'important');
      });

      const dayCells = dropdownRef.current.querySelectorAll('.rdrDay');
      dayCells.forEach((element) => {
        (element as HTMLElement).style.setProperty('color', '#FFFFFF', 'important');
        (element as HTMLElement).style.setProperty('border-radius', '10px', 'important');
        (element as HTMLElement).style.setProperty('font-weight', '500', 'important');
      });

      // Style day numbers specifically
      const dayNumbers = dropdownRef.current.querySelectorAll('.rdrDayNumber');
      dayNumbers.forEach((element) => {
        (element as HTMLElement).style.setProperty('color', '#FFFFFF', 'important');
        (element as HTMLElement).style.setProperty('font-weight', '600', 'important');
      });

      const dayNumberSpans = dropdownRef.current.querySelectorAll('.rdrDayNumber span');
      dayNumberSpans.forEach((element) => {
        (element as HTMLElement).style.setProperty('color', '#FFFFFF', 'important');
        (element as HTMLElement).style.setProperty('font-weight', '600', 'important');
      });

      // Style selected range
      const selectedDays = dropdownRef.current.querySelectorAll('.rdrDayInRange');
      selectedDays.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', 'rgba(139, 92, 246, 0.18)', 'important');
        (element as HTMLElement).style.setProperty('color', '#e0e7ef', 'important');
      });

      // Style start/end dates
      const startEndDays = dropdownRef.current.querySelectorAll('.rdrDayStartOfRange, .rdrDayEndOfRange');
      startEndDays.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', '#8B5CF6', 'important');
        (element as HTMLElement).style.setProperty('color', '#fff', 'important');
        (element as HTMLElement).style.setProperty('border-radius', '10px', 'important');
      });

      // Style today
      const todayCells = dropdownRef.current.querySelectorAll('.rdrDayToday');
      todayCells.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', 'transparent', 'important');
      });

      // Style navigation buttons
      const navButtons = dropdownRef.current.querySelectorAll('.rdrNextPrevButton');
      navButtons.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', '#23293a', 'important');
        (element as HTMLElement).style.setProperty('color', '#8B5CF6', 'important');
        (element as HTMLElement).style.setProperty('border-radius', '8px', 'important');
        (element as HTMLElement).style.setProperty('border', 'none', 'important');
      });

      // Style month/year wrapper
      const monthYearWrappers = dropdownRef.current.querySelectorAll('.rdrMonthAndYearWrapper');
      monthYearWrappers.forEach((element) => {
        (element as HTMLElement).style.setProperty('background', 'transparent', 'important');
        (element as HTMLElement).style.setProperty('color', '#e0e7ef', 'important');
      });
    }
  };

  // Apply dark theme when dropdown opens and ensure month/year pickers work
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure calendar is rendered
      const timer = setTimeout(() => {
        if (theme === 'dark') {
          applyDarkTheme();
        }
        
        // Ensure month/year pickers are clickable
        if (dropdownRef.current) {
          const monthPickers = dropdownRef.current.querySelectorAll('.rdrMonthPicker, .rdrYearPicker');
          monthPickers.forEach((picker) => {
            (picker as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
            (picker as HTMLElement).style.setProperty('cursor', 'pointer', 'important');
            (picker as HTMLElement).style.setProperty('z-index', '10', 'important');
          });
          
          const monthSelects = dropdownRef.current.querySelectorAll('.rdrMonthPicker select, .rdrYearPicker select');
          monthSelects.forEach((select) => {
            (select as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
            (select as HTMLElement).style.setProperty('cursor', 'pointer', 'important');
            (select as HTMLElement).style.setProperty('z-index', '10', 'important');
          });

          // Debug: Check if action buttons are visible
          const actionButtons = dropdownRef.current.querySelector('.flex.justify-end.items-center.p-3');
          if (actionButtons) {
            console.log('Action buttons found:', actionButtons);
            (actionButtons as HTMLElement).style.setProperty('position', 'relative', 'important');
            (actionButtons as HTMLElement).style.setProperty('z-index', '1000001', 'important');
            (actionButtons as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
            (actionButtons as HTMLElement).style.setProperty('background', 'inherit', 'important');
          } else {
            console.warn('Action buttons not found in dropdown');
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, theme]);

  // Convert string dates to Date objects for react-date-range
  const startDate = parseISO(dateRange.start);
  const endDate = parseISO(dateRange.end);

  // Enhanced date formatting with smart labels
  const formatDateRange = (start: Date, end: Date) => {
    const isSameYear = start.getFullYear() === end.getFullYear();
    const isSameMonth = start.getMonth() === end.getMonth();
    
    if (isSameDay(start, end)) {
      if (isToday(start)) return 'Today';
      if (isYesterday(start)) return 'Yesterday';
      return format(start, 'MMM d, yyyy');
    }
    
    if (isSameMonth && isSameYear) {
      return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
    }
    
    if (isSameYear) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const displayRange = formatDateRange(startDate, endDate);

  // Handle selection from calendar
  const handleSelect = (ranges: any) => {
    const range = ranges.selection;
    if (range.startDate && range.endDate) {
      const newDateRange = {
        start: format(range.startDate, 'yyyy-MM-dd'),
        end: format(range.endDate, 'yyyy-MM-dd'),
      };
      
      // Store the selected range but don't apply it yet
      setSelectedRange(newDateRange);
    }
  };

  // Quick selection presets
  const quickSelections = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This month', custom: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      // End date should not exceed today
      const end = new Date(Math.min(now.getTime(), new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime()));
      return { start, end };
    }},
    { label: 'Last month', custom: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start, end };
    }},
  ];

  const handleQuickSelection = async (selection: any) => {
    setIsLoading(true);
    
    let start: Date, end: Date;
    
    if (selection.custom) {
      const range = selection.custom();
      start = range.start;
      end = range.end;
      console.log('Quick selection custom:', selection.label, { start, end });
    } else {
      end = new Date();
      start = addDays(end, -selection.days + 1);
      console.log('Quick selection days:', selection.label, { start, end });
    }
    
    const newDateRange = {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    };
    
    console.log('New date range:', newDateRange);
    
    // Validate the date range
    const validation = validateDateRange(newDateRange.start, newDateRange.end, MAX_DATE_RANGE_DAYS);
    
    console.log('Validation result:', validation);
    
    if (validation.isValid) {
      setSelectedRange(newDateRange);
      await new Promise(resolve => setTimeout(resolve, 150));
      onDateRangeChange(newDateRange);
      setIsOpen(false);
    } else {
      console.warn('Date range validation failed:', validation.message);
      // Don't close dropdown on validation failure, let user see the error
    }
    
    setIsLoading(false);
  };

  // Handle Apply button click
  const handleApply = async () => {
    console.log('Apply button clicked!');
    console.log('Selected range:', selectedRange);
    
    if (selectedRange) {
      setIsLoading(true);
      
      // Validate the date range
      const validation = validateDateRange(selectedRange.start, selectedRange.end, MAX_DATE_RANGE_DAYS);
      console.log('Validation result:', validation);
      
      if (validation.isValid) {
        console.log('Applying date range:', selectedRange);
        await new Promise(resolve => setTimeout(resolve, 150));
        onDateRangeChange(selectedRange);
        setIsOpen(false);
      } else {
        console.warn('Date range validation failed:', validation.message);
        // Don't close dropdown on validation failure
      }
      
      setIsLoading(false);
    } else {
      console.warn('No selected range to apply');
    }
  };

  // Check if current selection includes today
  const hasCurrentDay = includesCurrentDay(dateRange.start, dateRange.end);
  const recommendedEndDate = getRecommendedEndDate();

  // Calculate optimal dropdown style based on available space
  const calculateDropdownStyle = (rect: DOMRect) => {
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Essential heights that must be visible
    const quickSelectionHeight = 120; // Quick selection section
    const actionButtonsHeight = 60; // Action buttons section
    const padding = 32; // Total padding
    const minRequiredHeight = quickSelectionHeight + actionButtonsHeight + padding;
    
    // Calculate available space
    const availableSpace = Math.max(spaceBelow, spaceAbove);
    
    // Always ensure action buttons are visible
    let style = {
      height: `${minRequiredHeight + 50}px`, // Minimum height to show buttons
      maxHeight: `${availableSpace - 20}px`,
      calendarHeight: '200px', // Fixed small calendar height
      showScroll: true
    };
    
    // If we have plenty of space, use normal sizing
    if (availableSpace > 450) {
      style = {
        height: 'auto',
        maxHeight: '400px',
        calendarHeight: '350px',
        showScroll: false
      };
    }
    // If we have moderate space, adjust accordingly
    else if (availableSpace > minRequiredHeight + 100) {
      const calendarHeight = availableSpace - minRequiredHeight - 50;
      style = {
        height: 'auto',
        maxHeight: `${availableSpace - 20}px`,
        calendarHeight: `${Math.max(200, calendarHeight)}px`,
        showScroll: true
      };
    }
    
    return style;
  };

  // Handle toggle dropdown with position calculation
  const handleToggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 320; // Estimated width
      
      // Calculate dynamic style
      const dynamicStyle = calculateDropdownStyle(rect);
      setDropdownStyle(dynamicStyle);
      
      // Use dynamic height for positioning
      const dropdownHeight = dynamicStyle.height === 'auto' 
        ? parseInt(dynamicStyle.maxHeight)
        : parseInt(dynamicStyle.height);
      
      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;
      const spaceLeft = rect.left;
      
      // Determine vertical position - prioritize showing action buttons
      let top: number;
      
      // Always try to position so action buttons are visible
      const actionButtonsBottom = rect.bottom + window.scrollY + dropdownHeight;
      const viewportBottom = window.scrollY + viewportHeight;
      
      if (actionButtonsBottom > viewportBottom) {
        // If action buttons would be cut off, position above
        top = rect.top + window.scrollY - dropdownHeight - 8;
        
        // If still doesn't fit above, position at top of viewport
        if (top < window.scrollY) {
          top = window.scrollY + 8;
        }
      } else {
        // Position below the button
        top = rect.bottom + window.scrollY + 8;
      }
      
      // Final safety check - ensure dropdown is within viewport
      const finalBottom = top + dropdownHeight;
      if (finalBottom > window.scrollY + viewportHeight) {
        top = window.scrollY + viewportHeight - dropdownHeight - 8;
      }
      
      // Ensure minimum top margin
      if (top < window.scrollY + 8) {
        top = window.scrollY + 8;
      }
      
      // Determine horizontal position
      let left: number;
      if (spaceRight >= dropdownWidth) {
        // Position to the right of the button
        left = rect.left + window.scrollX;
      } else if (spaceLeft >= dropdownWidth) {
        // Position to the left of the button
        left = rect.left + window.scrollX - dropdownWidth + rect.width;
      } else {
        // Center in viewport if button is too wide
        left = window.scrollX + (viewportWidth - dropdownWidth) / 2;
      }
      
      // Ensure left doesn't go outside viewport
      if (left < window.scrollX) {
        left = window.scrollX + 8;
      } else if (left + dropdownWidth > window.scrollX + viewportWidth) {
        left = window.scrollX + viewportWidth - dropdownWidth - 8;
      }
      
      setDropdownPosition({
        top: Math.max(8, top), // Ensure minimum top margin
        left: Math.max(8, left), // Ensure minimum left margin
        width: Math.min(dropdownWidth, viewportWidth - 16) // Ensure it fits in viewport
      });
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside and handle window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        // Recalculate position on window resize
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownHeight = 400; // Reduced height since calendar is now scrollable
        const dropdownWidth = 320;
        
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = viewportWidth - rect.left;
        const spaceLeft = rect.left;
        
        let top: number;
        if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
          top = rect.bottom + window.scrollY + 8;
        } else {
          top = rect.top + window.scrollY - dropdownHeight - 8;
        }
        
        if (top < window.scrollY) {
          top = window.scrollY + 8;
        }
        
        // Ensure bottom doesn't go below viewport
        const bottomPosition = top + dropdownHeight;
        if (bottomPosition > window.scrollY + viewportHeight) {
          top = window.scrollY + viewportHeight - dropdownHeight - 8;
        }
        
        let left: number;
        if (spaceRight >= dropdownWidth) {
          left = rect.left + window.scrollX;
        } else if (spaceLeft >= dropdownWidth) {
          left = rect.left + window.scrollX - dropdownWidth + rect.width;
        } else {
          left = window.scrollX + (viewportWidth - dropdownWidth) / 2;
        }
        
        if (left < window.scrollX) {
          left = window.scrollX + 8;
        } else if (left + dropdownWidth > window.scrollX + viewportWidth) {
          left = window.scrollX + viewportWidth - dropdownWidth - 8;
        }
        
        setDropdownPosition({
          top: Math.max(8, top), // Ensure minimum top margin
          left: Math.max(8, left), // Ensure minimum left margin
          width: Math.min(dropdownWidth, viewportWidth - 16)
        });
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <div className={`relative flex flex-col ${className}`}>  
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        disabled={isLoading}
        className="w-full px-4 sm:px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-left flex items-center justify-between shadow-lg dark:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 font-medium text-sm sm:text-base backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed group"
        type="button"
        style={{ minHeight: 56 }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{displayRange}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          <svg className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          data-portal="true"
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl dark:shadow-gray-900/50 backdrop-blur-sm"
          style={{ 
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            minWidth: '320px',
            maxWidth: 'calc(100vw - 32px)',
            height: dropdownStyle.height,
            maxHeight: dropdownStyle.maxHeight,
            zIndex: 999999,
            transform: 'translateZ(0)',
            position: 'fixed',
            pointerEvents: 'auto',
            overflow: dropdownStyle.showScroll ? 'auto' : 'visible'
          }}
        >
          {/* Quick Selection Presets */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">Quick Selection</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickSelections.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleQuickSelection(preset)}
                  disabled={isLoading}
                  className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-2" />
          </div>
          
          {/* Calendar */}
          <div className="p-2 overflow-y-auto" style={{ maxHeight: dropdownStyle.calendarHeight }}>
            <RDRDateRange
              ranges={[{
                startDate: parseISO(selectedRange.start),
                endDate: parseISO(selectedRange.end),
                key: 'selection',
                color: theme === 'dark' ? '#8B5CF6' : '#6366F1',
              }]}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              showMonthAndYearPickers={true}
              showDateDisplay={false}
              rangeColors={[theme === 'dark' ? '#8B5CF6' : '#6366F1']}
              months={1}
              direction="vertical"
              maxDate={addDays(new Date(), 0)}
              minDate={addDays(new Date(), -MAX_DATE_RANGE_DAYS)}
              className={`${theme === 'dark' ? 'dark' : ''} date-range-picker-responsive`}
              staticRanges={[]}
              inputRanges={[]}
              scroll={{ enabled: false }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                console.log('Apply button clicked - event:', e);
                e.preventDefault();
                e.stopPropagation();
                handleApply();
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 font-medium text-sm ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>,
        document.body
      )}
      
      {/* Helpful message for current day selection */}
      {hasCurrentDay && (
        <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium mb-1">Incomplete Data Warning</p>
              <p className="text-xs opacity-90">
                Today's data may be incomplete. For complete data, consider ending on {format(parseISO(recommendedEndDate), 'MMM d, yyyy')}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 