import { City } from '../types/weather';

// Nominatim API response interface
interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
    state?: string;
    county?: string;
  };
}

// Cache for search results to avoid excessive API calls
const searchCache = new Map<string, City[]>();

// Debounce function to limit API calls
let debounceTimer: NodeJS.Timeout;

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  // Check cache first
  const cacheKey = query.toLowerCase().trim();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        limit: '10',
        featureType: 'city',
        addressdetails: '1',
        extratags: '1',
        'accept-language': 'en'
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();

    const cities: City[] = results
      .filter(result => {
        // Filter for cities, towns, and villages
        return (
          result.class === 'place' &&
          ['city', 'town', 'village', 'municipality'].includes(result.type)
        );
      })
      .map(result => {
        // Extract city name from address or display name
        const address = result.address || {};
        const cityName = address.city || address.town || address.village || address.municipality || 
                        result.display_name.split(',')[0];
        
        const country = address.country || 'Unknown';
        const state = address.state || address.county || '';
        
        return {
          id: `custom-${result.place_id}`,
          name: cityName,
          country: country,
          state: state,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          isCustom: true
        };
      })
      .filter(city => city.name && city.country)
      .slice(0, 8); // Limit to 8 results

    // Cache the results
    searchCache.set(cacheKey, cities);
    
    return cities;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

export const debouncedSearchCities = (query: string, callback: (cities: City[]) => void) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const cities = await searchCities(query);
    callback(cities);
  }, 300);
};

// Local storage keys
const CUSTOM_CITIES_KEY = 'weather-dashboard-custom-cities';

export const saveCustomCity = (city: City): void => {
  const customCities = getCustomCities();
  const exists = customCities.some(c => c.id === city.id);
  
  if (!exists) {
    customCities.push(city);
    localStorage.setItem(CUSTOM_CITIES_KEY, JSON.stringify(customCities));
  }
};

export const getCustomCities = (): City[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_CITIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading custom cities:', error);
  }
  return [];
};

export const removeCustomCity = (cityId: string): void => {
  const customCities = getCustomCities();
  const filtered = customCities.filter(c => c.id !== cityId);
  localStorage.setItem(CUSTOM_CITIES_KEY, JSON.stringify(filtered));
};

export const clearCustomCities = (): void => {
  localStorage.removeItem(CUSTOM_CITIES_KEY);
}; 