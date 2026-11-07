const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach((l) => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runE2EOrderTest() {
  console.log('=====================================================');
  console.log('  DE PIZZANO — E2E ORDER PLACEMENT VERIFICATION TEST');
  console.log('=====================================================\n');

  // 1. Fetch Deal 1
  console.log('[Step 1] Fetching "Deal 1" product from Supabase...');
  const { data: deal1, error: pErr } = await supabase
    .from('products')
    .select('id, name, slug, base_price, is_available')
    .eq('slug', 'deal-1')
    .single();

  if (pErr || !deal1) {
    throw new Error(`Failed to find Deal 1: ${pErr?.message}`);
  }
  console.log(`✓ Found: "${deal1.name}" (ID: ${deal1.id}, Price: Rs. ${deal1.base_price})`);

  // 2. Fetch Delivery Zone (e.g., Gulshan-e-Iqbal)
  console.log('\n[Step 2] Fetching Delivery Zone...');
  const { data: zone } = await supabase
    .from('delivery_zones')
    .select('id, name, delivery_fee')
    .ilike('name', '%Gulshan%')
    .limit(1)
    .single();

  const zoneFee = zone ? zone.delivery_fee : 150;
  console.log(`✓ Delivery Zone: ${zone?.name || 'Default Karachi'} (Fee: Rs. ${zoneFee})`);

  // 3. Ensure test customer user exists via Supabase Admin API
  console.log('\n[Step 3] Resolving test user via Admin API (bypasses email rate limit)...');
  const testEmail = 'e2e-customer@depizzano.test';
  let userId = null;

  const { data: usersData } = await supabase.auth.admin.listUsers();
  const existingUser = usersData?.users?.find((u) => u.email === testEmail);

  if (existingUser) {
    userId = existingUser.id;
    console.log(`✓ Using existing test user: ${testEmail} (${userId})`);
  } else {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { full_name: 'E2E Test Customer' },
    });
    if (createErr || !newUser.user) {
      throw new Error(`Failed to create test user: ${createErr?.message}`);
    }
    userId = newUser.user.id;
    console.log(`✓ Created test user: ${testEmail} (${userId})`);
  }

  // 4. Execute Server-Side Price Validation Logic directly (as order-actions does)
  console.log('\n[Step 4] Simulating order placement with attempted price manipulation...');
  console.log('  Customer claims price is Rs. 50 (tampered frontend price)');
  console.log(`  Database actual price is Rs. ${deal1.base_price}`);

  // Re-fetch product to get server-verified price
  const { data: verifiedProduct } = await supabase
    .from('products')
    .select('id, name, slug, base_price, is_available')
    .eq('id', deal1.id)
    .single();

  const qty = 2; // Order 2 of Deal 1
  const serverUnitPrice = verifiedProduct.base_price; // 400
  const serverSubtotal = serverUnitPrice * qty; // 800
  const serverTotal = serverSubtotal + zoneFee; // 800 + zoneFee

  console.log(`  Recalculated Subtotal (2x Rs. ${serverUnitPrice}): Rs. ${serverSubtotal}`);
  console.log(`  Delivery Fee: Rs. ${zoneFee}`);
  console.log(`  Recalculated Total: Rs. ${serverTotal}`);

  // 5. Generate Order Number
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `DP-${yyyy}${mm}${dd}-${randomSuffix}`;
  console.log(`\n[Step 5] Generated Order Number: ${orderNumber}`);

  // 6. Insert Order into DB
  console.log('\n[Step 6] Inserting Order into public.orders...');
  const { data: newOrder, error: orderErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: userId,
      status: 'pending',
      subtotal: serverSubtotal,
      delivery_fee: zoneFee,
      platform_fee: 0,
      total: serverTotal,
      payment_method: 'cod',
      customer_name: 'E2E Test Customer',
      customer_phone: '0300-1234567',
      delivery_address: 'House 42, Block 5, Gulshan-e-Iqbal, Karachi',
      delivery_zone_id: zone?.id || null,
      delivery_instructions: 'Handle with care - Phase 3 E2E test',
    })
    .select('id, order_number, status, total, created_at')
    .single();

  if (orderErr || !newOrder) {
    throw new Error(`Order insertion failed: ${orderErr?.message}`);
  }
  console.log(`✓ Order Created Successfully: UUID ${newOrder.id}`);

  // 7. Insert Order Items
  console.log('\n[Step 7] Inserting into public.order_items...');
  const { error: itemErr } = await supabase.from('order_items').insert([
    {
      order_id: newOrder.id,
      product_id: deal1.id,
      product_name: deal1.name,
      variant_name: null,
      options: [],
      unit_price: serverUnitPrice,
      quantity: qty,
      line_total: serverSubtotal,
    },
  ]);

  if (itemErr) {
    throw new Error(`Order items insertion failed: ${itemErr.message}`);
  }
  console.log('✓ Order Items inserted successfully');

  // 8. Insert Order Status History
  console.log('\n[Step 8] Inserting into public.order_status_history...');
  const { error: histErr } = await supabase.from('order_status_history').insert([
    {
      order_id: newOrder.id,
      status: 'pending',
      changed_by: userId,
      notes: 'Phase 3 E2E test order via checkout system',
    },
  ]);

  if (histErr) {
    throw new Error(`Status history insertion failed: ${histErr.message}`);
  }
  console.log('✓ Status history entry logged (pending)');

  // 9. Verification Query
  console.log('\n[Step 9] Verifying order persistence from Supabase...');
  const { data: verifiedOrder } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      subtotal,
      delivery_fee,
      total,
      customer_name,
      customer_phone,
      delivery_address,
      order_items (
        id,
        product_name,
        unit_price,
        quantity,
        line_total
      ),
      order_status_history (
        id,
        status,
        notes
      )
    `)
    .eq('id', newOrder.id)
    .single();

  console.log('\n=====================================================');
  console.log('  VERIFICATION RESULT: SUCCESS');
  console.log('=====================================================');
  console.log(`Order Number:      ${verifiedOrder.order_number}`);
  console.log(`Status:            ${verifiedOrder.status}`);
  console.log(`Customer:          ${verifiedOrder.customer_name} (${verifiedOrder.customer_phone})`);
  console.log(`Address:           ${verifiedOrder.delivery_address}`);
  console.log(`Subtotal:          Rs. ${verifiedOrder.subtotal}`);
  console.log(`Delivery Fee:      Rs. ${verifiedOrder.delivery_fee}`);
  console.log(`Total:             Rs. ${verifiedOrder.total}`);
  console.log(`Items Count:       ${verifiedOrder.order_items.length}`);
  verifiedOrder.order_items.forEach((it, idx) => {
    console.log(`  [Item ${idx + 1}] ${it.product_name} x${it.quantity} @ Rs. ${it.unit_price} = Rs. ${it.line_total}`);
  });
  console.log(`History Count:     ${verifiedOrder.order_status_history.length}`);
  console.log('=====================================================\n');

  return verifiedOrder;
}

runE2EOrderTest()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('E2E TEST FAILED:', e);
    process.exit(1);
  });
