'use client';

import React from 'react';
import { OrderStatus, OrderStatusHistoryItem } from '@/types/storefront';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  history?: OrderStatusHistoryItem[];
  className?: string;
}

const ORDER_STEPS: { status: OrderStatus; label: string; description: string; icon: React.ElementType }[] = [
  {
    status: 'Pending',
    label: 'Order Received',
    description: 'We received your order and are validating details.',
    icon: Clock,
  },
  {
    status: 'Confirmed',
    label: 'Restaurant Accepted',
    description: 'Restaurant verified details and scheduled kitchen prep.',
    icon: CheckCircle2,
  },
  {
    status: 'Preparing',
    label: 'In the Kitchen',
    description: 'Fresh dough rolled, toppings assembled, and stone-baked.',
    icon: ChefHat,
  },
  {
    status: 'Ready',
    label: 'Waiting for Rider',
    description: 'Packaged hot with napkins and condiments, ready for pickup.',
    icon: PackageCheck,
  },
  {
    status: 'Out for Delivery',
    label: 'Rider on the way',
    description: 'Rider is on the way to your delivery address.',
    icon: Bike,
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    description: 'Delivered to you. Cash collected upon arrival.',
    icon: Home,
  },
];

export function OrderStatusTimeline({
  currentStatus,
  history = [],
  className,
}: OrderStatusTimelineProps) {
  if (currentStatus === 'Cancelled') {
    return (
      <div className={cn('p-5 rounded-2xl bg-red-950/30 border border-primary/40 text-center', className)}>
        <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-2" />
        <h4 className="text-base font-bold text-foreground uppercase tracking-wider font-display">
          Order Cancelled
        </h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          This order was cancelled. If you have questions or need assistance, please call our restaurant order line.
        </p>
      </div>
    );
  }

  const normalize = (s: string) => (s || '').toLowerCase().replace(/_/g, ' ').trim();
  const currentStepIndex = ORDER_STEPS.findIndex((s) => normalize(s.status) === normalize(currentStatus));
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className={cn('space-y-6', className)}>
      <ol className="relative border-l-2 border-surface-border ml-4 sm:ml-6 space-y-7">
        {ORDER_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isUpcoming = idx > activeIndex;

          const IconComponent = isCompleted ? CheckCircle2 : step.icon;

          // Find timestamp from history if available
          const historyEntry = history.find(
            (h) => normalize(h.status) === normalize(step.status)
          );

          return (
            <li key={step.status} className="ml-6 sm:ml-8 relative">
              {/* Step indicator dot/icon */}
              <span
                className={cn(
                  'absolute -left-10 sm:-left-12 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all',
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : isCurrent
                    ? 'bg-primary border-secondary text-white shadow-glow-gold animate-pulse'
                    : 'bg-surface border-surface-border text-muted/60'
                )}
              >
                <IconComponent className="w-4 h-4" />
              </span>

              {/* Step details */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4
                    className={cn(
                      'text-sm font-bold uppercase tracking-wider font-display',
                      isCurrent
                        ? 'text-secondary'
                        : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] font-sans px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/40 font-semibold align-middle">
                        Current Step
                      </span>
                    )}
                  </h4>

                  {historyEntry && (
                    <span className="text-[11px] text-muted-foreground tabular-nums font-mono">
                      {new Date(historyEntry.timestamp).toLocaleTimeString('en-PK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    'text-xs mt-1 leading-relaxed max-w-md',
                    isCurrent || isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  )}
                >
                  {historyEntry?.note || step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

