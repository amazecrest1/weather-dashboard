import React, { useState, useEffect, useRef } from 'react';
import { City } from '../types/weather';
import { CITIES } from '../constants/cities';
import { debouncedSearchCities, saveCustomCity, getCustomCities, removeCustomCity } from '../utils/geocoding';

interface CitySelectorProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
  className?: string;
}

const ALL_CITIES_OPTION: City = {
  id: 'all-cities',
  name: 'All Cities Selected',
  country: '',
  latitude: 0,
  longitude: 0,
};

const CitySelector: React.FC<CitySelectorProps> = ({ 
  selectedCity, 
  onCityChange, 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [customCities, setCustomCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load custom cities on mount
  useEffect(() => {
    setCustomCities(getCustomCities());
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      debouncedSearchCities(searchQuery, (cities) => {
        setSearchResults(cities);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // All available cities (predefined + custom)
  const allCities = [ALL_CITIES_OPTION, ...CITIES, ...customCities];

  // Filtered cities based on search query
  const filteredCities = searchQuery.length < 2 
    ? allCities 
    : allCities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Combined suggestions (filtered existing cities + search results)
  const suggestions = [
    ...filteredCities,
    ...searchResults.filter(result => 
      !allCities.some(city => 
        Math.abs(city.latitude - result.latitude) < 0.01 && 
        Math.abs(city.longitude - result.longitude) < 0.01
      )
    )
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleCitySelect = (city: City) => {
    // Save custom city if it's not already saved
    if (city.isCustom && !customCities.some(c => c.id === city.id)) {
      saveCustomCity(city);
      setCustomCities(prev => [...prev, city]);
    }
    
    onCityChange(city);
    setSearchQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleCitySelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        setSearchQuery('');
        break;
    }
  };

  const handleRemoveCustomCity = (cityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomCity(cityId);
    setCustomCities(prev => prev.filter(c => c.id !== cityId));
    
    // If the removed city was selected, switch to default
    if (selectedCity.id === cityId) {
      onCityChange(ALL_CITIES_OPTION);
    }
  };

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  };

  const handleDropdownBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
      setSearchQuery('');
    }, 200);
  };

  // Update display value
  const displayValue = selectedCity.id === 'all-cities'
    ? 'All Cities Selected'
    : selectedCity.name + (selectedCity.state ? `, ${selectedCity.state}` : '') + `, ${selectedCity.country}`;

  return (
    <div className={`relative flex flex-col ${className}`} style={{ zIndex: 1000 }}>
      <div className="relative">
        <button
          onClick={handleDropdownClick}
          className={`w-full px-6 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between shadow-lg hover:border-gray-300 transition-colors font-medium`}
          style={{ minHeight: 56 }}
        >
          <span className="truncate">{displayValue}</span>
          <span className="flex items-center justify-center ml-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-[9999] top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            border: '1px solid #e5e7eb',
            marginTop: '8px',
            minWidth: 260,
          }}
        >
          {/* Search input */}
          <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleDropdownBlur}
              placeholder="Search for a city..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          
          {/* Results */}
          <div className="max-h-60 overflow-y-auto">
            {suggestions.length === 0 ? (
              <div className="px-3 py-3 text-gray-400 text-sm text-center">
                {searchQuery.length < 2 ? 'Type to search for cities' : 'No cities found'}
              </div>
            ) : (
              <div>
                {suggestions.map((city, index) => (
                  <div
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors border-b border-gray-100 last:border-b-0 rounded-lg mx-2 my-1 ${
                      index === selectedIndex
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-100'
                    } ${city.id === 'all-cities' ? 'font-semibold text-gray-700 bg-gray-100 hover:bg-blue-50' : ''}`}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-gray-900 truncate">
                        {city.name}
                        {city.state && <span className="text-gray-500">, {city.state}</span>}
                      </span>
                      {city.id !== 'all-cities' && (
                        <span className="text-sm text-gray-500 truncate">{city.country}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {city.isCustom && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Custom
                        </span>
                      )}
                      {city.isCustom && customCities.some(c => c.id === city.id) && (
                        <button
                          onClick={(e) => handleRemoveCustomCity(city.id, e)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove custom city"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector; 