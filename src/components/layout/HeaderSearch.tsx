'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Sparkles, ArrowRight, Pizza } from 'lucide-react';
import { MENU_ITEMS } from '@/data/menu';
import { MenuItem } from '@/types/menu';
import { cn } from '@/lib/utils';
import { formatPkr } from '@/lib/cart-calculations';

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<MenuItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const filtered = MENU_ITEMS.filter((item) => {
      const matchName = item.name.toLowerCase().includes(trimmed);
      const matchDesc = item.description?.toLowerCase().includes(trimmed);
      const matchCat = item.category.toLowerCase().includes(trimmed);
      return matchName || matchDesc || matchCat;
    }).slice(0, 6);

    setResults(filtered);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/menu?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (item: MenuItem) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/menu?search=${encodeURIComponent(item.name)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search menu..."
          aria-label="Search menu"
          className="w-full pl-9 pr-12 md:pr-20 py-2 sm:py-2.5 rounded-full bg-surface border border-surface-border hover:border-surface-highlight focus:border-secondary focus:bg-surface-elevated text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-inner"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-surface-elevated border border-surface-border text-[10px] font-mono text-muted-foreground select-none">
              Ctrl K
            </kbd>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (query.trim().length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface/98 border border-surface-border rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden divide-y divide-surface-border/60 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 bg-surface-elevated/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Discovered Dishes ({results.length})</span>
            <span className="text-secondary font-semibold">Press Enter to view all</span>
          </div>

          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-surface-elevated transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-elevated shrink-0 border border-surface-border">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Pizza className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-secondary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[220px]">
                        {item.description || item.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-secondary">
                      {formatPkr(item.price)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-xs">
              No dishes found matching &quot;{query}&quot;. Try &quot;Tikka&quot;, &quot;Deal&quot;, or &quot;Fries&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
