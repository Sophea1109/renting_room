"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import { fetchChatUsers } from "@/utils/api";

export default function ChatSidebar({ onSelectUser = () => {}, onClose }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchChatUsers();
        console.log("API Response:", data); // Check your Browser Console (F12)
        
        // Ensure you are accessing the correct key
        setUsers(data.users || data.data || data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DELETE THE OLD handleSelectUser FUNCTION THAT WAS CAUSING THE ERROR

  return (
    <div className="h-full w-full bg-[#051F20] flex flex-col">
      {/* Search Header */}
      <div className="h-16 px-4 flex items-center gap-4 bg-[#051F20] border-b border-[#163832]">
        <button onClick={onClose} className="text-[#87a09b] hover:text-white">
          <FiArrowLeft size={24} />
        </button>
        <div className="flex-1 bg-[#0B2B26] rounded-full px-4 py-2 flex items-center gap-2 border border-[#163832]">
          <FiSearch className="text-[#5a7771]" />
          <input 
            placeholder="Search messages..." 
            className="bg-transparent w-full outline-none text-white placeholder-[#5a7771] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-center text-[#5a7771]">Loading...</p>
        ) : (
          filteredUsers.map((user) => (
            <div 
            key={user.id} 
            onClick={() => {
              console.log("DEBUG: Sidebar item clicked for user:", user);
              onSelectUser(user);
            }}
              className="cursor-pointer p-4 flex items-center gap-3 hover:bg-[#0B2B26] transition"
            >
              <div className="w-12 h-12 rounded-full bg-[#235347] flex items-center justify-center text-[#DAF1DE] font-bold text-lg border border-[#3a685d]">
                {user.first_name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{user.first_name} {user.last_name}</h4>
                <p className="text-sm text-[#87a09b] truncate">{user.last_message || "Start a conversation..."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}