import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  required,
  error,
  helperText,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-foreground flex items-center justify-between">
        <span>
          {label} {required && <span className="text-primary ml-0.5">*</span>}
        </span>
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-muted-foreground mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

