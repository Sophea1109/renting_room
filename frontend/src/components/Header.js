"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiBell,
  FiMessageCircle,
  FiCheckCircle,
  FiXCircle,
  FiHome,
} from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import {
  fetchUnreadMessagesApi,
  markMessagesAsRead,
  isAuthenticated,
} from "@/utils/api";

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

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastUnreadCount, setLastUnreadCount] = useState(0);

  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const { user, setUser } = useUser();
  const router = useRouter();

  // REVERTED: Messages now points directly to the new chat page
  const navLinks = [
    { name: "Home", href: "/dashboard/user/homepage" },
    { name: "Rooms", href: "/dashboard/user/rooms" },
    { name: "Rooms-Booking", href: "/dashboard/user/rooms-booking" },
    { name: "Messages", href: "/dashboard/user/chat" },
  ];

  const userFullName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.username ||
      "User"
    : "Guest";

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      setShowSearchResults(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(
            searchTerm
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server Error Details:", response.status, errorText);
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search query error:", err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchUnreadMessages = async () => {
    if (!isAuthenticated()) return;
    if (user?.role === "admin") return;

    try {
      setLoading(true);
      const data = await fetchUnreadMessagesApi();

      if (!data) {
        setNotifications([]);
        setUnreadCount(0);
        setLastUnreadCount(0);
        return;
      }

      let unreadData = [];
      if (Array.isArray(data)) unreadData = data;
      else if (data.unread_messages) unreadData = data.unread_messages;
      else if (data.messages) unreadData = data.messages;
      else if (data.data) unreadData = data.data;
      else if (typeof data === "object" && data.count !== undefined) {
        setUnreadCount(data.count || 0);
        setNotifications([]);
        return;
      }

      if (Array.isArray(unreadData) && unreadData.length > 0) {
        const newNotifications = unreadData.map((item) => {
          const senderFullName =
            `${item.sender_first_name || item.first_name || ""} ${
              item.sender_last_name || item.last_name || ""
            }`.trim() ||
            item.sender_name ||
            item.name ||
            "Unknown User";

          return {
            id: item.sender_id || item.id,
            message: `${senderFullName}: ${
              item.latest_message || item.message || "New message"
            }`,
            fullMessage: item.latest_message || item.message,
            senderId: item.sender_id || item.id,
            senderName: senderFullName,
            timestamp: item.created_at || item.timestamp,
            unreadCount: item.count || 1,
          };
        });

        const totalUnread = newNotifications.reduce(
          (sum, n) => sum + (n.unreadCount || 1),
          0
        );

        if (totalUnread > lastUnreadCount && lastUnreadCount !== 0) {
          const latest = newNotifications[0];
          if (latest) {
            setToast({
              id: Date.now(),
              senderName: latest.senderName,
              message: latest.fullMessage,
              senderId: latest.senderId,
            });
            try {
              new Audio("/sounds/notification.mp3").play().catch(() => {});
            } catch (e) {}
          }
        }

        setNotifications(newNotifications);
        setUnreadCount(totalUnread);
        setLastUnreadCount(totalUnread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
        setLastUnreadCount(0);
      }
    } catch (err) {
      console.warn("Error checking metrics:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated() || user?.role === "admin") return;
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const handleNotificationClick = async (notificationId, senderId) => {
    try {
      await markMessagesAsReadApi(senderId);
      setNotifications((prev) => {
        const removed = prev.find((n) => n.id === notificationId);
        setUnreadCount((count) =>
          Math.max(0, count - (removed?.unreadCount || 1))
        );
        return prev.filter((n) => n.id !== notificationId);
      });
      setShowNotifications(false);

      // Since we moved to a page, we just redirect there
      window.location.href = `/dashboard/user/chat?userId=${senderId}`;
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    if (!isAuthenticated() || notifications.length === 0) return;
    try {
      for (const note of notifications) {
        await markMessagesAsReadApi(note.senderId);
      }
      setNotifications([]);
      setUnreadCount(0);
      setLastUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const diff = new Date() - date;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const avatarUrl = user
    ? getAvatarUrl(user.avatar)
    : "/users/default-avatar.svg";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-neutral-200/80 dark:border-[#163832]/60 ${
          sticky ? "shadow-md py-2" : "py-4"
        } bg-white/95 dark:bg-[#051F20]/90 backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/dashboard/user/homepage">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-10 md:h-9 w-auto object-contain cursor-pointer"
            />
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center mx-8">
            <nav className="flex items-center space-x-6 text-neutral-600 dark:text-[#DAF1DE] text-sm font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative hover:text-[#0B2B26] dark:hover:text-[#8EB69B] transition group"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#0B2B26] dark:bg-[#8EB69B] transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="relative" ref={notificationRef}></div>

          {/* User Avatar */}
          <div
  className="flex items-center space-x-2 cursor-pointer"
  onClick={() => router.push("/dashboard/user/profile")}
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
      </header>
    </>
  );
}
