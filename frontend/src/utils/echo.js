import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

// Change to your Laravel base URL without /api, as broadcasting is a root route
const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8000";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getEcho = () => {
  if (echoInstance) return echoInstance;

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'local',
    wsHost: process.env.NEXT_PUBLIC_WS_HOST || '127.0.0.1',
    wsPort: process.env.NEXT_PUBLIC_WS_PORT || 6001,
    forceTLS: false,
    disableStats: true,
    
    // Broadcast auth usually lives at /broadcasting/auth
    authEndpoint: `${LARAVEL_URL}/broadcasting/auth`,

    auth: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: 'application/json',
      },
    },
  });

  return echoInstance;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};