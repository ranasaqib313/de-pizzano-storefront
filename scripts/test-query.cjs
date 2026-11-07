const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(l => {
  const [k, ...v] = l.trim().split('=');
  if (k && v.length) env[k] = v.join('=').trim().replace(/^['"]|['"]$/g, '');
});

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  console.log('--- 1. Testing Categories ---');
  const { data: categories, error: cErr } = await client
    .from('categories')
    .select('id, name, slug, sort_order')
    .order('sort_order', { ascending: true });
  if (cErr) console.error(cErr);
  else {
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(c => console.log(`  - [${c.sort_order}] ${c.name} (${c.slug})`));
  }

  console.log('\n--- 2. Testing Deal 1 ---');
  const { data: deal1, error: dErr } = await client
    .from('products')
    .select('name, slug, base_price, product_variants(*)')
    .eq('slug', 'deal-1')
    .single();
  if (dErr) console.error(dErr);
  else console.log(JSON.stringify(deal1, null, 2));

  console.log('\n--- 3. Testing Tikka Pizza with Variants ---');
  const { data: tikka, error: pErr } = await client
    .from('products')
    .select('name, slug, base_price, product_variants(name, price_delta, is_default, sort_order)')
    .eq('slug', 'tikka-pizza')
    .single();
  if (pErr) console.error(pErr);
  else console.log(JSON.stringify(tikka, null, 2));

  console.log('\n--- 4. Testing Product Counts per Category ---');
  for (const cat of (categories || [])) {
    const { count } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    console.log(`  - ${cat.name}: ${count} products`);
  }
}

test();
