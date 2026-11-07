import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminDashboardOverview, AdminOrderRow } from '@/components/admin/AdminDashboardOverview';
import * as orderActions from '@/app/actions/order-actions';

jest.mock('@/app/actions/order-actions', () => ({
  updateOrderStatusAction: jest.fn().mockResolvedValue({ success: true }),
}));

const TEST_ORDERS: AdminOrderRow[] = [
  {
    id: 'test-order-1',
    orderNumber: 'DP-20261107-1001',
    customerName: 'Fatima Zahra',
    customerPhone: '0312-3456789',
    deliveryAddress: 'House 14, Street 5, Soldier Bazar No. 3',
    orderType: 'delivery',
    subtotal: 1200,
    deliveryFee: 100,
    total: 1300,
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    createdAt: new Date().toISOString(),
    itemsCount: 2,
  },
  {
    id: 'test-order-2',
    orderNumber: 'DP-20261107-1002',
    customerName: 'Ali Raza',
    customerPhone: '0333-9876543',
    deliveryAddress: 'Shop 9 Takeaway Counter',
    orderType: 'pickup',
    subtotal: 750,
    deliveryFee: 0,
    total: 750,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    createdAt: new Date().toISOString(),
    itemsCount: 1,
  },
];

describe('AdminDashboardOverview Component', () => {
  test('renders operational metrics correctly', () => {
    render(<AdminDashboardOverview initialOrders={TEST_ORDERS} />);

    // Total orders count
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);

    // Sales Volume formatted
    expect(screen.getByText('Sales Volume')).toBeInTheDocument();
    expect(screen.getByText(/Rs\. 2,050/)).toBeInTheDocument();
  });

  test('renders recent orders table and customer details', () => {
    render(<AdminDashboardOverview initialOrders={TEST_ORDERS} />);

    expect(screen.getByText('DP-20261107-1001')).toBeInTheDocument();
    expect(screen.getByText('Fatima Zahra')).toBeInTheDocument();
    expect(screen.getByText('0312-3456789')).toBeInTheDocument();
    expect(screen.getByText('DP-20261107-1002')).toBeInTheDocument();
    expect(screen.getByText('Ali Raza')).toBeInTheDocument();
  });

  test('clicking Confirm button updates order status', async () => {
    render(<AdminDashboardOverview initialOrders={TEST_ORDERS} />);

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(orderActions.updateOrderStatusAction).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'test-order-1',
          status: 'Confirmed',
        })
      );
    });
  });
});
