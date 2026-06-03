// src/services/chatService.js
import {
  fetchChatUsers,
  fetchMessages,
  sendMessageApi,
  fetchUnreadMessages,
  markMessagesAsRead,
  getAuthToken,
} from '@/utils/api';

class ChatService {
  constructor() {
    this.token = null;
    this.listeners = new Map();
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token || getAuthToken();
  }

  async getUsers(search = '') {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    return fetchChatUsers(token, search);
  }

  async getMessages(userId) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    return fetchMessages(token, userId);
  }

  async sendMessage(receiverId, message) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    return sendMessageApi(token, receiverId, message);
  }

  async getUnreadMessages() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    return fetchUnreadMessages(token);
  }

  async markAsRead(senderId) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    return markMessagesAsRead(token, senderId);
  }

  // Subscribe to real-time messages (if using WebSockets)
  subscribeToMessages(userId, callback) {
    if (typeof window !== 'undefined' && window.Echo) {
      const channel = window.Echo.private(`chat.${userId}`);
      
      const handler = (e) => {
        callback(e.message);
      };
      
      channel.listen('MessageSent', handler);
      
      // Store for cleanup
      this.listeners.set(userId, { channel, handler });
      
      return () => {
        channel.stopListening('MessageSent', handler);
        this.listeners.delete(userId);
      };
    }
    
    return () => {};
  }

  // Cleanup all subscriptions
  cleanup() {
    this.listeners.forEach(({ channel, handler }) => {
      channel.stopListening('MessageSent', handler);
    });
    this.listeners.clear();
  }
}

export const chatService = new ChatService();
