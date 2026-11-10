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
      <header className="sticky top-0 z-[100] w-full bg-background/90 backdrop-blur-md border-b border-border/40 shadow-sm transition-all duration-200 py-2 sm:py-3">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-6">
            
            {/* LEFT: De Pizzano Brand Logo & Delivery Selector */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink min-w-0">
              <Link
                href="/"
                className="group flex items-center gap-1.5 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-0.5 shrink-0"
                aria-label="De Pizzano Home"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-glow-red transition-all shrink-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-sm sm:text-lg lg:text-xl font-black tracking-wider text-foreground font-display uppercase group-hover:text-secondary transition-colors leading-tight">
                  DE PIZZANO
                </span>
              </Link>

              {/* Delivery / Location Selector (Compact Reference UI) */}
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2.5 py-1 rounded-xl bg-surface border border-surface-border hover:border-secondary/60 text-foreground transition-all shadow-sm hover:bg-surface-elevated cursor-pointer select-none shrink-0 group text-left"
                title="Click to select delivery location or order mode"
                aria-label="Select delivery location"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-secondary/15 group-hover:bg-secondary/25 text-secondary flex items-center justify-center shrink-0 transition-colors">
                  {orderType === 'delivery' ? (
                    <Bike className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" />
                  ) : (
                    <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" />
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wide hidden sm:block">
                    {orderType === 'delivery' ? 'Delivery • 30-40 min' : 'Pickup • 15-25 min'}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-foreground group-hover:text-secondary transition-colors max-w-[65px] min-[380px]:max-w-[90px] sm:max-w-none truncate">
                    {orderType === 'delivery'
                      ? (selectedZone ? selectedZone.areaName : 'Karachi')
                      : 'Takeaway'}
                    <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary shrink-0 transition-transform group-hover:translate-y-0.5" />
                  </span>
                </div>
              </button>
            </div>

            {/* CENTER: Expandable Search Bar with max-w-2xl */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-3 lg:mx-6">
              <HeaderSearch />
            </div>

            {/* RIGHT: User Profile/Sign-In -> ThemeToggle -> Cart Button -> Hamburger */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* User / Profile Button - Hidden on mobile <420px to prevent crowding */}
              {isAuthenticated ? (
                <div className="hidden min-[420px]:flex items-center gap-1">
                  <Link
                    href="/orders"
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold rounded-xl bg-surface border border-surface-border text-foreground hover:bg-surface-elevated hover:border-secondary/70 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer select-none"
                    title="View My Profile & Orders"
                    aria-label="Customer Profile & Orders"
                  >
                    <User className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {profile?.full_name || user?.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-1.5 text-muted-foreground hover:text-primary rounded-xl bg-surface border border-surface-border hover:border-primary/50 transition-colors cursor-pointer select-none"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden min-[420px]:flex p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold rounded-xl bg-surface border border-surface-border text-foreground hover:bg-surface-elevated hover:border-secondary/70 transition-all items-center gap-1.5 shadow-sm cursor-pointer select-none"
                  title="Sign In / Customer Profile"
                  aria-label="Sign In / Customer Profile"
                >
                  <User className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Theme Toggle Button - Hidden on small mobile <400px (accessible in mobile menu) */}
              <div className="hidden min-[400px]:flex items-center">
                <ThemeToggle />
              </div>

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCartDrawer}
                aria-label={`View Shopping Cart (${itemCount} items)`}
                className="relative px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white dark:text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-glow-gold flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline font-extrabold uppercase tracking-wide">
                  Cart
                </span>
                <span className="w-4 h-4 rounded-full bg-white/25 dark:bg-black/25 text-current text-[10px] sm:text-[11px] font-black flex items-center justify-center">
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
          <div className="mt-2 md:hidden">
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
