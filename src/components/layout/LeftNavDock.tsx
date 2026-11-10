'use client';

import React, { useState } from 'react';
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
  ExternalLink,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFoodpandaUrl } from '@/lib/links';

/**
 * The Aurora Floating Glass Dock
 * A premium, floating pill-shaped navigation dock positioned fixed on the left side.
 * Features Framer Motion spring hover expansions, active anchor indicator, and glassmorphism.
 */
interface LeftNavDockProps {
  /** Called whenever the dock transitions between collapsed and expanded. */
  onExpandedChange?: (isExpanded: boolean) => void;
}

export function LeftNavDock({ onExpandedChange }: LeftNavDockProps) {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Hide the dock on admin dashboard pages
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
      tag: 'Store',
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
      href: '/deals',
      icon: Sparkles,
      isActive: pathname === '/deals',
      tag: 'Combos',
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
  ];

  return (
    <aside
      aria-label="Site Navigation"
      className="hidden md:flex fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-start select-none group/dock"
      onMouseEnter={() => onExpandedChange?.(true)}
      onMouseLeave={() => onExpandedChange?.(false)}
    >
      {/* Aurora Ambient Backlight */}
      <div
        aria-hidden="true"
        className="absolute -inset-2.5 rounded-[42px] bg-gradient-to-b from-primary/30 via-secondary/25 to-primary/25 blur-2xl opacity-60 group-hover/dock:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
      />

      {/* Subtle Gradient Border Wrapper for Glassmorphism Pop */}
      <div className="relative p-[1px] rounded-[38px] bg-gradient-to-b from-white/20 via-white/5 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent shadow-2xl">
        
        {/* Floating Glassmorphic Pill Dock Body */}
        <div className="relative flex flex-col items-start p-2 rounded-[37px] bg-[var(--dock-bg)]/90 backdrop-blur-2xl">
          
          {/* Brand Crest / Home Quick Link */}
          <Link
            href="/"
            aria-label="De Pizzano Kitchen"
            onMouseEnter={() => setHoveredId('brand')}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative flex items-center h-11 rounded-full cursor-pointer overflow-hidden text-foreground hover:bg-white/[0.08] dark:hover:bg-white/[0.08] transition-colors duration-200"
          >
            <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-primary via-primary-hover to-primary-dark flex items-center justify-center text-white shadow-md group-hover:shadow-glow-red transition-all">
              <motion.div
                animate={{ scale: hoveredId === 'brand' ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Flame className="w-5 h-5" />
              </motion.div>
            </div>
            <motion.div
              initial={false}
              animate={{
                width: hoveredId === 'brand' ? 'auto' : 0,
                opacity: hoveredId === 'brand' ? 1 : 0,
                paddingRight: hoveredId === 'brand' ? 14 : 0,
                paddingLeft: hoveredId === 'brand' ? 8 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="overflow-hidden whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
            >
              <span className="text-xs font-black tracking-wider uppercase text-foreground">
                DE PIZZANO
              </span>
            </motion.div>
          </Link>

          {/* Divider */}
          <div className="w-7 h-[1px] bg-border mx-auto my-1.5 self-center" />

          {/* Primary Navigation Items */}
          <nav aria-label="Primary Dock Navigation" className="flex flex-col items-start gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.isActive;
              const isHovered = hoveredId === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-label={item.label}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    'relative flex items-center h-11 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary select-none transition-colors duration-200',
                    active
                      ? 'bg-gradient-to-r from-primary via-[#D84A2A] to-secondary text-white font-bold shadow-[0_0_18px_rgba(220,38,38,0.55)]'
                      : 'text-foreground/80 hover:bg-white/[0.08] dark:hover:bg-white/[0.08] hover:text-foreground'
                  )}
                >
                  {/* Glowing Vertical Bar for Active Icon Anchor */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="w-1 h-6 bg-secondary rounded-r-full absolute -left-1.5 shadow-[0_0_12px_#F3B544]"
                    />
                  )}

                  {/* Icon Container with smooth scale on hover */}
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5 transition-colors',
                          active && 'stroke-[2.5]'
                        )}
                      />
                    </motion.div>
                  </div>

                  {/* Smooth Framer Motion Spring Expansion for Label */}
                  <motion.div
                    initial={false}
                    animate={{
                      width: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0,
                      paddingRight: isHovered ? 14 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="overflow-hidden whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
                  >
                    <span className="text-xs font-bold leading-none">{item.label}</span>
                    {item.tag && (
                      <span
                        className={cn(
                          'text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full leading-none shrink-0',
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-secondary/20 text-secondary'
                        )}
                      >
                        {item.tag}
                      </span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="w-7 h-[1px] bg-border mx-auto my-1.5 self-center" />

          {/* External Foodpanda Partner Pill */}
          <a
            href={getFoodpandaUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on Foodpanda"
            onMouseEnter={() => setHoveredId('foodpanda')}
            onMouseLeave={() => setHoveredId(null)}
            className="relative flex items-center h-10 rounded-full cursor-pointer overflow-hidden text-[#D70F64] hover:bg-[#D70F64]/10 transition-colors duration-200"
          >
            <div className="w-11 h-10 shrink-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: hoveredId === 'foodpanda' ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.div>
            </div>
            <motion.div
              initial={false}
              animate={{
                width: hoveredId === 'foodpanda' ? 'auto' : 0,
                opacity: hoveredId === 'foodpanda' ? 1 : 0,
                paddingRight: hoveredId === 'foodpanda' ? 14 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="overflow-hidden whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
            >
              <span className="text-[11px] font-bold">Foodpanda</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D70F64]" />
            </motion.div>
          </a>
        </div>
      </div>
    </aside>
  );
}
