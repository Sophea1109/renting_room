"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  FaBed, FaDollarSign, FaSave, FaInfoCircle, FaArrowLeft, 
  FaFileAlt, FaCheckCircle, FaExclamationTriangle, FaImage, 
  FaTrash, FaUpload, FaSpinner, FaBuilding, FaUsers, FaLayerGroup
} from "react-icons/fa";
import Image from "next/image";

export default function CreateUnit() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Reflecting schema parameters accurately
  const [form, setForm] = useState({
    title: "",
    description: "",
    floor: "",
    status: "available",
    price_type: "month",
    price: "",
    residential_water: "",
    electricity_prices: "",
    bed: "",
    max_member: "",
  });

  const [image, setImage] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!propertyId || !token) {
      if (!propertyId) setError("No property selected");
      if (!token) setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load property");
        setProperty(data.property || data);
      } catch (err) {
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      
      // Use correct, standard keys
      formData.append("property_id", propertyId);
      formData.append("title", form.title.trim()); 
      formData.append("description", form.description.trim()); // Fixed spelling
      formData.append("price", form.price);
      formData.append("price_type", form.price_type);
      formData.append("status", form.status);
      
      if (form.floor) formData.append("floor", form.floor);
      if (form.residential_water) formData.append("residential_water", form.residential_water);
      if (form.electricity_prices) formData.append("electricity_prices", form.electricity_prices);
      if (form.bed) formData.append("bed", form.bed);
      if (form.max_member) formData.append("max_member", form.max_member);
      if (image) formData.append("image", image);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`, 
            // Do NOT set 'Content-Type' header when using FormData; 
            // the browser sets it automatically with the boundary
            Accept: "application/json" 
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) throw new Error(Object.values(data.errors).flat().join(", "));
        throw new Error(data.message || "Failed to create unit");
      }

      router.push(`/dashboard/admin/property`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-20 text-gray-400">Loading details...</div>;

  return (
    <div className="bg-[#0a2a2b] min-h-screen py-8 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-[#051F20] border border-[#235347]/30 rounded-lg text-gray-300">
            <FaArrowLeft /> Back
          </button>
          <div className="text-sm text-gray-400">Property: {property?.name}</div>
        </div>

        <div className="bg-[#051F20] rounded-2xl border border-[#235347]/30 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-[#235347] to-[#1a3f35] px-6 py-6">
            <h1 className="text-xl font-bold flex items-center gap-2"><FaBuilding /> Create New Unit Structure</h1>
          </div>

          {error && <div className="p-4 mx-6 mt-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Unit Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none text-white" placeholder="Room 302, Suite A..." />
            </div>

            {/* Price configuration Row */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Amount ($) *</label>
                <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Billing Cycle *</label>
                <select name="price_type" value={form.price_type} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg text-white">
                  <option value="month">Per Month</option>
                  <option value="year">Per Year</option>
                  <option value="day">Per Day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg text-white">
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Utility and details grid parameters */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Floor Position</label>
                <input type="text" name="floor" value={form.floor} onChange={handleChange} placeholder="e.g., 3rd Floor" className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bed Configuration</label>
                <input type="text" name="bed" value={form.bed} onChange={handleChange} placeholder="e.g., 1 King Bed, 2 Single Beds" className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Water Price Details</label>
                <input type="text" name="residential_water" value={form.residential_water} onChange={handleChange} placeholder="e.g., $5/m3 or Free" className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Electricity Rates</label>
                <input type="text" name="electricity_prices" value={form.electricity_prices} onChange={handleChange} placeholder="e.g., $0.25/kWh" className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Occupants</label>
                <input type="text" name="max_member" value={form.max_member} onChange={handleChange} placeholder="e.g., 4 People" className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none" />
              </div>
            </div>

            {/* Image block */}
            <div>
              <label className="block text-sm font-medium mb-2">Showcase Image</label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden h-48 bg-[#0a2a2b]">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-2 bg-red-600 rounded-lg"><FaTrash /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#235347]/40 rounded-lg cursor-pointer bg-[#0a2a2b]/50">
                  <FaUpload className="text-2xl mb-2 text-gray-400" />
                  <span className="text-sm text-gray-400">Click to upload image file</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea rows="4" name="description" value={form.description} onChange={handleChange} placeholder="Write something about the rental scope..." className="w-full px-4 py-2.5 bg-[#0a2a2b] border border-[#235347]/40 rounded-lg focus:outline-none text-white resize-none" />
            </div>

            {/* Form actions */}
            <div className="flex gap-4 pt-4 border-t border-[#235347]/20">
              <button type="button" onClick={() => router.back()} disabled={submitting} className="flex-1 py-3 bg-[#0a2a2b] hover:bg-[#0d3536] rounded-lg border border-[#235347]/30 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 bg-gradient-to-r from-[#235347] to-[#1a3f35] rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-all">
                {submitting ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaSave /> Create Unit</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}