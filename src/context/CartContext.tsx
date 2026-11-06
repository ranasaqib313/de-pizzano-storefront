'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, PriceBreakdown, DeliveryZone } from '@/types/storefront';
import {
  calculateCartTotals,
  clampQuantity,
  generateCartItemId,
  toIntegerPkr,
} from '@/lib/cart-calculations';
import { KARACHI_DELIVERY_ZONES, DEFAULT_DELIVERY_FEE } from '@/data/delivery-zones';

interface AddItemInput {
  productId: string;
  name: string;
  image: string;
  category: string;
  unitPrice: number;
  quantity?: number;
  variant?: {
    id: string;
    name: string;
    price: number;
  };
  selectedOptions?: {
    optionId: string;
    name: string;
    price: number;
    category?: string;
  }[];
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  pricing: PriceBreakdown;
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (item: AddItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'depizzano_customer_cart_v1';
const ZONE_STORAGE_KEY = 'depizzano_delivery_zone_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedZone, setSelectedZoneState] = useState<DeliveryZone>(KARACHI_DELIVERY_ZONES[0]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load persisted cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }

      const savedZoneId = localStorage.getItem(ZONE_STORAGE_KEY);
      if (savedZoneId) {
        const matched = KARACHI_DELIVERY_ZONES.find((z) => z.id === savedZoneId);
        if (matched) {
          setSelectedZoneState(matched);
        }
      }
    } catch {
      // Local storage unreadable or disabled; fallback to default in-memory state
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage on cart change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota exceeded or private browsing
    }
  }, [items, isInitialized]);

  const setSelectedZone = useCallback((zone: DeliveryZone) => {
    setSelectedZoneState(zone);
    try {
      localStorage.setItem(ZONE_STORAGE_KEY, zone.id);
    } catch {
      // Ignore storage write error
    }
  }, []);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);

  const addItem = useCallback((input: AddItemInput) => {
    const rawQty = input.quantity ?? 1;
    const safeQty = clampQuantity(rawQty);
    const selectedOptions = input.selectedOptions || [];
    const optionIds = selectedOptions.map((o) => o.optionId);

    const generatedId = generateCartItemId(input.productId, input.variant?.id, optionIds);
    const unitPrice = toIntegerPkr(input.unitPrice);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === generatedId);
      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQty = clampQuantity(existing.quantity + safeQty);
        const updatedItem: CartItem = {
          ...existing,
          quantity: newQty,
          totalPrice: toIntegerPkr(unitPrice * newQty),
        };
        const updatedList = [...prevItems];
        updatedList[existingIndex] = updatedItem;
        return updatedList;
      }

      const newItem: CartItem = {
        id: generatedId,
        productId: input.productId,
        name: input.name,
        image: input.image,
        category: input.category,
        unitPrice,
        quantity: safeQty,
        totalPrice: toIntegerPkr(unitPrice * safeQty),
        variant: input.variant,
        selectedOptions,
        specialInstructions: input.specialInstructions,
      };

      return [...prevItems, newItem];
    });

    setIsCartDrawerOpen(true);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return;
    }

    const safeQty = clampQuantity(quantity);
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: safeQty,
            totalPrice: toIntegerPkr(item.unitPrice * safeQty),
          };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const pricing = useMemo(() => {
    return calculateCartTotals(
      items,
      selectedZone ? selectedZone.fee : DEFAULT_DELIVERY_FEE,
      0,
      0
    );
  }, [items, selectedZone]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      pricing,
      selectedZone,
      setSelectedZone,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInitialized,
    }),
    [
      items,
      itemCount,
      pricing,
      selectedZone,
      setSelectedZone,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInitialized,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const defaultCartContext: CartContextType = {
  items: [],
  itemCount: 0,
  pricing: {
    subtotal: 0,
    deliveryFee: DEFAULT_DELIVERY_FEE,
    platformFee: 0,
    discount: 0,
    total: 0,
  },
  selectedZone: KARACHI_DELIVERY_ZONES[0],
  setSelectedZone: () => {},
  isCartDrawerOpen: false,
  openCartDrawer: () => {},
  closeCartDrawer: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInitialized: true,
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return defaultCartContext;
  }
  return context;
}
