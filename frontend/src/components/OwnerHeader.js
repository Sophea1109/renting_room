'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { fetchPendingCount } from '@/lib/bookingApi';
import { useState, useEffect } from 'react';
export default function OwnerHeader({ onSearch }) {
  const router = useRouter();
  const { user } = useUser();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const loadCount = async () => {
      try {
        const data = await fetchPendingCount(user.id);
        setPendingCount(data.pending_count || 0);
      } catch {
        setPendingCount(0);
      }
    };

    loadCount();
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">

      {/* Search Bar */}
      <div className="flex items-center w-1/2 bg-gray-100 rounded-lg px-3 py-2">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none px-2 w-full text-gray-500"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Notification + Profile */}
      <div className="flex items-center gap-6">

        {/* Bell → goes to Booking Requests */}
        <button
          className="relative"
          onClick={() => router.push('/dashboard/owner/bookings')}
          title="Booking Requests"
        >
          <Bell size={24} className="text-gray-600" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Profile picture */}
        <div className="flex items-center gap-3">
          <img
            src="/users/user-02.jpg"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border cursor-pointer"
            onClick={() => router.push('/dashboard/owner/profile')}
          />
        </div>
      </div>
    </header>
  );
}