'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, MessageSquare, Settings, LogOut, ChevronRight, BedDouble, User } from 'lucide-react';

export default function OwnerSidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hasUnreadMessages] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, notification: 0, path: '/dashboard/owner' },
    { id: 'rooms', label: 'My Rooms', icon: <BedDouble size={20} />, notification: 2, path: '/dashboard/owner/rooms' },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, notification: hasUnreadMessages ? 3 : 0, path: '/dashboard/owner/messages' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, notification: 0, path: '/dashboard/owner/profile' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, notification: 0, path: '/dashboard/owner/settings' },
  ];

  const handleClick = (item) => {
    onTabChange(item.id);
    if (item.path) router.push(item.path);
  };

  return (
    <div className={`h-screen sticky top-0 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <img src="/images/logo.png" alt="Logo" className="w-12 h-12 rounded-md object-cover shadow-md" />
        {!collapsed && (
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Owner Panel
          </span>
        )}
      </div>

      {/* Menu */}
      <ul className="mt-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <li key={item.id} className="relative">
            <button
              onClick={() => handleClick(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center w-full px-3 py-3 text-sm rounded-xl transition-all relative overflow-hidden
                ${activeTab === item.id
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-700/40 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'}
                ${collapsed ? 'justify-center' : 'justify-between'}`}
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-1.5 rounded-lg shadow-sm transition-colors ${activeTab === item.id ? 'bg-blue-900/50' : 'bg-slate-800'}`}>
                  {React.cloneElement(item.icon, { className: activeTab === item.id ? 'text-blue-300' : 'text-slate-400' })}
                </div>
                {!collapsed && <span>{item.label}</span>}
              </div>

              {/* Notification */}
              {item.notification > 0 && (
                <div className={`relative z-10 ${collapsed ? 'absolute top-1 right-1' : ''}`}>
                  <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {item.notification}
                  </span>
                </div>
              )}
            </button>

            {/* Tooltip */}
            {collapsed && (
              <div
                className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded border border-slate-700 shadow-lg transition-all opacity-0 invisible"
                style={{
                  opacity: hoveredItem === item.id ? 1 : 0,
                  visibility: hoveredItem === item.id ? 'visible' : 'hidden',
                }}
              >
                {item.label}
              </div>
            )}
          </li>
        ))}

        {/* Logout */}
        <li className="mt-6 pt-4 border-t border-slate-800">
          <button
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex items-center w-full px-3 py-3 rounded-xl transition-all relative overflow-hidden group ${collapsed ? 'justify-center' : 'gap-3'} hover:bg-red-900/20 hover:text-red-300`}
          >
            <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-red-900/40">
              <LogOut size={20} className="text-slate-400 group-hover:text-red-300" />
            </div>
            {!collapsed && (
              <>
                <span className="font-medium relative z-10">Logout</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-red-300" />
              </>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
