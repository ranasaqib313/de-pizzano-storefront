import { MenuItem } from './menu';

export type OrderType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Small (9\")", "Regular (11\")", "Large (13\")"
  price: number; // integer PKR amount
  description?: string;
  isDefault?: boolean;
}

export interface ProductOption {
  id: string;
  name: string; // e.g. "Cheese Stuffed Crust", "Extra Cheese", "Garlic Mayo Dip"
  price: number; // integer PKR addition (0 for standard options)
  category: 'crust' | 'topping' | 'dip' | 'addon';
}

export interface ProductCustomization {
  variant?: ProductVariant;
  options: ProductOption[];
  notes?: string;
}

export interface CartItemOption {
  optionId: string;
  name: string;
  price: number;
  category?: string;
}

export interface CartItem {
  id: string; // Unique line item key: `${productId}-${variantId}-${optionsHash}`
  productId: string;
  name: string;
  image: string;
  category: string;
  unitPrice: number; // Integer PKR: variant price + sum of options
  quantity: number;
  totalPrice: number; // Integer PKR: unitPrice * quantity
  variant?: {
    id: string;
    name: string;
    price: number;
  };
  selectedOptions: CartItemOption[];
  specialInstructions?: string;
}

export interface PriceBreakdown {
  subtotal: number; // Integer PKR
  deliveryFee: number; // Integer PKR
  platformFee: number; // Integer PKR (0 in Phase 1)
  discount: number; // Integer PKR (0 in Phase 1)
  total: number; // Integer PKR (subtotal + deliveryFee - discount)
}

export interface Customer {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  area: string; // e.g. "Soldier Bazar No. 3"
  city: string; // "Karachi"
  instructions?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string; // ISO 8601 string
  note?: string;
}

export interface Order {
  id: string; // e.g. "DPZ-2026-8491"
  createdAt: string; // ISO 8601 string
  customer: Customer;
  deliveryAddress: DeliveryAddress;
  items: CartItem[];
  pricing: PriceBreakdown;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  estimatedDeliveryMinutes?: number;
  isDemoOrder: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  areaName: string;
  fee: number; // Integer PKR
  estimatedMinutes: string;
  isActive: boolean;
}

