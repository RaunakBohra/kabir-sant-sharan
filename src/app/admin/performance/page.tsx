'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import PerformanceMonitor from '@/components/admin/PerformanceMonitor';

export default function AdminPerformancePage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-cream-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <PerformanceMonitor />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}