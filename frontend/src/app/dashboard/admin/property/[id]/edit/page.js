"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", location: "", property_type_id: "", image: "", star_rating: "",
    floor: "", have_gym: false, have_swing: false, have_park: false,
    price: "", price_type: "", has_units: false, tittle: "",
    descrepton: "", bedrooma: "", has_kitchen: false, size_house: "",
    bathroom: "", payment_policy: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        setFormData(data.data);
      } catch (error) { console.log(error); } finally { setLoading(false); }
    };
    fetchProperty();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Updated successfully");
      router.push("/dashboard/admin/property");
    } catch (error) { alert(error.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-emerald-500">Loading...</div>;

  // Helper for input styling
  const inputClass = "w-full p-3.5 bg-[#0a1a1a] border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-5xl mx-auto p-8 bg-[#051111] min-h-screen text-white">
      <header className="mb-10 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Edit Property</h1>
        <p className="text-gray-500 mt-2">Updating information for: <span className="text-emerald-400">{formData.name}</span></p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#0a1e1e]/30 rounded-2xl border border-white/5">
          <h2 className="col-span-2 text-lg font-semibold text-emerald-400">Basic Info</h2>
          <div><label className={labelClass}>Property Name</label><input name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Location</label><input name="location" value={formData.location} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Type ID</label><input name="property_type_id" value={formData.property_type_id} onChange={handleChange} className={inputClass} /></div>
        </div>

        {/* Section 2: Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-[#0a1e1e]/30 rounded-2xl border border-white/5">
          <h2 className="col-span-2 md:col-span-4 text-lg font-semibold text-emerald-400">Specs & Pricing</h2>
          <div><label className={labelClass}>Price</label><input name="price" value={formData.price} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Price Type</label><select name="price_type" value={formData.price_type} onChange={handleChange} className={inputClass}><option value="day">Day</option><option value="month">Month</option><option value="year">Year</option></select></div>
          <div><label className={labelClass}>Bedrooms</label><input name="bedrooma" value={formData.bedrooma} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Bathrooms</label><input name="bathroom" value={formData.bathroom} onChange={handleChange} className={inputClass} /></div>
        </div>

        {/* Section 3: Amenities */}
        <div className="p-6 bg-[#0a1e1e]/30 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-6">
            {["have_gym", "have_swing", "have_park", "has_kitchen"].map((amenity) => (
              <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name={amenity} checked={formData[amenity]} onChange={handleChange} className="w-5 h-5 accent-emerald-500" />
                <span className="text-gray-300 group-hover:text-white transition-colors">{amenity.replace("_", " ").toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all">
          {saving ? "Saving Changes..." : "Save Property Changes"}
        </button>
      </form>
    </div>
  );
}