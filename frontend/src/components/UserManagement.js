"use client";

import { useEffect, useState } from "react";
import {
  fetchUsers,
  deleteUser,
} from "@/utils/api";
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaCamera, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingUserId, setUploadingUserId] = useState(null);

  const router = useRouter();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const usersArray = await fetchUsers();
      console.log("Users loaded:", usersArray);
      setUsers(usersArray);
    } catch (err) {
      console.error("Load error:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    router.push(`/dashboard/admin/User/Edit/${user.id}`);
  };

  const handleAvatarUpload = async (userId, file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    setUploadingUserId(userId);
    
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/user/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        // Reload users to get the updated avatar
        await loadUsers();
        alert("Avatar updated successfully!");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message);
    } finally {
      setUploadingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0a2a2b] rounded-xl border border-[#235347]/30 shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-[#235347]/30">
        <div>
          <h3 className="text-xl font-bold text-white">User Management</h3>
          <p className="text-gray-400 text-sm mt-1">Manage and monitor all users</p>
        </div>

        <button
          onClick={() => router.push('/dashboard/admin/User/create')}
          className="px-4 py-2 bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white rounded-lg text-sm hover:from-[#2a7a64] hover:to-[#235347] transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <FaUserPlus size={14} />
          Add User
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-6 border-b border-[#235347]/30">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#235347]/20 transition-all"
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#235347] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm mt-3">Loading users...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="m-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#051F20]">
              <tr className="border-b border-[#235347]/30">
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Avatar</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#235347]/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#051F20]/50 transition-colors">
                  {/* Avatar Cell */}
                  <td className="px-6 py-4">
                    <div className="relative group">
                      {/* Avatar Display - FIXED URL */}
                      {user.avatar ? (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${user.avatar}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#235347]"
                          onError={(e) => {
                            console.error('Failed to load:', e.target.src);
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const parent = e.target.parentNode;
                            parent.innerHTML = `
                              <div class="w-10 h-10 rounded-full bg-[#235347] flex items-center justify-center">
                                <svg class="text-white text-sm" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
                                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#235347] flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                        {uploadingUserId === user.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaCamera className="text-white text-sm" />
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleAvatarUpload(user.id, file);
                          }}
                          disabled={uploadingUserId === user.id}
                        />
                      </label>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-white text-sm font-medium">
                   {`${user.first_name} ${user.last_name}`}
                  </td>

                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-300'
                        : user.role === 'owner'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                      active
                    </span>
                  </td>

                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-400 hover:text-[#235347] transition-colors"
                      title="Edit User"
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete User"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER */}
      {!loading && !error && (
        <div className="px-6 py-4 border-t border-[#235347]/30 bg-[#051F20]/50 text-sm text-gray-400">
          Total Users: {users.length}
        </div>
      )}
    </div>
  );
}