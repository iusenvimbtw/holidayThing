// src/services/holidays.ts
import {
  DetectedHoliday,
  HolidayResponse,
  GeoLocationResponse,
  LocalityInfo,
  LocalityInfoItem
} from '@/types'; // Adjust path if needed

// --- Define API Base URLs ---
const NAGER_API_BASE_URL = 'https://date.nager.at/api/v3/PublicHolidays';
// Use environment variable if available, otherwise fallback to the direct URL
const INDIA_API_BASE_URL = process.env.NEXT_PUBLIC_INDIA_HOLIDAY_API_URL;

// --- Helper Functions ---

const getCountryFromCoordinates = async (latitude: number, longitude: number): Promise<GeoLocationResponse> => {
  try {
    const response = await fetch(
      // Using BigDataCloud for reverse geocoding
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`BigDataCloud API Error (${response.status}): ${errorBody}`);
      throw new Error(`Failed to fetch location data (Status: ${response.status})`);
    }
    const data: GeoLocationResponse = await response.json();
    // Basic check for expected properties
    if (!data || !data.countryCode) {
      throw new Error("Invalid response format from geolocation service.");
    }
    return data;
  } catch (error) {
    console.error('Error getting country from coordinates:', error);
    // Provide a user-friendly error message
    throw new Error(`Could not determine country from location. Please ensure location services are enabled and try again. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// --- Main Holiday Detection Function ---

export const detectPublicHolidays = async (year?: number): Promise<DetectedHoliday[]> => {
  let position: GeolocationPosition | null = null;
  let locationData: GeoLocationResponse | null = null;

  try {
    // 1. Get user's location
    console.log("Attempting to get geolocation...");
    position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        resolve,
        (err) => {
          console.error(`Geolocation Error: Code ${err.code}, Message: ${err.message}`);
          let userMessage = 'Could not get your location.';
          if (err.code === err.PERMISSION_DENIED) {
            userMessage = 'Location permission denied. Please enable location access in your browser settings.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            userMessage = 'Location information is unavailable.';
          } else if (err.code === err.TIMEOUT) {
            userMessage = 'Location request timed out.';
          }
          reject(new Error(userMessage));
        },
        { timeout: 10000, enableHighAccuracy: false } // 10s timeout, standard accuracy
      );
    });
    console.log("Geolocation acquired:", `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);


    // 2. Get country code from coordinates
    console.log("Fetching country/region data from coordinates...");
    locationData = await getCountryFromCoordinates(
      position.coords.latitude,
      position.coords.longitude,
    );
    const { countryCode, principalSubdivisionCode } = locationData;
    console.log(`Detected Country Code: ${countryCode}, Subdivision: ${principalSubdivisionCode || 'N/A'}`);


    // 3. Determine target year
    const targetYear = year || new Date().getFullYear();


    // 4. Construct API URL conditionally
    let apiUrl = '';
    const isIndia = countryCode === 'IN';

    if (isIndia) {
      apiUrl = `${INDIA_API_BASE_URL}/${targetYear}/IN`;
      console.log(`Using custom API for India (${targetYear}): ${apiUrl}`);
    } else {
      apiUrl = `${NAGER_API_BASE_URL}/${targetYear}/${countryCode}`;
      console.log(`Using Nager API for ${countryCode} (${targetYear}): ${apiUrl}`);
    }


    // 5. Fetch holidays
    console.log(`Fetching holidays from: ${apiUrl}`);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No holiday data found for ${countryCode} in ${targetYear}. API responded with 404.`);
        return []; // Return empty array if no data found
      }
      const errorBody = await response.text();
      throw new Error(`Failed to fetch holidays from ${apiUrl}. Status: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }

    const holidays: HolidayResponse[] = await response.json();

    if (!Array.isArray(holidays)) {
      console.error("Received non-array response from holiday API:", holidays);
      throw new Error(`Invalid response format received from ${apiUrl}. Expected an array.`);
    }
    console.log(`Received ${holidays.length} holidays initially for ${countryCode} ${targetYear}.`);


    // 6. *CONDITIONAL* Filtering based on API source
    let relevantHolidays: HolidayResponse[];

    if (isIndia) {
      // **ASSUMPTION:** Your custom worker for India ALREADY returns only Public/Optional holidays.
      // No further filtering based on 'global' or 'counties' is needed here for IN.
      relevantHolidays = holidays;
      console.log(`Using ${relevantHolidays.length} holidays directly from custom India API.`);
    } else {
      // **FILTERING:** Apply standard Nager API filtering logic for ALL OTHER countries.
      relevantHolidays = holidays.filter(
        (holiday): holiday is HolidayResponse => // Type guard helps ensure properties exist
          holiday != null && // Check if holiday object exists
          (holiday.global === true || // Keep if it's a global holiday for the country
            (Array.isArray(holiday.counties) && holiday.counties.includes(principalSubdivisionCode))) // Or if it applies to the specific subdivision
      );
      console.log(`Filtered Nager results down to ${relevantHolidays.length} holidays for ${countryCode} ${targetYear} based on global/subdivision.`);
    }


    // 7. Transform the final list to match the app's expected format
    return relevantHolidays.map(holiday => ({
      date: holiday.date,
      // Prefer localName if available, otherwise use the general name
      name: holiday.localName || holiday.name,
    }));

  } catch (error) {
    console.error('Error detecting public holidays:', error);
    // Log specific details if available
    if (position) console.error('Position at time of error:', position.coords);
    if (locationData) console.error('Location data at time of error:', locationData);

    // Return empty array for graceful failure in the UI
    // You might want to show a toast notification here to inform the user
    // e.g., import { toast } from 'sonner'; toast.error("Could not detect holidays", { description: (error as Error).message });
    return [];
  }
};
