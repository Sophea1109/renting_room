"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiUser, FiMenu, FiX, FiSearch, FiBell, FiMessageCircle } from "react-icons/fi";
import { useUser } from "@/context/UserContext";

const navLinks = [
  { name: "Home", href: "/dashboard/user/homepage" },
  { name: "Room", href: "/dashboard/user/rooms" },
  { name: "Request Roommate", href: "/dashboard/user/request-roommate" },
];

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messagesCount, setMessagesCount] = useState(0); // mock messages count
  const [notifications, setNotifications] = useState([]); // mock notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, setUser } = useUser();

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Frontend-only: Mock messages and notifications
  useEffect(() => {
    if (user) {
      // You can adjust these numbers for demo
      setMessagesCount(3);
      setNotifications([
        { message: "Your request has been approved" },
        { message: "New room available in Chamkarmon" },
      ]);
    } else {
      setMessagesCount(0);
      setNotifications([]);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const avatarUrl = (() => {
    if (!user?.avatar) return "/users/default-avatar.svg";
    return user.avatar.startsWith("/") ? user.avatar : user.avatar;
  })();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        sticky ? "shadow-lg py-2" : "py-4"
      }`}
      style={{
        background:
          "linear-gradient(to right, rgba(59,130,246,0.3), rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between relative">
        <Link href="/dashboard/user/homepage">
          <img src="/images/logo.png" alt="FindRoommate Logo" className="w-18 h-20 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-between mx-4 space-x-6">
          <div className="relative flex-1">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <nav className="flex space-x-6 text-white items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-yellow-300 relative group transition">
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
              </Link>
            ))}

            {user && (
              <>
                {/* Message Icon */}
                <Link href="/dashboard/user/messages" className="relative">
                  <FiMessageCircle className="w-6 h-6 text-white hover:text-yellow-300" />
                  {messagesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {messagesCount}
                    </span>
                  )}
                </Link>

                {/* Notification Icon */}
                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                    <FiBell className="w-6 h-6 text-white hover:text-yellow-300" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-100 font-semibold">Notifications</div>
                      {notifications.length === 0 && <div className="p-4 text-gray-500 text-sm">No notifications</div>}
                      {notifications.map((note, i) => (
                        <div key={i} className="p-3 border-b border-gray-100 text-sm hover:bg-gray-50 cursor-pointer">
                          {note.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4 text-white relative">
          {user ? (
            <Link href="/dashboard/user/profile" className="flex items-center space-x-2 hover:opacity-80 transition">
              <img
                src={avatarUrl}
                alt={user.name || "User Avatar"}
                className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                onError={(e) => (e.currentTarget.src = "/users/default-avatar.svg")}
              />
              <span>{user.name || "Anonymous"}</span>
            </Link>
          ) : (
            <Link href="/login" className="hidden md:flex items-center space-x-1 hover:text-yellow-300">
              <FiUser className="w-6 h-6" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 shadow-lg">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <nav className="flex flex-col space-y-3 text-gray-900">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-indigo-500">
                {link.name}
              </Link>
            ))}
            {!user && <Link href="/login" className="hover:text-indigo-500">Login</Link>}
            {user && (
              <>
                <Link href="/dashboard/user/messages" className="hover:text-indigo-500">
                  Messages {messagesCount > 0 && `(${messagesCount})`}
                </Link>
                <Link href="#" className="hover:text-indigo-500">
                  Notifications {notifications.length > 0 && `(${notifications.length})`}
                </Link>
                <button onClick={handleLogout} className="hover:text-indigo-500 text-left w-full">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
