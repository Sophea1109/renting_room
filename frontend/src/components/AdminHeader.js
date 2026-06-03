'use client';

import React from 'react';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { fetchPendingCount } from '@/lib/bookingApi';
import { useState, useEffect } from 'react';

export default function OwnerHeader({ onSearch, onMenuClick, collapsed }) {
  const router = useRouter();
  const { user } = useUser();
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-gradient-to-r from-[#051F20] to-[#0a2a2b] border-b border-[#235347]/30 shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          
          {/* Left Section - Menu Toggle & Search */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#0a2a2b] transition-colors"
              >
                <Menu size={22} />
              </button>
            )}

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search rooms, bookings, messages..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#235347] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center gap-4">
            
            {/* Notifications Bell */}
            <button
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#0a2a2b] transition-all duration-200 group"
              onClick={() => router.push('/dashboard/owner/bookings')}
              title="Booking Requests"
            >
              <Bell size={20} className="group-hover:scale-110 transition-transform duration-200" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#0a2a2b] transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={user?.avatar || "/images/default-avatar.jpg"}
                    alt={user?.name || "Profile"}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#235347] group-hover:border-[#2a6b5a] transition-colors"
                    onError={(e) => {
                      e.target.src = "https://ui-avatars.com/api/?name=" + (user?.name || "Owner") + "&background=235347&color=fff";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#051F20] rounded-full"></span>
                </div>
                
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name || 'Owner User'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'owner@example.com'}</p>
                </div>
                
                <ChevronDown 
                  size={16} 
                  className={`hidden md:block text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-[#0a2a2b] border border-[#235347]/30 rounded-xl shadow-2xl overflow-hidden z-40 animate-slideDown">
                    {/* User Info */}
                    <div className="p-4 border-b border-[#235347]/30 bg-gradient-to-r from-[#051F20] to-[#0a2a2b]">
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatar || "/images/default-avatar.jpg"}
                          alt={user?.name || "Profile"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#235347]"
                          onError={(e) => {
                            e.target.src = "https://ui-avatars.com/api/?name=" + (user?.name || "Owner") + "&background=235347&color=fff";
                          }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{user?.name || 'Owner User'}</p>
                          <p className="text-xs text-gray-400">{user?.email || 'owner@example.com'}</p>
                          <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-400">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push('/dashboard/owner/profile');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#235347]/20 transition-colors"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push('/dashboard/owner/settings');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#235347]/20 transition-colors"
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-[#235347]/30 my-1"></div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>

                    {/* Version Info */}
                    <div className="px-4 py-3 border-t border-[#235347]/30 bg-[#051F20]/50">
                      <p className="text-xs text-center text-gray-500">Version 2.1.0</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}