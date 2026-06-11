"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiUser,
  FiSend,
  FiPaperclip,
  FiMoreVertical,
  FiMessageSquare,
} from "react-icons/fi";
import { fetchChatUsers, fetchMessages, sendMessage } from "@/utils/api";

function ChatContent() {
  const searchParams = useSearchParams();
  const contactIdFromUrl = searchParams.get("contact");

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchChatUsers();
        const fetchedUsers = data.users || data.data || (Array.isArray(data) ? data : []);
        setUsers(fetchedUsers);

        if (contactIdFromUrl) {
          const targetId = parseInt(contactIdFromUrl, 10);
          const foundUser = fetchedUsers.find((u) => u.id === targetId);

          if (foundUser) {
            setActiveContact(foundUser);
          } else {
            const res = await fetch(`http://127.0.0.1:8000/api/users/${targetId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
              },
            });
            if (res.ok) {
              const userData = await res.json();
              const freshUser = userData.user || userData.data || userData;
              setUsers((prev) => [freshUser, ...prev]);
              setActiveContact(freshUser);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [contactIdFromUrl]);

  useEffect(() => {
    if (!activeContact) return;

    const loadConversation = async () => {
      try {
        const backendMessages = await fetchMessages(activeContact.id);
        const formattedMessages = backendMessages.map((m) => ({
          id: m.id,
          text: m.message,
          sender: m.sender_id === activeContact.id ? "them" : "me",
          time: m.created_at,
          avatar: m.sender?.avatar || null,
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Could not load messages:", err);
      }
    };

    loadConversation();
    const syncInterval = setInterval(loadConversation, 4000);
    return () => clearInterval(syncInterval);
  }, [activeContact]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;
    const textToSend = newMessage;
    setNewMessage("");

    try {
      const savedMessage = await sendMessage(activeContact.id, textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: savedMessage.id || Date.now(),
          text: savedMessage.message || textToSend,
          sender: "me",
          time: savedMessage.created_at || new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setNewMessage(textToSend);
      alert("Message failed to send.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#021414]">
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* LEFT: Sidebar */}
        <aside className="w-80 bg-[#051F20] border-r border-[#163832] flex flex-col">
          <div className="p-4 border-b border-[#163832]">
            <div className="bg-[#0B2B26] rounded-xl px-4 py-2 flex items-center gap-3 border border-[#163832]">
              <FiSearch className="text-[#5a7771]" />
              <input
                placeholder="Search conversations..."
                className="bg-transparent w-full outline-none text-white placeholder-[#5a7771] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-[#5a7771] text-sm text-center">
                Loading chats...
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setActiveContact(user)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${
                    activeContact?.id === user.id
                      ? "bg-[#0B2B26] border-[#235347]"
                      : "border-transparent hover:bg-[#082421]"
                  }`}
                >
                  {/* User avatar item in sidebar */}
                  {user.avatar ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${user.avatar}`}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover border border-[#235347]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#163832] flex items-center justify-center text-[#8EB69B] font-bold border border-[#235347] shrink-0">
                      {(user.first_name || user.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 flex items-center justify-between">
                    <h4 className="font-semibold text-[#DAF1DE] truncate">
                      {user.first_name || user.name
                        ? `${user.first_name || user.name} ${
                            user.last_name || ""
                          }`
                        : "User Details"}
                    </h4>

                    {Number(user.unread_count) > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold min-w-[22px] h-[22px] rounded-full flex items-center justify-center ml-2">
                        {user.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* RIGHT: Chat Window */}
        <main className="flex-1 flex flex-col relative bg-[#021414]">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <header className="px-6 py-4 bg-[#051F20] border-b border-[#163832] flex justify-between items-center">
                <h3 className="font-bold text-[#DAF1DE] flex items-center gap-3">
                  {activeContact.avatar ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${activeContact.avatar}`}
                      alt="active-profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  )}
                  {activeContact.first_name || activeContact.name}{" "}
                  {activeContact.last_name || ""}
                </h3>
                <FiMoreVertical className="text-[#5a7771] cursor-pointer" />
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 items-end ${
                      m.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Render Other User Avatar left of message bubble */}
                    {m.sender !== "me" &&
                      (activeContact.avatar ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${activeContact.avatar}`}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover mb-1"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#163832] flex items-center justify-center text-[#8EB69B] text-xs font-bold mb-1 shrink-0">
                          {(
                            activeContact.first_name ||
                            activeContact.name ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      ))}

                    {/* Bubble Content with message text and embedded timestamp */}
                    <div className="flex flex-col max-w-[60%]">
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-sm ${
                          m.sender === "me"
                            ? "bg-[#235347] text-white rounded-br-none"
                            : "bg-[#051F20] border border-[#163832] text-[#DAF1DE] rounded-bl-none"
                        }`}
                      >
                        <p className="break-words">{m.text}</p>

                        {/* Timestamp item inside bubble */}
                        <span className="block text-[10px] text-right mt-1 opacity-50 select-none">
                          {formatTime(m.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <footer className="p-4 bg-[#051F20] border-t border-[#163832]">
                <div className="flex items-center gap-3 bg-[#0B2B26] rounded-2xl p-2 border border-[#163832]">
                  <button
                    type="button"
                    className="p-3 text-[#5a7771] hover:text-white"
                  >
                    <FiPaperclip />
                  </button>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-transparent py-2 outline-none text-white placeholder-[#5a7771]"
                    placeholder="Type a message..."
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="p-3 bg-[#235347] text-white rounded-xl hover:bg-[#3a685d] flex items-center justify-center shrink-0"
                  >
                    <FiSend />
                  </button>
                </div>
              </footer>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-[#5a7771] space-y-4">
              <FiMessageSquare size={48} className="opacity-20" />
              <p>Select a contact to start your conversation</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
