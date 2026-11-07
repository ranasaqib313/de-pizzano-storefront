import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getMenuCategories, getMenuProducts } from '@/lib/supabase/services/menu-service';
import { MENU_CATEGORIES } from '@/data/menu';
import { Layers, CheckCircle2, Flame, Pizza, Sparkles, Sandwich, Soup, Drumstick } from 'lucide-react';

export const dynamic = 'force-dynamic';

function getCategoryIcon(id: string) {
  switch (id) {
    case 'pizza-deals':
      return Sparkles;
    case 'pizza-flavours':
      return Pizza;
    case 'special-flavours':
      return Flame;
    case 'sandwiches':
      return Sandwich;
    case 'pasta-fries':
      return Soup;
    case 'sides':
      return Drumstick;
    default:
      return Layers;
  }
}

export default async function AdminCategoriesPage() {
  const [{ categories }, { items }] = await Promise.all([
    getMenuCategories(),
    getMenuProducts(),
  ]);

  const activeCategories = categories && categories.length > 0 ? categories : MENU_CATEGORIES;

  const categoriesWithCounts = activeCategories.map((c) => ({
    ...c,
    count: items.filter((it) => it.category === c.id).length,
  }));

  return (
    <div>
      <AdminHeader
        title="Menu Categories"
        subtitle="Manage the 6 authentic De Pizzano menu category classifications and display order."
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.id);

            return (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-surface border border-surface-border flex flex-col justify-between hover:border-secondary/40 transition-all shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-elevated text-secondary flex items-center justify-center border border-surface-border">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>

                  <span className="text-[10px] text-muted uppercase font-bold tracking-widest block mb-1">
                    Sort Index: #{idx + 1} • Slug: {cat.id}
                  </span>
                  <h3 className="text-xl font-black text-white font-display mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-6">
                    {cat.description || 'Verified De Pizzano culinary category.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border/80 flex items-center justify-between text-xs">
                  <span className="text-muted">Assigned Products:</span>
                  <span className="font-extrabold text-white bg-surface-elevated px-3 py-1 rounded-xl border border-surface-border">
                    {cat.count} Dishes
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

