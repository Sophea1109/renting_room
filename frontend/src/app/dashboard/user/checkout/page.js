"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 👈 Used to read incoming query parameters
import { FiCalendar, FiCheckCircle, FiArrowLeft, FiCreditCard, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { createBookingApi, captureVisaPaymentApi } from "@/utils/api"; 

export default function PayFirstPage() {
  const searchParams = useSearchParams();

  // Extract dynamic fields incoming from the payment-selection page
  const urlUnitId = searchParams.get("unitId");
  const urlTitle = searchParams.get("title") || "Rental Room (បន្ទប់ជួល)";
  const urlCheckIn = searchParams.get("checkIn");
  const urlCheckOut = searchParams.get("checkOut");
  const urlPrice = parseFloat(searchParams.get("price") || "0.00");

  // Keep state synchronized cleanly with the dynamic URL input params
  const [bookingDetails, setBookingDetails] = useState({
    unitId: urlUnitId,
    title: urlTitle,
    checkInDate: urlCheckIn,
    checkOutDate: urlCheckOut,
    totalPrice: urlPrice,
  });

  useEffect(() => {
    if (urlUnitId) {
      setBookingDetails({
        unitId: urlUnitId,
        title: urlTitle,
        checkInDate: urlCheckIn,
        checkOutDate: urlCheckOut,
        totalPrice: urlPrice,
      });
    }
  }, [urlUnitId, urlTitle, urlCheckIn, urlCheckOut, urlPrice]);

  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [txReference, setTxReference] = useState("");

  const handlePayFirstCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Front-end safety shield: Validate card name is present before touching the network
    if (!cardName.trim()) {
      setErrorMessage("The cardholder name field is required.");
      setLoading(false);
      return;
    }

    if (!bookingDetails.unitId) {
      setErrorMessage("Missing a valid unit configuration parameter.");
      setLoading(false);
      return;
    }

    try {
      // ---------------------------------------------------------
      // STEP 1: Create the Booking Record (Generates the parent tracking row)
      // ---------------------------------------------------------
      console.log(`📡 Step 1: Dispatching booking initialization for Unit ID: ${bookingDetails.unitId}`);
      const bookingPayload = {
        unit_id: bookingDetails.unitId,
        check_in: bookingDetails.checkInDate,
        check_out: bookingDetails.checkOutDate,
        payment_method: "Visa", 
      };

      const bookingResponse = await createBookingApi(bookingPayload);
      
      // Extract the fresh booking ID returned by your Laravel backend array
      const freshBookingId = bookingResponse.data?.id || bookingResponse.id;

      if (!freshBookingId) {
        throw new Error("Failed to secure a valid booking reference key from the server.");
      }
      console.log(`✅ Step 1 Complete: Secured Booking ID: ${freshBookingId}`);

      // ---------------------------------------------------------
      // STEP 2: Process Visa Authorization (Your successful Postman request)
      // ---------------------------------------------------------
      console.log(`📡 Step 2: Authorizing Visa payment for Booking ID: ${freshBookingId}...`);
      const paymentResponse = await captureVisaPaymentApi(freshBookingId, cardName);

      if (paymentResponse.success) {
        console.log("✅ Step 2 Complete: Payment logged successfully.");
        setTxReference(paymentResponse.transaction_reference);
        setBookingStatus("success");
      } else {
        setBookingStatus("error");
        setErrorMessage(paymentResponse.message || "Visa authorization declined.");
      }

    } catch (error) {
      console.error("❌ Pay First transaction chain crashed:", error.message);
      setBookingStatus("error");
      setErrorMessage(error.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE SCREEN
  if (bookingStatus === "success") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#051F20] flex items-center justify-center p-4 pt-24 transition-colors duration-300">
        <div className="bg-white dark:bg-[#0B2B26] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-neutral-100 dark:border-[#163832]">
          <div className="w-16 h-16 bg-[#8EB69B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-10 h-10 text-[#8EB69B]" />
          </div>
          <h2 className="text-2xl font-black text-neutral-800 dark:text-[#DAF1DE]">Payment Successful!</h2>
          <p className="text-sm text-neutral-500 dark:text-[#8EB69B] mt-2">
            Your room has been instantly reserved and fully authorized.
          </p>

          <div className="my-6 p-4 rounded-xl bg-neutral-50 dark:bg-[#163832]/40 text-left text-xs space-y-2 text-neutral-600 dark:text-[#DAF1DE] border border-neutral-100 dark:border-[#235347]">
            <p><strong>Transaction Ref:</strong> <span className="font-mono text-blue-600 dark:text-blue-400">{txReference}</span></p>
            <p><strong>Property:</strong> {bookingDetails.title}</p>
            <p><strong>Stay Dates:</strong> {bookingDetails.checkInDate} to {bookingDetails.checkOutDate}</p>
            <p><strong>Amount Paid:</strong> ${bookingDetails.totalPrice.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> Visa (Authorized)</p>
          </div>

          <Link href="/dashboard/user/homepage" className="block w-full py-3 bg-[#235347] hover:bg-[#163832] text-white font-bold rounded-xl transition text-sm shadow-md">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM SCREEN
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#051F20] pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/user/rooms" className="inline-flex items-center gap-2 text-xs font-bold text-[#235347] dark:text-[#8EB69B] hover:underline mb-4">
          <FiArrowLeft /> Back to details
        </Link>

        <div className="bg-white dark:bg-[#0B2B26] p-6 sm:p-8 rounded-2xl shadow-md border border-neutral-100 dark:border-[#163832]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <FiCreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-800 dark:text-[#DAF1DE]">Confirm & Pay First</h2>
              <p className="text-xs text-neutral-400 dark:text-[#8EB69B]">Secure your reservation immediately using your Visa card.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs rounded-r-lg font-medium flex gap-2 items-center">
              <FiAlertCircle className="flex-shrink-0" /> {errorMessage}
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
                  <p className="font-bold text-neutral-700 dark:text-[#DAF1DE]">{bookingDetails.checkInDate || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#235347] dark:text-[#8EB69B]" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Check-Out</p>
                  <p className="font-bold text-neutral-700 dark:text-[#DAF1DE]">{bookingDetails.checkOutDate || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Price Banner */}
          <div className="flex justify-between items-center bg-[#8EB69B]/10 dark:bg-[#163832]/30 p-4 rounded-xl mb-6">
            <span className="text-sm font-bold text-neutral-700 dark:text-[#8EB69B]">Total Amount to Charge:</span>
            <span className="text-2xl font-black text-[#0B2B26] dark:text-[#DAF1DE]">${bookingDetails.totalPrice.toFixed(2)}</span>
          </div>

          {/* Secure Visa Input Form */}
          <form onSubmit={handlePayFirstCheckout} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-[#DAF1DE] uppercase tracking-wider mb-2">
                Cardholder Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-neutral-200 dark:border-[#163832] bg-white dark:bg-[#051F20] text-neutral-800 dark:text-[#DAF1DE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Processing Payment Sequence...</span>
                </>
              ) : (
                `Authorize & Pay $${bookingDetails.totalPrice.toFixed(2)} Now`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}