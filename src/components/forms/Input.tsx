'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl bg-surface-elevated text-foreground text-sm border px-3.5 py-2.5 transition-all',
            'placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary',
            icon ? 'pl-10' : 'pl-3.5',
            rightElement ? 'pr-11' : 'pr-3.5',
            error
              ? 'border-primary text-primary-light focus:ring-primary'
              : 'border-surface-border hover:border-surface-highlight focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2.5 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
