"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FiArrowLeft, 
  FiHome, 
  FiMapPin, 
  FiLayers, 
  FiStar, 
  FiImage, 
  FiLoader, 
  FiCheckCircle, 
  FiAlertCircle,
  FiDollarSign,
  FiFileText,
  FiBox,
  FiMaximize
} from "react-icons/fi";

export default function CreatePropertyForm() {
  const router = useRouter();

  // Matched exactly to your Laravel controller requests (including database string typos)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    property_type_id: "",
    image: `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80&sig=${Math.floor(Math.random() * 1000)}`,
    star_rating: "5.0",
    floor: "1",
    price: "",
    price_type: "month", // match enum: month, year, day
    tittle: "", // mapping your controller's 'tittle' validation rule
    descrepton: "", // mapping your controller's 'descrepton' validation rule
    bedrooma: "1", // mapping your controller's 'bedrooma' validation rule
    bathroom: "1",
    size_house: "",
    payment_policy: "pay_first", // match enum: pay_first, pay_later
    have_gym: false,
    have_swing: false,
    have_park: false,
    has_units: false,
    has_kitchen: false,
  });

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Sync classification tier items
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property-types`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.types || data.data || [];
        setPropertyTypes(list);
      } catch (err) {
        console.error("Failed loading types", err);
      } finally {
        setLoadingTypes(false);
      }
    };

    if (token) fetchTypes();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          property_type_id: parseInt(formData.property_type_id, 10),
          floor: formData.floor ? parseInt(formData.floor, 10) : null,
          star_rating: formData.star_rating ? parseFloat(formData.star_rating) : null,
          price: parseFloat(formData.price),
          size_house: formData.size_house ? parseFloat(formData.size_house) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process listing generation command.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/owner/property");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 min-h-screen bg-[#061819] text-[#DAF1DE] antialiased pt-24">
      
      {/* Back Routing Trigger */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors mb-4 group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Return to Dashboard
      </button>

      {/* Main Header Display */}
      <div className="relative overflow-hidden mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] border border-emerald-500/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center shadow-lg ring-1 ring-emerald-400/30">
            <FiHome className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Provision New Asset Listing</h1>
            <p className="text-emerald-300/60 text-sm mt-0.5">Publish structural configurations, financials, policies, and parameters directly onto the central index.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
          <FiAlertCircle className="shrink-0 text-base" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl animate-pulse">
          <FiCheckCircle className="shrink-0 text-base" />
          <span>Listing published successfully! Updating system database state...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ROW GROUP 1: Marketing Copy Details */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] border border-emerald-500/10 shadow-lg space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase border-b border-emerald-500/10 pb-2 flex items-center gap-2">
            <FiFileText className="text-emerald-400" /> Public Identity Details
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-emerald-300/70">Public Headline Title</label>
            <input
              type="text"
              name="tittle" // strict mapping to match controller validation syntax
              required
              value={formData.tittle}
              onChange={handleChange}
              placeholder="e.g., Premium Penthouse Suite Overlooking Downtown Vista"
              className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Internal Asset Code/Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Block-C Suite 4"
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Geographic Location Address</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Diamond District, Lane 4, Phnom Penh"
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-emerald-300/70">Property Narrative Description</label>
            <textarea
              name="descrepton" // strict mapping to match controller validation syntax
              rows={3}
              value={formData.descrepton}
              onChange={handleChange}
              placeholder="Provide a comprehensive breakdown detailing local proximity landmarks, security configurations, and surrounding environments..."
              className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all resize-none"
            />
          </div>
        </div>

        {/* ROW GROUP 2: Financial Matrix Structure */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] border border-emerald-500/10 shadow-lg space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase border-b border-emerald-500/10 pb-2 flex items-center gap-2">
            <FiDollarSign className="text-emerald-400" /> Financial Settings & Policies
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Base Listing Rate Price</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3 text-emerald-500/60 text-sm" />
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Billing Period Interval</label>
              <select
                name="price_type"
                required
                value={formData.price_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              >
                <option value="day" className="bg-[#061819]">Daily Invoicing</option>
                <option value="month" className="bg-[#061819]">Monthly Subscription</option>
                <option value="year" className="bg-[#061819]">Annual Contract Agreement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Tenant Payment Policy</label>
              <select
                name="payment_policy"
                required
                value={formData.payment_policy}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              >
                <option value="pay_first" className="bg-[#061819]">Pay First (Upfront Deposit Required)</option>
                <option value="pay_later" className="bg-[#061819]">Pay Later (Deferred Invoicing System)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ROW GROUP 3: Architecture & Sizing Specs */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] border border-emerald-500/10 shadow-lg space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase border-b border-emerald-500/10 pb-2 flex items-center gap-2">
            <FiBox className="text-emerald-400" /> Structural Architecture Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Total Bedrooms</label>
              <input
                type="text"
                name="bedrooma" // strict mapping to match controller validation syntax
                required
                value={formData.bedrooma}
                onChange={handleChange}
                placeholder="e.g., 3, Studio, or Penthouse Split"
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Total Bathrooms</label>
              <input
                type="text"
                name="bathroom"
                required
                value={formData.bathroom}
                onChange={handleChange}
                placeholder="e.g., 2.5 or Dedicated Bath"
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70 flex items-center gap-1.5">
                <FiMaximize className="text-emerald-500" /> Net House Size (Sqm)
              </label>
              <input
                type="number"
                name="size_house"
                step="0.1"
                value={formData.size_house}
                onChange={handleChange}
                placeholder="e.g., 145.5"
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Vertical Floors Elevation</label>
              <input
                type="number"
                name="floor"
                min="1"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70 flex items-center gap-1.5">
                <FiLayers className="text-emerald-500" /> Asset Classification Group
              </label>
              <select
                name="property_type_id"
                required
                value={formData.property_type_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              >
                <option value="">-- Choose Type --</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id} className="bg-[#061819]">{type.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70 flex items-center gap-1.5">
                <FiStar className="text-emerald-500" /> System Rating Core
              </label>
              <input
                type="number"
                name="star_rating"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.star_rating}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70 flex items-center gap-1.5">
                <FiImage className="text-emerald-500" /> Public Cover Resource CDN URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Dynamic asset string vector link"
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* ROW GROUP 4: Functional Amenity Switch Array Toggles */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] border border-emerald-500/10 shadow-lg space-y-4">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">Amenity Matrix & Sub-Units</h3>
            <p className="text-xs text-emerald-300/50 mt-0.5">Identify sub-system capabilities or specialized structural amenities built directly within the premises.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 border-t border-emerald-500/10 pt-4">
            {[
              { id: "have_gym", label: "Gymnasium", sub: "Fitness complex" },
              { id: "have_swing", label: "Swing/Pool", sub: "Lounge features" },
              { id: "have_park", label: "Public Park", sub: "Green lawns" },
              { id: "has_units", label: "Sub-Units", sub: "Multi-inventory" },
              { id: "has_kitchen", label: "Kitchen Space", sub: "Cooking space" },
            ].map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => handleToggle(amenity.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  formData[amenity.id] 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-md shadow-emerald-950/20" 
                    : "bg-[#051617] border-emerald-500/10 text-emerald-300/40 hover:border-emerald-500/30"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mb-4 transition-colors ${
                  formData[amenity.id] ? "border-emerald-400 bg-emerald-500 text-white" : "border-emerald-800"
                }`}>
                  {formData[amenity.id] && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="block font-semibold text-xs text-emerald-100 group-hover:text-white transition-colors">{amenity.label}</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">{amenity.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM STEP CONTROLS */}
        <div className="flex justify-end items-center gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl bg-[#051617] text-emerald-400/80 hover:bg-emerald-950 hover:text-white border border-emerald-500/10 font-medium text-sm transition-all"
          >
            Cancel Actions
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || loadingTypes}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-medium text-sm rounded-xl text-white transition-all duration-200 shadow-md shadow-emerald-950/40 flex items-center gap-2 disabled:opacity-40"
          >
            {isSubmitting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
            Provision Property Asset
          </button>
        </div>

      </form>
    </div>
  );
}