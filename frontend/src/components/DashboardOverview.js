'use client';

import React, { useState, useEffect } from 'react';
import { request } from "@/utils/api";
import { Users, Bed, User, Building } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-stats`);
        setStats([
          { title: 'Total Rooms', value: data.rooms || 0, icon: Bed, color: '#235347' },
          { title: 'Property Owners', value: data.owners || 0, icon: User, color: '#235347' },
          { title: 'Total Users', value: data.users || 0, icon: Users, color: '#2a7a64' },
          { title: 'Total Property', value: data.properties || 0, icon: Building, color: '#235347' },
        ]);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-[#0a2a2b] p-5 rounded-xl border border-[#235347]/30 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#051F20]">
                <item.icon size={24} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{item.title}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}