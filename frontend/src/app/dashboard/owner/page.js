'use client';

import React, { useState } from 'react';
import DashboardOverview from '@/components/DashboardOverview';
import OwnerSidebar from '@/components/OwnerSidebar';
import OwnerHeader from '@/components/OwnerHeader';

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <OwnerHeader onSearch={() => {}} />

        {/* Page Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-500">Owner Dashboard</h1>
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
}
