import { ProductVariant, ProductOption } from '@/types/storefront';

/**
 * Standard size variants for pizzas based on verified Foodpanda & restaurant benchmarks.
 * Small: base price (e.g. Rs. 750 / 800)
 * Regular (11"): +Rs. 350
 * Large (13"): +Rs. 700
 */
export function getPizzaVariants(basePrice: number): ProductVariant[] {
  return [
    {
      id: 'small',
      name: 'Small (9")',
      price: basePrice,
      description: 'Ideal for 1 person (4 slices)',
      isDefault: true,
    },
    {
      id: 'regular',
      name: 'Regular / Medium (11")',
      price: basePrice + 350,
      description: 'Perfect for 2-3 people (6 slices)',
      isDefault: false,
    },
    {
      id: 'large',
      name: 'Large (13")',
      price: basePrice + 700,
      description: 'Family size for 4-5 people (8 slices)',
      isDefault: false,
    },
  ];
}

/**
 * Crust options available for all pizzas.
 */
export const PIZZA_CRUST_OPTIONS: ProductOption[] = [
  {
    id: 'crust-pan',
    name: 'Classic Pan Crust',
    price: 0,
    category: 'crust',
  },
  {
    id: 'crust-thin',
    name: 'Thin & Crispy Crust',
    price: 0,
    category: 'crust',
  },
  {
    id: 'crust-stuffed',
    name: 'Cheese Stuffed Crust',
    price: 200,
    category: 'crust',
  },
];

/**
 * Optional add-on toppings for pizzas.
 */
export const PIZZA_ADDON_OPTIONS: ProductOption[] = [
  {
    id: 'addon-extra-cheese',
    name: 'Extra Mozzarella Cheese',
    price: 150,
    category: 'topping',
  },
  {
    id: 'addon-extra-meat',
    name: 'Extra Chicken Chunks',
    price: 150,
    category: 'topping',
  },
  {
    id: 'addon-garlic-dip',
    name: 'Signature Garlic Mayo Dip',
    price: 60,
    category: 'dip',
  },
  {
    id: 'addon-ranch-dip',
    name: 'Spicy Ranch Dip',
    price: 60,
    category: 'dip',
  },
];

/**
 * Add-on options for starters, pastas, sandwiches, and fries.
 */
export const GENERAL_ADDON_OPTIONS: ProductOption[] = [
  {
    id: 'addon-extra-cheese-general',
    name: 'Melted Cheddar & Mozzarella Drizzle',
    price: 120,
    category: 'topping',
  },
  {
    id: 'addon-garlic-dip-general',
    name: 'Garlic Mayo Dip Sauce',
    price: 60,
    category: 'dip',
  },
];
