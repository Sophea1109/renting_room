'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  BedDouble, 
  User, 
  FileText,
  Calendar,
  LayoutDashboard,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { fetchPendingCount } from '@/lib/bookingApi';

export default function OwnerSidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hasUnreadMessages] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const loadPendingCount = async () => {
      try {
        const data = await fetchPendingCount(user.id);
        setPendingBookings(data.pending_count || 0);
      } catch {
        setPendingBookings(0);
      }
    };
    loadPendingCount();
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Restructured menu item data mapping
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/dashboard/owner',
    },
    { 
      id: 'rooms', 
      label: 'My Rooms', 
      icon: <BedDouble size={20} />, 
      path: '/dashboard/owner/property',
    },
    { 
      id: 'bookings', 
      label: 'Booking Requests', 
      icon: <FileText size={20} />, 
      notification: pendingBookings,
      path: '/dashboard/owner/bookings',
      badge: pendingBookings > 0 ? `${pendingBookings}` : null,
      badgeColor: 'bg-red-500'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: <Calendar size={20} />, 
      path: '/dashboard/owner/calendar',
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: <MessageSquare size={20} />, 
      notification: hasUnreadMessages ? 3 : 0,
      path: '/dashboard/owner/messages',
      badge: hasUnreadMessages ? '3' : null,
      badgeColor: 'bg-blue-500'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <User size={20} />, 
      path: '/dashboard/owner/profile',
    },
  ];

  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/dashboard/owner/settings' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const isActive = (item) => {
    if (activeTab === item.id) return true;
    if (pathname === item.path) return true;
    // Enhanced active layout parsing (prevents matching root route accidentally)
    if (item.path && item.path !== '/dashboard/owner' && pathname?.startsWith(item.path)) return true;
    return false;
  };

  const renderMenuItem = (item) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item.id];
    const active = isActive(item);

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasSubItems && !collapsed) {
              toggleSubMenu(item.id);
            } else {
              onTabChange(item.id);
              if (item.path) router.push(item.path);
            }
          }}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            w-full flex items-center rounded-xl px-3 py-2.5 
            transition-all duration-200 group relative
            ${active 
              ? 'bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white shadow-lg shadow-[#235347]/30' 
              : 'text-gray-300 hover:bg-[#0a2a2b] hover:text-white'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          {/* Active Indicator */}
          {active && !collapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
          )}

          {/* Icon */}
          <div className={`
            relative transition-transform duration-200
            ${hoveredItem === item.id ? 'scale-110' : ''}
            ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}
          `}>
            {item.icon}
            {hoveredItem === item.id && (
              <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
            )}
          </div>

          {/* Label & Badges */}
          {!collapsed && (
            <>
              <span className="ml-3 flex-1 text-left text-sm font-medium">{item.label}</span>
              
              {item.badge && (
                <span className={`${item.badgeColor || 'bg-[#235347]'} text-white text-xs px-2 py-0.5 rounded-full ml-2`}>
                  {item.badge}
                </span>
              )}

              {item.notification > 0 && !item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2 animate-pulse">
                  {item.notification}
                </span>
              )}

              {hasSubItems && (
                <ChevronDown 
                  size={16} 
                  className={`ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </>
          )}

          {/* Collapsed Tooltip */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#0a2a2b] text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-[#235347]/30">
              {item.label}
              {item.badge && (
                <span className={`ml-2 ${item.badgeColor || 'bg-[#235347]'} text-white text-xs px-1.5 py-0.5 rounded-full`}>
                  {item.badge}
                </span>
              )}
              {item.notification > 0 && !item.badge && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {item.notification}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Nested Submenu Layout Rendering */}
        {hasSubItems && isExpanded && !collapsed && (
          <div className="ml-9 mt-1 space-y-0.5">
            {item.subItems.map((subItem) => (
              <button
                key={subItem.path}
                onClick={() => router.push(subItem.path)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between group
                  ${pathname === subItem.path ? 'text-white bg-[#0a2a2b]' : 'text-gray-400 hover:text-white hover:bg-[#0a2a2b]/50'}`}
              >
                <span>{subItem.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={onToggleCollapse}
        />
      )}

      <div className={`
        h-screen sticky top-0 bg-gradient-to-b from-[#051F20] via-[#0a2a2b] to-[#051F20]
        text-white flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-72'}
        shadow-2xl shadow-black/50 z-30
        border-r border-[#235347]/30
      `}>
        {/* Header */}
        <div className={`
          p-5 border-b border-[#235347]/30 bg-gradient-to-r from-[#051F20] to-[#0a2a2b] relative
          ${collapsed ? 'text-center' : ''}
        `}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#235347] to-[#1a3f35] p-2.5 rounded-xl shadow-lg shadow-[#235347]/30">
                <BedDouble size={24} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#051F20] rounded-full"></span>
            </div>
            
            {!collapsed && (
              <div className="flex-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Owner Panel
                </h1>
                <p className="text-gray-400 text-xs flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Active
                </p>
              </div>
            )}
          </div>

          {/* Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="absolute top-5 right-0 transform translate-x-1/2 bg-[#0a2a2b] border border-[#235347]/30 rounded-full p-1.5 hover:bg-[#235347] transition-colors shadow-lg hidden lg:block"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#235347] transition-all"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">
                <Menu size={16} />
              </span>
            </div>
          </div>
        )}

        {/* Main Menu Wrapper */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin scrollbar-thumb-[#235347] scrollbar-track-[#051F20]">
          <div className="space-y-6">
            <div>
              <h3 className={`text-[#235347] text-xs font-semibold uppercase tracking-wider mb-3 ${collapsed ? 'text-center' : 'px-2'}`}>
                {collapsed ? '•••' : 'Main Menu'}
              </h3>
              <div className="space-y-0.5">
                {menuItems.map(item => renderMenuItem(item))}
              </div>
            </div>

            <div>
              <h3 className={`text-[#235347] text-xs font-semibold uppercase tracking-wider mb-3 ${collapsed ? 'text-center' : 'px-2'}`}>
                {collapsed ? '•••' : 'Settings'}
              </h3>
              <div className="space-y-0.5">
                {settingsItems.map(item => renderMenuItem(item))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer profile container */}
        <div className="p-4 border-t border-[#235347]/30 bg-gradient-to-t from-[#051F20] to-transparent">
          {!collapsed ? (
            <>
              <div className="flex items-center space-x-3 mb-3 p-2 bg-[#0a2a2b] rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-[#235347] to-[#1a3f35] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'O'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.name || 'Owner User'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'owner@example.com'}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/30 group"
              >
                <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-300" />
                <span className="text-sm font-medium">Logout</span>
              </button>

              <div className="mt-3 text-center">
                <p className="text-gray-500 text-xs">Version 2.1.0</p>
                <p className="text-gray-600 text-[10px] mt-0.5">© 2026 Owner Panel</p>
              </div>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-3 px-3 rounded-xl bg-red-600 hover:bg-red-700 transition-colors group relative"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}