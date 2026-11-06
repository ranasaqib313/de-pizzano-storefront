import { createClient, isSupabaseConfigured } from '../client';
import { Database } from '../types';
import { DeliveryZone } from '@/types/storefront';
import { KARACHI_DELIVERY_ZONES } from '@/data/delivery-zones';

type DbDeliveryZone = Database['public']['Tables']['delivery_zones']['Row'];

export async function getDeliveryZones(): Promise<{
  zones: DeliveryZone[];
  source: 'database' | 'fallback';
}> {
  if (!isSupabaseConfigured()) {
    return { zones: KARACHI_DELIVERY_ZONES, source: 'fallback' };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('is_active', true);

    if (error || !data || (data as unknown as DbDeliveryZone[]).length === 0) {
      return { zones: KARACHI_DELIVERY_ZONES, source: 'fallback' };
    }

    const zones: DeliveryZone[] = (data as unknown as DbDeliveryZone[]).map((z) => ({
      id: z.id,
      name: z.name,
      areaName: z.name.split('(')[0].trim(),
      fee: z.delivery_fee,
      estimatedMinutes: z.estimated_minutes ? `${z.estimated_minutes}-${z.estimated_minutes + 10} mins` : '30-45 mins',
      isActive: z.is_active,
    }));

    return { zones, source: 'database' };
  } catch {
    return { zones: KARACHI_DELIVERY_ZONES, source: 'fallback' };
  }
}
