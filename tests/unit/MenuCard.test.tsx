import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuCard } from '@/components/menu/MenuCard';
import { MenuItem } from '@/types/menu';

const mockItemStarting: MenuItem = {
  id: 'chicken-tikka-pizza',
  name: 'Chicken Tikka Pizza',
  category: 'regular-pizza',
  price: 750,
  isStartingPrice: true,
  currency: 'Rs.',
  description: 'Pizza sauce, onion, chicken tikka, cheese.',
  image: '/images/menu/chicken-tikka-pizza.svg',
  featured: true,
};

const mockItemFixed: MenuItem = {
  id: 'cheesy-stick',
  name: 'Cheesy Stick',
  category: 'starters',
  price: 550,
  isStartingPrice: false,
  currency: 'Rs.',
  image: '/images/menu/cheesy-stick.svg',
};

describe('MenuCard Component', () => {
  test('renders item name, category tag, and starting price format correctly', () => {
    render(<MenuCard item={mockItemStarting} />);
    expect(screen.getByText('Chicken Tikka Pizza')).toBeInTheDocument();
    expect(screen.getByText('Starting at Rs. 750')).toBeInTheDocument();
    expect(screen.getByText('regular pizza')).toBeInTheDocument();
    expect(screen.getByText(/Pizza sauce, onion, chicken tikka, cheese./i)).toBeInTheDocument();
  });

  test('renders fixed price correctly without "Starting at"', () => {
    render(<MenuCard item={mockItemFixed} />);
    expect(screen.getByText('Cheesy Stick')).toBeInTheDocument();
    expect(screen.getByText('Rs. 550')).toBeInTheDocument();
  });

  test('calls onSelect when Details button is clicked', () => {
    const handleSelect = jest.fn();
    render(<MenuCard item={mockItemStarting} onSelect={handleSelect} />);
    const detailsBtn = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsBtn);
    expect(handleSelect).toHaveBeenCalledWith(mockItemStarting);
  });
});

