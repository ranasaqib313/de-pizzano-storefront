'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, MenuCategoryId, MenuCategory } from '@/types/menu';
import { MENU_CATEGORIES } from '@/data/menu';
import { MenuCard } from './MenuCard';
import { MenuFilters } from './MenuFilters';
import { MenuSearch } from './MenuSearch';
import { ProductDialog } from './ProductDialog';
import { AlertCircle, Database, Sparkles, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getMenuProducts, getMenuCategories } from '@/lib/supabase/services/menu-service';
import { cn } from '@/lib/utils';

interface MenuGridProps {
  initialItems: MenuItem[];
  initialCategories?: MenuCategory[];
  initialSource?: 'database' | 'fallback';
}

export function MenuGrid({ initialItems, initialCategories, initialSource = 'fallback' }: MenuGridProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories && initialCategories.length > 0 ? initialCategories : MENU_CATEGORIES);
  const [dataSource, setDataSource] = useState<'database' | 'fallback'>(initialSource);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Attempt client-side load from Supabase database
  useEffect(() => {
    let isMounted = true;
    async function loadFromDb() {
      setIsLoading(true);
      try {
        const [prodResult, catResult] = await Promise.all([
          getMenuProducts(),
          getMenuCategories(),
        ]);
        if (isMounted) {
          if (prodResult.items && prodResult.items.length > 0) {
            setItems(prodResult.items.filter((i) => i.category !== 'pizza-deals'));
          }
          if (catResult.categories && catResult.categories.length > 0) {
            setCategories(catResult.categories.filter((c) => c.id !== 'pizza-deals'));
          }
          setDataSource(prodResult.source);
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

  // Compute live item counts per category
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      itemCount: items.filter((item) => item.category === cat.id).length,
    }));
  }, [categories, items]);

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
    <div className="space-y-6">
      {/* Horizontal Category Pill Filters (Across all screen sizes) */}
      <div className="w-full">
        <MenuFilters
          categories={categoriesWithCounts}
          activeCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          totalCount={items.length}
        />
      </div>

      {/* Toolbar: Results Count, Connection Indicator, Search & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-surface-border">
        {/* Results Counter & Active Category */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-light">
          <span>
            Showing <strong className="text-white font-mono">{filteredItems.length}</strong> of{' '}
            <strong className="text-white font-mono">{items.length}</strong> dishes
            {selectedCategory !== 'all' && (
              <span className="text-secondary ml-1 font-semibold">
                in {categories.find((c) => c.id === selectedCategory)?.label || selectedCategory}
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

          {(selectedCategory !== 'all' || searchTerm) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-secondary hover:underline font-semibold cursor-pointer ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Search Bar & View Mode Toggle Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <MenuSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />
          </div>

          {/* Grid / List View Toggle */}
          <div
            className="flex items-center bg-surface-elevated border border-surface-border rounded-xl p-1 shrink-0"
            role="group"
            aria-label="Product layout view"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-white'
              )}
              title="Grid View"
              aria-pressed={viewMode === 'grid'}
              aria-label="Switch to grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-white'
              )}
              title="List View"
              aria-pressed={viewMode === 'list'}
              aria-label="Switch to list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Width Product Catalog Browsing Area */}
      <main className="w-full" aria-label="Product Catalog">
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  layout="grid"
                  onSelect={(selected) => setActiveItem(selected)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  layout="list"
                  onSelect={(selected) => setActiveItem(selected)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border">
            <AlertCircle className="w-10 h-10 text-muted mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Dishes Found</h4>
            <p className="text-xs text-muted mb-4">
              No menu items match your search &quot;{searchTerm}&quot; in{' '}
              {selectedCategory === 'all' ? 'the entire menu' : selectedCategory}.
            </p>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      {/* Interactive Customization & Variant Dialog */}
      <ProductDialog
        item={activeItem}
        onClose={() => setActiveItem(null)}
      />
    </div>
  );
}
