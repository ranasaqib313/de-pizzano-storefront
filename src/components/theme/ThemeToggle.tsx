'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const isDark = resolvedTheme === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Toggle theme"
        className={cn(
          'w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface border border-surface-border text-muted-foreground opacity-50 flex items-center justify-center',
          className
        )}
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Toggle theme (Switch to ${isDark ? 'Light' : 'Dark'} mode)`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={cn(
        'group relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface hover:bg-surface-elevated border border-surface-border hover:border-secondary/60 text-foreground flex items-center justify-center cursor-pointer shadow-sm active:scale-95 shrink-0 select-none',
        className
      )}
    >
      {isDark ? (
        <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-secondary" />
      ) : (
        <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-secondary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
