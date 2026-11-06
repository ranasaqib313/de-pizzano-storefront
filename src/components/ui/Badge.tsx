import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-surface-elevated text-muted-light border border-surface-border',
    primary: 'bg-primary/20 text-primary-light border border-primary/40',
    secondary: 'bg-secondary/20 text-secondary border border-secondary/40',
    success: 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/40',
    warning: 'bg-amber-900/30 text-amber-300 border border-amber-500/40',
    info: 'bg-sky-900/30 text-sky-300 border border-sky-500/40',
    outline: 'border border-surface-border text-foreground bg-transparent',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full transition-colors uppercase',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
