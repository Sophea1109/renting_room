"use client";

import { useState } from "react";
import { FiCalendar, FiCheckCircle, FiArrowLeft, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

export default function PayLaterPage() {
  // Mock unit structure mapping directly to your database fields
  const [bookingDetails, setBookingDetails] = useState({
    unitId: 45,
    title: "Cozy Rental House (ផ្ទះជួល) - 2 Bedrooms",
    checkInDate: "2026-07-12",
    checkOutDate: "2026-07-15",
    totalPrice: 180.00,
  });

  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/pay-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit_id: bookingDetails.unitId,
          check_in_date: bookingDetails.checkInDate,
          check_out_date: bookingDetails.checkOutDate,
          total_price: bookingDetails.totalPrice,
          payment_method: "Cash", // Mapped directly to your payment schema table
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setBookingStatus("success");
      } else {
        setBookingStatus("error");
      }
    } catch (error) {
      console.error("Booking reservation failed:", error);
      setBookingStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (bookingStatus === "success") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#051F20] flex items-center justify-center p-4 pt-24 transition-colors duration-300">
        <div className="bg-white dark:bg-[#0B2B26] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-neutral-100 dark:border-[#163832]">
          <div className="w-16 h-16 bg-[#8EB69B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-10 h-10 text-[#8EB69B]" />
          </div>
          <h2 className="text-2xl font-black text-neutral-800 dark:text-[#DAF1DE]">Reservation Secured!</h2>
          <p className="text-sm text-neutral-500 dark:text-[#8EB69B] mt-2">
            Your booking is confirmed. You will pay the owner in **Cash** upon your arrival.
          </p>

          <div className="my-6 p-4 rounded-xl bg-neutral-50 dark:bg-[#163832]/40 text-left text-xs space-y-2 text-neutral-600 dark:text-[#DAF1DE] border border-neutral-100 dark:border-[#235347]">
            <p><strong>Reservation ID:</strong> BK-{Math.floor(200000 + Math.random() * 700000)}</p>
            <p><strong>Property:</strong> {bookingDetails.title}</p>
            <p><strong>Stay Dates:</strong> {bookingDetails.checkInDate} to {bookingDetails.checkOutDate}</p>
            <p><strong>Amount Due at Check-In:</strong> ${bookingDetails.totalPrice.toFixed(2)}</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-2 flex gap-1">
              <FiAlertCircle className="self-center flex-shrink-0" /> Pay Later rules apply. Review cancellation policies.
            </p>
          </div>

          <Link href="/dashboard/user/homepage" className="block w-full py-3 bg-[#235347] hover:bg-[#163832] text-white font-bold rounded-xl transition text-sm shadow-md">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#051F20] pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/user/rooms" className="inline-flex items-center gap-2 text-xs font-bold text-[#235347] dark:text-[#8EB69B] hover:underline mb-4">
          <FiArrowLeft /> Back to details
        </Link>

        <div className="bg-white dark:bg-[#0B2B26] p-6 sm:p-8 rounded-2xl shadow-md border border-neutral-100 dark:border-[#163832]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-800 dark:text-[#DAF1DE]">Confirm Your Pay Later Booking</h2>
              <p className="text-xs text-neutral-400 dark:text-[#8EB69B]">Book now instantly, pay with cash on-site later.</p>
            </div>
          </div>

          {bookingStatus === "error" && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs rounded-r-lg font-medium">
              Could not complete reservation right now. Please try again or check availability status.
            </div>
          )}

          {/* Booking Summary Card */}
          <div className="bg-neutral-50 dark:bg-[#051F20] p-4 rounded-xl border border-neutral-100 dark:border-[#163832] mb-6 space-y-3 text-sm">
            <h4 className="font-bold text-neutral-800 dark:text-[#DAF1DE]">{bookingDetails.title}</h4>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200/60 dark:border-[#163832]/60 text-xs text-neutral-600 dark:text-[#8EB69B]">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#235347] dark:text-[#8EB69B]" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Check-In</p>
                  <p className="font-bold text-neutral-700 dark:text-[#DAF1DE]">{bookingDetails.checkInDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#235347] dark:text-[#8EB69B]" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Check-Out</p>
                  <p className="font-bold text-neutral-700 dark:text-[#DAF1DE]">{bookingDetails.checkOutDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#8EB69B]/10 dark:bg-[#163832]/30 p-4 rounded-xl mb-6">
            <span className="text-sm font-bold text-neutral-700 dark:text-[#8EB69B]">Total Amount to Pay:</span>
            <span className="text-2xl font-black text-[#0B2B26] dark:text-[#DAF1DE]">${bookingDetails.totalPrice.toFixed(2)}</span>
          </div>

          <div className="bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 rounded-xl p-4 mb-6 text-xs text-amber-700 dark:text-amber-300 space-y-1">
            <p className="font-bold">⚠️ Important Notice for Cash Bookings:</p>
            <p>The owner reserves the right to cancel the booking if you fail to check in within your scheduled arrival time slot without notifying them via the application messenger thread.</p>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-lg text-white bg-[#0B2B26] hover:bg-[#163832] dark:bg-[#235347] dark:hover:bg-[#163832] disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              "Confirm Cash Reservation Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}