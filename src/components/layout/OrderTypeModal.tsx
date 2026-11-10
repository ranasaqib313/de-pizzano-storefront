'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Store, MapPin, X, Check, Clock, Fuel, Sparkles, Navigation } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { KARACHI_DELIVERY_ZONES, BASE_PETROL_PRICE } from '@/data/delivery-zones';
import { BUSINESS_CONFIG } from '@/data/business';
import { OrderType, DeliveryZone } from '@/types/storefront';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface OrderTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LocationModal (OrderTypeModal)
 * A clean, compact, centered popup with dynamic fuel-indexed delivery pricing.
 * High contrast in both light and dark mode with full WCAG AA compliance.
 */
export function OrderTypeModal({ isOpen, onClose }: OrderTypeModalProps) {
  const { orderType, setOrderType, selectedZone, setSelectedZone } = useCart();
  const [activeType, setActiveType] = useState<OrderType>(orderType);
  const [activeZoneId, setActiveZoneId] = useState<string>(
    selectedZone?.id || KARACHI_DELIVERY_ZONES[0].id
  );

  useEffect(() => {
    if (isOpen) {
      setActiveType(orderType);
      setActiveZoneId(selectedZone?.id || KARACHI_DELIVERY_ZONES[0].id);
    }
  }, [isOpen, orderType, selectedZone]);

  const handleConfirm = () => {
    setOrderType(activeType);
    if (activeType === 'delivery') {
      const zone = KARACHI_DELIVERY_ZONES.find((z) => z.id === activeZoneId);
      if (zone) {
        setSelectedZone(zone);
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container - Compact, centered, high-contrast */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="relative w-[95%] max-w-md mx-auto bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-elevated/40 shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-secondary/15 text-secondary border border-secondary/30 mb-1">
                  <Sparkles className="w-3 h-3" /> Order Mode &amp; Area
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground font-display uppercase tracking-tight">
                  How would you like your order?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select delivery area for dynamic petrol-based pricing
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface border border-border text-foreground hover:text-secondary flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer shrink-0 ml-3"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              {/* Mode Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Delivery Option */}
                <button
                  type="button"
                  onClick={() => setActiveType('delivery')}
                  className={cn(
                    'p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-row sm:flex-col items-center sm:items-stretch justify-between select-none relative gap-3 sm:gap-2 sm:min-h-[115px]',
                    activeType === 'delivery'
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/40 shadow-sm'
                      : 'bg-surface border-border hover:border-border/80 hover:bg-surface-elevated'
                  )}
                >
                  <div className="flex items-center gap-3 sm:justify-between sm:w-full">
                    <div
                      className={cn(
                        'w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-colors shrink-0',
                        activeType === 'delivery'
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-surface-elevated text-foreground'
                      )}
                    >
                      <Bike className="w-4 h-4" />
                    </div>
                    <div className="sm:hidden">
                      <h4 className="font-bold text-sm text-foreground">
                        Home Delivery
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Hot &amp; fresh to your door • <span className="text-secondary font-bold">25–45 mins</span>
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground">
                      Home Delivery
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Hot &amp; fresh to your door
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-secondary">
                      <Clock className="w-2.5 h-2.5" /> 25–45 mins
                    </span>
                  </div>

                  {activeType === 'delivery' && (
                    <span className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] sm:text-[9px] shrink-0 sm:absolute sm:top-3 sm:right-3">
                      <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>

                {/* Pickup Option */}
                <button
                  type="button"
                  onClick={() => setActiveType('pickup')}
                  className={cn(
                    'p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-row sm:flex-col items-center sm:items-stretch justify-between select-none relative gap-3 sm:gap-2 sm:min-h-[115px]',
                    activeType === 'pickup'
                      ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/40 shadow-sm'
                      : 'bg-surface border-border hover:border-border/80 hover:bg-surface-elevated'
                  )}
                >
                  <div className="flex items-center gap-3 sm:justify-between sm:w-full">
                    <div
                      className={cn(
                        'w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-colors shrink-0',
                        activeType === 'pickup'
                          ? 'bg-secondary text-black shadow-md font-bold'
                          : 'bg-surface-elevated text-foreground'
                      )}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="sm:hidden">
                      <h4 className="font-bold text-sm text-foreground">
                        Takeaway Pickup
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Soldier Bazar counter • <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free (Rs. 0)</span>
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground">
                      Takeaway Pickup
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Soldier Bazar counter
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Free (Rs. 0) • 15–20 mins
                    </span>
                  </div>

                  {activeType === 'pickup' && (
                    <span className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-secondary text-black flex items-center justify-center text-[10px] sm:text-[9px] font-bold shrink-0 sm:absolute sm:top-3 sm:right-3">
                      <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              </div>

              {/* Sub-section: Delivery Areas with Smart Petrol-Indexed Fees */}
              {activeType === 'delivery' ? (
                <div className="pt-1.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      Select Delivery Area:
                    </label>

                    {/* Dynamic Petrol Indicator Pill */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-foreground bg-surface px-2 py-0.5 rounded-full border border-border">
                      <Fuel className="w-3 h-3 text-secondary" />
                      Fuel: Rs. {BASE_PETROL_PRICE}/L
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                    {KARACHI_DELIVERY_ZONES.map((zone) => {
                      const isSelected = activeZoneId === zone.id;
                      return (
                        <div
                          key={zone.id}
                          onClick={() => setActiveZoneId(zone.id)}
                          className={cn(
                            'w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none',
                            isSelected
                              ? 'bg-surface-elevated border-secondary ring-1 ring-secondary/50 text-foreground font-semibold shadow-sm'
                              : 'bg-surface border-border text-foreground hover:bg-surface-elevated/70'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs transition-colors',
                                isSelected
                                  ? 'bg-secondary text-black font-black'
                                  : 'bg-surface-elevated text-muted-foreground'
                              )}
                            >
                              {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Navigation className="w-2.5 h-2.5" />}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                                {zone.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                                <span>{zone.estimatedMinutes}</span>
                                {zone.distanceKm && (
                                  <>
                                    <span>•</span>
                                    <span className="text-secondary font-semibold">
                                      {zone.distanceKm} km
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-3">
                            <span className="text-xs sm:text-sm font-black text-secondary block">
                              Rs. {zone.fee}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Delivery
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Pickup Location Details */
                <div className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-1.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block text-xs sm:text-sm">
                        De Pizzano Soldier Bazar Kitchen
                      </span>
                      <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                        {BUSINESS_CONFIG.primaryLocation.address}
                      </p>
                      <p className="text-[11px] text-secondary font-semibold mt-1">
                        Landmark: {BUSINESS_CONFIG.primaryLocation.landmark} • {BUSINESS_CONFIG.operatingHours.display}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-3.5 sm:p-4 border-t border-border flex items-center justify-end gap-2.5 bg-surface-elevated/30 shrink-0">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                icon={<Check className="w-3.5 h-3.5" />}
                iconPosition="right"
                className="shadow-glow-red text-xs font-bold"
              >
                Confirm {activeType === 'delivery' ? 'Delivery' : 'Takeaway'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
