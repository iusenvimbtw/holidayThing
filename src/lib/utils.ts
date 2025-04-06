// src/lib/utils.ts
// ... other imports
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PossibleColors } from '@/types'; // Adjust path if needed
import { COLOR_SCHEMES } from '@/constants'; // Adjust path if needed

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isProd = () => process.env.NODE_ENV === 'production';

// Utility function to get day type colors
export type DayType = 'pto' | 'publicHoliday' | 'companyDayOff' | 'weekend' | 'extendedWeekend' | 'default';

// Mapping from day types to color schemes
export const dayTypeToColorScheme: Record<DayType, PossibleColors> = {
  pto: 'fuchsia',
  publicHoliday: 'amber',
  companyDayOff: 'violet',
  weekend: 'orange',
  extendedWeekend: 'red',
  default: 'transparent'
};

// Custom utility functions for common Tailwind patterns
export const linkStyles = (variant: 'primary' | 'secondary' | 'ghost') => {
  const baseStyles = "inline-flex items-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md" // Added focus styles

  const variantStyles = {
    primary: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:ring-blue-500", // Added dark variants
    secondary: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 focus:ring-gray-500", // Added dark variants
    ghost: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 px-2 py-1" // Added dark variants + padding for ghost
  }

  return cn(baseStyles, variantStyles[variant])
}

export const containerStyles = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" // Standardized padding

// Text size utilities with responsive variants
export const textSize = (variant: 'heading' | 'subheading' | 'body' | 'small' | 'tiny') => {
  const variants = {
    heading: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight", // Added tracking
    subheading: "text-lg sm:text-xl font-semibold",
    body: "text-sm sm:text-base leading-relaxed", // Added leading
    small: "text-xs sm:text-sm",
    tiny: "text-xs"
  }

  return variants[variant]
}

// Spacing utilities
export const spacing = {
  section: "py-8 sm:py-12 md:py-16", // Increased spacing
  container: "px-4 sm:px-6 lg:px-8", // Consistent container padding
  stack: "space-y-4 sm:space-y-6",
  inline: "space-x-2 sm:space-x-3" // Slightly adjusted inline spacing
}

// Function to get color scheme styles safely
export const getDayColorSchemeStyles = (dayType: DayType | 'today' | 'past') => {
  let colorKey: PossibleColors = 'neutral'; // Default

  if (dayType === 'today') {
    colorKey = 'today';
  } else if (dayType === 'past') {
    colorKey = 'past';
  } else if (dayType !== 'default') {
    colorKey = dayTypeToColorScheme[dayType as DayType];
  }

  return COLOR_SCHEMES[colorKey]?.calendar || COLOR_SCHEMES.neutral.calendar;
}
