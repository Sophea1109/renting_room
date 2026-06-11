"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createUnitWithImage } from "@/utils/api";
import { FaBed, FaDollarSign, FaFileAlt, FaImage, FaSave, FaSpinner, FaUsers, FaBuilding, FaInfoCircle } from "react-icons/fa";

export default function CreateUnit() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    tittle: "", descrepton: "", floor: "", status: "available",
    price_type: "month", price: "", residential_water: "",
    electricity_prices: "", bed: "", max_member: "1",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append("property_id", propertyId);
    if (image) formData.append("image", image);

    try {
      await createUnitWithImage(formData);
      router.push(`/dashboard/owner/property`);
    } catch (err) { setError(err.message); } 
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a2a2b] p-6 md:p-10 text-gray-200">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaBuilding className="text-[#235347]" /> Create New Unit
          </h1>
          <p className="text-gray-400">Add details for your property unit below.</p>
        </header>

        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-700 text-red-400 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Main Info Card */}
          <div className="bg-[#051F20] p-6 rounded-2xl border border-[#235347]/30 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Core Details</h2>
            
            <input name="tittle" value={form.tittle} onChange={handleChange} placeholder="Unit Name" required className="w-full p-3 bg-[#0a2a2b] rounded-lg border border-[#235347] focus:ring-2 focus:ring-[#235347] outline-none" />
            <textarea name="descrepton" value={form.descrepton} onChange={handleChange} placeholder="Description" rows={3} className="w-full p-3 bg-[#0a2a2b] rounded-lg border border-[#235347] outline-none" />
            
            <div className="grid grid-cols-2 gap-4">
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="p-3 bg-[#0a2a2b] rounded-lg border border-[#235347]" />
              <input name="max_member" type="number" value={form.max_member} onChange={handleChange} placeholder="Max Guests" className="p-3 bg-[#0a2a2b] rounded-lg border border-[#235347]" />
            </div>
          </div>

          {/* Secondary Info Card */}
          <div className="bg-[#051F20] p-6 rounded-2xl border border-[#235347]/30 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Specs & Media</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <select name="status" onChange={handleChange} className="p-3 bg-[#0a2a2b] rounded-lg border border-[#235347] outline-none">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <select name="price_type" onChange={handleChange} className="p-3 bg-[#0a2a2b] rounded-lg border border-[#235347] outline-none">
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
                <option value="day">Per Day</option>
              </select>
            </div>

            <input name="floor" value={form.floor} onChange={handleChange} placeholder="Floor Number" className="w-full p-3 bg-[#0a2a2b] rounded-lg border border-[#235347]" />
            
            <label className="block p-4 border-2 border-dashed border-[#235347] rounded-lg cursor-pointer text-center hover:bg-[#235347]/10 transition-colors">
              <FaImage className="mx-auto text-2xl text-[#235347] mb-2" />
              <span className="text-sm">Upload Unit Image</span>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="md:col-span-2 py-4 bg-[#235347] hover:bg-[#1a3f35] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {submitting ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save Unit</>}
          </button>
        </form>
      </div>
    </div>
  );
}