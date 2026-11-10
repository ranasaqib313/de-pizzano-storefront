import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { DockAwareLayout } from '@/components/layout/DockAwareLayout';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { BUSINESS_CONFIG } from '@/data/business';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'De Pizzano — Pizza, Pastas & Fast Food | Soldier Bazar, Karachi',
    template: '%s | De Pizzano Karachi',
  },
  description:
    'De Pizzano restaurant concept in Soldier Bazar No. 3, Karachi. Explore our full 26-item menu of regular and special pizzas, creamy pastas, sandwiches, and loaded fries.',
  keywords: [
    'De Pizzano',
    'De-Pizzano',
    'Pizza Karachi',
    'Soldier Bazar Pizza',
    'Pizza Restaurant Soldier Bazar',
    'Chicken Tikka Pizza',
    'Foodpanda De Pizzano',
    'Fast Food Karachi',
  ],
  authors: [{ name: 'De Pizzano Concept Design' }],
  metadataBase: new URL('https://de-pizzano-karachi.demo'),
  openGraph: {
    title: 'De Pizzano — Pizza & Fast Food in Soldier Bazar, Karachi',
    description:
      'Handcrafted pizzas, loaded pastas, toasted sandwiches, and fries. View our complete 26-item menu and online ordering options.',
    siteName: 'De Pizzano',
    locale: 'en_PK',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Safe Restaurant Schema without fake ratings or unverified coordinates
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: BUSINESS_CONFIG.name,
    alternateName: 'De-Pizzano',
    servesCuisine: ['Pizza', 'Fast Food', 'Pasta', 'Sandwiches'],
    telephone: BUSINESS_CONFIG.contact.primaryPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.primaryLocation.address,
      addressLocality: 'Soldier Bazar No. 3',
      addressRegion: 'Karachi',
      addressCountry: 'PK',
    },
    url: 'https://de-pizzano-karachi.demo',
    hasMenu: 'https://de-pizzano-karachi.demo/menu',
    priceRange: 'Rs. 200 - Rs. 1300',
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: BUSINESS_CONFIG.externalLinks.foodpanda,
        inLanguage: 'en-PK',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary selection:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <CartProvider>
              {/* Navbar is OUTSIDE the padded wrapper — renders full-width with no left offset */}
              <Navbar />
              {/* DockAwareLayout owns the dock ↔ content shift state */}
              <DockAwareLayout>
                {children}
              </DockAwareLayout>
              <CartDrawer />
              <MobileBottomNav />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
