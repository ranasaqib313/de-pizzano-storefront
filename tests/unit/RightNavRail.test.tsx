import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeftNavDock } from '@/components/layout/LeftNavDock';
import { RightNavRail } from '@/components/layout/RightNavRail';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('LeftNavDock Component (Aurora Floating Glass Dock)', () => {
  test('renders left floating glass dock with primary navigation links', () => {
    render(<LeftNavDock />);

    expect(screen.getByRole('complementary', { name: /site navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Full Menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Deals & Offers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Outlets & Locations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Orders' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Track Live Order' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact & Support' })).toBeInTheDocument();
    // Customer Account profile was moved to top header per UX redesign requirements
    expect(screen.queryByRole('link', { name: 'Customer Account' })).not.toBeInTheDocument();
  });

  test('RightNavRail backward-compatibility alias renders LeftNavDock properly', () => {
    render(<RightNavRail />);
    expect(screen.getByRole('complementary', { name: /site navigation/i })).toBeInTheDocument();
  });
});
