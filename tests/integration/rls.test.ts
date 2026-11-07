/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch {
  // Ignore
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

describe('Live Supabase Integration & Real RLS Policy Verification', () => {
  jest.setTimeout(30000);

  // Test with Anon client
  const anonClient = isConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  test('Check 1 (Live DB): Anon client querying orders returns 0 rows', async () => {
    if (!isConfigured || !anonClient) {
      console.warn('Skipping Check 1: Real Supabase credentials not found in .env.local');
      return;
    }

    const { data, error } = await anonClient.from('orders').select('*');
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data).toHaveLength(0);
  });

  test('Check 2 (Live DB): Anon client cannot insert into orders (RLS rejection)', async () => {
    if (!isConfigured || !anonClient) {
      console.warn('Skipping Check 2: Real Supabase credentials not found in .env.local');
      return;
    }

    const fakeOrder = {
      order_number: `DP-AUDIT-${Date.now()}`,
      subtotal: 1000,
      delivery_fee: 50,
      total: 1050,
      customer_name: 'Hacker Anon',
      customer_phone: '0300-0000000',
      delivery_address: 'Soldier Bazar Karachi',
    };

    const { error } = await anonClient.from('orders').insert(fakeOrder as any);
    // Must return an RLS violation error
    expect(error).not.toBeNull();
  });

  test('Check 3 (Live DB): Anon client can read active categories and products', async () => {
    if (!isConfigured || !anonClient) {
      console.warn('Skipping Check 3: Real Supabase credentials not found in .env.local');
      return;
    }

    const { data: categories, error: catError } = await anonClient
      .from('categories')
      .select('name, slug')
      .eq('is_active', true);

    expect(catError).toBeNull();
    expect(Array.isArray(categories)).toBe(true);

    const { data: products, error: prodError } = await anonClient
      .from('products')
      .select('name, slug, base_price')
      .eq('is_available', true);

    expect(prodError).toBeNull();
    expect(Array.isArray(products)).toBe(true);
  });

  test('Check 4 (Live DB): Authenticated user RLS isolation & role escalation block', async () => {
    if (!isConfigured || !anonClient) {
      console.warn('Skipping Check 4: Real Supabase credentials not found in .env.local');
      return;
    }

    // 1. Create a transient test customer account
    const testEmail = `depizzano.audit.${Date.now()}@gmail.com`;
    const testPassword = `AuditPass!98765`;

    const { data: authData, error: signUpError } = await anonClient.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { full_name: 'QA Audit Customer' },
      },
    });

    if (signUpError || !authData.user || !authData.session) {
      // If email signup requires confirmation on project or rate limits, note it
      console.warn('SignUp returned error or requires email confirmation:', signUpError?.message || 'No active session');
      return;
    }

    const userId = authData.user.id;

    // 2. Query orders as this authenticated user (should only return their own, i.e. 0)
    const { data: userOrders, error: ordersError } = await anonClient
      .from('orders')
      .select('*');
    expect(ordersError).toBeNull();
    expect(userOrders).toEqual([]);

    // 3. Attempt role escalation to 'admin' (RLS WITH CHECK restriction: role = 'customer')
    const { error: roleEscalationError } = await anonClient
      .from('profiles')
      .update({ role: 'admin' as any })
      .eq('id', userId);

    // This update must fail due to RLS WITH CHECK policy or constraint
    expect(roleEscalationError).not.toBeNull();

    // 4. Sign out
    await anonClient.auth.signOut();

    // 5. Verify anon querying orders again returns empty
    const { data: afterSignOutOrders } = await anonClient.from('orders').select('*');
    expect(afterSignOutOrders).toHaveLength(0);
  });
});

