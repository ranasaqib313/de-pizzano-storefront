const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});
const { createClient } = require('@supabase/supabase-js');

const c = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  // Categories
  const { data: cats } = await c.from('categories').select('id,name,slug').order('sort_order');
  console.log('=== CATEGORIES ===');
  cats.forEach(cat => console.log(`  ${cat.slug} -> ${cat.name}`));

  // Counts
  const { count: prodCount } = await c.from('products').select('*', { count: 'exact', head: true });
  const { count: varCount } = await c.from('product_variants').select('*', { count: 'exact', head: true });
  console.log(`\nTotal products: ${prodCount}`);
  console.log(`Total variants: ${varCount}`);

  // Spot checks
  const { data: d1 } = await c.from('products').select('name,base_price').eq('slug', 'deal-1').single();
  console.log(`\nDeal 1: ${d1?.name} = Rs. ${d1?.base_price}`);

  const { data: tikka } = await c.from('products')
    .select('name,base_price,product_variants(name,price_delta)')
    .eq('slug', 'tikka')
    .single();
  console.log(`Tikka: ${tikka?.name}, base: ${tikka?.base_price}`);
  tikka?.product_variants?.forEach(v => console.log(`  ${v.name}: +${v.price_delta} = Rs. ${tikka.base_price + v.price_delta}`));

  const { data: club } = await c.from('products').select('name,base_price').eq('slug', 'club-sandwich').single();
  console.log(`\nClub Sandwich: ${club?.name} = Rs. ${club?.base_price}`);

  const { data: wings } = await c.from('products')
    .select('name,base_price,product_variants(name,price_delta)')
    .eq('slug', 'chicken-wings')
    .single();
  console.log(`Wings: ${wings?.name}, base: ${wings?.base_price}`);
  wings?.product_variants?.forEach(v => console.log(`  ${v.name}: +${v.price_delta} = Rs. ${wings.base_price + v.price_delta}`));

  // Check order of recent orders (if any)
  const { data: orders, count: orderCount } = await c.from('orders').select('*', { count: 'exact' });
  console.log(`\nTotal orders in DB: ${orderCount}`);
})();
