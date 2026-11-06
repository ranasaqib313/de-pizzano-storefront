'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl bg-surface-elevated text-foreground text-sm border p-3.5 transition-all resize-y min-h-[90px]',
          'placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary',
          error
            ? 'border-primary text-primary-light focus:ring-primary'
            : 'border-surface-border hover:border-surface-highlight focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
