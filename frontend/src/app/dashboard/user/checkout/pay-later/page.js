"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiCalendar, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function BookingSetupPage() {
  const router = useRouter();
  const { id } = useParams();

  const [unit, setUnit] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch unit
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/units/${id}`);
        const data = await res.json();
        setUnit(data.data);
      } catch (error) {
        console.error("Failed to load unit:", error);
      }
    };

    if (id) fetchUnit();
  }, [id]);

  // 💰 SAFE PRICE CALCULATION
  useEffect(() => {
    if (checkIn && checkOut && unit) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const diff = end - start;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

      const pricePerDay = Number(unit.price || 0);

      if (days > 0 && pricePerDay > 0) {
        setTotalPrice(days * pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, unit]);

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!unit) return;

    if (!checkIn || !checkOut) {
      alert("Please select valid dates");
      return;
    }

    if (totalPrice <= 0) {
      alert("Invalid price calculation");
      return;
    }

    const queryParams = new URLSearchParams({
      unitId: unit.id,
      checkIn,
      checkOut,
      // ❌ DO NOT send price anymore (important fix)
      payment_policy: unit.property?.payment_policy || "",
    }).toString();

    router.push(
      `/dashboard/user/payment-selection?${queryParams}`
    );
  };

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading unit...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-md mx-auto">

        <Link href="/dashboard/user/rooms">
          <FiArrowLeft /> Back
        </Link>

        <h2 className="font-bold text-xl mt-2">
          {unit.title}
        </h2>

        <form onSubmit={handleProceedToPayment}>

          {/* CHECK IN */}
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border p-2 w-full mt-3"
          />

          {/* CHECK OUT */}
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border p-2 w-full mt-3"
          />

          {/* PRICE PREVIEW */}
          {totalPrice > 0 && (
            <div className="mt-3 p-3 bg-gray-100 rounded">
              <p className="text-sm">
                Total: <b>${totalPrice.toFixed(2)}</b>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white p-3 rounded"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}