'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, MenuCategoryId } from '@/types/menu';
import { MENU_CATEGORIES } from '@/data/menu';
import { MenuCard } from './MenuCard';
import { MenuFilters } from './MenuFilters';
import { MenuSearch } from './MenuSearch';
import { ProductDialog } from './ProductDialog';
import { AlertCircle, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getMenuProducts } from '@/lib/supabase/services/menu-service';

interface MenuGridProps {
  initialItems: MenuItem[];
}

export function MenuGrid({ initialItems }: MenuGridProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [dataSource, setDataSource] = useState<'database' | 'fallback'>('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);

  // Attempt client-side load from Supabase database
  useEffect(() => {
    let isMounted = true;
    async function loadFromDb() {
      setIsLoading(true);
      try {
        const result = await getMenuProducts();
        if (isMounted) {
          if (result.items && result.items.length > 0) {
            setItems(result.items);
          }
          setDataSource(result.source);
        }
      } catch (err) {
        console.warn('Supabase menu fetch fell back to Phase 1 data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      const categoryMatch =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Search match
      const query = searchTerm.toLowerCase().trim();
      const searchMatch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      return categoryMatch && searchMatch;
    });
  }, [items, selectedCategory, searchTerm]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <MenuFilters
          categories={MENU_CATEGORIES}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalCount={items.length}
        />
        <MenuSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
      </div>

      {/* Results Count & Current Active Filter State & Data Source Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted mb-6 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> of{' '}
            <strong className="text-white">{items.length}</strong> items
            {selectedCategory !== 'all' && (
              <span className="text-secondary ml-1">
                in {MENU_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </span>
            )}
            {searchTerm && (
              <span className="text-primary-light ml-1 font-medium">
                matching &quot;{searchTerm}&quot;
              </span>
            )}
          </span>

          {/* Database Connection Indicator */}
          <div
            data-testid="menu-data-source-indicator"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-elevated border border-surface-border"
            title={dataSource === 'database' ? 'Reading real-time data from Supabase PostgreSQL' : 'Operating in fallback mode with verified Phase 1 menu data'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dataSource === 'database'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            <span className={dataSource === 'database' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
              {dataSource === 'database' ? 'Live Data (Supabase)' : 'Demo Data'}
            </span>
          </div>
        </div>

        {(selectedCategory !== 'all' || searchTerm) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-secondary hover:underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onSelect={(selected) => setActiveItem(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-surface-border rounded-2xl p-12 text-center max-w-md mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No menu items found</h3>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            No dishes match &quot;{searchTerm}&quot; in the selected filter. Try clearing the search or exploring all categories.
          </p>
          <Button variant="primary" size="sm" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Modal Dialog for Product Details */}
      <ProductDialog item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}

