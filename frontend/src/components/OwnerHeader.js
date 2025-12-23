'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function OwnerHeader({ onSearch }) {
  return (
    <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      
      {/* Search Bar */}
      <div className="flex items-center w-1/2 bg-gray-100 rounded-lg px-3 py-2">
        <Search size={20} className="text-gray-500 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none px-2 w-full text-gray-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Notification + Profile */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={24} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/users/user-02.jpg"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
        </div>
      </div>
    </header>
  );
}
