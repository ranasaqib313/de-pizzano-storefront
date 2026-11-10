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
  test('renders brand title DE PIZZANO without cluttered tagline (per Task 1 UX cleanup)', () => {
    render(<Navbar />);
    expect(screen.getAllByText(/DE PIZZANO/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/Tasty Delicious/i)).not.toBeInTheDocument();
  });

  test('does not render demo preview badge announcement (removed per UX cleanup)', () => {
    render(<Navbar />);
    expect(screen.queryByText(/INDEPENDENT WEBSITE CONCEPT/i)).not.toBeInTheDocument();
  });

  test('renders location/delivery selector with default Select Location text and search input', () => {
    render(<Navbar />);
    expect(screen.getAllByTitle(/click to select delivery location/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Select Location/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/search pizzas, deals, sides/i)[0]).toBeInTheDocument();
  });

  test('renders user sign-in/profile link and theme toggle button', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
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
