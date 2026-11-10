'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function MenuSearch({ searchTerm, onSearchChange, onClear }: MenuSearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search menu (e.g. Tikka, Lasagne, Fries)..."
          className="w-full bg-surface border border-surface-border text-foreground text-sm rounded-xl pl-10 pr-10 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground bg-surface-elevated hover:bg-surface-border transition-colors"
            aria-label="Clear Search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

