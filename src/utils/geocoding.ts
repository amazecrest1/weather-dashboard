import { City } from '../types/weather';

// Multiple API response interfaces
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

interface OpenWeatherGeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: {
    [key: string]: string;
  };
}

interface GooglePlacesResult {
  predictions: Array<{
    description: string;
    place_id: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }>;
}

interface GooglePlaceDetails {
  result: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
  };
}

// Cache for search results to avoid excessive API calls
const searchCache = new Map<string, City[]>();

// Debounce function to limit API calls
let debounceTimer: NodeJS.Timeout;

// API Keys (you can add your own keys here)
const OPENWEATHER_API_KEY = 'your_openweather_api_key_here'; // Optional: Add your OpenWeatherMap API key
const GOOGLE_API_KEY = 'your_google_api_key_here'; // Optional: Add your Google Places API key

// Enhanced city search with multiple API sources
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
    // Try multiple APIs in parallel for better results
    const results = await Promise.allSettled([
      searchNominatim(query),
      searchOpenWeatherGeocoding(query),
      // searchGooglePlaces(query), // Uncomment if you have Google API key
    ]);

    // Combine and deduplicate results
    const allCities: City[] = [];
    const seenNames = new Set<string>();

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        result.value.forEach((city) => {
          const key = `${city.name.toLowerCase()}-${city.country.toLowerCase()}`;
          if (!seenNames.has(key)) {
            seenNames.add(key);
            allCities.push(city);
          }
        });
      }
    });

    // Sort by relevance and limit results
    const sortedCities = allCities
      .sort((a, b) => {
        // Prioritize exact name matches
        const aExact = a.name.toLowerCase() === query.toLowerCase();
        const bExact = b.name.toLowerCase() === query.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by country relevance
        const aCountryMatch = a.country.toLowerCase().includes(query.toLowerCase());
        const bCountryMatch = b.country.toLowerCase().includes(query.toLowerCase());
        if (aCountryMatch && !bCountryMatch) return -1;
        if (!aCountryMatch && bCountryMatch) return 1;
        
        return 0;
      })
      .slice(0, 10);

    // Cache the results
    searchCache.set(cacheKey, sortedCities);
    
    return sortedCities;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

// Nominatim search (OpenStreetMap)
const searchNominatim = async (query: string): Promise<City[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        limit: '15',
        featureType: 'city',
        addressdetails: '1',
        extratags: '1',
        'accept-language': 'en'
      })
    );

    if (!response.ok) {
      throw new Error(`Nominatim HTTP error! status: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();

    return results
      .filter(result => {
        // Filter for cities, towns, and villages
        return (
          result.class === 'place' &&
          ['city', 'town', 'village', 'municipality'].includes(result.type) &&
          result.importance > 0.3 // Filter out less important places
        );
      })
      .map(result => {
        const address = result.address || {};
        const cityName = address.city || address.town || address.village || address.municipality || 
                        result.display_name.split(',')[0];
        
        const country = address.country || 'Unknown';
        const state = address.state || address.county || '';
        
        return {
          id: `nominatim-${result.place_id}`,
          name: cityName,
          country: country,
          state: state,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          isCustom: true
        };
      })
      .filter(city => city.name && city.country);
  } catch (error) {
    console.error('Nominatim search error:', error);
    return [];
  }
};

// OpenWeatherMap Geocoding API
const searchOpenWeatherGeocoding = async (query: string): Promise<City[]> => {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
    return []; // Skip if no API key
  }

  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?` +
      new URLSearchParams({
        q: query,
        limit: '10',
        appid: OPENWEATHER_API_KEY
      })
    );

    if (!response.ok) {
      throw new Error(`OpenWeather HTTP error! status: ${response.status}`);
    }

    const results: OpenWeatherGeocodingResult[] = await response.json();

    return results
      .filter(result => result.name && result.country)
      .map(result => ({
        id: `openweather-${result.lat}-${result.lon}`,
        name: result.name,
        country: result.country,
        state: result.state || '',
        latitude: result.lat,
        longitude: result.lon,
        isCustom: true
      }));
  } catch (error) {
    console.error('OpenWeather search error:', error);
    return [];
  }
};

// Google Places API (requires API key) - Currently disabled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchGooglePlaces = async (query: string): Promise<City[]> => {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_google_api_key_here') {
    return []; // Skip if no API key
  }

  try {
    // First, get place predictions
    const predictionsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      new URLSearchParams({
        input: query,
        types: '(cities)',
        key: GOOGLE_API_KEY
      })
    );

    if (!predictionsResponse.ok) {
      throw new Error(`Google Places HTTP error! status: ${predictionsResponse.status}`);
    }

    const predictionsData: GooglePlacesResult = await predictionsResponse.json();
    
    // Get details for each prediction
    const placeDetails = await Promise.all(
      predictionsData.predictions.slice(0, 5).map(async (prediction) => {
        try {
          const detailsResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            new URLSearchParams({
              place_id: prediction.place_id,
              fields: 'geometry,address_components,formatted_address',
              key: GOOGLE_API_KEY
            })
          );

          if (detailsResponse.ok) {
            const detailsData: GooglePlaceDetails = await detailsResponse.json();
            return detailsData.result;
          }
        } catch (error) {
          console.error('Error fetching place details:', error);
        }
        return null;
      })
    );

    return placeDetails
      .filter(details => details !== null)
      .map(details => {
        const country = details!.address_components.find(comp => 
          comp.types.includes('country')
        )?.long_name || 'Unknown';
        
        const state = details!.address_components.find(comp => 
          comp.types.includes('administrative_area_level_1')
        )?.long_name || '';

        return {
          id: `google-${details!.geometry.location.lat}-${details!.geometry.location.lng}`,
          name: details!.formatted_address.split(',')[0],
          country: country,
          state: state,
          latitude: details!.geometry.location.lat,
          longitude: details!.geometry.location.lng,
          isCustom: true
        };
      });
  } catch (error) {
    console.error('Google Places search error:', error);
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