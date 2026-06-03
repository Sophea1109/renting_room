// hooks/useNotifications.js
import { useEffect, useState } from "react";

export function useNotifications() {
  // Start with 'default' on the server to prevent SSR mismatch errors
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && !("Notification" in window)) {
      console.log("Browser does not support desktop notifications");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  };

  const showNotification = (title, options = {}) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const defaultOptions = {
      body: options.body || "",
      icon: options.icon || "/favicon.ico",
      badge: options.badge || "/badge-icon.png",
      tag: options.tag || "chat-message",
      requireInteraction: false,
      silent: false,
    };

    const notification = new Notification(title, { ...defaultOptions, ...options });

    notification.onclick = (e) => {
      e.preventDefault();
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };

    return notification;
  };

  return { permission, requestPermission, showNotification };
}