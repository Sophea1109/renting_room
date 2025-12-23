import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  BarChart,
  Users,
  ShoppingCart,
  Package,
  Settings,
  FileText,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  DollarSign,
  Bell,
  Calendar,
  MessageSquare,
  Bed
} from 'lucide-react';

const AdminSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hasUnreadMessages] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard/admin' },
    { id: 'users', label: 'Users', icon: <Users size={20} />, path: '/dashboard/admin/User' },
    { id: 'Owner', label: 'Owner', icon: <User size={20} />, path: '/dashboard/admin/owner' },
    { id: 'Room', label: 'Room', icon: <Bed size={20} />, path: '/dashboard/admin/room' },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} />, path: '/dashboard/admin/report' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, path: '/dashboard/admin/notification' },
  ];

  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/dashboard/admin/setting' },
  ];

  return (
    <div className={`h-screen sticky top-0 bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield size={24} />
          </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Welcome back</p>
            </div>
        </div>
      </div>
      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-2">
          <h3 className={`text-gray-500 text-xs font-semibold uppercase mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '...' : 'Main Menu'}
          </h3>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (item.path) router.push(item.path);
              }}
              className={`w-full flex items-center rounded-lg px-3 py-3 mb-1 transition-all hover:bg-gray-800 ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-300'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              {!collapsed && <span className="ml-3">{item.label}</span>}
              {!collapsed && item.id === 'messages' && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              )}
              {!collapsed && item.id === 'notifications' && (
                <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">5</span>
              )}
            </button>
          ))}
        </div>

        {/* Settings Section */}
        <div className="mt-8 px-2">
          <h3 className={`text-gray-500 text-xs font-semibold uppercase mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '...' : 'Settings'}
          </h3>
          {settingsItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (item.path) router.push(item.path);
              }}
              className={`w-full flex items-center rounded-lg px-3 py-3 mb-1 transition-all hover:bg-gray-800 ${
                activeTab === item.id ? 'bg-gray-800 text-white' : 'text-gray-300'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button
          className={`w-full flex items-center justify-center py-3 px-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors ${
            collapsed ? '' : 'space-x-2'
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="mt-4 text-center text-gray-400 text-sm">
            <p>v2.1.0</p>
            <p className="text-xs mt-1">© 2024 Admin Panel</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
