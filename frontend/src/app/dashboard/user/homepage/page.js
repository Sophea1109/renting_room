"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import ChatSidebar from "@/components/ChatSidebar";
import { fetchPropertiesApi } from "@/utils/api";
export default function HomePage() {
  const [roomData, setRoomData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchPropertiesApi();
        const props = response.data || [];
        
        const filteredUnits = props
          .flatMap(prop => (prop.units || []).map(unit => ({ ...unit, property: prop })))
          .filter(unit => unit.status?.toString().toLowerCase().trim() === 'available');

        setRoomData(filteredUnits);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  useEffect(() => {
    async function loadData() {
      setLoading(true);
  
      try {
        const response = await fetchPropertiesApi();
        const props = response.data || [];
  
        setProperties(props);
  
        const allUnits = props.flatMap((prop) =>
          (prop.units || []).map((unit) => ({
            ...unit,
            property: prop,
          }))
        );
  
        const filteredUnits = allUnits.filter(
          (unit) =>
            unit.status &&
            unit.status.toString().toLowerCase().trim() === "available"
        );
  
        setRoomData(filteredUnits);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }
  
    loadData();
  }, []);

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!userComment) return;
    const newFeedback = { id: Date.now(), name: "Anonymous", comment: userComment };
    setFeedbacks([newFeedback, ...feedbacks]);
    setUserComment("");
  };

  return (
    <div className="min-h-screen bg-[#051F20] text-[#DAF1DE] md:pt-28">
      <Header onMessagesClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* HERO SECTION */}
      <section className="pt-12 pb-12 min-h-[200px] md:min-h-[200px] border-b border-[#235347] bg-[#051F20] relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200')] opacity-5 bg-cover bg-center"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Your text will now sit perfectly in the center without being clipped! */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Book Your
              <span className="text-[#8EB69B]"> Perfect Space</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find and reserve rooms that match your lifestyle, budget, and location.
            </p>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Available</h2>
          <div className="h-1 w-20 bg-[#8EB69B] rounded-full"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-[#0B2B26] animate-pulse rounded-2xl"></div>)}
          </div>
        ) : roomData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {roomData.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-[#8EB69B]">No rooms available at the moment.</div>
        )}
      </section>

      {/* FEEDBACK */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <h2 className="text-3xl font-bold text-center">What Our Users Say</h2>
        <form onSubmit={handleAddFeedback} className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Leave your comment..."
            className="px-4 py-2 rounded-lg bg-[#0B2B26] border border-[#235347] text-[#DAF1DE] placeholder:text-[#8EB69B] focus:outline-none flex-1"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            required
          />
          <button type="submit" className="px-6 py-2 bg-[#235347] hover:bg-[#8EB69B] hover:text-[#051F20] transition rounded-lg">
            Submit
          </button>
        </form>
      </section>

      <Footer />

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          
          {/* Sidebar Panel */}
          <div className="relative w-80 h-full bg-[#051F20] border-l border-[#235347] shadow-2xl">
            <ChatSidebar 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}