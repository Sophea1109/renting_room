"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { sendOtpApi, verifyOtpApi } from "@/utils/api";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    telegram_id: "",
    telegram_username: "",
    password: "",
    password_confirmation: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // STEP 1 → SEND OTP
  // =============================
  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validate password match
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            telegram_id: form.telegram_id,
            telegram_username: form.telegram_username,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setMessage("OTP sent successfully to Telegram");

      // DEV ONLY
      console.log("OTP:", data.otp);

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // STEP 2 → VERIFY OTP
  // =============================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
            otp: form.otp,
          }),
        }
      );

      const data = await res.json();

      console.log("Registration API Response:", data); // Debug log

      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      // ✅ Save token exactly like your login does
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      
      // ✅ Save user data if returned from API (like your login expects)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("Registration successful! Redirecting...");

      // ✅ Redirect based on user role (matching your login logic)
      setTimeout(() => {
        if (data.user?.role === "admin") {
          router.push("/dashboard/admin");
        } else if (data.user?.role === "user") {
          router.push("/dashboard/user/homepage");
        } else {
          // If no role specified, check localStorage or default to user homepage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === "admin") {
              router.push("/dashboard/admin");
            } else {
              router.push("/dashboard/user/homepage");
            }
          } else {
            router.push("/dashboard/user/homepage"); // Default for regular users
          }
        }
      }, 1500);
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step indicators
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 gap-4">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? 'bg-[#235347] text-white' : 'bg-[#051F20] text-gray-400 border border-[#235347]/40'
        }`}>
          {step > 1 ? <FaCheckCircle className="w-4 h-4" /> : "1"}
        </div>
        <div className={`ml-2 text-sm ${step >= 1 ? 'text-white' : 'text-gray-400'}`}>
          Account Info
        </div>
      </div>
      <div className={`w-12 h-px ${step >= 2 ? 'bg-[#235347]' : 'bg-[#235347]/40'}`}></div>
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 2 ? 'bg-[#235347] text-white' : 'bg-[#051F20] text-gray-400 border border-[#235347]/40'
        }`}>
          2
        </div>
        <div className={`ml-2 text-sm ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>
          Verify OTP
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#051F20] to-[#0a3d3f]">
      <div className="bg-[#0a2a2b] p-8 rounded-2xl shadow-2xl w-96 border border-[#235347]/30">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-50 flex items-center justify-center mb-3">
            <img
              src="/images/logo.png"
              alt="FindRoommate Logo"
              className="h-10 md:h-9 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {step === 1 ? "Create Account" : "Verify OTP"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1 
              ? "Register with Telegram OTP" 
              : `Enter the code sent to ${form.email}`}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* ===================================== */}
        {/* STEP 1 */}
        {/* ===================================== */}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Telegram ID
              </label>
              <input
                type="text"
                name="telegram_id"
                value={form.telegram_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all"
                placeholder="123456789"
              />
              <p className="text-gray-400 text-xs mt-1">
                You can find your Telegram ID by messaging @userinfobot
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Telegram Username (Optional)
              </label>
              <input
                type="text"
                name="telegram_username"
                value={form.telegram_username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all"
                placeholder="@username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white py-2.5 rounded-lg hover:from-[#2a7a64] hover:to-[#235347] transition-all duration-300 disabled:opacity-50 font-medium shadow-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ===================================== */}
        {/* STEP 2 */}
        {/* ===================================== */}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Enter OTP Code
              </label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                required
                maxLength="6"
                className="w-full px-4 py-2.5 rounded-lg bg-[#051F20] text-white border border-[#235347]/40 focus:outline-none focus:border-[#235347] focus:ring-2 focus:ring-[#235347]/20 transition-all text-center tracking-[8px] text-xl"
                placeholder="000000"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-400 text-xs">
                  Enter the 6-digit code sent to your Telegram
                </p>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-[#235347] hover:text-[#2a7a64] transition"
                >
                  Resend Code
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#235347] to-[#1a3f35] text-white py-2.5 rounded-lg hover:from-[#2a7a64] hover:to-[#235347] transition-all duration-300 disabled:opacity-50 font-medium shadow-lg mb-3"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
                setMessage("");
              }}
              className="w-full bg-transparent border border-[#235347]/40 text-gray-300 py-2.5 rounded-lg hover:bg-[#235347]/10 transition-all duration-300 font-medium"
            >
              Back to Registration
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#235347] hover:text-[#2a7a64] font-medium transition"
            >
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}