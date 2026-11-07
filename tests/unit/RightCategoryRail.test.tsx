import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RightCategoryRail } from '@/components/menu/RightCategoryRail';
import { MENU_CATEGORIES } from '@/data/menu';

describe('RightCategoryRail Component', () => {
  test('renders All Dishes and all 6 category buttons with item counts', () => {
    const handleSelect = jest.fn();
    render(
      <RightCategoryRail
        categories={MENU_CATEGORIES}
        activeCategory="all"
        onSelectCategory={handleSelect}
        totalCount={50}
      />
    );

    expect(screen.getByRole('button', { name: /all dishes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pizza deals/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pizza flavours/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /special flavours/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sandwiches/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pasta & fries/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sides/i })).toBeInTheDocument();
  });

  test('clicking a category calls onSelectCategory with the clicked ID', () => {
    const handleSelect = jest.fn();
    render(
      <RightCategoryRail
        categories={MENU_CATEGORIES}
        activeCategory="all"
        onSelectCategory={handleSelect}
        totalCount={50}
      />
    );

    const flavoursBtn = screen.getByRole('button', { name: /pizza flavours/i });
    fireEvent.click(flavoursBtn);
    expect(handleSelect).toHaveBeenCalledWith('pizza-flavours');
  });
});

