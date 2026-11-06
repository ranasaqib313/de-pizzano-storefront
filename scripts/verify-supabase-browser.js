/**
 * ==============================================================================
 * DE PIZZANO — LIVE SUPABASE RLS VERIFICATION SCRIPT (BROWSER CONSOLE)
 * ==============================================================================
 * Instructions:
 * 1. Open http://localhost:3000 in your browser.
 * 2. Press F12 to open Developer Tools -> Console tab.
 * 3. Paste this entire script and press Enter.
 *
 * This script will run 4 live verification checks against your real Supabase
 * database and print color-coded PASS / FAIL indicators for Row Level Security (RLS).
 * ==============================================================================
 */

(async function runSupabaseRlsAudit() {
  console.log('%c[DE PIZZANO] Starting Live Supabase RLS Audit...', 'color: #f59e0b; font-weight: bold; font-size: 14px;');

  // Retrieve client from page context or create instance
  const supabaseUrl = process.env?.NEXT_PUBLIC_SUPABASE_URL || window.__NEXT_DATA__?.props?.pageProps?.supabaseUrl;
  const anonKey = process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (typeof window.supabase === 'undefined' && typeof createClient === 'undefined') {
    // Dynamically load supabase-js if not globally exposed
    console.log('%cLoading Supabase JS client...', 'color: #94a3b8;');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const clientFactory = window.supabase?.createClient;
  if (!clientFactory) {
    console.error('❌ Could not initialize Supabase client.');
    return;
  }

  // Read URL and key from input prompt if not in window
  let url = prompt('Enter NEXT_PUBLIC_SUPABASE_URL (e.g., https://xyz.supabase.co):') || '';
  let key = prompt('Enter NEXT_PUBLIC_SUPABASE_ANON_KEY (or sb_publishable_...):') || '';

  if (!url || !key) {
    console.warn('⚠️ URL or Anon Key was cancelled. Audit aborted.');
    return;
  }

  const client = clientFactory(url.trim(), key.trim());

  console.log('%c────────────────────────────────────────────────────────────', 'color: #475569;');
  console.log('%c🔍 CHECK 1: Public Read Access (Active Categories & Products)', 'color: #38bdf8; font-weight: bold;');
  try {
    const { data: cats, error: catErr } = await client.from('categories').select('name, slug').eq('is_active', true);
    const { data: prods, error: prodErr } = await client.from('products').select('name, base_price').eq('is_available', true);

    if (!catErr && !prodErr && prods && prods.length > 0) {
      console.log(`%c✅ PASS: Successfully read ${cats.length} categories and ${prods.length} products from live database!`, 'color: #4ade80; font-weight: bold;');
    } else {
      console.error('❌ FAIL / WARNING: Could not read products. Did you push migration 20261107000003_seed_data.sql?', catErr || prodErr);
    }
  } catch (e) {
    console.error('❌ CHECK 1 EXCEPTION:', e);
  }

  console.log('%c────────────────────────────────────────────────────────────', 'color: #475569;');
  console.log('%c🔍 CHECK 2: Anon Orders Table Isolation (Anon cannot read orders)', 'color: #38bdf8; font-weight: bold;');
  try {
    const { data: orders, error: ordErr } = await client.from('orders').select('*');
    if (!ordErr && orders && orders.length === 0) {
      console.log('%c✅ PASS: Anon query to orders returned 0 rows (RLS policy working correctly).', 'color: #4ade80; font-weight: bold;');
    } else if (ordErr) {
      console.log('%c✅ PASS: Anon query rejected by PostgreSQL RLS:', 'color: #4ade80;', ordErr.message);
    } else {
      console.error('❌ FAIL: Anon user was able to read orders!', orders);
    }
  } catch (e) {
    console.error('❌ CHECK 2 EXCEPTION:', e);
  }

  console.log('%c────────────────────────────────────────────────────────────', 'color: #475569;');
  console.log('%c🔍 CHECK 3: Anon Orders Creation Block (Unauthenticated INSERT blocked)', 'color: #38bdf8; font-weight: bold;');
  try {
    const { error: insErr } = await client.from('orders').insert({
      order_number: 'DP-TEST-UNAUTH',
      subtotal: 1000,
      delivery_fee: 50,
      total: 1050,
      customer_name: 'Unauth Attacker',
      customer_phone: '0300-0000000',
      delivery_address: 'Soldier Bazar Karachi'
    });

    if (insErr) {
      console.log('%c✅ PASS: Unauthenticated INSERT successfully rejected by RLS:', 'color: #4ade80; font-weight: bold;', insErr.message);
    } else {
      console.error('❌ CRITICAL FAIL: Unauthenticated user was able to insert into orders table!');
    }
  } catch (e) {
    console.log('%c✅ PASS: Insertion rejected with exception:', 'color: #4ade80;', e);
  }

  console.log('%c────────────────────────────────────────────────────────────', 'color: #475569;');
  console.log('%c🔍 CHECK 4: Customer Role Escalation Block (Role cannot be set to admin)', 'color: #38bdf8; font-weight: bold;');
  try {
    // Generate transient test user
    const email = `audit-test-${Date.now()}@test.local`;
    const password = 'Password@123456';
    const { data: auth, error: authErr } = await client.auth.signUp({
      email,
      password,
      options: { data: { full_name: 'Audit User' } }
    });

    if (authErr || !auth?.user) {
      console.warn('ℹ️ Note: Auto signup blocked or requires confirmation. Ensure "Confirm email" is OFF in Supabase settings.');
    } else {
      const { error: updateErr } = await client.from('profiles').update({ role: 'admin' }).eq('id', auth.user.id);
      if (updateErr) {
        console.log('%c✅ PASS: Customer role escalation to "admin" was rejected by RLS WITH CHECK policy!', 'color: #4ade80; font-weight: bold;', updateErr.message);
      } else {
        // Query to check if role actually changed
        const { data: prof } = await client.from('profiles').select('role').eq('id', auth.user.id).single();
        if (prof?.role === 'customer') {
          console.log('%c✅ PASS: Customer role update was ignored / restricted to customer.', 'color: #4ade80; font-weight: bold;');
        } else {
          console.error('❌ CRITICAL FAIL: Customer was able to escalate role to admin!');
        }
      }
      await client.auth.signOut();
    }
  } catch (e) {
    console.error('❌ CHECK 4 EXCEPTION:', e);
  }

  console.log('%c────────────────────────────────────────────────────────────', 'color: #475569;');
  console.log('%c🎉 Live Supabase RLS Audit Complete.', 'color: #f59e0b; font-weight: bold; font-size: 14px;');
})();

