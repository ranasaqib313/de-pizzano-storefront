'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowLeft, Trash2, ShieldAlert } from 'lucide-react';
import { KARACHI_DELIVERY_ZONES } from '@/data/delivery-zones';

export default function CartPage() {
  const {
    items,
    itemCount,
    pricing,
    selectedZone,
    setSelectedZone,
    updateQuantity,
    removeItem,
    clearCart,
    isInitialized,
  } = useCart();

  if (!isInitialized) {
    return (
      <div className="py-20 text-center">
        <Container size="md">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface mx-auto" />
            <div className="h-6 w-48 bg-surface rounded mx-auto" />
            <div className="h-4 w-64 bg-surface rounded mx-auto" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-background min-h-[75vh]">
      <Container size="xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-surface-border">
          <div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors mb-2 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Full Menu
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Review your pizza selections, crust options, and delivery address in Karachi.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors cursor-pointer self-start sm:self-auto py-1.5 px-3 rounded-lg border border-surface-border bg-surface hover:bg-surface-elevated"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          )}
        </div>

        {/* Prototype Demo Banner */}
        <div className="mb-8 p-4 rounded-xl bg-surface border border-secondary/20 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs text-muted leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              Phase 1 Client Prototype Notice
            </strong>
            Cash on Delivery is the sole payment option. Cart calculations operate with integer PKR precision to prevent rounding discrepancies.
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 bg-surface border border-surface-border rounded-2xl p-5 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-surface-border text-xs text-muted font-semibold uppercase tracking-wider">
                <span>Selected Items ({itemCount})</span>
                <span>Price & Quantity</span>
              </div>

              <div className="divide-y divide-surface-border">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Add more dishes shortcut */}
              <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
                <Link
                  href="/menu"
                  className="text-xs text-secondary hover:underline font-bold flex items-center gap-1"
                >
                  + Add more dishes from the menu
                </Link>
                <span className="text-xs text-muted">
                  Prices based on verified restaurant listings
                </span>
              </div>
            </div>

            {/* Order Summary & Delivery Zone Card */}
            <div className="lg:col-span-4 sticky top-24">
              <CartSummary
                pricing={pricing}
                selectedZone={selectedZone}
                onZoneChange={setSelectedZone}
                showCheckoutButton={true}
              />
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="bg-surface border border-surface-border rounded-2xl p-10 sm:p-16 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-20 h-20 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-center text-muted mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 text-muted-light" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-muted-light max-w-sm mx-auto mb-8 leading-relaxed">
              You haven&apos;t added any pizzas or sides yet. Browse our full 26-dish menu in Soldier Bazar and build your order.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" size="lg" href="/menu" className="w-full sm:w-auto shadow-glow-red">
                Explore Full Menu
              </Button>
              <Button variant="outline" size="lg" href="/" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

