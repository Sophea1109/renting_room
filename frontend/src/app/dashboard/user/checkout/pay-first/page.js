"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiCalendar, FiCheckCircle, FiArrowLeft, FiCreditCard, FiAlertCircle, FiLock, FiUser } from "react-icons/fi";
import Link from "next/link";
import { createBookingApi, captureVisaPaymentApi } from "@/utils/api"; 

export default function PayFirstPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract dynamic parameters passed from payment selection
  const urlUnitId = searchParams.get("unitId");
  const urlTitle = searchParams.get("title") || "Rental Room (បន្ទប់ជួល)";
  const urlCheckIn = searchParams.get("checkIn");
  const urlCheckOut = searchParams.get("checkOut");
  const urlPrice = parseFloat(searchParams.get("price") || "0.00");

  const [bookingDetails, setBookingDetails] = useState({
    unitId: urlUnitId,
    title: urlTitle,
    checkInDate: urlCheckIn,
    checkOutDate: urlCheckOut,
    totalPrice: urlPrice,
  });

  // Keep state synced with incoming search parameters
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

  // UI state hooks
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [txReference, setTxReference] = useState("");

  // Input Formatting Helper for Expiration Mask (MM/YY)
  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Keep digits only
    if (input.length > 2) {
      input = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
    }
    setExpiry(input);
  };

  const handlePayFirstCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!cardName.trim()) {
      setErrorMessage("The cardholder name field is required.");
      setLoading(false);
      return;
    }

    if (!bookingDetails.unitId) {
      setErrorMessage("Invalid checkout parameters. Please return to the rooms selection screen.");
      setLoading(false);
      return;
    }

    try {
      // STEP 1: Post standard booking data to create database tracking row
      console.log(`📡 Initializing Booking for Unit: ${bookingDetails.unitId}`);
      const bookingPayload = {
        unit_id: bookingDetails.unitId,
        check_in: bookingDetails.checkInDate,
        check_out: bookingDetails.checkOutDate,
        payment_method: "Visa", 
      };

      const bookingResponse = await createBookingApi(bookingPayload);
      console.log("🔍 DEBUG: Full response received from Laravel:", bookingResponse);

      // 🛡️ Explicitly drill into the matching backend keys:
      const freshBookingId = 
        bookingResponse?.data?.booking?.id || 
        bookingResponse?.data?.id || 
        bookingResponse?.booking?.id ||
        bookingResponse?.id;

      if (!freshBookingId) {
        console.error("❌ Extraction failed. Available keys:", Object.keys(bookingResponse || {}));
        throw new Error("Failed to receive valid booking reference token.");
      }

      // STEP 2: Instantly process payment using the extracted booking reference id
      console.log(`📡 Capturing Visa transaction against Booking ID: ${freshBookingId}`);
      const paymentResponse = await captureVisaPaymentApi(freshBookingId, cardName);

      if (paymentResponse?.success) {
        setTxReference(paymentResponse.transaction_reference);
        setBookingStatus("success");
      } else {
        setBookingStatus("error");
        setErrorMessage(paymentResponse?.message || "Visa authorization declined.");
      }

    } catch (error) {
      console.error("❌ Checkout system transaction failed:", error.message);
      setBookingStatus("error");
      setErrorMessage(error.message || "An unexpected system or connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATUS RE_ROUTE LAYOUT
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
            <p><strong>Transaction Ref:</strong> <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{txReference}</span></p>
            <p><strong>Property:</strong> {bookingDetails.title}</p>
            <p><strong>Stay Dates:</strong> {bookingDetails.checkInDate} to {bookingDetails.checkOutDate}</p>
            <p><strong>Amount Billed:</strong> ${bookingDetails.totalPrice.toFixed(2)}</p>
            <p><strong>Status:</strong> Visa (Authorized)</p>
          </div>

          <Link href="/dashboard/user/homepage" className="block w-full py-3 bg-[#235347] hover:bg-[#163832] text-white font-bold rounded-xl transition text-sm shadow-md text-center">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // CORE INPUT USER INTERFACE
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#051F20] pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold text-[#235347] dark:text-[#8EB69B] hover:underline mb-4">
          <FiArrowLeft /> Change Payment Choice
        </button>

        <div className="bg-white dark:bg-[#0B2B26] p-6 sm:p-8 rounded-2xl shadow-md border border-neutral-100 dark:border-[#163832]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <FiCreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-800 dark:text-[#DAF1DE]">Visa Secure Checkout</h2>
              <p className="text-xs text-neutral-400 dark:text-[#8EB69B]">Authorize card now to secure booking data instantly.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs rounded-r-lg font-medium flex gap-2 items-center">
              <FiAlertCircle className="flex-shrink-0" /> {errorMessage}
            </div>
          )}

          {/* Booking Summary Box */}
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

          {/* Checkout Card Form */}
          <form onSubmit={handlePayFirstCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-[#8EB69B] uppercase tracking-wider mb-2">Cardholder Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 dark:border-[#163832] bg-white dark:bg-[#051F20] text-neutral-800 dark:text-[#DAF1DE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  disabled={loading}
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8EB69B]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-[#8EB69B] uppercase tracking-wider mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength="19"
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 dark:border-[#163832] bg-white dark:bg-[#051F20] text-neutral-800 dark:text-[#DAF1DE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  disabled={loading}
                />
                <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8EB69B]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 dark:text-[#8EB69B] uppercase tracking-wider mb-2">Expiration Date</label>
                <input
                  type="text"
                  maxLength="5"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-[#163832] bg-white dark:bg-[#051F20] text-neutral-800 dark:text-[#DAF1DE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 dark:text-[#8EB69B] uppercase tracking-wider mb-2">CVC / CVV</label>
                <input
                  type="password"
                  maxLength="3"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-[#163832] bg-white dark:bg-[#051F20] text-neutral-800 dark:text-[#DAF1DE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-[#8EB69B] pt-2">
              <FiLock className="text-green-600 flex-shrink-0" />
              <span>Payments are processed securely via SSL authorization links.</span>
            </div>

            <button
  type="submit"
  // 🛡️ The 'disabled' prop here prevents the user from clicking a second time
  disabled={loading} 
  className="w-full ... transition shadow-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
>
  {loading ? "Processing..." : "Authorize & Pay"}
</button>
          </form>
        </div>
      </div>
    </div>
  );
}