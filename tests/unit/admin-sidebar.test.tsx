import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}));

describe('AdminSidebar Component', () => {
  test('renders all administrative navigation routes', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('DE PIZZANO')).toBeInTheDocument();
    expect(screen.getByText(/operations suite/i)).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Live Orders')).toBeInTheDocument();
    expect(screen.getByText('Menu Catalog')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Deals & Promos')).toBeInTheDocument();
    expect(screen.getByText('Restaurant Settings')).toBeInTheDocument();
    expect(screen.getByText(/view customer storefront/i)).toBeInTheDocument();
  });
});

