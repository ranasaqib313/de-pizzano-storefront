'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Check, AlertCircle, Info } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { ProductVariant, ProductOption } from '@/types/storefront';
import {
  getPizzaVariants,
  PIZZA_CRUST_OPTIONS,
  PIZZA_ADDON_OPTIONS,
  GENERAL_ADDON_OPTIONS,
} from '@/data/product-customizations';
import {
  calculateUnitPrice,
  calculateLineItemTotal,
  formatPkr,
  toIntegerPkr,
} from '@/lib/cart-calculations';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from '@/components/cart/QuantitySelector';
import { Button } from '@/components/ui/Button';

interface ProductDialogProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function ProductDialog({ item, onClose }: ProductDialogProps) {
  const { addItem } = useCart();

  const isPizza =
    item?.category === 'pizza-flavours' ||
    item?.category === 'special-flavours' ||
    item?.category === 'regular-pizza' ||
    item?.category === 'special-pizza';

  // Available variants
  const variants = useMemo<ProductVariant[]>(() => {
    if (!item) return [];
    if (item.variants && item.variants.length > 0) {
      return item.variants;
    }
    if (isPizza) {
      return getPizzaVariants(item.price);
    }
    return [
      {
        id: 'standard',
        name: 'Standard Portion',
        price: item.price,
        description: 'Chef standard portion',
        isDefault: true,
      },
    ];
  }, [item, isPizza]);

  // Selected states
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedCrust, setSelectedCrust] = useState<ProductOption | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<ProductOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset states when item opens
  useEffect(() => {
    if (item) {
      const defaultVar = (item.variants && item.variants.length > 0)
        ? (item.variants.find((v) => v.isDefault) || item.variants[0])
        : isPizza
        ? getPizzaVariants(item.price)[0]
        : {
            id: 'standard',
            name: 'Standard Portion',
            price: item.price,
            isDefault: true,
          };
      setSelectedVariant(defaultVar);
      setSelectedCrust(isPizza && item.category !== 'special-flavours' ? PIZZA_CRUST_OPTIONS[0] : undefined);
      setSelectedAddons([]);
      setQuantity(1);
      setIsAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, isPizza, onClose]);

  if (!item) return null;

  // Toggle add-on
  const handleToggleAddon = (addon: ProductOption) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  // Unit and line total
  const allSelectedOptions = [
    ...(selectedCrust && selectedCrust.price > 0 ? [selectedCrust] : []),
    ...selectedAddons,
  ];

  const unitPrice = calculateUnitPrice(
    item.price,
    selectedVariant?.price,
    allSelectedOptions
  );

  const totalPrice = calculateLineItemTotal(unitPrice, quantity);

  // Add to cart handler
  const handleAddToCart = () => {
    const optionsForCart = [
      ...(selectedCrust ? [{
        optionId: selectedCrust.id,
        name: selectedCrust.name,
        price: selectedCrust.price,
        category: selectedCrust.category,
      }] : []),
      ...selectedAddons.map((a) => ({
        optionId: a.id,
        name: a.name,
        price: a.price,
        category: a.category,
      })),
    ];

    addItem({
      productId: item.id,
      name: item.name,
      image: item.image,
      category: item.category,
      unitPrice,
      quantity,
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: selectedVariant.price,
          }
        : undefined,
      selectedOptions: optionsForCart,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 450);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-[95%] sm:w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 text-foreground hover:text-primary backdrop-blur-md border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          aria-label="Close Product Details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full bg-surface-elevated overflow-hidden shrink-0">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 600px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-surface">
              🍕
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute bottom-3 left-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-background/90 backdrop-blur-md text-secondary border border-secondary/30 rounded-full">
              {item.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Title & Description */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="product-dialog-title"
                  className="text-xl sm:text-2xl font-black text-foreground font-display uppercase tracking-wide"
                >
                  {item.name}
                </h3>
                <p className="text-lg font-extrabold text-secondary mt-1">
                  {item.isStartingPrice ? `Starting at Rs. ${item.price}` : `Rs. ${item.price}`}
                </p>
              </div>
            </div>
            {item.description ? (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {item.description}
              </p>
            ) : (
              <p className="text-xs text-muted mt-1 italic">
                Crafted fresh to order with De Pizzano signature dough and seasonings.
              </p>
            )}
          </div>

          {/* Size / Portion Selection */}
          {variants.length > 1 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                1. Select {isPizza ? 'Pizza Size' : 'Portion / Size'} <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-secondary bg-secondary/15 ring-1 ring-secondary'
                          : 'border-surface-border bg-surface-elevated hover:border-surface-highlight'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground font-display">
                          {variant.name === 'Regular (11")' ? 'Regular / Medium (11")' : variant.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-secondary shrink-0" />}
                      </div>
                      <span className="text-xs font-black text-secondary block mt-1">
                        {formatPkr(variant.price)}
                      </span>
                      {variant.description && (
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {variant.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crust Selection (For Pizzas with crust options, not for deals or special pre-stuffed crusts) */}
          {isPizza && item?.category !== 'special-flavours' && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                2. Select Crust Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PIZZA_CRUST_OPTIONS.map((crust) => {
                  const isSelected = selectedCrust?.id === crust.id;
                  return (
                    <button
                      key={crust.id}
                      type="button"
                      onClick={() => setSelectedCrust(crust)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-secondary bg-secondary/15 ring-1 ring-secondary'
                          : 'border-surface-border bg-surface-elevated hover:border-surface-highlight'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {crust.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-secondary" />}
                      </div>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        {crust.price > 0 ? `+ ${formatPkr(crust.price)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Add-ons */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              {isPizza ? '3. Extra Toppings & Dips (Optional)' : 'Optional Add-ons & Dips'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(isPizza ? PIZZA_ADDON_OPTIONS : GENERAL_ADDON_OPTIONS).map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => handleToggleAddon(addon)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-secondary bg-secondary/10'
                        : 'border-surface-border bg-surface-elevated hover:border-surface-highlight'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-foreground block">
                        {addon.name}
                      </span>
                      <span className="text-[11px] text-secondary font-bold">
                        + {formatPkr(addon.price)}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-secondary border-secondary text-background'
                          : 'border-surface-border bg-surface text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Price Banner */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-between gap-4 flex-wrap bg-surface-elevated/50 p-4 rounded-xl border border-surface-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quantity:
              </span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => Math.min(99, q + 1))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                size="md"
              />
            </div>

            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Item Total</span>
              <span className="text-xl font-black text-secondary tabular-nums">
                {formatPkr(totalPrice)}
              </span>
            </div>
          </div>

          {/* Development notice */}
          <div className="p-3 bg-surface-elevated rounded-xl border border-secondary/20 flex items-start gap-2.5 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Price reflects provisional public directory listing (Foodpanda). Actual restaurant direct prices may vary and await owner confirmation before launch. Cash on Delivery is available for all Soldier Bazar & Karachi orders.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-surface-border bg-surface-elevated flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            className="w-full justify-center shadow-glow-red font-bold"
            icon={isAdded ? <Check className="w-4 h-4 text-white" /> : <ShoppingBag className="w-4 h-4" />}
          >
            {isAdded ? 'Added to Cart!' : `Add to Cart — ${formatPkr(totalPrice)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
