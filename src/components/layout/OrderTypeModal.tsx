'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Store, MapPin, X, Check, Clock, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { KARACHI_DELIVERY_ZONES } from '@/data/delivery-zones';
import { BUSINESS_CONFIG } from '@/data/business';
import { OrderType } from '@/types/storefront';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface OrderTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTypeModal({ isOpen, onClose }: OrderTypeModalProps) {
  const { orderType, setOrderType, selectedZone, setSelectedZone } = useCart();
  const [activeType, setActiveType] = useState<OrderType>(orderType);
  const [activeZoneId, setActiveZoneId] = useState<string>(selectedZone?.id || KARACHI_DELIVERY_ZONES[0].id);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-border bg-surface-elevated/40">
              <div>
                <h3 className="text-xl font-black text-white font-display uppercase tracking-wide">
                  Select Order Mode
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Choose how you want to receive your fresh De Pizzano order
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-surface border border-surface-border text-muted hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Option 1: Delivery */}
              <div
                onClick={() => setActiveType('delivery')}
                className={cn(
                  'cursor-pointer rounded-2xl p-4 border transition-all duration-200 select-none',
                  activeType === 'delivery'
                    ? 'bg-primary/10 border-primary shadow-glow-red/20 ring-1 ring-primary'
                    : 'bg-surface-elevated/60 border-surface-border hover:bg-surface-elevated text-muted-light'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                        activeType === 'delivery'
                          ? 'bg-primary text-white shadow-glow-red'
                          : 'bg-surface text-muted'
                      )}
                    >
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">Home Delivery</h4>
                        {activeType === 'delivery' && (
                          <span className="text-[10px] uppercase font-extrabold bg-primary text-white px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        Hot & fresh to your doorstep across Karachi
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-secondary flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" /> 35–45 min
                    </span>
                  </div>
                </div>

                {/* Sub-selector for delivery area when delivery is active */}
                {activeType === 'delivery' && (
                  <div className="mt-4 pt-3.5 border-t border-surface-border/80">
                    <label className="block text-xs font-semibold text-muted-light mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      Select Your Delivery Area:
                    </label>
                    <div className="space-y-1.5">
                      {KARACHI_DELIVERY_ZONES.map((zone) => (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveZoneId(zone.id);
                          }}
                          className={cn(
                            'w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition-all',
                            activeZoneId === zone.id
                              ? 'bg-surface border-secondary text-white font-bold'
                              : 'bg-surface/50 border-surface-border/50 text-muted hover:text-white hover:bg-surface'
                          )}
                        >
                          <div>
                            <span className="text-white font-semibold">{zone.name}</span>
                            <span className="block text-[11px] text-muted truncate max-w-[280px]">
                              {zone.areaName} • {zone.estimatedMinutes}
                            </span>
                          </div>
                          <span className="text-secondary font-bold shrink-0 ml-2">
                            Rs. {zone.fee}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Takeaway / Pickup */}
              <div
                onClick={() => setActiveType('pickup')}
                className={cn(
                  'cursor-pointer rounded-2xl p-4 border transition-all duration-200 select-none',
                  activeType === 'pickup'
                    ? 'bg-secondary/10 border-secondary shadow-glow-gold/20 ring-1 ring-secondary'
                    : 'bg-surface-elevated/60 border-surface-border hover:bg-surface-elevated text-muted-light'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                        activeType === 'pickup'
                          ? 'bg-secondary text-black shadow-glow-gold font-bold'
                          : 'bg-surface text-muted'
                      )}
                    >
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">Takeaway Pickup</h4>
                        {activeType === 'pickup' && (
                          <span className="text-[10px] uppercase font-extrabold bg-secondary text-black px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        Collect directly from our Soldier Bazar kitchen counter
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                      Free (Rs. 0)
                    </span>
                    <span className="text-[11px] text-muted flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" /> 15–25 min
                    </span>
                  </div>
                </div>

                {activeType === 'pickup' && (
                  <div className="mt-4 pt-3.5 border-t border-surface-border/80 text-xs text-muted-light space-y-1">
                    <div className="flex items-start gap-1.5 text-white font-medium">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <span>{BUSINESS_CONFIG.primaryLocation.address}</span>
                    </div>
                    <p className="text-[11px] text-muted pl-5">
                      Landmark: {BUSINESS_CONFIG.primaryLocation.landmark} • {BUSINESS_CONFIG.operatingHours.display}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 pt-2 border-t border-surface-border/60 flex items-center justify-end gap-3 bg-surface-elevated/20">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirm}
                icon={<Check className="w-4 h-4" />}
                iconPosition="right"
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
