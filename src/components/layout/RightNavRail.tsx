'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  Sparkles,
  MapPin,
  ShoppingBag,
  Compass,
  PhoneCall,
  User,
  Menu,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFoodpandaUrl } from '@/lib/links';

interface RightNavRailProps {
  onOpenMenu?: () => void;
}

export function RightNavRail({ onOpenMenu }: RightNavRailProps) {
  const pathname = usePathname();

  // Do not render the customer navigation rail on admin dashboard pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'menu',
      label: 'Full Menu',
      href: '/menu',
      icon: BookOpen,
      isActive: pathname === '/menu',
    },
    {
      id: 'deals',
      label: 'Deals & Offers',
      href: '/menu#pizza-deals',
      icon: Sparkles,
      isActive: pathname === '/menu' && typeof window !== 'undefined' && window.location.hash === '#pizza-deals',
    },
    {
      id: 'locations',
      label: 'Outlets & Locations',
      href: '/locations',
      icon: MapPin,
      isActive: pathname === '/locations',
    },
    {
      id: 'orders',
      label: 'My Orders',
      href: '/orders',
      icon: ShoppingBag,
      isActive: pathname === '/orders',
    },
    {
      id: 'track',
      label: 'Track Live Order',
      href: '/track',
      icon: Compass,
      isActive: pathname?.startsWith('/track'),
    },
    {
      id: 'contact',
      label: 'Contact & Support',
      href: '/contact',
      icon: PhoneCall,
      isActive: pathname === '/contact',
    },
    {
      id: 'account',
      label: 'Customer Account',
      href: '/login',
      icon: User,
      isActive: pathname === '/login' || pathname === '/register',
    },
  ];

  return (
    <aside
      aria-label="Site Navigation"
      className="hidden lg:flex fixed right-0 top-0 bottom-0 w-[72px] xl:w-[76px] bg-surface/95 border-l border-surface-border z-40 flex-col items-center justify-between py-4 backdrop-blur-md shadow-2xl select-none"
    >
      {/* Top Section: Drawer Trigger & Brand Accent */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {onOpenMenu ? (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open Site Drawer"
            title="Open Site Drawer"
            className="w-11 h-11 rounded-2xl bg-surface-elevated border border-surface-border text-muted-light hover:text-white hover:border-secondary flex items-center justify-center transition-all hover:scale-105 shadow-sm group relative cursor-pointer"
          >
            <Menu className="w-5 h-5 text-secondary" />
            <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3.5 px-2.5 py-1 rounded-xl bg-surface-elevated text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-surface-border transition-opacity duration-150 z-50">
              Navigation Menu
            </span>
          </button>
        ) : (
          <Link
            href="/"
            aria-label="De Pizzano Home"
            title="De Pizzano Home"
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md hover:shadow-glow-red transition-all hover:scale-105"
          >
            <Flame className="w-5 h-5" />
          </Link>
        )}
        <div className="w-8 h-[1px] bg-surface-border/80 my-1" />
      </div>

      {/* Middle Section: Site-Wide Vertical Icon Navigation */}
      <nav aria-label="Primary Navigation" className="flex flex-col items-center gap-2.5 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary',
                active
                  ? 'bg-secondary text-background font-bold shadow-glow-gold scale-105'
                  : 'text-muted-light hover:text-white hover:bg-surface-elevated hover:scale-105 border border-transparent hover:border-surface-border'
              )}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Tooltip flyout on the left */}
              <div
                role="tooltip"
                className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-surface-elevated text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-surface-border transition-all duration-150 flex items-center gap-1.5 z-50"
              >
                <span>{item.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: External Foodpanda link */}
      <div className="flex flex-col items-center gap-2 w-full px-2 pt-2 border-t border-surface-border/80">
        <a
          href={getFoodpandaUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on Foodpanda (External)"
          className="group relative w-10 h-10 rounded-xl bg-[#D70F64]/10 hover:bg-[#D70F64] text-[#D70F64] hover:text-white border border-[#D70F64]/30 flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <ExternalLink className="w-4 h-4" />
          <div
            role="tooltip"
            className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-surface-elevated text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-surface-border transition-all duration-150 z-50"
          >
            Order on Foodpanda
          </div>
        </a>
      </div>
    </aside>
  );
}

