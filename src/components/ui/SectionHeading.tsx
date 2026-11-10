import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl',
        className
      )}
    >
      {badge && (
        <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-secondary bg-secondary/10 border border-secondary/20 rounded-full mb-3">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-display uppercase',
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

