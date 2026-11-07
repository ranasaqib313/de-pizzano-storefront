import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  test('renders brand title DE PIZZANO and tagline', () => {
    render(<Navbar />);
    expect(screen.getAllByText(/DE PIZZANO/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Tasty Delicious/i)).toBeInTheDocument();
  });

  test('renders demo preview badge announcement', () => {
    render(<Navbar />);
    expect(screen.getByText(/INDEPENDENT WEBSITE CONCEPT/i)).toBeInTheDocument();
  });

  test('renders location/delivery selector and search input', () => {
    render(<Navbar />);
    expect(screen.getByTitle(/click to switch delivery \/ takeaway location/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/search pizzas, deals, sides/i)[0]).toBeInTheDocument();
  });

  test('renders cart button with item count', () => {
    render(<Navbar />);
    expect(screen.getByRole('button', { name: /view shopping cart/i })).toBeInTheDocument();
  });

  test('opens mobile drawer when menu toggle button is clicked', () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText(/open navigation menu/i);
    fireEvent.click(menuBtn);
    expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument();
  });
});
