'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Newsletter } from '@/components/admin/Newsletter';

export default function AdminNewsletterPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-cream-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <Newsletter />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}