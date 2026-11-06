import type { ProductVariant, ProductOption } from './storefront';

export type MenuCategoryId =
  | 'all'
  | 'starters'
  | 'regular-pizza'
  | 'special-pizza'
  | 'sandwiches'
  | 'pastas'
  | 'fried-items';

export interface MenuCategory {
  id: Exclude<MenuCategoryId, 'all'>;
  label: string;
  description: string;
  itemCount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategoryId, 'all'>;
  price: number;
  isStartingPrice: boolean; // true if "onwards"
  currency: string;
  description?: string;
  image: string;
  featured?: boolean;
  priceDisclaimer?: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
}


