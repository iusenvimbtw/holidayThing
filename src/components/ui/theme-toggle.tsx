// src/components/ui/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Coffee, Monitor, Moon, Sun } from 'lucide-react'; // Import Coffee icon
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Import cn if not already imported

const themes = [
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    activeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', // Existing style
    inactiveClass: 'text-gray-600 dark:text-gray-400', // Existing style
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    activeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300', // Existing style
    inactiveClass: 'text-gray-600 dark:text-gray-400', // Existing style
  },
  // ---> ADD NIGHT MODE OPTION HERE <---
  {
    id: 'night',
    name: 'Night',
    icon: Coffee, // Use Coffee icon or choose another like Bedtime, Sunset etc.
    // Define active styles for Night mode - use warm colors
    activeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300',
    inactiveClass: 'text-gray-600 dark:text-gray-400', // Same inactive style
  },
  // --- END OF NIGHT MODE OPTION ---
  {
    id: 'system',
    name: 'System',
    icon: Monitor,
    activeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300', // Existing style
    inactiveClass: 'text-gray-600 dark:text-gray-400', // Existing style
  },
];

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />; // Placeholder
  }

  // Find the *full* theme config object, defaulting safely
  const currentThemeConfig = themes.find(t => t.id === theme) ?? themes.find(t => t.id === 'system')!;
  const CurrentIcon = currentThemeConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative group"
          aria-label={`Change theme. Current theme: ${currentThemeConfig.name}`}
        >
          <motion.div
            key={theme} // Key change triggers animation
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Ensure icon color contrasts well in all themes */}
            <CurrentIcon className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 p-1">
        {themes.map(({ id, name, icon: Icon, activeClass, inactiveClass }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setTheme(id)}
            // Use cn to merge classes, important for applying active/inactive styles
            className={cn(
              `flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md text-sm font-medium
               transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-ring/30`,
              theme === id ? activeClass : inactiveClass,
              // General hover styles - apply regardless of active state
              `hover:bg-gray-100 dark:hover:bg-gray-800`,
              // Ensure focus state also has hover styles for consistency
              `focus:bg-gray-100 dark:focus:bg-gray-800`
            )}
            aria-current={theme === id ? 'true' : 'false'}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{name}</span>
            {theme === id && (
              <motion.div
                layoutId="activeThemeIndicator"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-current"
                initial={false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
