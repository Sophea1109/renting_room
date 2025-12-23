'use client';

import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

export default function OwnerHeader({ onSearch }) {
  const [open, setOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'System maintenance scheduled', status: 'unread', date: 'Dec 18' },
    { id: 2, title: 'New message from user', status: 'unread', date: 'Dec 19' },
    { id: 3, title: 'Room approved', status: 'read', date: 'Dec 20' },
  ];

  const toggleOpen = () => setOpen(prev => !prev);

  return (
    <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between relative">
      {/* Search Bar */}
      <div className="flex items-center w-1/2 bg-gray-100 rounded-lg px-3 py-2">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none px-2 w-full text-gray-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

        {/* Profile */}
        <img
          src="/users/user-04.jpg"
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
    </header>
  );
}
