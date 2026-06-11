"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { fetchPendingCount } from "@/lib/bookingApi";
import { useState, useEffect } from "react";

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "/users/default-avatar.svg";
  if (avatarPath.startsWith("http")) return avatarPath;
  if (avatarPath.includes("avatars/")) {
    return `http://127.0.0.1:8000/storage/${avatarPath}`;
  }
  if (avatarPath && !avatarPath.includes("/")) {
    return `http://127.0.0.1:8000/storage/avatars/${avatarPath}`;
  }
  return "/users/default-avatar.svg";
};

export default function OwnerHeader({ onSearch, onMenuClick, collapsed }) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userFullName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.username ||
      "User"
    : "Guest";

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
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };
  const avatarUrl = user
    ? getAvatarUrl(user.avatar)
    : "/users/default-avatar.svg";

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
                <div className="flex items-center space-x-3 mb-3 p-2">
                  <h3 className="text-2xl font-bold text-white">Admin Panel</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => router.push("/dashboard/admin/profile")}
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-neutral-200 dark:border-[#235347] object-cover"
                />
                <span className="hidden lg:block text-sm font-medium text-neutral-800 dark:text-[#DAF1DE]">
                  {userFullName}
                </span>
              </div>
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
