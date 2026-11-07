import React from 'react';
import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Kitchen Operations & Admin Dashboard — De Pizzano',
  description: 'Manage live incoming customer orders, update kitchen preparation statuses, adjust menu pricing and control restaurant operating settings.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Admin Operations Sidebar */}
      <AdminSidebar />

      {/* Main Content Pane */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

