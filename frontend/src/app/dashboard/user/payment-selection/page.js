"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  FiCreditCard,
  FiDollarSign,
  FiArrowLeft,
  FiCalendar,
  FiShield,
} from "react-icons/fi";

export default function PaymentSelectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Booking metadata
  const unitId =
    searchParams.get("unit_id") ||
    searchParams.get("unitId");

  const title =
    searchParams.get("title") ||
    "Premium Rental Space";

  const checkIn =
    searchParams.get("check_in") ||
    searchParams.get("checkIn");

  const checkOut =
    searchParams.get("check_out") ||
    searchParams.get("checkOut");

  const total =
    searchParams.get("total") ||
    searchParams.get("price") ||
    "0";

  // PAYMENT POLICY FROM PROPERTY
  const rawPolicy =
    searchParams.get("payment_policy");

  // normalize
  const policy = (rawPolicy || "").toLowerCase();

  // Pass data to next pages
  const queryParams = new URLSearchParams({
    unitId: unitId || "",
    title: title || "",
    checkIn: checkIn || "",
    checkOut: checkOut || "",
    price: total || "",
    payment_policy: policy,
  }).toString();

  const handleSelection = (method) => {
    if (method === "visa") {
      router.push(
        `/dashboard/user/checkout/pay-first?${queryParams}`
      );
    }

    if (method === "cash") {
      router.push(
        `/dashboard/user/checkout/pay-later?${queryParams}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#051F20] pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#235347] dark:text-[#8EB69B] hover:underline mb-4"
        >
          <FiArrowLeft />
          Modify stay dates
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-[#0B2B26] p-6 sm:p-8 rounded-2xl shadow-xl border border-neutral-100 dark:border-[#163832]">

          {/* Header */}
          <h2 className="text-xl font-black text-neutral-800 dark:text-[#DAF1DE] mb-1">
            Choose Payment Method
          </h2>

          <p className="text-xs text-neutral-400 dark:text-[#8EB69B] mb-6">
            Select how you want to complete your booking reservation.
          </p>

          {/* Booking Info */}
          <div className="bg-neutral-50 dark:bg-[#051F20] p-4 rounded-xl mb-6 text-xs text-neutral-600 dark:text-[#DAF1DE] space-y-2 border border-neutral-100 dark:border-[#163832]">

            <p className="font-bold text-neutral-800 dark:text-[#DAF1DE] text-sm mb-1">
              {title}
            </p>

            <div className="flex items-center gap-2 text-neutral-500 dark:text-[#8EB69B]">
              <FiCalendar className="flex-shrink-0" />

              <span>
                <strong>Duration:</strong>{" "}
                {checkIn || "N/A"} to {checkOut || "N/A"}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200/60 dark:border-[#163832]/60 flex justify-between items-center mt-1">
              <span className="font-medium text-neutral-500 dark:text-[#8EB69B]">
                Grand Total Due:
              </span>

              <span className="text-[#235347] dark:text-[#8EB69B] font-extrabold text-sm">
                ${parseFloat(total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* PAYMENT OPTIONS */}
          <div className="space-y-3">

            {/* PAY FIRST ONLY */}
            {policy === "pay_first" && (
              <button
                onClick={() => handleSelection("visa")}
                className="w-full p-4 rounded-xl border-2 border-neutral-200 dark:border-[#235347] hover:border-blue-500 bg-white dark:bg-[#051F20] transition text-left flex items-center gap-4 group shadow-sm"
              >
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition">
                  <FiCreditCard className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-neutral-800 dark:text-[#DAF1DE] text-sm group-hover:text-blue-600 transition">
                    Pay First (Visa Card)
                  </h4>

                  <p className="text-[11px] text-neutral-400 dark:text-[#8EB69B] mt-0.5">
                    Secure online payment required before booking confirmation.
                  </p>
                </div>
              </button>
            )}

            {/* PAY LATER ONLY */}
            {policy === "pay_later" && (
              <button
                onClick={() => handleSelection("cash")}
                className="w-full p-4 rounded-xl border-2 border-neutral-200 dark:border-[#235347] hover:border-amber-500 bg-white dark:bg-[#051F20] transition text-left flex items-center gap-4 group shadow-sm"
              >
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition">
                  <FiDollarSign className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-neutral-800 dark:text-[#DAF1DE] text-sm group-hover:text-amber-600 transition">
                    Pay Later (Cash)
                  </h4>

                  <p className="text-[11px] text-neutral-400 dark:text-[#8EB69B] mt-0.5">
                    Pay directly at check-in using cash payment.
                  </p>
                </div>
              </button>
            )}

            {/* NO POLICY */}
            {!policy && (
              <div className="text-center text-red-500 text-xs font-medium py-4">
                No payment method available.
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#163832]/50 flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            <FiShield className="text-emerald-500 w-3.5 h-3.5" />
            <span>Secure Checkout Protection</span>
          </div>

        </div>
      </div>
    </div>
  );
}