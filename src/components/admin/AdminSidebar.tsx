'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  LayoutDashboard,
  ShoppingBag,
  Pizza,
  Layers,
  Tag,
  Settings,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/data/business';

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Live Orders', href: '/admin/orders', icon: ShoppingBag, badge: 'Live' },
  { label: 'Menu Catalog', href: '/admin/products', icon: Pizza, count: 50 },
  { label: 'Categories', href: '/admin/categories', icon: Layers, count: 6 },
  { label: 'Deals & Promos', href: '/admin/deals', icon: Tag },
  { label: 'Restaurant Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 lg:w-72 bg-surface/95 border-r border-surface-border min-h-screen flex flex-col justify-between p-4 sticky top-0 shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-surface-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow-red">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-base font-black text-white font-display uppercase tracking-wider block">
              DE PIZZANO
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-secondary font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>Operations Suite</span>
            </div>
          </div>
        </div>

        {/* Branch / Kitchen Status */}
        <div className="px-3 py-2.5 rounded-xl bg-surface-elevated border border-surface-border/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted text-[11px]">Primary Kitchen:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-white font-bold text-xs mt-1 truncate">
            {BUSINESS_CONFIG.primaryLocation.name}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-primary text-white shadow-glow-red font-bold'
                    : 'text-muted-light hover:text-white hover:bg-surface-elevated'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-secondary')} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-md bg-secondary text-black font-extrabold text-[9px] uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] text-muted px-1.5 py-0.2 rounded bg-surface">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-muted-dark')} />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront Link */}
      <div className="pt-4 border-t border-surface-border space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-elevated/60 border border-surface-border text-xs text-muted-light hover:text-white hover:bg-surface-elevated transition-colors"
        >
          <span className="font-semibold">View Customer Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-secondary" />
        </Link>
        <div className="text-[10px] text-muted-dark text-center">
          De Pizzano Kitchen OS v2.0 • Soldier Bazar
        </div>
      </div>
    </aside>
  );
}

