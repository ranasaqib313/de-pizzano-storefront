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

/**
 * De Pizzano Bespoke Right-Side Artisanal Dock
 * Preserves the functional desktop right-side placement while delivering an original,
 * tactile artisanal aesthetic distinct from mass-market industrial navigation bars.
 */
export function RightNavRail({ onOpenMenu }: RightNavRailProps) {
  const pathname = usePathname();

  // Do not render the customer navigation dock on admin dashboard pages
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
      tag: 'Storefront',
    },
    {
      id: 'menu',
      label: 'Full Menu',
      href: '/menu',
      icon: BookOpen,
      isActive: pathname === '/menu',
      tag: '50 Dishes',
    },
    {
      id: 'deals',
      label: 'Deals & Offers',
      href: '/menu#pizza-deals',
      icon: Sparkles,
      isActive: pathname === '/menu' && typeof window !== 'undefined' && window.location.hash === '#pizza-deals',
      tag: 'Value Combos',
    },
    {
      id: 'locations',
      label: 'Outlets & Locations',
      href: '/locations',
      icon: MapPin,
      isActive: pathname === '/locations',
      tag: 'Soldier Bazar',
    },
    {
      id: 'orders',
      label: 'My Orders',
      href: '/orders',
      icon: ShoppingBag,
      isActive: pathname === '/orders',
      tag: 'History',
    },
    {
      id: 'track',
      label: 'Track Live Order',
      href: '/track',
      icon: Compass,
      isActive: pathname?.startsWith('/track'),
      tag: 'Live Status',
    },
    {
      id: 'contact',
      label: 'Contact & Support',
      href: '/contact',
      icon: PhoneCall,
      isActive: pathname === '/contact',
      tag: 'Hotline',
    },
    {
      id: 'account',
      label: 'Customer Account',
      href: '/login',
      icon: User,
      isActive: pathname === '/login' || pathname === '/register',
      tag: 'Profile',
    },
  ];

  return (
    <aside
      aria-label="Site Navigation"
      className="hidden lg:flex fixed right-0 top-0 bottom-0 w-[74px] xl:w-[78px] bg-[#161311]/95 border-l border-[#38302B] z-40 flex-col items-center justify-between py-4 backdrop-blur-xl shadow-2xl select-none"
    >
      {/* Top Section: Brand Seal & Drawer Trigger */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {onOpenMenu ? (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open Site Drawer"
            title="Open Site Drawer"
            className="w-11 h-11 rounded-2xl bg-[#221C19] border border-[#3D352E] text-muted-light hover:text-white hover:border-secondary flex items-center justify-center transition-all hover:scale-105 shadow-sm group relative cursor-pointer"
          >
            <Menu className="w-5 h-5 text-secondary transition-transform group-hover:rotate-90 duration-300" />
            <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-[#221C19] text-white text-xs font-semibold whitespace-nowrap shadow-2xl border border-[#3D352E] transition-opacity duration-150 z-50">
              Quick Menu Drawer
            </span>
          </button>
        ) : (
          <Link
            href="/"
            aria-label="De Pizzano Home"
            title="De Pizzano Home"
            className="group relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary-hover to-primary-dark flex items-center justify-center text-white shadow-lg hover:shadow-glow-red transition-all hover:scale-105"
          >
            <Flame className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-[#221C19] text-white text-xs font-semibold whitespace-nowrap shadow-2xl border border-[#3D352E] transition-opacity duration-150 z-50">
              De Pizzano Kitchen
            </span>
          </Link>
        )}
        <div className="w-7 h-[1px] bg-gradient-to-r from-transparent via-[#4A3F36] to-transparent my-1" />
      </div>

      {/* Middle Section: Artisanal Vertical Dock */}
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
                  ? 'bg-gradient-to-b from-[#F3B544] to-[#E0A02E] text-neutral-950 font-bold shadow-glow-gold scale-105'
                  : 'text-[#B8ACA2] hover:text-[#FFF7EA] hover:bg-[#251F1B] hover:scale-105 border border-transparent hover:border-[#3D352E]'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', active && 'stroke-[2.5]')} />

              {/* Active Indicator Accent */}
              {active && (
                <span className="absolute -left-1 w-1 h-5 rounded-r-full bg-[#F3B544] shadow-[0_0_8px_#F3B544]" />
              )}

              {/* Bespoke Artisanal Tooltip flyout on the left */}
              <div
                role="tooltip"
                className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-[#221C19] text-white text-xs font-semibold whitespace-nowrap shadow-2xl border border-[#3D352E] transition-all duration-150 flex items-center gap-2 z-50"
              >
                <span className="text-[#FFF7EA]">{item.label}</span>
                <span className="text-[10px] uppercase font-bold text-secondary bg-[#2D2520] px-1.5 py-0.5 rounded-md border border-[#483E38]">
                  {item.tag}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_5px_#F3B544]" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: External Foodpanda reference badge */}
      <div className="flex flex-col items-center gap-2 w-full px-2 pt-2 border-t border-[#38302B]">
        <a
          href={getFoodpandaUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on Foodpanda (External)"
          className="group relative w-10 h-10 rounded-xl bg-[#D70F64]/10 hover:bg-[#D70F64] text-[#D70F64] hover:text-white border border-[#D70F64]/30 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <div
            role="tooltip"
            className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#221C19] text-white text-xs font-semibold whitespace-nowrap shadow-2xl border border-[#3D352E] transition-all duration-150 z-50 flex items-center gap-1.5"
          >
            <span>Foodpanda Partner</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D70F64]" />
          </div>
        </a>
      </div>
    </aside>
  );
}
