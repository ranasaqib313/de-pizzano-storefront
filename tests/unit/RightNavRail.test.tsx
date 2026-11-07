import React from 'react';
import { render, screen } from '@testing-library/react';
import { RightNavRail } from '@/components/layout/RightNavRail';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('RightNavRail Component (Site-Wide Right Navigation)', () => {
  test('renders site-wide right navigation rail with primary links', () => {
    render(<RightNavRail />);

    expect(screen.getByRole('complementary', { name: /site navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Full Menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Deals & Offers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Outlets & Locations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Orders' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Track Live Order' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact & Support' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Customer Account' })).toBeInTheDocument();
  });

  test('contains external Foodpanda link', () => {
    render(<RightNavRail />);
    const fpLink = screen.getByRole('link', { name: /order on foodpanda/i });
    expect(fpLink).toBeInTheDocument();
    expect(fpLink).toHaveAttribute('href', expect.stringContaining('foodpanda.pk'));
  });
});

