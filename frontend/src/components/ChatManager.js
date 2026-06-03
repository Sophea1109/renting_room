"use client";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiArrowLeft, FiX, FiSend } from "react-icons/fi";
import { fetchChatUsers, fetchMessagesApi, sendMessageApi } from "@/utils/api";

export default function ChatManager({ onClose }) {
  const [view, setView] = useState("sidebar"); 
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Fetch User List when component mounts
  useEffect(() => {
    fetchChatUsers().then(data => setUsers(data.users || []));
  }, []);

  // 2. Real-time message polling
  useEffect(() => {
    if (!selectedUser) return;
    
    // Fetch immediately on select
    const loadMessages = async () => {
      const data = await fetchMessagesApi(selectedUser.id);
      setMessages(data || []);
    };
    loadMessages();

    // Polling interval for new messages
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setView("conversation");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessageApi(selectedUser.id, newMessage);
    setNewMessage("");
    const data = await fetchMessagesApi(selectedUser.id);
    setMessages(data || []);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-[#051F20] z-[100] border-l border-[#163832] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#163832]">
        {view === "conversation" ? (
          <button onClick={() => setView("sidebar")} className="text-white"><FiArrowLeft size={20} /></button>
        ) : <span className="text-white font-bold">Messages</span>}
        <button onClick={onClose} className="text-white"><FiX size={20} /></button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === "sidebar" ? (
          users.map(user => (
            <div key={user.id} onClick={() => handleSelectUser(user)} className="p-4 cursor-pointer hover:bg-[#0B2B26] text-white border-b border-[#163832]">
              <p className="font-bold">{user.first_name} {user.last_name}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-lg max-w-[80%] ${m.sender_id === selectedUser.id ? 'bg-[#163832] self-start' : 'bg-[#235347] self-end'}`}>
                  {m.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="mt-4 flex gap-2">
              <input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-[#0B2B26] text-white p-2 rounded-lg"
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage} className="bg-[#235347] p-2 rounded-lg text-white"><FiSend /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}