'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Sparkles, ShoppingBag, Receipt } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCartDrawer } = useCart();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'menu',
      label: 'Menu',
      href: '/menu',
      icon: BookOpen,
      isActive: pathname === '/menu',
    },
    {
      id: 'deals',
      label: 'Deals',
      href: '/deals',
      icon: Sparkles,
      isActive: pathname === '/deals',
    },
    {
      id: 'orders',
      label: 'Orders',
      href: '/orders',
      icon: Receipt,
      isActive: pathname === '/orders',
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Bar"
      className="fixed bottom-0 left-0 w-full flex md:hidden z-50 bg-background/90 backdrop-blur-md border-t border-surface-border px-3 py-2 items-center justify-around shadow-2xl safe-bottom"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.isActive;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors text-[10px] font-semibold',
              active
                ? 'text-secondary font-bold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'p-1.5 rounded-xl transition-all',
                active ? 'bg-secondary/15 text-secondary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Cart Trigger Button */}
      <button
        type="button"
        onClick={openCartDrawer}
        aria-label={`View Shopping Cart (${itemCount} items)`}
        className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-semibold cursor-pointer"
      >
        <div className="relative p-1.5 rounded-xl bg-primary text-white shadow-sm">
          <ShoppingBag className="w-4 h-4" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-secondary text-background font-black text-[9px] flex items-center justify-center border-2 border-surface animate-bounce">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>
        <span className="text-foreground font-bold">Cart</span>
      </button>
    </nav>
  );
}

