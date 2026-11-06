import { CartItem, CartItemOption, PriceBreakdown } from '@/types/storefront';

/**
 * Ensures currency amounts are strictly calculated as integers in Pakistani Rupees (PKR)
 * to avoid IEEE 754 floating point arithmetic issues.
 */
export function toIntegerPkr(amount: number): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  return Math.round(amount);
}

/**
 * Clamps item quantities between minimum (default 1) and maximum (default 99).
 */
export function clampQuantity(qty: number, min = 1, max = 99): number {
  const integerVal = Math.floor(qty);
  if (isNaN(integerVal) || integerVal < min) return min;
  if (integerVal > max) return max;
  return integerVal;
}

/**
 * Calculates the unit price for a configured product item based on
 * variant base price (or product base price) plus any added options.
 */
export function calculateUnitPrice(
  basePrice: number,
  variantPrice?: number,
  options: { price: number }[] = []
): number {
  const effectiveBase = typeof variantPrice === 'number' && variantPrice > 0 ? variantPrice : basePrice;
  const optionsTotal = options.reduce((sum, opt) => sum + (opt.price || 0), 0);
  return toIntegerPkr(effectiveBase + optionsTotal);
}

/**
 * Computes line item total price.
 */
export function calculateLineItemTotal(unitPrice: number, quantity: number): number {
  const safeQty = clampQuantity(quantity);
  const safeUnitPrice = toIntegerPkr(unitPrice);
  return toIntegerPkr(safeUnitPrice * safeQty);
}

/**
 * Calculates the full order price breakdown.
 */
export function calculateCartTotals(
  items: CartItem[],
  deliveryFee = 100,
  platformFee = 0,
  discount = 0
): PriceBreakdown {
  const subtotal = items.reduce((sum, item) => {
    return sum + toIntegerPkr(item.totalPrice);
  }, 0);

  const safeDelivery = items.length > 0 ? toIntegerPkr(deliveryFee) : 0;
  const safePlatform = toIntegerPkr(platformFee);
  const safeDiscount = toIntegerPkr(discount);
  const total = Math.max(0, subtotal + safeDelivery + safePlatform - safeDiscount);

  return {
    subtotal,
    deliveryFee: safeDelivery,
    platformFee: safePlatform,
    discount: safeDiscount,
    total,
  };
}

/**
 * Generates a deterministic unique ID for a line item based on product ID,
 * selected variant, and sorted selected options.
 */
export function generateCartItemId(
  productId: string,
  variantId?: string,
  selectedOptionIds: string[] = []
): string {
  const sortedOptions = [...selectedOptionIds].sort().join(',');
  return `${productId}::${variantId || 'standard'}::${sortedOptions || 'none'}`;
}

/**
 * Formats integer PKR amount into standard display string (e.g. "Rs. 750")
 */
export function formatPkr(amount: number): string {
  return `Rs. ${toIntegerPkr(amount).toLocaleString('en-PK')}`;
}

/**
 * Validates Cash on Delivery (COD) checkout customer and address inputs.
 */
export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  streetAddress: string;
  area: string;
  instructions?: string;
}

export function validateCheckoutForm(values: CheckoutFormValues): {
  isValid: boolean;
  errors: Partial<Record<keyof CheckoutFormValues, string>>;
} {
  const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

  if (!values.fullName || values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters long.';
  }

  // Pakistan phone format validation: 03XX-XXXXXXX, +923XXXXXXXXX, 03XXXXXXXXX
  const cleanedPhone = values.phone ? values.phone.replace(/[\s-]/g, '') : '';
  const pkPhoneRegex = /^((\+92)|(0092)|(03))\d{9}$/;
  if (!cleanedPhone) {
    errors.phone = 'Phone number is required for order confirmation call.';
  } else if (!pkPhoneRegex.test(cleanedPhone) && cleanedPhone.length < 10) {
    errors.phone = 'Please enter a valid Pakistan mobile number (e.g., 0318-2588631).';
  }

  if (!values.streetAddress || values.streetAddress.trim().length < 5) {
    errors.streetAddress = 'Please enter complete house/flat number, building, and street name.';
  }

  if (!values.area || values.area.trim().length === 0) {
    errors.area = 'Please select your delivery neighbourhood in Karachi.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

