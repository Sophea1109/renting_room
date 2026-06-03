"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaBuilding } from "react-icons/fa";
import Header from "@/components/Header";

export default function RoomsBookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = "http://127.0.0.1:8000/storage/";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/my-bookings`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to load");
      setBookings(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#031415] flex items-center justify-center text-[#8EB69B]">
      <FaSpinner className="animate-spin text-3xl" />
    </div>
  );

  return (
    // Inside RoomsBookingPage.js
  <div className="min-h-screen bg-[#031415]">
    <Header /> {/* Add this right here */}
    <div className="p-6 md:p-12">
    <div className="min-h-screen bg-[#031415] text-white p-6 md:p-12">

<div className="max-w-7xl mx-auto">

  <h1 className="text-3xl font-black mb-8 text-white uppercase tracking-widest">My Bookings</h1>



  {bookings.length === 0 ? (

    <div className="text-center py-20 border-2 border-dashed border-[#235347]/30 rounded-3xl">

      <p className="text-gray-500">No active reservations found.</p>

    </div>

  ) : (

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {bookings.map((b) => (

        <div key={b.id} className="bg-[#051F20]/50 border border-[#235347]/40 rounded-3xl p-5 hover:border-[#8EB69B]/50 transition-all group">

          

          {/* IMAGE SECTION */}

          <div className="h-48 w-full relative bg-gray-900 overflow-hidden rounded-2xl">

            <img

              src={`${baseUrl}${b.unit?.image}`}

              alt={b.unit?.tittle}

              className="w-full h-full object-cover transition-opacity duration-500"

              onError={(e) => {

                e.target.style.display = 'none';

                // Use a ref-less approach: find the sibling div

                const placeholder = e.target.parentElement.querySelector('.img-placeholder');

                if (placeholder) placeholder.style.display = 'flex';

              }}

            />

            {/* Fallback Placeholder */}

            <div 

              className="img-placeholder hidden absolute inset-0 flex-col items-center justify-center text-gray-500 bg-gray-900"

            >

              <FaBuilding className="text-3xl mb-2 opacity-50" />

              <span className="text-[10px] uppercase tracking-widest">No Image</span>

            </div>

          </div>



          <h2 className="text-xl font-bold mb-1 mt-4">{b.unit?.tittle}</h2>

          <p className="text-sm text-gray-400 flex items-center gap-2 mb-4">

            <FaMapMarkerAlt /> {b.unit?.property?.location}

          </p>



          <div className="space-y-2 text-xs text-gray-300 bg-[#0B2B26]/30 p-3 rounded-xl mb-4">

            <div className="flex justify-between">

              <span>Check-in:</span> <span className="font-bold text-white">{b.check_in}</span>

            </div>

            <div className="flex justify-between">

              <span>Check-out:</span> <span className="font-bold text-white">{b.check_out}</span>

            </div>

          </div>



          <div className="flex justify-between items-center mb-4">

            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>

              {b.status}

            </span>

            <span className="text-lg font-black">${Number(b.total || 0).toFixed(2)}</span>

          </div>



          <button

            onClick={() => router.push(`/dashboard/user/rooms/${b.unit_id}`)}

            className="w-full bg-[#235347]/40 hover:bg-[#235347] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition"

          >

            View Details
            
          </button>

          {b.status === 'completed' && (
              <button
                onClick={() => router.push(`/dashboard/user/rooms/${b.unit_id}`)}
                className="w-full mt-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition"
              >
                ★ Leave a Review
              </button>
            )}

        </div>

      ))}

    </div>

  )}

</div>

</div>
    </div>
  </div>
  );
}