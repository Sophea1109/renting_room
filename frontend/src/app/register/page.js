"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Wizard Steps: 'request_otp' | 'verify_and_register' | 'success'
  const [step, setStep] = useState("request_otp");
  
  const [formData, setFormData] = useState({
    email: "",
    telegram_id: "",
    telegram_phone_number: "",
    otp: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minute countdown

  // Countdown timer for Step 2
  useEffect(() => {
    let interval;
    if (step === "verify_and_register" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Step 1: Request OTP via Telegram
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          telegram_id: formData.telegram_id,
          telegram_phone_number: formData.telegram_phone_number || null,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to send OTP.");

      setStep("verify_and_register");
      setTimer(300);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: Number(formData.otp),
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Verification failed.");

      // Success logic: Cache token and redirect
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DAF1DE] px-4 py-12">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#8EB69B]/30 transition-all duration-300">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain mb-3" />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#051F20] tracking-tight">Create Account</h1>
          <p className="text-[#235347] text-sm font-medium mt-1 text-center">
            {step === "request_otp" ? "Link your Telegram to get started" : "Complete your details to join"}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          <span className={`h-1.5 w-[48%] rounded-full transition-colors duration-300 ${step !== "success" ? "bg-[#0B2B26]" : "bg-[#8EB69B]/40"}`} />
          <span className={`h-1.5 w-[48%] rounded-full transition-colors duration-300 ${["verify_and_register", "success"].includes(step) ? "bg-[#0B2B26]" : "bg-[#8EB69B]/40"}`} />
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 shadow-sm">
            {error}
          </div>
        )}

        {/* --- STEP 1: REQUEST OTP --- */}
        {step === "request_otp" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163832] text-[#051F20] placeholder-[#8EB69B]/60 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Telegram Chat ID</label>
              <input
                type="text"
                name="telegram_id"
                value={formData.telegram_id}
                onChange={handleChange}
                placeholder="Required to receive OTP"
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163832] text-[#051F20] placeholder-[#8EB69B]/60 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Telegram Phone Number (Optional)</label>
              <input
                type="tel"
                name="telegram_phone_number"
                value={formData.telegram_phone_number}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163832] text-[#051F20] placeholder-[#8EB69B]/60 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2B26] hover:bg-[#051F20] text-[#DAF1DE] font-semibold py-3.5 rounded-xl transition shadow-lg shadow-[#0B2B26]/20 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Get Verification Code"}
            </button>
          </form>
        )}

        {/* --- STEP 2: COMPLETE PROFILE --- */}
        {step === "verify_and_register" && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div className="bg-[#DAF1DE]/40 p-4 rounded-2xl border border-[#8EB69B]/20">
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider text-center">Enter 6-Digit OTP</label>
              <input
                type="text"
                name="otp"
                maxLength="6"
                value={formData.otp}
                onChange={handleChange}
                placeholder="000000"
                className="w-full text-center tracking-[0.5em] text-2xl font-black bg-transparent text-[#051F20] focus:outline-none"
                required
              />
              <p className="text-[10px] text-center mt-2 text-[#235347]">
                Expires in: <span className="font-bold">{formatTime(timer)}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none text-[#051F20]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none text-[#051F20]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none text-[#051F20]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none text-[#051F20]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2B26] hover:bg-[#051F20] text-[#DAF1DE] font-semibold py-3.5 rounded-xl transition shadow-lg"
            >
              {loading ? "Finalizing..." : "Create Account"}
            </button>
            <button type="button" onClick={() => setStep("request_otp")} className="w-full text-[10px] text-[#235347] hover:underline">
              Mistake in Email? Go back.
            </button>
          </form>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#DAF1DE] text-[#051F20] rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4 shadow-inner">✓</div>
            <h3 className="text-2xl font-black text-[#051F20]">Success!</h3>
            <p className="text-[#235347] text-sm mt-2">Welcome! Your account is ready.</p>
            <Link href="/dashboard/user/homepage" className="block w-full bg-[#051F20] text-[#DAF1DE] py-3.5 rounded-xl mt-6 font-bold">
              Start Exploring
            </Link>
          </div>
        )}

        <p className="text-center text-[#235347] text-sm font-medium mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0B2B26] hover:text-[#051F20] font-bold hover:underline transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}