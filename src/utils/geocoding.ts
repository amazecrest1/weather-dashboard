import { City } from '../types/weather';

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

const searchCache = new Map<string, City[]>();
let debounceTimer: NodeJS.Timeout;

const OPENWEATHER_API_KEY = 'your_openweather_api_key_here';
const GOOGLE_API_KEY = 'your_google_api_key_here';

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const cacheKey = query.toLowerCase().trim();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const results = await Promise.allSettled([
      searchNominatim(query),
      searchOpenWeatherGeocoding(query),
    ]);

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

    const sortedCities = allCities
      .sort((a, b) => {
        const aExact = a.name.toLowerCase() === query.toLowerCase();
        const bExact = b.name.toLowerCase() === query.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aCountryMatch = a.country.toLowerCase().includes(query.toLowerCase());
        const bCountryMatch = b.country.toLowerCase().includes(query.toLowerCase());
        if (aCountryMatch && !bCountryMatch) return -1;
        if (!aCountryMatch && bCountryMatch) return 1;
        
        return 0;
      })
      .slice(0, 10);

    searchCache.set(cacheKey, sortedCities);
    
    return sortedCities;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

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
        return (
          result.class === 'place' &&
          ['city', 'town', 'village', 'municipality'].includes(result.type) &&
          result.importance > 0.3
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

const searchOpenWeatherGeocoding = async (query: string): Promise<City[]> => {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
    return [];
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchGooglePlaces = async (query: string): Promise<City[]> => {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_google_api_key_here') {
    return [];
  }

  try {
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
      .filter((place): place is GooglePlaceDetails['result'] => place !== null)
      .map(place => {
        const addressComponents = place.address_components;
        const cityComponent = addressComponents.find(comp => 
          comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
        );
        const countryComponent = addressComponents.find(comp => 
          comp.types.includes('country')
        );
        
        return {
          id: `google-${place.geometry.location.lat}-${place.geometry.location.lng}`,
          name: cityComponent?.long_name || place.formatted_address.split(',')[0],
          country: countryComponent?.long_name || 'Unknown',
          state: '',
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          isCustom: true
        };
      })
      .filter(city => city.name && city.country);
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

export const saveCustomCity = (city: City): void => {
  const customCities = getCustomCities();
  const exists = customCities.some(c => c.id === city.id);
  
  if (!exists) {
    customCities.push(city);
    localStorage.setItem('customCities', JSON.stringify(customCities));
  }
};

export const getCustomCities = (): City[] => {
  try {
    const stored = localStorage.getItem('customCities');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom cities:', error);
    return [];
  }
};

export const removeCustomCity = (cityId: string): void => {
  const customCities = getCustomCities();
  const filtered = customCities.filter(city => city.id !== cityId);
  localStorage.setItem('customCities', JSON.stringify(filtered));
};

export const clearCustomCities = (): void => {
  localStorage.removeItem('customCities');
}; 