'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Flame,
  ShoppingBag,
  User,
  LogOut,
  Bike,
  Store,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { BUSINESS_CONFIG } from '@/data/business';
import { MobileMenu } from './MobileMenu';
import { OrderTypeModal } from './OrderTypeModal';
import { HeaderSearch } from './HeaderSearch';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { itemCount, openCartDrawer, orderType, selectedZone } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();

  return (
    <>
      {/* Main Top Header - Sticky, Glassmorphic, and Perfectly Spaced */}
      <header className="sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-all duration-200 py-3 sm:py-3.5">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            
            {/* LEFT: De Pizzano Brand Logo & Delivery Selector */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink min-w-0">
              <Link
                href="/"
                className="group flex items-center gap-1.5 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-0.5 sm:p-1 shrink-0"
                aria-label="De Pizzano Home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-glow-red transition-all group-hover:scale-105 shrink-0">
                  <Flame className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-base sm:text-xl font-black tracking-wider text-foreground font-display uppercase group-hover:text-secondary transition-colors leading-tight truncate">
                  DE PIZZANO
                </span>
              </Link>

              {/* Delivery / Location Selector (Compact Reference UI) */}
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-surface border border-surface-border hover:border-secondary/60 text-foreground transition-all shadow-sm hover:bg-surface-elevated cursor-pointer select-none shrink-0 group text-left"
                title="Click to select delivery location or order mode"
                aria-label="Select delivery location"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/15 group-hover:bg-secondary/25 text-secondary flex items-center justify-center shrink-0 transition-colors">
                  {orderType === 'delivery' ? (
                    <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                  ) : (
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground tracking-wide hidden sm:block">
                    {orderType === 'delivery' ? 'Delivery • 30-40 min' : 'Pickup • 15-25 min'}
                  </span>
                  <span className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-bold text-foreground group-hover:text-secondary transition-colors max-w-[75px] min-[400px]:max-w-[110px] sm:max-w-none truncate">
                    {orderType === 'delivery'
                      ? (selectedZone ? selectedZone.areaName : 'Select Location')
                      : 'Takeaway'}
                    <ChevronDown className="w-3 h-3 text-secondary shrink-0 transition-transform group-hover:translate-y-0.5" />
                  </span>
                </div>
              </button>
            </div>

            {/* CENTER: Expandable Search Bar with max-w-2xl */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-3 lg:mx-6">
              <HeaderSearch />
            </div>

            {/* RIGHT: User Profile/Sign-In -> ThemeToggle -> Cart Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              
              {/* User / Profile Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Link
                    href="/orders"
                    className="p-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-xl bg-surface border border-surface-border text-foreground hover:bg-surface-elevated hover:border-secondary/70 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer select-none active:scale-95"
                    title="View My Profile & Orders"
                    aria-label="Customer Profile & Orders"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary shrink-0" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {profile?.full_name || user?.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary rounded-xl bg-surface border border-surface-border hover:border-primary/50 transition-colors cursor-pointer select-none"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-xl bg-surface border border-surface-border text-foreground hover:bg-surface-elevated hover:border-secondary/70 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer select-none active:scale-95"
                  title="Sign In / Customer Profile"
                  aria-label="Sign In / Customer Profile"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary shrink-0" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Theme Toggle Button (Light <-> Dark binary switch with Circular Reveal) */}
              <ThemeToggle />

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCartDrawer}
                aria-label={`View Shopping Cart (${itemCount} items)`}
                className="relative px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white dark:text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-glow-gold flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline font-extrabold uppercase tracking-wide">
                  Cart
                </span>
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 dark:bg-black/20 text-current text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 text-foreground bg-surface border border-surface-border hover:bg-surface-elevated rounded-xl lg:hidden focus:outline-none transition-colors cursor-pointer shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search Input Row */}
          <div className="mt-2.5 md:hidden">
            <HeaderSearch />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={pathname}
      />

      {/* Order Type & Location Modal */}
      <OrderTypeModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </>
  );
}
