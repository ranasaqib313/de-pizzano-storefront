const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(l => {
  const [k, ...v] = l.trim().split('=');
  if (k && v.length) env[k] = v.join('=').trim().replace(/^['"]|['"]$/g, '');
});

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  console.log('--- 1. Testing Products with Relations ---');
  const { data: pizza, error: pErr } = await client
    .from('products')
    .select('name, base_price, product_variants(name, price_delta), product_options(name, price_delta, option_group)')
    .eq('slug', 'chicken-tikka-pizza')
    .single();

  if (pErr) console.error(pErr);
  else console.log(JSON.stringify(pizza, null, 2));

  console.log('\n--- 2. Testing Delivery Zones ---');
  const { data: zones, error: zErr } = await client
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true);

  if (zErr) console.error(zErr);
  else {
    console.log(`Found ${zones.length} active delivery zones:`);
    zones.forEach(z => console.log(`  - ${z.name}: Rs. ${z.delivery_fee} (${z.estimated_minutes} min)`));
  }

  console.log('\n--- 3. Testing Restaurant Settings ---');
  const { data: settings, error: sErr } = await client
    .from('restaurant_settings')
    .select('*');

  if (sErr) console.error(sErr);
  else {
    console.log(`Found ${settings.length} settings:`);
    settings.forEach(s => console.log(`  - ${s.key}:`, s.value));
  }
}

test();
