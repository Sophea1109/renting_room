'use client';
import React, { useState } from 'react';
import { Info, MessageCircle, AlertCircle } from 'lucide-react';

export default function NotificationDashboardPage() {
  const [notifications, setNotifications] = useState([
    { id: 201, title: 'System maintenance scheduled', status: 'unread', type: 'system', date: '2025-12-18', description: 'The platform will be down for 2 hours.' },
    { id: 202, title: 'New user message to support', status: 'unread', type: 'message', date: '2025-12-19', description: 'User asked about payment issues.' },
    { id: 203, title: 'Abuse report escalated', status: 'read', type: 'alert', date: '2025-12-19', description: 'Report of inappropriate content.' },
    { id: 204, title: 'Room listing approved', status: 'read', type: 'system', date: '2025-12-20', description: 'New room listing is now live.' },
  ]);

  const setStatus = (id, status) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status } : n));

  const removeNotification = (id) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const getTypeIcon = (type) => {
    switch (type) {
      case 'system': return <Info size={20} className="text-blue-500" />;
      case 'message': return <MessageCircle size={20} className="text-green-500" />;
      case 'alert': return <AlertCircle size={20} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
      status === 'unread' ? 'bg-blue-100 text-blue-700' :
      status === 'read' ? 'bg-gray-100 text-gray-700' : ''
    }`}>
      {status}
    </span>
  );

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 && (
        <div className="text-gray-500 text-center">No notifications</div>
      )}

      {notifications.map(n => (
        <div
          key={n.id}
          className={`flex flex-col md:flex-row justify-between items-start md:items-center p-3 rounded-lg border ${
            n.status === 'unread' ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
          }`}
        >
          {/* Left: icon + title + description */}
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">{getTypeIcon(n.type)}</div>
            <div className="flex flex-col">
              <div className="font-medium text-gray-800">{n.title}</div>
              <div className="text-sm text-gray-600">{n.description}</div>
              <div className="text-xs text-gray-400 mt-1">{n.type} • {n.date}</div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 md:ml-4">
            {n.status === 'unread' ? (
              <button
                onClick={() => setStatus(n.id, 'read')}
                className="text-blue-600 hover:underline text-sm"
              >
                Mark Read
              </button>
            ) : (
              <button
                onClick={() => setStatus(n.id, 'unread')}
                className="text-yellow-600 hover:underline text-sm"
              >
                Mark Unread
              </button>
            )}
            <button
              onClick={() => removeNotification(n.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
            {getStatusBadge(n.status)}
          </div>
        </div>
      ))}
    </div>
  );
}
