"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUserPlus, FaEnvelope, FaLock, FaUser, 
  FaArrowLeft, FaEye, FaEyeSlash, FaPhoneAlt, FaVenusMars 
} from "react-icons/fa";

export default function CreateUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Aligned with Laravel User Model fillables
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    telegram_phone_number: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.telegram_phone_number.trim() && !/^\+?[0-9]{7,15}$/.test(formData.telegram_phone_number.replace(/\s+/g, ""))) {
      newErrors.telegram_phone_number = "Invalid phone number format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          telegram_phone_number: formData.telegram_phone_number,
          role: formData.role,
        }),
      });
      
      if (response.ok) {
        router.push("/dashboard/admin/User");
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Failed to create user" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-[#235347] transition-colors mb-4"
        >
          <FaArrowLeft size={16} />
          <span className="text-sm">Back to Users</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#235347] to-[#1a3f35] rounded-xl shadow-lg shadow-[#235347]/30">
            <FaUserPlus className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New User</h1>
            <p className="text-gray-400 text-sm mt-1">Add a new record configured to system parameters</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#0a2a2b] rounded-xl border border-[#235347]/30 shadow-lg overflow-hidden">
        <div className="p-6 space-y-5">
          
          {/* First & Last Name row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">First Name *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaUser size={14} />
                </div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#051F20] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.first_name ? "border-red-500 focus:border-red-500" : "border-[#235347]/40 focus:border-[#235347]"
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Last Name *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaUser size={14} />
                </div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#051F20] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.last_name ? "border-red-500 focus:border-red-500" : "border-[#235347]/40 focus:border-[#235347]"
                  }`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaEnvelope size={16} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-[#051F20] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-[#235347]/40 focus:border-[#235347]"
                }`}
                placeholder="user@example.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Telegram Phone Number */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Telegram Phone Number</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaPhoneAlt size={14} />
              </div>
              <input
                type="text"
                name="telegram_phone_number"
                value={formData.telegram_phone_number}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-[#051F20] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.telegram_phone_number ? "border-red-500 focus:border-red-500" : "border-[#235347]/40 focus:border-[#235347]"
                }`}
                placeholder="+1234567890"
              />
            </div>
            {errors.telegram_phone_number && <p className="text-red-400 text-xs mt-1">{errors.telegram_phone_number}</p>}
          </div>

          {/* Password Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaLock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 bg-[#051F20] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.password ? "border-red-500 focus:border-red-500" : "border-[#235347]/40 focus:border-[#235347]"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaLock size={14} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 bg-[#051F20] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-[#235347]/40 focus:border-[#235347]"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Gender Select & Role Select row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white focus:outline-none focus:border-[#235347] transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">User Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#051F20] border border-[#235347]/40 rounded-lg text-white focus:outline-none focus:border-[#235347] transition-all"
              >
                <option value="user">Regular User</option>
                <option value="owner">Property Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* Server-Side Error feedback */}
          {errors.submit && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="px-6 py-4 border-t border-[#235347]/30 bg-[#051F20]/50 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white rounded-lg hover:from-[#2a7a64] hover:to-[#235347] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <FaUserPlus size={16} />
                Create User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}