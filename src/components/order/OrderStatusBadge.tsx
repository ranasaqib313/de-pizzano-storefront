import React from 'react';
import { OrderStatus } from '@/types/storefront';
import { Badge } from '@/components/ui/Badge';
import {
  Clock,
  CheckCircle,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  XCircle,
} from 'lucide-react';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config: Record<
    OrderStatus,
    {
      variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info';
      icon: React.ReactNode;
      label: string;
    }
  > = {
    Pending: {
      variant: 'warning',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Pending Confirmation',
    },
    Confirmed: {
      variant: 'info',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: 'Order Confirmed',
    },
    Preparing: {
      variant: 'secondary',
      icon: <ChefHat className="w-3.5 h-3.5" />,
      label: 'Baking in Oven',
    },
    Ready: {
      variant: 'info',
      icon: <PackageCheck className="w-3.5 h-3.5" />,
      label: 'Packed & Ready',
    },
    'Out for Delivery': {
      variant: 'primary',
      icon: <Bike className="w-3.5 h-3.5" />,
      label: 'Rider on the Way',
    },
    Delivered: {
      variant: 'success',
      icon: <Home className="w-3.5 h-3.5" />,
      label: 'Delivered',
    },
    Cancelled: {
      variant: 'default',
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: 'Cancelled',
    },
  };

  const item = config[status] || config['Pending'];

  return (
    <Badge variant={item.variant} size={size}>
      {showIcon && item.icon}
      <span>{item.label}</span>
    </Badge>
  );
}

