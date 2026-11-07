export interface NavItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu', description: 'Explore all 50 pizzas, pastas, sandwiches & sides' },
  { label: 'Deals', href: '/menu#pizza-deals', description: 'Value bundle deals with soft drinks included' },
  { label: 'Track Order', href: '/track', description: 'Live status timeline for Cash on Delivery orders' },
  { label: 'My Orders', href: '/orders', description: 'Order history and receipts' },
  { label: 'About', href: '/about', description: 'Our concept and culinary focus' },
  { label: 'Locations', href: '/locations', description: 'Soldier Bazar branch information' },
  { label: 'Contact', href: '/contact', description: 'Get in touch & order info' },
];
