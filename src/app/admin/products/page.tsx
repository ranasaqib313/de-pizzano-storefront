import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminProductManagement } from '@/components/admin/AdminProductManagement';
import { getMenuProducts } from '@/lib/supabase/services/menu-service';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { items } = await getMenuProducts();

  return (
    <div>
      <AdminHeader
        title="Menu Product Catalog"
        subtitle="Manage product availability, featured highlights and verify integer PKR base prices across all 50 dishes."
      />
      <AdminProductManagement initialProducts={items} />
    </div>
  );
}

