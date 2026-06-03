"use client";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import ChatSidebar from "@/components/ChatSidebar";
import { fetchPropertiesApi } from "@/utils/api";

export default function RoomsPage() {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // States for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchPropertiesApi();
        const props = response?.data || [];
        const availableUnits = props.flatMap(prop => 
          (prop.units || []).filter(unit => 
            unit.status?.toString().toLowerCase().trim() === 'available'
          ).map(unit => ({ ...unit, title: unit.tittle, property: prop }))
        );
        setRoomData(availableUnits);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Get unique locations for the dropdown
  const locations = useMemo(() => {
    const locs = roomData.map(r => r.property?.location).filter(Boolean);
    return ["all", ...new Set(locs)];
  }, [roomData]);

  const filteredRooms = useMemo(() => {
    return roomData.filter((room) => {
      const matchesSearch = 
        room?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room?.property?.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "all" || room?.property?.location === locationFilter;
      return matchesSearch && matchesLocation;
    });
  }, [roomData, searchTerm, locationFilter]);

  return (
    <div className="min-h-screen bg-[#051F20] text-[#DAF1DE]">
      <Header onMessagesClick={() => setIsChatOpen(!isChatOpen)} />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Available Rooms</h1>
            <p className="text-[#8EB69B]">Explore {filteredRooms.length} rooms matching your criteria</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-6 py-3 rounded-full bg-[#0B2B26] border border-[#235347] focus:ring-2 focus:ring-[#8EB69B] outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="px-6 py-3 rounded-full bg-[#0B2B26] border border-[#235347] outline-none cursor-pointer"
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              {locations.map(loc => <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>)}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3].map(i => <div key={i} className="h-80 bg-[#0B2B26] animate-pulse rounded-2xl" />)}
           </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredRooms.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-[#8EB69B]">Try adjusting your search or location filter.</p>
          </div>
        )}
      </main>
      <Footer />

      {isChatOpen && <ChatSidebar />}
    </div>
  );
}