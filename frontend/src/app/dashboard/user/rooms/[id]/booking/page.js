"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BookingSetupPage() {
  const router = useRouter();
  const { id } = useParams();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [unit, setUnit] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isUnavailable, setIsUnavailable] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ---------------- FETCH UNIT ----------------
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await fetch(`${API}/units/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();

        const unitData = data.data || data;

        setUnit(unitData);

        // IMPORTANT: check bookings
        const booked = unitData.bookings?.some(
          (b) =>
            b.status === "confirmed" ||
            b.status === "checked_in"
        );

        setIsUnavailable(booked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUnit();
  }, [id]);

  // ---------------- PRICE CALC ----------------
  useEffect(() => {
    if (!checkIn || !checkOut || !unit) return;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start) || isNaN(end)) {
      setTotalPrice(0);
      return;
    }

    const diffDays = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) {
      setTotalPrice(0);
      return;
    }

    const price = Number(unit.price || 0);
    setTotalPrice(diffDays * price);
  }, [checkIn, checkOut, unit]);

  // ---------------- SUBMIT ----------------
  const handleProceed = (e) => {
    e.preventDefault();

    if (isUnavailable) {
      alert("This room is already booked");
      return;
    }

    if (!unit || totalPrice <= 0) {
      alert("Select valid dates");
      return;
    }

    const queryParams = new URLSearchParams({
      unitId: unit.id,
      title: unit.title || "Room",
      checkIn,
      checkOut,
      price: totalPrice.toString(),
      payment_policy: unit.property?.payment_policy || "",
    }).toString();

    router.push(
      `/dashboard/user/payment-selection?${queryParams}`
    );
  };

  // ---------------- LOADING ----------------
  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleProceed} className="p-4 space-y-4">

      {/* BLOCK IF UNAVAILABLE */}
      {isUnavailable && (
        <div className="p-3 bg-red-500 text-white rounded">
          This room is already booked
        </div>
      )}

      {/* DATES */}
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
      />

      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        min={checkIn || new Date().toISOString().split("T")[0]}
      />

      {/* PRICE */}
      {totalPrice > 0 && (
        <div className="font-bold">
          Total: ${totalPrice.toFixed(2)}
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={isUnavailable}
        className={`px-4 py-2 rounded text-white ${
          isUnavailable ? "bg-gray-500" : "bg-green-600"
        }`}
      >
        Continue
      </button>
    </form>
  );
}