import { DeliveryZone } from '@/types/storefront';

/**
 * Dynamic Petrol-Indexed Delivery Pricing Engine
 * Calculates delivery fees dynamically based on current petrol rates and rider round-trip distance.
 * Admins can adjust BASE_PETROL_PRICE anytime as fuel prices fluctuate.
 */
export const BASE_PETROL_PRICE = 378; // Rs. per litre (Admin adjustable)
export const CURRENT_PETROL_PRICE = 378; // Rs. per litre alias for dynamic fuel pricing
export const BASE_DISPATCH_FEE = 50;  // Base dispatch & packing charge in Rs.
export const BIKE_KM_PER_LITRE = 35;  // Average delivery motorbike consumption in Karachi city traffic

/**
 * Calculates delivery fee based on distance and fuel rates.
 * Formula: Base Fee + (Round-Trip Distance / Mileage) * Petrol Price, rounded to nearest 10.
 */
export function calculateDeliveryFee(
  distanceKm: number,
  petrolPrice: number = BASE_PETROL_PRICE
): number {
  const roundTripDistance = Math.max(0.5, distanceKm) * 2;
  const fuelCost = (roundTripDistance / BIKE_KM_PER_LITRE) * petrolPrice;
  const total = BASE_DISPATCH_FEE + fuelCost;
  return Math.ceil(total / 10) * 10;
}

export interface ZoneConfig {
  id: string;
  name: string;
  areaName: string;
  distanceKm: number;
  estimatedMinutes: string;
  isActive: boolean;
}

export const ZONE_CONFIGS: ZoneConfig[] = [
  {
    id: 'soldier-bazar-3',
    name: 'Soldier Bazar No. 3 (Nearby)',
    areaName: 'Soldier Bazar No. 3',
    distanceKm: 0.8,
    estimatedMinutes: '20-30 mins',
    isActive: true,
  },
  {
    id: 'soldier-bazar-1-2',
    name: 'Soldier Bazar No. 1 & 2',
    areaName: 'Soldier Bazar No. 1 & 2',
    distanceKm: 1.5,
    estimatedMinutes: '25-35 mins',
    isActive: true,
  },
  {
    id: 'garden-east-west',
    name: 'Garden East & West',
    areaName: 'Garden East & West',
    distanceKm: 2.8,
    estimatedMinutes: '30-40 mins',
    isActive: true,
  },
  {
    id: 'saddar',
    name: 'Saddar / Empress Market',
    areaName: 'Saddar',
    distanceKm: 3.5,
    estimatedMinutes: '30-40 mins',
    isActive: true,
  },
  {
    id: 'jamshed-road',
    name: 'Jamshed Road / Martin Quarters',
    areaName: 'Jamshed Road',
    distanceKm: 3.2,
    estimatedMinutes: '30-45 mins',
    isActive: true,
  },
  {
    id: 'gurumandir',
    name: 'Gurumandir / Patel Para',
    areaName: 'Gurumandir',
    distanceKm: 2.2,
    estimatedMinutes: '30-40 mins',
    isActive: true,
  },
  {
    id: 'pechs',
    name: 'PECHS (Blocks 2, 3 & 6)',
    areaName: 'PECHS',
    distanceKm: 5.5,
    estimatedMinutes: '35-50 mins',
    isActive: true,
  },
  {
    id: 'bahadurabad',
    name: 'Bahadurabad / Tariq Road',
    areaName: 'Bahadurabad',
    distanceKm: 6.8,
    estimatedMinutes: '40-55 mins',
    isActive: true,
  },
];

export const KARACHI_DELIVERY_ZONES: DeliveryZone[] = ZONE_CONFIGS.map((z) => ({
  id: z.id,
  name: z.name,
  areaName: z.areaName,
  fee: calculateDeliveryFee(z.distanceKm, BASE_PETROL_PRICE),
  distanceKm: z.distanceKm,
  estimatedMinutes: z.estimatedMinutes,
  isActive: z.isActive,
}));

export const DEFAULT_DELIVERY_FEE = KARACHI_DELIVERY_ZONES[0].fee;
