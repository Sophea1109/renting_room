"use client";

import { useEffect, useState } from "react";
import {
  fetchOwnerBookings,
  confirmBooking,
  rejectBooking,
  fetchOwnerRevenue,
} from "@/utils/api";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await fetchOwnerBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmBooking(id);
      await loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id);
      await loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const totalRevenue = bookings
  .filter((booking) => booking.status === "confirmed")
  .reduce((sum, booking) => sum + Number(booking.total || 0), 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a3d3f]"></div>
        <p className="mt-2 text-gray-600">Loading bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#051F20] to-[#0a3d3f] p-6">
      <div className="max-w-4xl mx-auto mb-6">
  <div className="bg-white rounded-xl shadow-lg p-6">
    <p className="text-sm text-gray-500">Total Revenue</p>

    <p className="text-3xl font-bold text-green-600">
      ${totalRevenue.toFixed(2)}
    </p>

    <p className="text-sm text-gray-400 mt-1">
      From confirmed bookings
    </p>
  </div>
</div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">My Property Bookings</h2>
          <p className="text-gray-300 mt-2">Manage and track all your property reservations</p>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-gradient-to-br from-[#051F20] to-[#0a3d3f] rounded-lg shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.unit?.tittle || 'Untitled Property'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-[#0a3d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
  {`${booking.user?.first_name || ''} ${booking.user?.last_name || ''}`.trim() || 'Unknown'}
</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-[#0a3d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{booking.user?.email || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-[#0a3d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Check In</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.check_in)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-[#0a3d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Check Out</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.check_out)}</p>
                    </div>
                  </div>
                </div>

                {/* Status-specific messages and buttons */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {booking.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleConfirm(booking.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                      >
                        ✓ Confirm Booking
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                      >
                        ✗ Reject Booking
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-green-800 font-semibold">✓ Payment Confirmed</p>
                      </div>
                    </div>
                  )}

                  {booking.status === "rejected" && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-800 font-semibold">✖ Booking Rejected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-white/20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-300 text-lg">No bookings found</p>
            <p className="text-gray-400">When guests book your properties, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}