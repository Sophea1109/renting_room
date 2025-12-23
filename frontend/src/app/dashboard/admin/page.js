'use client';

import React from 'react';
import DashboardOverview from '@/components/DashboardOverview';

export default function AdminPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-500">Admin Dashboard</h1>
      <DashboardOverview />
    </>
  );
}
