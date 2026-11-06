'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from './CartItemRow';
import { formatPkr } from '@/lib/cart-calculations';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const {
    items,
    itemCount,
    pricing,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-surface border-l border-surface-border h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider font-display">
                    Your Cart
                  </h2>
                  <p className="text-xs text-muted">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCartDrawer}
                className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface border border-surface-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {items.length > 0 ? (
                <div className="divide-y divide-surface-border">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-center text-muted mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 font-display">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-muted max-w-xs mb-6 leading-relaxed">
                    Explore our 26 researched dishes spanning handcrafted pizzas, pastas, toasted sandwiches, and loaded fries.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    href="/menu"
                    onClick={closeCartDrawer}
                  >
                    Browse Menu
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-surface-border bg-surface-elevated space-y-3.5">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-light">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-white tabular-nums">
                      {formatPkr(pricing.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-light">
                    <span>Estimated Delivery (Soldier Bazar):</span>
                    <span className="font-semibold text-white tabular-nums">
                      {formatPkr(pricing.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-surface-border">
                    <span>Payable Total (COD):</span>
                    <span className="text-secondary font-black text-base tabular-nums">
                      {formatPkr(pricing.total)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/cart" onClick={closeCartDrawer} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={closeCartDrawer} className="w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs shadow-glow-red"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

