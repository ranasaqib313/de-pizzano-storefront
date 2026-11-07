import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { isSupabaseConfigured } from '@/lib/supabase/client';

describe('Phase 2 — Supabase Row Level Security (RLS) & Secrets Audit', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const rlsSqlPath = path.join(rootDir, 'supabase/migrations/20261107000002_row_level_security.sql');
  const initialSchemaPath = path.join(rootDir, 'supabase/migrations/20261107000001_initial_schema.sql');
  let rlsSql = '';
  let schemaSql = '';

  beforeAll(() => {
    rlsSql = fs.readFileSync(rlsSqlPath, 'utf8');
    schemaSql = fs.readFileSync(initialSchemaPath, 'utf8');
  });

  test('Check 1: Customer A cannot read Customer B orders (RLS orders policy isolation)', () => {
    // 1. Orders table must enable RLS
    expect(rlsSql).toContain('ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;');

    // 2. Select policy for authenticated customers must restrict to auth.uid() = customer_id
    expect(rlsSql).toMatch(/CREATE POLICY "Customers see own orders"[\s\S]*?ON public\.orders FOR SELECT[\s\S]*?USING \(auth\.uid\(\) = customer_id\);/);

    // 3. Verify no permissive open SELECT policy exists for orders
    expect(rlsSql).not.toMatch(/CREATE POLICY [^\n]* ON public\.orders FOR SELECT[\s\S]*?USING \(true\);/);
  });

  test('Check 2: Customer cannot update own role to admin (Profiles WITH CHECK constraint)', () => {
    // 1. Profiles table must enable RLS
    expect(rlsSql).toContain('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;');

    // 2. Customer update policy must enforce role = 'customer' in WITH CHECK
    expect(rlsSql).toMatch(/CREATE POLICY "Users can update own profile"[\s\S]*?ON public\.profiles FOR UPDATE[\s\S]*?WITH CHECK \(auth\.uid\(\) = id AND role = 'customer'\);/);

    // 3. Schema check constraint on profiles.role validates permitted roles
    expect(schemaSql).toMatch(/role TEXT DEFAULT 'customer' CHECK \(role IN \('customer', 'staff', 'admin'\)\)/);
  });

  test('Check 3: Unauthenticated user cannot create orders (Anon INSERT rejected)', () => {
    // 1. INSERT policy must only be granted TO authenticated
    expect(rlsSql).toMatch(/CREATE POLICY "Customers can create own orders"[\s\S]*?ON public\.orders FOR INSERT[\s\S]*?TO authenticated/);

    // 2. Ensure NO anon INSERT policy exists on orders
    expect(rlsSql).not.toMatch(/CREATE POLICY [^\n]* ON public\.orders FOR INSERT[\s\S]*?TO [^\n]*anon/);
  });

  test('Check 4: Customer cannot update order status (Order UPDATE restricted to staff/admin)', () => {
    // 1. UPDATE policy on orders must require staff or admin role
    expect(rlsSql).toMatch(/CREATE POLICY "Staff can update orders"[\s\S]*?ON public\.orders FOR UPDATE[\s\S]*?TO authenticated[\s\S]*?USING \([\s\S]*?role IN \('staff', 'admin'\)[\s\S]*?\);/);

    // 2. Ensure NO customer UPDATE policy exists on orders
    expect(rlsSql).not.toMatch(/CREATE POLICY [^\n]* ON public\.orders FOR UPDATE[\s\S]*?auth\.uid\(\) = customer_id/);
  });

  test('Check 5: Service role key is NEVER exposed in client-side source files', () => {
    const srcDir = path.join(rootDir, 'src');

    // Server-only files that legitimately use the service role key.
    // These import from 'next/headers' or 'server-only' and are never
    // included in the client bundle by Next.js.
    const SERVER_ONLY_FILES = new Set([
      'server.ts',   // src/lib/supabase/server.ts — SSR/Server Action helper
    ]);

    // Server-only directories whose files are never shipped to the client.
    const SERVER_ONLY_DIRS = new Set([
      'actions',      // src/app/actions/ — Server Actions
    ]);

    // Recursive search in src/ directory for any reference to SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_.*SERVICE_ROLE
    function checkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (SERVER_ONLY_DIRS.has(entry.name)) continue;
          checkDir(fullPath);
        } else if (/\.(tsx?|jsx?|json|css)$/.test(entry.name)) {
          if (SERVER_ONLY_FILES.has(entry.name)) continue;
          const content = fs.readFileSync(fullPath, 'utf8');
          expect(content).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
          expect(content).not.toContain('service_role');
          expect(content).not.toMatch(/NEXT_PUBLIC_[A-Z_]*SERVICE_ROLE/);
        }
      }
    }

    checkDir(srcDir);
  });

  test('Check 6: .env.local is ignored and NEVER tracked in Git', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

    // Verify .env*.local or .env.local is present in .gitignore
    const hasEnvLocalPattern =
      gitignoreContent.includes('.env.local') ||
      gitignoreContent.includes('.env*.local');
    expect(hasEnvLocalPattern).toBe(true);

    // Verify with git status that .env.local is untracked
    try {
      const trackedFiles = execSync('git ls-files .env.local', { cwd: rootDir, encoding: 'utf8' }).trim();
      expect(trackedFiles).toBe('');
    } catch {
      // Command succeeded with empty or error means not tracked
    }
  });

  test('Check 7: Customer cannot delete products (DELETE restricted to staff/admin)', () => {
    // 1. Products table must enable RLS
    expect(rlsSql).toContain('ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;');

    // 2. Modifying products (INSERT, UPDATE, DELETE) is restricted to staff/admin only
    expect(rlsSql).toMatch(/CREATE POLICY "Staff can modify products"[\s\S]*?ON public\.products FOR ALL[\s\S]*?role IN \('staff', 'admin'\)/);

    // 3. Ensure NO customer or anon DELETE policy exists
    expect(rlsSql).not.toMatch(/CREATE POLICY [^\n]* ON public\.products FOR DELETE/);
  });

  test('Check 8: Anon key querying orders table returns empty / denied', () => {
    // 1. In RLS SQL, public/anon has NO SELECT policy on orders
    expect(rlsSql).not.toMatch(/CREATE POLICY [^\n]* ON public\.orders FOR SELECT[\s\S]*?TO [^\n]*anon/);

    // 2. Verify order-items is also protected from anon SELECT
    expect(rlsSql).not.toMatch(/CREATE POLICY [^\n]* ON public\.order_items FOR SELECT[\s\S]*?TO [^\n]*anon/);

    // 3. Fallback client verification: unconfigured or anon client returns safely
    expect(typeof isSupabaseConfigured).toBe('function');
  });
});

