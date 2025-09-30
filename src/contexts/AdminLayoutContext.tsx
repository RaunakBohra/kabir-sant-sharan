'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminLayoutContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
}

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AdminLayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </AdminLayoutContext.Provider>
  );
}