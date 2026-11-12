import { BusinessConfig } from '@/types/business';

export const BUSINESS_CONFIG: BusinessConfig = {
  name: 'De Pizzano',
  legalName: 'De Pizzano Pizza Restaurant',
  tagline: 'Tasty Delicious',
  primaryCategory: 'Pizza Restaurant',
  categories: ['Fast Food', 'Pasta', 'Sandwiches', 'Starters'],
  contact: {
    // Primary provisional number from Google Business listing.
    // NOTE: Requires owner confirmation before launch.
    primaryPhone: '+92 318 2588631',
    formattedPhone: '+92 318 2588631',
    rawPhone: '+923182588631',
    disclaimer: 'Provisional contact number pending official restaurant confirmation.',
    whatsappVerified: false, // Keep hidden until restaurant confirms WhatsApp ordering
    whatsappNumber: undefined,
  },
  operatingHours: {
    display: 'Daily: 12:00 PM – 3:00 AM',
    daily: '12:00 PM – 3:00 AM',
    note: 'Provisional public listing hours. Please confirm opening hours directly before visiting.',
  },
  services: {
    delivery: true,
    takeaway: true,
    dineIn: false, // Unknown / unverified
  },
  primaryLocation: {
    id: 'soldier-bazar',
    name: 'Soldier Bazar (Primary)',
    address: 'Shop No. 9, Murtaza Terrace, Soldier Bazar No. 3',
    landmark: 'Near Hamza Uniform',
    area: 'Soldier Bazar No. 3',
    city: 'Karachi',
    country: 'Pakistan',
    isPrimary: true,
    status: 'active-provisional',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Shop+No+9+Murtaza+Terrace+Soldier+Bazar+No+3+Karachi',
  },
  externalLinks: {
    mapsDirections:
      'https://www.google.com/maps/search/?api=1&query=Shop+No+9+Murtaza+Terrace+Soldier+Bazar+No+3+Karachi',
  },
  demoNotice: {
    badge: 'INDEPENDENT WEBSITE CONCEPT — FOR OWNER REVIEW',
    disclaimer:
      'Business details, menu prices and imagery are based on available public information and require owner approval.',
    isDemo: true,
  },
};

