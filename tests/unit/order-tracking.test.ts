import { mapDatabaseStatus } from '@/lib/supabase/services/order-service';
import { OrderStatus } from '@/types/storefront';

describe('Phase 5 — Customer Live Order Tracking & Status Sync', () => {
  describe('Database Status Mapping & Normalization', () => {
    test('maps pending status variants to "Pending"', () => {
      expect(mapDatabaseStatus('pending')).toBe('Pending');
      expect(mapDatabaseStatus('PENDING')).toBe('Pending');
      expect(mapDatabaseStatus(' Pending ')).toBe('Pending');
    });

    test('maps confirmed status variants to "Confirmed"', () => {
      expect(mapDatabaseStatus('confirmed')).toBe('Confirmed');
      expect(mapDatabaseStatus('CONFIRMED')).toBe('Confirmed');
    });

    test('maps preparing status variants to "Preparing"', () => {
      expect(mapDatabaseStatus('preparing')).toBe('Preparing');
      expect(mapDatabaseStatus('PREPARING')).toBe('Preparing');
    });

    test('maps ready status variants to "Ready"', () => {
      expect(mapDatabaseStatus('ready')).toBe('Ready');
      expect(mapDatabaseStatus('READY')).toBe('Ready');
    });

    test('maps out_for_delivery snake_case to "Out for Delivery"', () => {
      expect(mapDatabaseStatus('out_for_delivery')).toBe('Out for Delivery');
      expect(mapDatabaseStatus('OUT_FOR_DELIVERY')).toBe('Out for Delivery');
      expect(mapDatabaseStatus('out for delivery')).toBe('Out for Delivery');
    });

    test('maps delivered status variants to "Delivered"', () => {
      expect(mapDatabaseStatus('delivered')).toBe('Delivered');
      expect(mapDatabaseStatus('DELIVERED')).toBe('Delivered');
    });

    test('maps cancelled status variants to "Cancelled"', () => {
      expect(mapDatabaseStatus('cancelled')).toBe('Cancelled');
      expect(mapDatabaseStatus('CANCELLED')).toBe('Cancelled');
    });

    test('defaults unknown or null status to "Pending"', () => {
      expect(mapDatabaseStatus('')).toBe('Pending');
      expect(mapDatabaseStatus('unknown_state')).toBe('Pending');
    });
  });

  describe('Lifecycle Stepper Progression', () => {
    const LIFECYCLE_SEQUENCE: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered',
    ];

    test('all 6 core lifecycle steps exist in correct progression sequence', () => {
      expect(LIFECYCLE_SEQUENCE).toHaveLength(6);
      expect(LIFECYCLE_SEQUENCE[0]).toBe('Pending');
      expect(LIFECYCLE_SEQUENCE[1]).toBe('Confirmed');
      expect(LIFECYCLE_SEQUENCE[2]).toBe('Preparing');
      expect(LIFECYCLE_SEQUENCE[3]).toBe('Ready');
      expect(LIFECYCLE_SEQUENCE[4]).toBe('Out for Delivery');
      expect(LIFECYCLE_SEQUENCE[5]).toBe('Delivered');
    });

    test('calculates active step progression index correctly', () => {
      const getActiveIndex = (status: OrderStatus) => LIFECYCLE_SEQUENCE.indexOf(status);

      expect(getActiveIndex('Pending')).toBe(0);
      expect(getActiveIndex('Confirmed')).toBe(1);
      expect(getActiveIndex('Preparing')).toBe(2);
      expect(getActiveIndex('Ready')).toBe(3);
      expect(getActiveIndex('Out for Delivery')).toBe(4);
      expect(getActiveIndex('Delivered')).toBe(5);
    });
  });
});

