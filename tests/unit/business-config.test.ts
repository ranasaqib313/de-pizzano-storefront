import { BUSINESS_CONFIG } from '@/data/business';
import { getPhoneLink, getMapsDirectionsUrl } from '@/lib/links';

describe('Business Configuration & Safety Checks', () => {
  test('primary contact phone matches provisional research', () => {
    expect(BUSINESS_CONFIG.contact.primaryPhone).toBe('+92 318 2588631');
  });

  test('conflicting number (+92 333 3225867) is not published in business config', () => {
    const configString = JSON.stringify(BUSINESS_CONFIG);
    expect(configString).not.toContain('3333225867');
    expect(configString).not.toContain('+92 333 3225867');
  });

  test('whatsapp ordering remains unverified and disabled', () => {
    expect(BUSINESS_CONFIG.contact.whatsappVerified).toBe(false);
  });

  test('phone link helper generates proper tel: protocol URI', () => {
    expect(getPhoneLink()).toBe('tel:+923182588631');
  });

  test('directions link targets Soldier Bazar No 3 Karachi', () => {
    const mapsUrl = getMapsDirectionsUrl();
    expect(mapsUrl).toContain('Soldier+Bazar');
    expect(mapsUrl).toContain('Karachi');
  });

  test('demo notice is clearly configured', () => {
    expect(BUSINESS_CONFIG.demoNotice.isDemo).toBe(true);
    expect(BUSINESS_CONFIG.demoNotice.badge).toContain('INDEPENDENT WEBSITE CONCEPT');
  });
});

