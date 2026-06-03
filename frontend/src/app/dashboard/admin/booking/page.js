"use client";

import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaSearch, FaUser, FaBuilding } from "react-icons/fa";
import { fetchBookingsApi } from "@/utils/api";

export default function BookingsAdminTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetchBookingsApi();
      setBookings(response.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/20">
      {/* HEADER - Matches your Property Dashboard */}
      <div className="p-8 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
            <FaCalendarAlt className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Bookings Management
            </h3>
            <p className="text-emerald-300/70 text-sm">Review and manage all reservation records</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#051F20]">
            <tr className="border-b border-emerald-500/20">
              <th className="px-6 py-4 text-xs font-semibold text-emerald-300/70 uppercase">Guest/Owner</th>
              <th className="px-6 py-4 text-xs font-semibold text-emerald-300/70 uppercase">Property</th>
              <th className="px-6 py-4 text-xs font-semibold text-emerald-300/70 uppercase">Dates</th>
              <th className="px-6 py-4 text-xs font-semibold text-emerald-300/70 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/10">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <FaUser className="text-emerald-400" />
                    {booking.user?.first_name} {booking.user?.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-emerald-400" />
                    {booking.unit?.property?.name || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {booking.check_in} to {booking.check_out}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}