export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  landmark: string;
  area: string;
  city: string;
  country: string;
  isPrimary: boolean;
  status: 'active-provisional' | 'unverified';
  mapsUrl: string;
}

export interface BusinessConfig {
  name: string;
  legalName?: string;
  tagline: string;
  primaryCategory: string;
  categories: string[];
  contact: {
    primaryPhone: string;
    formattedPhone: string;
    rawPhone: string; // for tel: links
    disclaimer: string;
    whatsappVerified: boolean;
    whatsappNumber?: string;
  };
  operatingHours: {
    display: string;
    daily: string;
    note: string;
  };
  services: {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean; // unverified
  };
  primaryLocation: BusinessLocation;
  externalLinks: {
    mapsDirections: string;
  };
  demoNotice: {
    badge: string;
    disclaimer: string;
    isDemo: boolean;
  };
}

