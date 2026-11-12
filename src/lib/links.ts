import { BUSINESS_CONFIG } from '@/data/business';

/**
 * Returns safe tel: link for provisional phone number
 */
export function getPhoneLink(rawPhone: string = BUSINESS_CONFIG.contact.rawPhone): string {
  return `tel:${rawPhone.replace(/[^0-9+]/g, '')}`;
}

/**
 * Returns Google Maps directions URL
 */
export function getMapsDirectionsUrl(): string {
  return BUSINESS_CONFIG.externalLinks.mapsDirections;
}

