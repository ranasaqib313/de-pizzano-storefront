'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Pizza,
  Check,
  X,
  Edit2,
  Sparkles,
  Flame,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { formatCurrency } from '@/lib/format-price';
import {
  toggleProductAvailabilityAction,
  toggleProductFeaturedAction,
  updateProductPriceAction,
} from '@/app/actions/order-actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface AdminProductManagementProps {
  initialProducts: MenuItem[];
}

export function AdminProductManagement({ initialProducts }: AdminProductManagementProps) {
  const [products, setProducts] = useState<MenuItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Price Edit Modal
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  const handleToggleAvailability = async (product: MenuItem) => {
    setUpdatingId(product.id);
    const newStatus = product.isAvailable === false ? true : false;
    try {
      const res = await toggleProductAvailabilityAction(product.id, newStatus);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isAvailable: newStatus } : p))
        );
      } else {
        alert(`Failed to update availability: ${res.error}`);
      }
    } catch (err) {
      alert(`Error updating availability: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (product: MenuItem) => {
    setUpdatingId(product.id);
    const newFeatured = !product.featured;
    try {
      const res = await toggleProductFeaturedAction(product.id, newFeatured);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, featured: newFeatured } : p))
        );
      } else {
        alert(`Failed to update featured status: ${res.error}`);
      }
    } catch (err) {
      alert(`Error updating featured: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSavePrice = async () => {
    if (!editingProduct) return;
    setUpdatingId(editingProduct.id);
    try {
      const res = await updateProductPriceAction(editingProduct.id, newPrice);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, price: newPrice } : p))
        );
        setEditingProduct(null);
      } else {
        alert(`Failed to update price: ${res.error}`);
      }
    } catch (err) {
      alert(`Error updating price: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-surface-border">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish by name or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-surface-border rounded-xl text-xs text-white placeholder-muted focus:outline-none focus:border-secondary"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter products by menu category"
          className="px-3 py-2 bg-surface-elevated border border-surface-border rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
        >
          <option value="all">All Categories ({products.length})</option>
          <option value="pizza-deals">Pizza Deals</option>
          <option value="pizza-flavours">Pizza Flavours</option>
          <option value="special-flavours">Special Flavours</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="pasta-fries">Pasta & Fries</option>
          <option value="sides">Sides</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between text-xs text-muted">
          <span>
            Total catalog items: <strong className="text-white font-bold">{filteredProducts.length}</strong>
          </span>
          <span className="text-secondary font-semibold">
            Price updates apply to all future customer orders immediately
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-light">
            <thead className="bg-surface-elevated/80 text-[11px] uppercase tracking-wider text-muted font-bold border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4">Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price (PKR)</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredProducts.map((product) => {
                const isUpdating = updatingId === product.id;
                const isAvailable = product.isAvailable !== false;

                return (
                  <tr key={product.id} className="hover:bg-surface-elevated/40 transition-colors">
                    {/* Dish image & title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-surface-elevated shrink-0 border border-surface-border">
                          <Image
                            src={product.image || '/images/menu/chicken-tikka-pizza.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{product.name}</span>
                          <span className="text-[11px] text-muted line-clamp-1 max-w-xs">
                            {product.description || 'De Pizzano signature recipe'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-elevated text-white font-medium text-[11px] border border-surface-border uppercase tracking-wider">
                        {product.category.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-secondary text-sm">
                        {formatCurrency(product.price)}
                      </span>
                      {product.isStartingPrice && (
                        <span className="block text-[10px] text-muted">Starting base rate</span>
                      )}
                    </td>

                    {/* Featured Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleFeatured(product)}
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer',
                          product.featured
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-surface text-muted border-surface-border hover:text-white'
                        )}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{product.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleAvailability(product)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer',
                          isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border-red-500/40'
                        )}
                      >
                        {isAvailable ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {isUpdating ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-bold">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(product);
                            setNewPrice(product.price);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-elevated text-secondary border border-surface-border text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Rate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                  Update Dish Price
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {editingProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-surface-elevated text-muted hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1 font-semibold">
                Base Price in PKR:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary font-bold text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-12 pr-4 py-2.5 bg-surface-elevated border border-surface-border rounded-xl text-white font-bold text-base focus:outline-none focus:border-secondary"
                />
              </div>
              <p className="text-[11px] text-muted mt-1.5">
                Current: {formatCurrency(editingProduct.price)}. Updates immediately in server-side calculations.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSavePrice}>
                Save Price
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

