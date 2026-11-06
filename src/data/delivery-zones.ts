import { DeliveryZone } from '@/types/storefront';

export const KARACHI_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'soldier-bazar-3',
    name: 'Soldier Bazar No. 3 (Nearby)',
    areaName: 'Soldier Bazar No. 3',
    fee: 100,
    estimatedMinutes: '25-35 mins',
    isActive: true,
  },
  {
    id: 'soldier-bazar-1-2',
    name: 'Soldier Bazar No. 1 & 2',
    areaName: 'Soldier Bazar No. 1 & 2',
    fee: 100,
    estimatedMinutes: '25-35 mins',
    isActive: true,
  },
  {
    id: 'garden-east-west',
    name: 'Garden East & West',
    areaName: 'Garden East & West',
    fee: 150,
    estimatedMinutes: '30-40 mins',
    isActive: true,
  },
  {
    id: 'saddar',
    name: 'Saddar / Empress Market',
    areaName: 'Saddar',
    fee: 150,
    estimatedMinutes: '30-40 mins',
    isActive: true,
  },
  {
    id: 'jamshed-road',
    name: 'Jamshed Road / Martin Quarters',
    areaName: 'Jamshed Road',
    fee: 150,
    estimatedMinutes: '30-45 mins',
    isActive: true,
  },
  {
    id: 'gurumandir',
    name: 'Gurumandir / Patel Para',
    areaName: 'Gurumandir',
    fee: 150,
    estimatedMinutes: '30-40 mins',
    isActive: true,
  },
  {
    id: 'pechs',
    name: 'PECHS (Blocks 2, 3 & 6)',
    areaName: 'PECHS',
    fee: 200,
    estimatedMinutes: '35-50 mins',
    isActive: true,
  },
  {
    id: 'bahadurabad',
    name: 'Bahadurabad / Tariq Road',
    areaName: 'Bahadurabad',
    fee: 250,
    estimatedMinutes: '40-55 mins',
    isActive: true,
  },
];

export const DEFAULT_DELIVERY_FEE = 100;

