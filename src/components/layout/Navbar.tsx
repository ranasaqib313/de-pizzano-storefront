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
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { itemCount, openCartDrawer, orderType, selectedZone } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Concept Disclaimer Announcement Bar */}
      <div className="bg-gradient-to-r from-neutral-950 via-primary/25 to-neutral-950 border-b border-primary/20 text-xs py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-muted-light">
          <span className="font-semibold text-secondary tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            {BUSINESS_CONFIG.demoNotice.badge}
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="text-[11px] text-muted">
            {BUSINESS_CONFIG.demoNotice.disclaimer}
          </span>
        </div>
      </div>

      {/* Main Top Header */}
      <header
        className={cn(
          'sticky top-0 z-30 w-full transition-all duration-300 backdrop-blur-xl',
          isScrolled
            ? 'bg-background/95 border-b border-surface-border shadow-xl py-2.5 sm:py-3'
            : 'bg-background/85 border-b border-surface-border/60 py-3 sm:py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
            {/* LEFT: De Pizzano Brand Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink min-w-0">
              <Link
                href="/"
                className="group flex items-center gap-1.5 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-0.5 sm:p-1 shrink min-w-0"
                aria-label="De Pizzano Home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-glow-red transition-all group-hover:scale-105 shrink-0">
                  <Flame className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm sm:text-xl font-black tracking-wider text-white font-display uppercase group-hover:text-secondary transition-colors leading-tight truncate">
                    DE PIZZANO
                  </span>
                  <span className="hidden md:block text-[10px] tracking-widest uppercase text-muted -mt-0.5 font-semibold">
                    {BUSINESS_CONFIG.tagline} • Soldier Bazar
                  </span>
                </div>
              </Link>

              {/* NEXT: Delivery / Location Selector Pill (Full on sm, compact on mobile) */}
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-surface border border-surface-border hover:border-secondary/60 text-xs text-white transition-all shadow-sm hover:bg-surface-elevated cursor-pointer select-none shrink-0"
                title="Click to switch Delivery / Takeaway location"
              >
                {orderType === 'delivery' ? (
                  <>
                    <Bike className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-muted-light font-medium leading-none">
                        Delivery • 30-40 min
                      </span>
                      <span className="font-bold text-white text-xs truncate max-w-[100px] sm:max-w-[130px] leading-tight">
                        {selectedZone?.name?.replace(' (Primary)', '') || 'Soldier Bazar'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-muted-light font-medium leading-none">
                        Takeaway Pickup
                      </span>
                      <span className="font-bold text-white text-xs leading-tight">
                        Soldier Bazar No. 3
                      </span>
                    </div>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-muted ml-0.5" />
              </button>

              {/* Mobile Compact Location Button */}
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-full bg-surface border border-surface-border hover:border-secondary/60 text-[11px] text-white transition-all shadow-sm shrink-0"
                title="Click to switch Delivery / Takeaway location"
              >
                <Bike className="w-3 h-3 text-secondary shrink-0" />
                <span className="font-bold text-[10px] text-muted-light truncate max-w-[70px]">
                  {selectedZone?.name?.replace(' (Primary)', '') || 'Bazar'}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-muted" />
              </button>
            </div>

            {/* CENTER: Large Expandable Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-2">
              <HeaderSearch />
            </div>

            {/* RIGHT: Sign In / Account & Cart Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Account / User Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Link
                    href="/orders"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-surface border border-surface-border text-white hover:bg-surface-elevated hover:border-secondary transition-all flex items-center gap-1.5 shadow-sm"
                    title="View My Orders"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {profile?.full_name || user?.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-1.5 sm:p-2 text-muted hover:text-primary rounded-xl bg-surface border border-surface-border transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden xs:flex px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-surface border border-surface-border text-muted-light hover:text-white hover:border-secondary transition-all items-center gap-1.5 shadow-sm"
                  title="Sign In / Customer Account"
                  aria-label="Customer Login"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Cart Button: High-visibility pill button matching Broadway's yellow cart */}
              <button
                type="button"
                onClick={openCartDrawer}
                aria-label={`View Shopping Cart (${itemCount} items)`}
                className="relative px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-background font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-glow-gold flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-background" />
                <span className="hidden sm:inline font-extrabold uppercase tracking-wide">
                  Cart
                </span>
                <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-background text-secondary text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              </button>

              {/* Mobile Menu Hamburger (Visible on mobile/tablet) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 text-muted-light hover:text-white bg-surface border border-surface-border rounded-xl lg:hidden focus:outline-none transition-colors cursor-pointer shrink-0"
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
