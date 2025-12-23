'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeaderSimple from '@/components/AdminHeader';

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-white">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="flex-1">
        <AdminHeaderSimple onSearch={() => {}} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
