'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MapPin, ExternalLink, Flame, ShoppingBag, User, LogOut, Bike, Store, ChevronRight } from 'lucide-react';
import { MAIN_NAV_ITEMS } from '@/data/navigation';
import { BUSINESS_CONFIG } from '@/data/business';
import { getMapsDirectionsUrl, getFoodpandaUrl } from '@/lib/links';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { OrderTypeModal } from './OrderTypeModal';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  const { itemCount, orderType, selectedZone } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Close menu on Escape key press and prevent scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[200] flex justify-end"
        >
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel with Spring Slide-in from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-[320px] sm:max-w-sm h-full bg-background border-l border-surface-border shadow-2xl flex flex-col p-5 sm:p-6 z-10 overflow-y-auto"
          >
            {/* Header with Close & Theme Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-base text-foreground font-display">DE PIZZANO</span>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-xl bg-surface border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer active:scale-95 transition-colors"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Mode Mobile Selector */}
            <div className="pt-4 pb-1">
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="w-full p-3 rounded-xl bg-surface border border-secondary/40 flex items-center justify-between text-left hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {orderType === 'delivery' ? (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                      <Bike className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] font-semibold text-secondary block uppercase tracking-wider">
                      {orderType === 'delivery' ? 'Home Delivery' : 'Takeaway Pickup'}
                    </span>
                    <span className="text-xs font-bold text-foreground block truncate max-w-[150px]">
                      {orderType === 'delivery' ? (selectedZone?.name || 'Karachi') : 'Soldier Bazar No. 3'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                  Change <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

            {/* Quick Storefront Actions (Cart, Login/Account) */}
            <div className="grid grid-cols-2 gap-2.5 py-4 border-b border-surface-border">
              <Link
                href="/cart"
                onClick={onClose}
                className="p-3 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-left hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary-light" />
                  <span className="text-xs font-bold text-foreground">Cart</span>
                </div>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-background text-[10px] font-black">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link
                    href="/orders"
                    onClick={onClose}
                    className="flex-1 p-3 rounded-xl bg-surface border border-surface-border flex items-center gap-2 hover:bg-surface-elevated transition-colors truncate"
                  >
                    <User className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-xs font-bold text-foreground truncate">
                      {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-surface border border-surface-border text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    aria-label="Sign Out"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="p-3 rounded-xl bg-surface border border-surface-border flex items-center gap-2 hover:bg-surface-elevated transition-colors"
                >
                  <User className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold text-foreground">Account</span>
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 py-4 flex-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex flex-col px-3.5 py-2.5 rounded-xl transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface/60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{item.label}</span>
                      {item.href === '/track' && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold">
                          COD
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-[11px] text-muted-foreground mt-0.5">{item.description}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & Info */}
            <div className="pt-4 border-t border-surface-border space-y-2.5">
              <Button
                variant="primary"
                size="md"
                href="/menu"
                onClick={onClose}
                className="w-full justify-center shadow-glow-red font-bold text-xs"
                icon={<ShoppingBag className="w-4 h-4" />}
              >
                Order Online Now (COD)
              </Button>

              <Button
                variant="foodpanda"
                size="sm"
                href={getFoodpandaUrl()}
                external
                className="w-full justify-center text-xs"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Order on Foodpanda
              </Button>

              {/* Verification Warning Notice */}
              <div className="bg-surface/80 p-2.5 rounded-lg border border-surface-border text-[11px] text-muted-foreground leading-relaxed text-center">
                <span className="text-secondary font-semibold block mb-0.5">Authentic De Pizzano Storefront</span>
                Handcrafted oven-baked pizza delivery & takeaway in Karachi.
              </div>
            </div>
          </motion.div>

          <OrderTypeModal
            isOpen={orderModalOpen}
            onClose={() => setOrderModalOpen(false)}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
