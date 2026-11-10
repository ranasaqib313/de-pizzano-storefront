'use client';

import React, { useState, useCallback } from 'react';
import { LeftNavDock } from './LeftNavDock';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface DockAwareLayoutProps {
  children: React.ReactNode;
}

/**
 * DockAwareLayout
 *
 * Owns the dock-expansion boolean so both the LeftNavDock (trigger) and the
 * content wrapper (target) share state without lifting it all the way to the
 * Server-Component root layout. When the dock is hovered the content wrapper
 * smoothly shifts right via a padding transition, keeping hero text clear.
 *
 * Collapsed:  md:pl-28  (112 px) — clears the ~76 px collapsed dock
 * Expanded:   md:pl-64  (256 px) — clears the ~242 px expanded dock with 14 px gap
 */
export function DockAwareLayout({ children }: DockAwareLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandedChange = useCallback((expanded: boolean) => {
    setIsExpanded(expanded);
  }, []);

  return (
    <>
      {/* Fixed dock — notifies layout when it expands */}
      <LeftNavDock onExpandedChange={handleExpandedChange} />

      {/* Content + Footer shift right smoothly when dock expands */}
      <div
        className={cn(
          'flex flex-col flex-1 transition-[padding-left] duration-300 ease-out will-change-[padding-left]',
          isExpanded
            ? 'pl-0 md:pl-64 lg:pl-[270px] xl:pl-[280px]'
            : 'pl-0 md:pl-28 lg:pl-32 xl:pl-36'
        )}
      >
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
      </div>
    </>
  );
}

