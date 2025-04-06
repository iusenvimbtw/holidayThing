// src/components/Logo.tsx
import { PROJECT_NAME } from '@/constants'; // Adjust path if needed
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Adjust path if needed

export const Logo = () => (
  <Link href="/" tabIndex={0} aria-label="holidayThing Home" className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md">
    <div className="flex items-center space-x-2">
      {/* Icon Container */}
      <div
        className={cn(
          "p-1.5 rounded-lg shadow-sm transition-colors duration-200",
          "bg-blue-500 dark:bg-blue-600", // Dark mode background
          "group-hover:bg-blue-600 dark:group-hover:bg-blue-500" // Hover effect
        )}
      >
        <svg
          className="h-5 w-5 text-white" // Icon color remains white
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8} // Slightly thinner stroke
          aria-hidden="true"
          role="img"
        >
          <title>Calendar Icon</title>
          {/* Simplified calendar path for cleaner look */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      {/* Text Container */}
      <div>
        <h2
          className={cn(
            "text-base font-semibold transition-colors duration-200",
            "text-gray-900 dark:text-white" // Dark mode text
          )}
        >
          {PROJECT_NAME}
        </h2>
        <p className={cn(
          "text-xs transition-colors duration-200",
          "text-gray-500 dark:text-gray-400" // Dark mode text
        )}>
          Maximize your time off in {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </Link>
);
