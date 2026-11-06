'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Phone, MapPin, ExternalLink, Flame, ShoppingBag, User, LogOut } from 'lucide-react';
import { MAIN_NAV_ITEMS } from '@/data/navigation';
import { BUSINESS_CONFIG } from '@/data/business';
import { getPhoneLink, getMapsDirectionsUrl, getFoodpandaUrl } from '@/lib/links';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  const { itemCount } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();

  // Close menu on Escape key press
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm h-full bg-background border-l border-surface-border shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-5 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white font-display">DE PIZZANO</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-light hover:text-white rounded-lg bg-surface border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
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
              <span className="text-xs font-bold text-white">Cart</span>
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
                <span className="text-xs font-bold text-white truncate">
                  {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="p-3 rounded-xl bg-surface border border-surface-border text-muted hover:text-primary transition-colors cursor-pointer"
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
              <span className="text-xs font-bold text-white">Account</span>
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
                    ? 'bg-primary/20 text-white border-l-4 border-primary font-semibold'
                    : 'text-muted-light hover:text-white hover:bg-surface/60'
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
                  <span className="text-[11px] text-muted mt-0.5">{item.description}</span>
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

          <Button
            variant="outline"
            size="sm"
            href={getPhoneLink()}
            className="w-full justify-center text-xs"
            icon={<Phone className="w-3.5 h-3.5 text-secondary" />}
          >
            Call {BUSINESS_CONFIG.contact.formattedPhone}
          </Button>

          {/* Verification Warning Notice */}
          <div className="bg-surface/80 p-2.5 rounded-lg border border-surface-border text-[11px] text-muted leading-relaxed text-center">
            <span className="text-secondary font-semibold block mb-0.5">Demo Prototype</span>
            Phase 1 customer storefront. All orders operate in simulation mode.
          </div>
        </div>
      </div>
    </div>
  );
}
