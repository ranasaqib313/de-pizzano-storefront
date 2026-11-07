'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tag, Sparkles, Plus, Check, Clock, Percent, ShieldCheck, Flame } from 'lucide-react';
import { formatCurrency } from '@/lib/format-price';
import { Button } from '@/components/ui/Button';

interface PromoVoucher {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  isActive: boolean;
  expiresAt: string;
}

const INITIAL_VOUCHERS: PromoVoucher[] = [
  {
    id: 'v1',
    code: 'WELCOME10',
    description: '10% discount for first-time website orders.',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 800,
    isActive: true,
    expiresAt: 'Dec 31, 2026',
  },
  {
    id: 'v2',
    code: 'SOLDIERBAZAR',
    description: 'Rs. 100 off delivery fee on local Soldier Bazar orders.',
    discountType: 'fixed',
    discountValue: 100,
    minOrder: 500,
    isActive: true,
    expiresAt: 'Ongoing',
  },
  {
    id: 'v3',
    code: 'FAMILYFEAST',
    description: 'Rs. 250 off orders containing 2 or more Large pizzas.',
    discountType: 'fixed',
    discountValue: 250,
    minOrder: 1800,
    isActive: false,
    expiresAt: 'Expired',
  },
];

const DEALS_SUMMARY = [
  { number: 1, title: 'Small Pizza + 345ml Drink', price: 400, type: 'Solo Deal' },
  { number: 2, title: 'Regular Pizza + 345ml Drink', price: 750, type: 'Regular Deal' },
  { number: 3, title: 'Large Pizza + 1L Drink', price: 1000, type: 'Large Deal' },
  { number: 4, title: '2 Regular Pizzas + 1L Drink', price: 1450, type: 'Duo Combo' },
  { number: 5, title: '2 Large Pizzas + 1.5L Drink', price: 1950, type: 'Family Combo' },
  { number: 6, title: '3 Regular Pizzas + 1.5L Drink', price: 2150, type: 'Party Combo' },
  { number: 7, title: '3 Large Pizzas + 1.5L Drink', price: 2900, type: 'Grand Feast' },
  { number: 8, title: 'Small Pizza + 2 Pcs Garlic Bread + Drink', price: 550, type: 'Snack Combo' },
  { number: 9, title: 'Regular Pizza + 4 Pcs Wings + Drink', price: 950, type: 'Wing Combo' },
  { number: 10, title: 'Large Pizza + 4 Pcs Wings + 1L Drink', price: 1250, type: 'Mega Combo' },
];

export default function AdminDealsPage() {
  const [vouchers, setVouchers] = useState<PromoVoucher[]>(INITIAL_VOUCHERS);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newValue, setNewValue] = useState(10);
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');

  const handleToggleVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newV: PromoVoucher = {
      id: `v-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      description: newDesc.trim() || 'Special promotional discount.',
      discountType: newType,
      discountValue: newValue,
      minOrder: 500,
      isActive: true,
      expiresAt: 'Dec 31, 2026',
    };

    setVouchers((prev) => [newV, ...prev]);
    setNewCode('');
    setNewDesc('');
    setShowNewModal(false);
  };

  return (
    <div>
      <AdminHeader
        title="Deals & Promotions Management"
        subtitle="Manage promotional discount codes, validity windows and review active meal bundle configurations."
      />

      <div className="p-6 space-y-8">
        {/* Vouchers Section */}
        <div className="rounded-3xl bg-surface border border-surface-border p-6 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
                <Tag className="w-5 h-5 text-secondary" />
                <span>Promotional Discount Codes</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Vouchers are validated strictly server-side during checkout to prevent client tampering.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowNewModal(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Create New Voucher
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className={`p-5 rounded-2xl border transition-all ${
                  v.isActive
                    ? 'bg-surface-elevated/70 border-secondary/40 shadow-sm'
                    : 'bg-surface/50 border-surface-border opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-base font-black text-secondary tracking-wider">
                    {v.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleVoucher(v.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      v.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-surface text-muted border-surface-border'
                    }`}
                  >
                    {v.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <p className="text-xs text-muted-light mb-4">{v.description}</p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-surface-border/60">
                  <span className="font-bold text-white">
                    {v.discountType === 'percentage' ? `${v.discountValue}% OFF` : `Rs. ${v.discountValue} OFF`}
                  </span>
                  <span className="text-[11px] text-muted">Valid: {v.expiresAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Deals Bundle Catalog */}
        <div className="rounded-3xl bg-surface border border-surface-border p-6 shadow-card">
          <div className="pb-4 border-b border-surface-border">
            <h2 className="text-lg font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>Active Value Bundle Deals (10 Deals)</span>
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Verified bundle rates with included chilled soft drinks. Sourced from authentic restaurant menu data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6">
            {DEALS_SUMMARY.map((deal) => (
              <div
                key={deal.number}
                className="p-4 rounded-2xl bg-surface-elevated/50 border border-surface-border flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
                    Deal #{deal.number}
                  </span>
                  <h4 className="text-xs font-bold text-white mb-2 leading-tight">
                    {deal.title}
                  </h4>
                </div>
                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
                  <span className="text-sm font-black text-secondary">
                    {formatCurrency(deal.price)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Voucher Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateVoucher}
            className="w-full max-w-md bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white font-display">Create Promotional Voucher</h3>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Voucher Code:</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. FLASH20"
                className="w-full px-3.5 py-2 bg-surface-elevated border border-surface-border rounded-xl text-white font-mono uppercase focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Description:</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. 20% off for weekend pizza cravings"
                className="w-full px-3.5 py-2 bg-surface-elevated border border-surface-border rounded-xl text-white text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Discount Type:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface-elevated border border-surface-border rounded-xl text-white text-xs focus:outline-none focus:border-secondary"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed PKR (Rs.)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Value:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-surface-border rounded-xl text-white text-xs focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-border">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Voucher
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

