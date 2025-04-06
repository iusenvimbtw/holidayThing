// src/components/layout/Header.tsx
'use client'; // Add this if not already present

import { Logo } from '@/components/Logo'; // Adjust path if needed
import { cn, spacing } from '@/lib/utils'; // Adjust path if needed
import { GitHubLink } from '@/components/ui/github-link'; // Adjust path if needed
import { ThemeToggle } from '@/components/ui/theme-toggle'; // Adjust path if needed
import { GITHUB_URL } from '@/constants'; // Adjust path if needed

const Header = () => (
  <header className={cn(
    'sticky top-0 z-40 w-full',
    'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm', // Updated dark background
    'border-b border-gray-200/60 dark:border-gray-700/60', // Updated dark border
    'pt-[env(safe-area-inset-top)]', // Handle safe area for mobile devices
    'transition-colors duration-200' // Smooth transition
  )}>
    <div className={cn(
      'mx-auto max-w-7xl',
      spacing.container, // Use spacing utility if defined
    )}>
      <div className="flex h-14 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2"> {/* Reduced gap slightly */}
          <GitHubLink
            href={GITHUB_URL}
            variant="default"
            className="hidden sm:inline-flex"
          />
          <GitHubLink
            href={GITHUB_URL}
            variant="compact"
            className="sm:hidden"
          />
          {/* Add the ThemeToggle component */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
