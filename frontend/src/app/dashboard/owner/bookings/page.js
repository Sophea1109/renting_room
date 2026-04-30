'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, Check, X, Clock, Calendar, DollarSign, User } from 'lucide-react';
import OwnerSidebar from '@/components/OwnerSidebar';
import OwnerHeader from '@/components/OwnerHeader';
import { useUser } from '@/context/UserContext';
import { fetchOwnerBookings, approveBooking, rejectBooking } from '@/lib/bookingApi';

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected', 'completed'];

const statusStyle = {
  pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  approved:  'bg-green-100  text-green-700  border border-green-200',
  rejected:  'bg-red-100    text-red-700    border border-red-200',
  completed: 'bg-blue-100   text-blue-700   border border-blue-200',
};

const statusIcon = {
  pending:   <Clock size={13} />,
  approved:  <Check size={13} />,
  rejected:  <X size={13} />,
  completed: <Check size={13} />,
};

export default function BookingRequestsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('bookings');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  // multiple bookings 
  const [bookingDates, setBookingDates] = useState({}); // { [bookingId]: { startDate, endDate } }

  const loadBookings = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchOwnerBookings(user.id, activeFilter === 'all' ? null : activeFilter);
      setBookings(data.bookings || []);
      setCounts(data.counts || { all: 0, pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      toast.error(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeFilter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleApprove = async (bookingId, startDate, endDate) => {
    setActionLoading(bookingId);
    try {
      await approveBooking(bookingId, startDate, endDate);
      toast.success('Booking approved! Room is now occupied.');
      loadBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to approve booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await rejectBooking(bookingId);
      toast.success('Booking rejected.');
      loadBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to reject booking');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <OwnerHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">

            {/* Page Title */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <FileText size={24} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
              </div>
              <p className="text-gray-500">Review and manage tenant booking requests for your rooms.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    activeFilter === tab
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                  {counts[tab] > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                      activeFilter === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {counts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mr-3" />
                  Loading bookings...
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FileText size={48} className="mb-3 opacity-30" />
                  <p className="text-lg font-medium">No {activeFilter !== 'all' ? activeFilter : ''} bookings found</p>
                  <p className="text-sm mt-1">Booking requests from tenants will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Tenant</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Room</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Dates</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Amount</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Submitted</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">

                          {/* Tenant */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{booking.tenant_name}</p>
                                <p className="text-xs text-gray-400">{booking.tenant_email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Room */}
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{booking.room_name}</p>
                            {booking.room_number && (
                              <p className="text-xs text-gray-400">#{booking.room_number}</p>
                            )}
                          </td>

                          {/* Dates */}
                          <td className="px-6 py-4 min-w-[200px]">
                            <div className="flex items-center gap-1 text-black whitespace-nowrap">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{booking.start_date || 'No start date'}</span>
                            </div>
                            <div className="text-xs text-black mt-0.5 ml-4 whitespace-nowrap">to {booking.end_date || 'No end date'}</div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                              <DollarSign size={14} className="text-green-500" />
                              {Number(booking.total_amount).toLocaleString()}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[booking.status]}`}>
                              {statusIcon[booking.status]}
                              {booking.status}
                            </span>
                          </td>

                          {/* Submitted */}
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {booking.created_at}
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            {booking.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="date"
                                  className="text-black appearance-none"
                                  value={bookingDates[booking.id]?.startDate || ''}
                                  onChange={(e) => setBookingDates({...bookingDates, [booking.id]: {...bookingDates[booking.id], startDate: e.target.value}})}
                                />

                                <input
                                  type="date"
                                  className="text-black appearance-none"
                                  value={bookingDates[booking.id]?.endDate || ''}
                                  onChange={(e) => setBookingDates({...bookingDates, [booking.id]: {...bookingDates[booking.id], endDate: e.target.value}})}
                                />

                                <button
                                  onClick={() => handleApprove(
                                    booking.id,
                                    bookingDates[booking.id]?.startDate,
                                    bookingDates[booking.id]?.endDate
                                  )} 
                                  disabled={actionLoading === booking.id}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Check size={14} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(booking.id)}
                                  disabled={actionLoading === booking.id}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
