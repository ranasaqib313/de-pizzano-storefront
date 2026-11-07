const { readFileSync } = require('fs');
const { join } = require('path');
const pg = require('pg');

const ROOT = join(__dirname, '..');

const PROJECT_REF = 'pnuclccijauosoqnhgbm';
const DB_PASSWORD = 'DePizzano#2026!';
const POOLER_HOST = 'aws-0-ap-northeast-1.pooler.supabase.com';

const MIGRATIONS = [
  '20261107000001_initial_schema.sql',
  '20261107000002_row_level_security.sql',
  '20261107000003_seed_data.sql',
  '20261108000001_real_menu.sql',
];

async function run() {
  console.log('\n🍕 Executing Migrations on Live Supabase Database...');
  console.log(`Connecting to ${POOLER_HOST}:5432 (Session mode) for ref ${PROJECT_REF}...`);

  const client = new pg.Client({
    host: POOLER_HOST,
    port: 5432,
    user: `postgres.${PROJECT_REF}`,
    password: DB_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log('✅ Connected to Postgres!\n');

  for (const filename of MIGRATIONS) {
    console.log(`Applying migration: ${filename}...`);
    const sqlPath = join(ROOT, 'supabase', 'migrations', filename);
    const sql = readFileSync(sqlPath, 'utf-8');

    try {
      await client.query(sql);
      console.log(`✅ Successfully applied: ${filename}\n`);
    } catch (err) {
      console.error(`❌ Error in ${filename}:`, err);
      await client.end();
      process.exit(1);
    }
  }

  console.log('--- Verifying Schema ---');
  const tablesRes = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log('Tables created in public schema:');
  console.table(tablesRes.rows);

  const categoriesCount = await client.query('SELECT count(*)::int as c FROM public.categories');
  const productsCount = await client.query('SELECT count(*)::int as c FROM public.products');
  const variantsCount = await client.query('SELECT count(*)::int as c FROM public.product_variants');
  const optionsCount = await client.query('SELECT count(*)::int as c FROM public.product_options');
  const zonesCount = await client.query('SELECT count(*)::int as c FROM public.delivery_zones');
  const settingsCount = await client.query('SELECT count(*)::int as c FROM public.restaurant_settings');

  console.log('\n--- Row Counts ---');
  console.log(`Categories:        ${categoriesCount.rows[0].c}`);
  console.log(`Products:          ${productsCount.rows[0].c}`);
  console.log(`Product Variants:  ${variantsCount.rows[0].c}`);
  console.log(`Product Options:   ${optionsCount.rows[0].c}`);
  console.log(`Delivery Zones:    ${zonesCount.rows[0].c}`);
  console.log(`Settings:          ${settingsCount.rows[0].c}`);

  const rlsRes = await client.query(`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  console.log('\n--- RLS Status ---');
  console.table(rlsRes.rows);

  await client.end();
  console.log('\n🎉 ALL MIGRATIONS COMPLETED AND VERIFIED!\n');
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

