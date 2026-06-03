"use client";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { fetchMessagesApi, sendMessageApi } from "@/utils/api";

export default function ChatConversation({ selectedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      const data = await fetchMessagesApi(selectedUser.id);
      setMessages(data || []);
      setLoading(false);
    };
    loadMessages();
  }, [selectedUser.id]);

  return (
    <div className="flex flex-col h-full bg-[#051F20] text-white">
      {/* Header with Back Button */}
      <div className="h-16 px-4 flex items-center border-b border-[#163832]">
        <button onClick={onBack} className="mr-4 text-[#87a09b]">
          <FiArrowLeft size={24} />
        </button>
        <h2 className="font-bold">{selectedUser.first_name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-[#5a7771]">Loading...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`p-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
              <div className="inline-block bg-[#163832] p-2 rounded-lg">{msg.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}