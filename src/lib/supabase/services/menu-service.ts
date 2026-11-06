import { createClient, isSupabaseConfigured } from '../client';
import { Database } from '../types';
import { MenuItem, MenuCategory } from '@/types/menu';
import { MENU_ITEMS, MENU_CATEGORIES } from '@/data/menu';
import { getPizzaVariants, PIZZA_CRUST_OPTIONS, PIZZA_ADDON_OPTIONS } from '@/data/product-customizations';

type DbCategory = Database['public']['Tables']['categories']['Row'];

export interface DbProductWithRelations {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  base_price: number;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  product_variants: {
    id: string;
    product_id: string;
    name: string;
    price_delta: number;
    is_default: boolean;
    sort_order: number;
  }[];
  product_options: {
    id: string;
    product_id: string;
    option_group: string;
    name: string;
    price_delta: number;
    is_default: boolean;
    max_selections: number;
  }[];
  categories?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  } | null;
}

/**
 * Fetches menu items from Supabase PostgreSQL database.
 * If Supabase is not configured or an error occurs, falls back gracefully to Phase 1 verified data.
 */
export async function getMenuProducts(): Promise<{
  items: MenuItem[];
  source: 'database' | 'fallback';
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      items: MENU_ITEMS,
      source: 'fallback',
      error: null,
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_options(*), categories(*)')
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return {
        items: MENU_ITEMS,
        source: 'fallback',
        error: error?.message || 'No products returned from database',
      };
    }

    // Map database records to frontend MenuItem structure
    const mappedItems: MenuItem[] = (data as unknown as DbProductWithRelations[]).map((p) => {
      const categorySlug = (p.categories?.slug || 'regular-pizza') as MenuItem['category'];

      const variants = p.product_variants && p.product_variants.length > 0
        ? p.product_variants.map((v) => ({
            id: v.id,
            name: v.name,
            price: p.base_price + v.price_delta,
            isDefault: v.is_default,
          }))
        : (categorySlug === 'regular-pizza' || categorySlug === 'special-pizza'
            ? getPizzaVariants(p.base_price)
            : undefined);

      const options = p.product_options && p.product_options.length > 0
        ? p.product_options.map((o) => ({
            id: o.id,
            name: o.name,
            price: o.price_delta,
            category: o.option_group as 'crust' | 'topping' | 'dip' | 'addon',
          }))
        : (categorySlug === 'regular-pizza' || categorySlug === 'special-pizza'
            ? [...PIZZA_CRUST_OPTIONS, ...PIZZA_ADDON_OPTIONS]
            : undefined);

      return {
        id: p.slug,
        name: p.name,
        category: categorySlug,
        price: p.base_price,
        isStartingPrice: categorySlug === 'regular-pizza' || categorySlug === 'special-pizza' || p.slug === 'garlic-bread',
        currency: 'Rs.',
        description: p.description || undefined,
        image: p.image_url || '/images/menu/chicken-tikka-pizza.jpg',
        featured: p.is_featured,
        variants,
        options,
      };
    });

    return {
      items: mappedItems,
      source: 'database',
      error: null,
    };
  } catch (err) {
    return {
      items: MENU_ITEMS,
      source: 'fallback',
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}

/**
 * Fetches menu categories from Supabase with fallback to Phase 1 data.
 */
export async function getMenuCategories(): Promise<{
  categories: MenuCategory[];
  source: 'database' | 'fallback';
}> {
  if (!isSupabaseConfigured()) {
    return { categories: MENU_CATEGORIES, source: 'fallback' };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || (data as unknown as DbCategory[]).length === 0) {
      return { categories: MENU_CATEGORIES, source: 'fallback' };
    }

    const categories: MenuCategory[] = (data as unknown as DbCategory[]).map((c) => ({
      id: c.slug as MenuCategory['id'],
      label: c.name,
      description: c.description || '',
      itemCount: 0,
    }));

    return { categories, source: 'database' };
  } catch {
    return { categories: MENU_CATEGORIES, source: 'fallback' };
  }
}
