import {
  toIntegerPkr,
  clampQuantity,
  calculateUnitPrice,
  calculateLineItemTotal,
  calculateCartTotals,
  generateCartItemId,
  formatPkr,
  validateCheckoutForm,
} from '@/lib/cart-calculations';
import { CartItem } from '@/types/storefront';

describe('Cart Calculations & Integer PKR Arithmetic', () => {
  describe('toIntegerPkr', () => {
    test('rounds floating point numbers to exact integer PKR', () => {
      expect(toIntegerPkr(750.49)).toBe(750);
      expect(toIntegerPkr(750.51)).toBe(751);
      expect(toIntegerPkr(1200)).toBe(1200);
    });

    test('handles NaN and Infinity safely', () => {
      expect(toIntegerPkr(NaN)).toBe(0);
      expect(toIntegerPkr(Infinity)).toBe(0);
    });
  });

  describe('clampQuantity', () => {
    test('clamps values between 1 and 99', () => {
      expect(clampQuantity(0)).toBe(1);
      expect(clampQuantity(-5)).toBe(1);
      expect(clampQuantity(150)).toBe(99);
      expect(clampQuantity(5)).toBe(5);
    });

    test('rounds floating values to integers', () => {
      expect(clampQuantity(3.7)).toBe(3);
    });
  });

  describe('calculateUnitPrice', () => {
    test('uses product base price when no variant is provided', () => {
      const unit = calculateUnitPrice(750);
      expect(unit).toBe(750);
    });

    test('uses variant price when variant is selected', () => {
      const unit = calculateUnitPrice(750, 1100);
      expect(unit).toBe(1100);
    });

    test('adds option prices to the unit price correctly', () => {
      const options = [
        { price: 200 }, // Cheese stuffed crust
        { price: 150 }, // Extra cheese
      ];
      const unit = calculateUnitPrice(750, 1100, options);
      expect(unit).toBe(1450);
    });
  });

  describe('calculateLineItemTotal', () => {
    test('multiplies unit price by clamped quantity', () => {
      expect(calculateLineItemTotal(1100, 2)).toBe(2200);
      expect(calculateLineItemTotal(750, 1)).toBe(750);
    });
  });

  describe('calculateCartTotals', () => {
    const mockItems: CartItem[] = [
      {
        id: 'item-1',
        productId: 'chicken-tikka-pizza',
        name: 'Chicken Tikka Pizza',
        category: 'regular-pizza',
        image: '/images/menu/chicken-tikka-pizza.jpg',
        unitPrice: 1100,
        quantity: 2,
        totalPrice: 2200,
        selectedOptions: [],
      },
      {
        id: 'item-2',
        productId: 'garlic-bread',
        name: 'Garlic Bread',
        category: 'starters',
        image: '/images/menu/garlic-bread.jpg',
        unitPrice: 200,
        quantity: 1,
        totalPrice: 200,
        selectedOptions: [],
      },
    ];

    test('calculates subtotal, delivery fee, and final total correctly', () => {
      const totals = calculateCartTotals(mockItems, 100);
      expect(totals.subtotal).toBe(2400);
      expect(totals.deliveryFee).toBe(100);
      expect(totals.total).toBe(2500);
    });

    test('returns zero delivery fee when cart is empty', () => {
      const totals = calculateCartTotals([], 100);
      expect(totals.subtotal).toBe(0);
      expect(totals.deliveryFee).toBe(0);
      expect(totals.total).toBe(0);
    });
  });

  describe('generateCartItemId', () => {
    test('creates distinct keys for different variants and option permutations', () => {
      const key1 = generateCartItemId('pizza-1', 'small', ['opt-a', 'opt-b']);
      const key2 = generateCartItemId('pizza-1', 'small', ['opt-b', 'opt-a']);
      const key3 = generateCartItemId('pizza-1', 'large', ['opt-a', 'opt-b']);

      expect(key1).toBe(key2); // Sorted options match
      expect(key1).not.toBe(key3); // Different variant
    });
  });

  describe('formatPkr', () => {
    test('formats PKR correctly with thousands separator', () => {
      expect(formatPkr(2500)).toBe('Rs. 2,500');
      expect(formatPkr(750)).toBe('Rs. 750');
    });
  });

  describe('validateCheckoutForm', () => {
    test('validates required fields correctly', () => {
      const invalid = validateCheckoutForm({
        fullName: '',
        phone: '',
        streetAddress: '',
        area: '',
      });

      expect(invalid.isValid).toBe(false);
      expect(invalid.errors.fullName).toBeDefined();
      expect(invalid.errors.phone).toBeDefined();
      expect(invalid.errors.streetAddress).toBeDefined();
      expect(invalid.errors.area).toBeDefined();
    });

    test('passes valid Karachi delivery details', () => {
      const valid = validateCheckoutForm({
        fullName: 'Hamza Khan',
        phone: '0318-2588631',
        streetAddress: 'Flat 4B, Murtaza Heights, Soldier Bazar',
        area: 'Soldier Bazar No. 3',
        instructions: 'Call upon arrival at gate',
      });

      expect(valid.isValid).toBe(true);
      expect(Object.keys(valid.errors)).toHaveLength(0);
    });
  });
});
