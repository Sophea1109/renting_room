"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    room_number: "",
    type: "Single",
    monthly_rent: "",
    beds: 1,
    baths: 1,
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create room");

      router.push("/dashboard/rooms");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a2a2b] rounded-xl p-12 text-center">
        <div className="w-8 h-8 border-4 border-[#235347] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-3">Creating room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-[#235347] mb-4 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white">Create New Room</h1>
        <p className="text-gray-400">Fill in the details below</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a2a2b] rounded-xl border border-[#235347]/30 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Room Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
              placeholder="e.g., Cozy Studio"
            />
          </div>

          {/* Room Number & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Room Number</label>
              <input
                type="text"
                name="room_number"
                value={form.room_number}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
                placeholder="e.g., 101"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Room Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Studio">Studio</option>
                <option value="Suite">Suite</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
          </div>

          {/* Rent & Beds/Baths */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Monthly Rent ($) *</label>
              <input
                type="number"
                name="monthly_rent"
                value={form.monthly_rent}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Beds</label>
              <input
                type="number"
                name="beds"
                value={form.beds}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Baths</label>
              <input
                type="number"
                name="baths"
                value={form.baths}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white"
              placeholder="e.g., New York, NY"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white resize-none"
              placeholder="Describe the room..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#235347] text-white rounded-lg font-semibold hover:bg-[#2a7a64] transition"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}