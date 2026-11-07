import { MENU_CATEGORIES } from '@/data/menu';

describe('Menu Data & Integrity Tests', () => {
  test('there must be exactly 6 categories with expected labels', () => {
    expect(MENU_CATEGORIES).toHaveLength(6);
    const categoryIds = MENU_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toEqual([
      'pizza-deals',
      'pizza-flavours',
      'special-flavours',
      'sandwiches',
      'pasta-fries',
      'sides',
    ]);
  });

  test('each category has expected item counts', () => {
    const countMap = Object.fromEntries(
      MENU_CATEGORIES.map((c) => [c.id, c.itemCount])
    );

    expect(countMap['pizza-deals']).toBe(10);
    expect(countMap['pizza-flavours']).toBe(24);
    expect(countMap['special-flavours']).toBe(4);
    expect(countMap['sandwiches']).toBe(2);
    expect(countMap['pasta-fries']).toBe(3);
    expect(countMap['sides']).toBe(7);
  });

  test('total item count across categories is 50', () => {
    const total = MENU_CATEGORIES.reduce((sum, c) => sum + c.itemCount, 0);
    expect(total).toBe(50);
  });

  test('every category has a non-empty label and description', () => {
    MENU_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.description).toBeTruthy();
    });
  });
});
