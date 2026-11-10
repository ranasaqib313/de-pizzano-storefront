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

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Strictly binary switch based on resolvedTheme: Dark <-> Light
    const isDark = resolvedTheme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    const isViewTransitionSupported =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isViewTransitionSupported) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.ceil(
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      ) * 1.05
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 100,
          easing: 'linear',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Toggle theme"
        className={cn(
          'w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface border border-surface-border text-muted opacity-50 flex items-center justify-center',
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
        'group relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface hover:bg-surface-elevated border border-surface-border hover:border-secondary/60 text-foreground transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 shrink-0 select-none',
        className
      )}
    >
      {isDark ? (
        <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-secondary transition-transform group-hover:scale-110" />
      ) : (
        <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-secondary transition-transform group-hover:scale-110 group-hover:rotate-45" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
