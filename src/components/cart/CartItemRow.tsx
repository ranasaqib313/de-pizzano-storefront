'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { CartItem } from '@/types/storefront';
import { formatPkr } from '@/lib/cart-calculations';
import { QuantitySelector } from './QuantitySelector';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartItemRowProps) {
  return (
    <div className="flex gap-3.5 py-3.5 border-b border-surface-border last:border-b-0 items-start">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-surface-elevated shrink-0 border border-surface-border">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            🍕
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm sm:text-base font-bold text-white font-display truncate">
            {item.name}
          </h4>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-muted hover:text-primary transition-colors p-1 -mr-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Variant name if any */}
        {item.variant && (
          <p className="text-xs text-secondary font-semibold mt-0.5">
            Size: {item.variant.name}
          </p>
        )}

        {/* Selected options */}
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.selectedOptions.map((opt) => (
              <span
                key={opt.optionId}
                className="text-[11px] px-2 py-0.5 rounded-md bg-surface border border-surface-border text-muted-light"
              >
                + {opt.name} ({formatPkr(opt.price)})
              </span>
            ))}
          </div>
        )}

        {/* Price and quantity row */}
        <div className="mt-2.5 flex items-center justify-between gap-3 flex-wrap">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
            size={compact ? 'sm' : 'md'}
          />

          <div className="text-right">
            <span className="text-xs text-muted block sm:inline mr-2">
              {formatPkr(item.unitPrice)} each
            </span>
            <span className="text-sm sm:text-base font-black text-white tabular-nums">
              {formatPkr(item.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
