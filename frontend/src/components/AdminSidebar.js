import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Settings,
  LogOut,
  Shield,
  Bed,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PieChart,
  Calendar,
  ChevronDown,
  Menu,
  Building2,
  TrendingUp,
  Package2Icon,
  File
} from 'lucide-react';
import { FaQq } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard Overview', 
      icon: <LayoutDashboard size={20} />, 
      path: '/dashboard/admin/overview',
    },
    { 
      id: 'users', 
      label: 'Users Management', 
      icon: <Users size={20} />, 
      path: '/dashboard/admin/User',
    },
    { 
      id: 'Property', 
      label: 'Property Management', 
      icon: <Building2 size={20} />, 
      path: '/dashboard/admin/property',
    },
    { 
      id: 'Property-Type', 
      label: 'Property-Type Management', 
      icon: <Bed size={20} />, 
      path: '/dashboard/admin/property-types',
    },
    { 
      id: 'Booking', 
      label: 'Booking Management', 
      icon: <Bed size={20} />, 
      path: '/dashboard/admin/booking',
    },
    { 
      id: 'Report', 
      label: 'Report', 
      icon: <File size={20} />, 
      path: '/dashboard/admin/report',
    },
  ];

  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/dashboard/admin/settings' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
  
      if (typeof setUser === "function") {
        setUser(null);
      }
  
      router.push('/login');
    }
  };

  const renderMenuItem = (item, isSettings = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isActive = activeTab === item.id || item.subItems?.some(sub => activeTab === sub.id);

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
            ${isActive 
              ? 'bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white shadow-lg shadow-[#235347]/30' 
              : 'text-gray-300 hover:bg-[#0a2a2b] hover:text-white'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          {/* Active Indicator */}
          {isActive && !collapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
          )}

          {/* Icon with hover effect */}
          <div className={`
            relative transition-transform duration-200
            ${hoveredItem === item.id ? 'scale-110' : ''}
            ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
          `}>
            {item.icon}
            {hoveredItem === item.id && (
              <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
            )}
          </div>

          {/* Label */}
          {!collapsed && (
            <>
              <span className="ml-3 flex-1 text-left text-sm font-medium">{item.label}</span>
              
              {item.badge && (
                <span className={`${item.badgeColor || 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded-full ml-2`}>
                  {item.badge}
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

          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#0a2a2b] text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-[#235347]/30">
              {item.label}
              {item.badge && (
                <span className={`ml-2 ${item.badgeColor || 'bg-gray-500'} text-white text-xs px-1.5 py-0.5 rounded-full`}>
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Submenu */}
        {hasSubItems && isExpanded && !collapsed && (
          <div className="ml-9 mt-1 space-y-0.5">
            {item.subItems.map((subItem) => (
              <button
                key={subItem.path}
                onClick={() => router.push(subItem.path)}
                className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#0a2a2b] rounded-lg transition-colors flex items-center justify-between group"
              >
                <span>{subItem.label}</span>
                {subItem.badge && (
                  <span className="bg-[#235347] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {subItem.badge}
                  </span>
                )}
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
          p-5 border-b border-[#235347]/30 bg-gradient-to-r from-[#051F20] to-[#0a2a2b]
          ${collapsed ? 'text-center' : ''}
        `}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#235347] to-[#1a3f35] p-2.5 rounded-xl shadow-lg shadow-[#235347]/30">
                <Shield size={24} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#051F20] rounded-full"></span>
            </div>
            
            {!collapsed && (
              <div className="flex-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-gray-400 text-xs flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Online
                </p>
              </div>
            )}
          </div>

          {/* Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className={`
              absolute top-5 right-0 transform translate-x-1/2
              bg-[#0a2a2b] border border-[#235347]/30 rounded-full p-1.5
              hover:bg-[#235347] transition-colors shadow-lg
              ${collapsed ? 'hidden lg:block' : 'hidden lg:block'}
            `}
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

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin scrollbar-thumb-[#235347] scrollbar-track-[#051F20]">
          <div className="space-y-6">
            <div>
              <h3 className={`
                text-[#235347] text-xs font-semibold uppercase tracking-wider mb-3
                ${collapsed ? 'text-center' : 'px-2'}
              `}>
                {collapsed ? '•••' : 'Main Menu'}
              </h3>
              <div className="space-y-0.5">
                {menuItems.map(item => renderMenuItem(item))}
              </div>
            </div>

            <div>
              <h3 className={`
                text-[#235347] text-xs font-semibold uppercase tracking-wider mb-3
                ${collapsed ? 'text-center' : 'px-2'}
              `}>
                {collapsed ? '•••' : 'Settings'}
              </h3>
              <div className="space-y-0.5">
                {settingsItems.map(item => renderMenuItem(item, true))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with user profile */}
        <div className="p-4 border-t border-[#235347]/30 bg-gradient-to-t from-[#051F20] to-transparent">
          {!collapsed ? (
            <>
              <div className="flex items-center space-x-3 mb-3 p-2 bg-[#0a2a2b] rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-[#235347] to-[#1a3f35] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">AD</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">admin@example.com</p>
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
                <p className="text-gray-600 text-[10px] mt-0.5">© 2024 Admin Panel</p>
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
};

export default AdminSidebar;