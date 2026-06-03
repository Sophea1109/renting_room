"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import OwnerHeader from "@/components/OwnerHeader";
import OwnerSidebar from "@/components/OwnerSidebar";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBed, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";

export default function OwnerRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Get unique locations from rooms
  const locations = useMemo(() => {
    const allLocations = rooms.map(room => room.location).filter(Boolean);
    return [...new Set(allLocations)];
  }, [rooms]);

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-rooms`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      fetchRooms();
    } catch (error) {
      alert("Failed to delete room");
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchTerm === "" || 
      room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "" || room.location === locationFilter;
    
    const roomPrice = room.monthly_rent || 0;
    const matchesMinPrice = minPrice === "" || roomPrice >= parseInt(minPrice);
    const matchesMaxPrice = maxPrice === "" || roomPrice <= parseInt(maxPrice);
    
    return matchesSearch && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-500/20 text-green-400";
      case "occupied": return "bg-red-500/20 text-red-400";
      case "maintenance": return "bg-yellow-500/20 text-yellow-400";
      case "cleaning": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available": return "Available";
      case "occupied": return "Occupied";
      case "maintenance": return "Maintenance";
      case "cleaning": return "Cleaning";
      default: return status || "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <OwnerHeader onMenuClick={() => setSidebarOpen(true)} />
        <OwnerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex justify-center items-center h-96">
          <div className="w-8 h-8 border-4 border-[#235347] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 ml-3">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <OwnerHeader onMenuClick={() => setSidebarOpen(true)} />
      <OwnerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">My Rooms</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your property listings</p>
              </div>
              <button
                onClick={() => router.push('/dashboard/owner/rooms/create')}
                className="px-4 py-2 bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white rounded-lg text-sm hover:from-[#2a7a64] hover:to-[#235347] transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaPlus size={14} />
                Add Room
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0a2a2b] rounded-xl p-4 border border-[#235347]/30">
              <FaBed className="text-[#235347] text-xl mb-2" />
              <div className="text-2xl font-bold text-white">{rooms.length}</div>
              <div className="text-sm text-gray-400">Total Rooms</div>
            </div>
            <div className="bg-[#0a2a2b] rounded-xl p-4 border border-[#235347]/30">
              <FaDollarSign className="text-[#235347] text-xl mb-2" />
              <div className="text-2xl font-bold text-white">
                ${rooms.reduce((sum, r) => sum + (r.monthly_rent || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Monthly Revenue</div>
            </div>
            <div className="bg-[#0a2a2b] rounded-xl p-4 border border-[#235347]/30">
              <div className="text-2xl font-bold text-white">
                {rooms.filter(r => r.occupancy_status === "available").length}
              </div>
              <div className="text-sm text-gray-400">Available Rooms</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#0a2a2b] rounded-xl border border-[#235347]/30 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#235347]"
                />
              </div>
              
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white focus:outline-none focus:border-[#235347]"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#235347]"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#235347]"
              />
            </div>
          </div>

          {/* Rooms Grid */}
          {filteredRooms.length === 0 ? (
            <div className="bg-[#0a2a2b] rounded-xl border border-[#235347]/30 p-12 text-center">
              <FaBed className="text-gray-600 text-5xl mx-auto mb-4" />
              <p className="text-gray-400">No rooms found</p>
              <button
                onClick={() => router.push('/dashboard/owner/rooms/create')}
                className="mt-4 text-[#235347] hover:underline"
              >
                Create your first room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="bg-[#0a2a2b] rounded-xl border border-[#235347]/30 overflow-hidden hover:border-[#235347] transition-all group">
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-[#235347] to-[#1a3f35] flex items-center justify-center relative">
                    <FaBed className="text-white text-5xl opacity-50" />
                    <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${getStatusColor(room.occupancy_status)}`}>
                      {getStatusText(room.occupancy_status)}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{room.name}</h3>
                      {room.room_number && (
                        <span className="text-xs text-gray-500">#{room.room_number}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <FaMapMarkerAlt size={14} className="text-[#235347]" />
                      {room.location || "Location not specified"}
                    </div>
                    
                    <div className="flex items-center gap-1 text-[#235347] font-bold text-xl mb-4">
                      <FaDollarSign size={20} />
                      {room.monthly_rent?.toLocaleString()}
                      <span className="text-sm text-gray-400 font-normal">/month</span>
                    </div>

                    {/* Amenities Preview */}
                    {room.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-[#235347]/20 text-[#235347] rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Description Preview */}
                    {room.description && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {room.description}
                      </p>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-3 pt-3 border-t border-[#235347]/30">
                      <button
                        onClick={() => router.push(`/dashboard/owner/rooms/${room.id}/edit`)}
                        className="flex-1 px-3 py-2 bg-[#235347] text-white rounded-lg text-sm hover:bg-[#2a7a64] transition flex items-center justify-center gap-2"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          {filteredRooms.length > 0 && (
            <div className="mt-6 px-6 py-4 bg-[#0a2a2b] rounded-xl border border-[#235347]/30 text-sm text-gray-400">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </div>
          )}
        </main>
      </div>
    </div>
  );
}