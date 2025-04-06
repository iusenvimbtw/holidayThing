// src/types.ts

// Make sure this matches the schema path in your components.json if it's different
// Although this line is often just for editor DX and doesn't affect runtime.
// "$schema": "https://ui.shadcn.com/schema.json",

// --- Global Augmentation ---
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

// --- Optimization Types ---
export type OptimizationStrategy = 'balanced' | 'miniBreaks' | 'longWeekends' | 'weekLongBreaks' | 'extendedVacations';

export interface OptimizedDay {
  date: string;
  isWeekend: boolean;
  isPTO: boolean;
  isPartOfBreak: boolean;
  isPublicHoliday: boolean;
  publicHolidayName?: string;
  isCompanyDayOff: boolean;
  companyDayName?: string;
}

export interface Break {
  startDate: string;
  endDate: string;
  days: OptimizedDay[];
  totalDays: number;
  ptoDays: number;
  publicHolidays: number;
  weekends: number;
  companyDaysOff: number;
}

export interface OptimizationStats {
  totalPTODays: number;
  totalPublicHolidays: number;
  totalNormalWeekends: number; // This seems used in optimizer.ts L350 but perhaps should be just totalWeekends? Review usage.
  totalExtendedWeekends: number; // This seems calculated differently in optimizer.ts L351. Review logic.
  totalCompanyDaysOff: number;
  totalDaysOff: number;
}

export interface OptimizationResult {
  days: OptimizedDay[];
  breaks: Break[];
  stats: OptimizationStats;
}

export interface CompanyDayOff {
  date: string;           // Date in 'yyyy-MM-dd' format
  name: string;          // Description or name of the company day off
  isRecurring?: boolean; // Whether this applies to all matching weekdays in a date range
  startDate?: string;    // If recurring, the start date of the range
  endDate?: string;      // If recurring, the end date of the range
  weekday?: number;      // If recurring, the day of week (0-6, where 0 is Sunday)
}

export interface OptimizationParams {
  numberOfDays: number;
  strategy?: OptimizationStrategy;
  year?: number;
  holidays?: Array<{ date: string, name: string }>; // Consider exporting this simple type too if used widely
  companyDaysOff?: Array<CompanyDayOff>;
}

export interface StrategyOption {
  id: OptimizationStrategy;
  label: string;
  description: string;
}


// --- Holiday API & Geolocation Types ---

export interface DetectedHoliday {
  date: string; // Format: "YYYY-MM-DD"
  name: string;
}

// Represents the structure expected from the Nager API or your custom worker.
export interface HolidayResponse {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[]; // Consider making this more specific, e.g., ("Public" | "Optional" | "Observance")[]
}

export interface LocalityInfoItem {
  name: string;
  description?: string;
  isoName?: string;
  order: number;
  adminLevel?: number;
  isoCode?: string;
  wikidataId?: string;
  geonameId?: number;
}

export interface LocalityInfo {
  administrative: LocalityInfoItem[];
  informative: LocalityInfoItem[];
}

export interface GeoLocationResponse {
  latitude: number;
  lookupSource: string;
  longitude: number;
  localityLanguageRequested: string;
  continent: string;
  continentCode: string;
  countryName: string;
  countryCode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
  csdCode?: string;
  localityInfo: LocalityInfo;
}


// --- Tailwind CSS Color Types ---

// Standard Tailwind color palette
type TailwindColor =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' // Gray scales
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' // Warm to cool colors
  | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'; // Cool to warm colors

// Special colors and utility colors
type SpecialColor = 'black' | 'white' | 'transparent' | 'current';

// Application-specific color schemes
type AppSpecificColorScheme = 'today' | 'past';

// Type definitions for the structure of color scheme elements
export interface TailwindColorStyles {
  bg: string;    // Background color classes (e.g., "bg-blue-100 dark:bg-blue-900/50")
  text: string;  // Text color classes (e.g., "text-blue-600 dark:text-blue-300")
  ring: string;  // Ring/outline classes (e.g., "ring-blue-400/20 dark:ring-blue-300/20")
}

// Exported because it's used by ColorSchemeDefinition
export interface TooltipStyles {
  icon: string;  // Icon color classes
  bg: string;    // Background color classes
}

// Exported because it's used by ColorSchemeDefinition
export interface CardStyles {
  hover: string; // Hover state classes
  ring?: string; // Optional ring/outline classes
}

// The complete structure of a color scheme definition
// Exported because it's used by ColorSchemes
export interface ColorSchemeDefinition {
  icon: TailwindColorStyles;
  tooltip: TooltipStyles;
  card: CardStyles;
  calendar: TailwindColorStyles;
}

export type PossibleColors = TailwindColor | SpecialColor | AppSpecificColorScheme;

// The complete COLOR_SCHEMES object type
export type ColorSchemes = Record<PossibleColors, ColorSchemeDefinition>;

// --- Date List Component Types (if needed globally, otherwise keep local) ---
// It seems these might be defined locally in their respective component folders,
// which is often a good practice unless shared across many unrelated features.
// Example:
// export interface DateItem {
//   date: string;
//   name: string;
//   alternateNames?: string[];
// }
// export interface GroupedDates {
//  name: string;
//  dates: DateItem[];
//  isDefaultNamed?: boolean;
//  groupKeyTimestamp: number;
// }

// --- Form Types (if needed globally) ---
// Example:
// export interface FormErrors {
//   days?: string;
//   companyDay?: { name?: string; date?: string };
//   holiday?: { name?: string; date?: string };
// }

// Ensure the file ends correctly, no stray characters
