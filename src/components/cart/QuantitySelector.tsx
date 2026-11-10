'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const sizeClasses = {
    sm: {
      btn: 'w-7 h-7 text-xs',
      text: 'w-8 text-xs',
      wrapper: 'p-0.5',
    },
    md: {
      btn: 'w-8 h-8 text-sm',
      text: 'w-10 text-sm',
      wrapper: 'p-1',
    },
    lg: {
      btn: 'w-10 h-10 text-base',
      text: 'w-12 text-base',
      wrapper: 'p-1.5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl bg-surface border border-surface-border select-none shadow-sm',
        currentSize.wrapper,
        className
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={isMin}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center rounded-lg text-muted-foreground transition-all',
          'hover:bg-surface-elevated hover:text-foreground active:scale-95',
          'disabled:opacity-30 disabled:pointer-events-none',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          currentSize.btn
        )}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span
        className={cn(
          'text-center font-bold text-foreground tabular-nums',
          currentSize.text
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={isMax}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center rounded-lg text-muted-foreground transition-all',
          'hover:bg-surface-elevated hover:text-foreground active:scale-95',
          'disabled:opacity-30 disabled:pointer-events-none',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          currentSize.btn
        )}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

