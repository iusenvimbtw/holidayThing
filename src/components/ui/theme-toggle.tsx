// src/components/ui/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path if needed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Adjust path if needed
import { motion } from 'framer-motion';

const themes = [
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    // Adjusted active classes for better contrast and consistency
    activeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    inactiveClass: 'text-gray-600 dark:text-gray-400',
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    activeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    inactiveClass: 'text-gray-600 dark:text-gray-400',
  },
  {
    id: 'system',
    name: 'System',
    icon: Monitor,
    activeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    inactiveClass: 'text-gray-600 dark:text-gray-400',
  },
];

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server/initial client render
    return <div className="h-8 w-8" />; // Placeholder to prevent layout shift
  }

  const currentTheme = themes.find(t => t.id === theme) || themes[2]; // Default to system if theme is somehow invalid
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative group" // Added group for potential hover effects
          aria-label={`Change theme. Current theme: ${currentTheme.name}`}
        >
          {/* Use motion.div for smooth icon transitions */}
          <motion.div
            key={theme} // Add key to force re-render on theme change for animation
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
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
            className={`
              flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md text-sm font-medium
              transition-colors duration-150
              ${theme === id ? activeClass : inactiveClass}
              hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800
              focus:outline-none focus:ring-1 focus:ring-ring/30
            `}
            aria-current={theme === id ? 'true' : 'false'}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{name}</span>
            {theme === id && (
              // Animated indicator for the active theme
              <motion.div
                layoutId="activeThemeIndicator" // Unique ID for layout animation
                className="ml-auto h-1.5 w-1.5 rounded-full bg-current"
                initial={false} // Prevent initial animation if already active
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
