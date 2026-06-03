"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Reset steps: 'request_reset' | 'verify_reset_otp' | 'set_new_password' | 'success'
  const [step, setStep] = useState("request_reset");
  
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: ""
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minute recovery window

  // Tracking the countdown loop during verification phase
  useEffect(() => {
    let interval;
    if (step === "verify_reset_otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Phase 1 -> POST /forgot-password
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to process recovery request.");

      setStep("verify_reset_otp");
      setTimer(300);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Phase 2 -> POST /verify-reset
  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: Number(formData.otp)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Verification failed.");

      setStep("set_new_password");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Phase 3 -> POST /reset-password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to alter safety credentials.");

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
        
        {/* Branding Headings */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain mb-3" />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#051F20] tracking-tight">Reset Password</h1>
          <p className="text-[#235347] text-sm font-medium mt-1 text-center">
            {step === "request_reset" && "Recover your portal token directly via Telegram"}
            {step === "verify_reset_otp" && "Input the security verification digits sent by our bot"}
            {step === "set_new_password" && "Establish safe, updated authentication entries"}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 shadow-sm">
            {error}
          </div>
        )}

        {/* --- STEP 1: REQUEST SYSTEM PIN --- */}
        {step === "request_reset" && (
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Account Email</label>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2B26] hover:bg-[#051F20] text-[#DAF1DE] font-semibold py-3.5 rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Locating Profile..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* --- STEP 2: VERIFY RESET PIN --- */}
        {step === "verify_reset_otp" && (
          <form onSubmit={handleVerifyResetOtp} className="space-y-4">
            <div className="bg-[#DAF1DE]/40 p-4 rounded-2xl border border-[#8EB69B]/20">
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider text-center">Telegram Pin Code</label>
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
                Code expires in: <span className="font-bold">{formatTime(timer)}</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2B26] hover:bg-[#051F20] text-[#DAF1DE] font-semibold py-3.5 rounded-xl transition shadow-lg"
            >
              {loading ? "Verifying Token..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* --- STEP 3: SET NEW PASSWORD --- */}
        {step === "set_new_password" && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">New Password</label>
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
              <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">Confirm New Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none text-[#051F20]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2B26] hover:bg-[#051F20] text-[#DAF1DE] font-semibold py-3.5 rounded-xl transition shadow-lg"
            >
              {loading ? "Updating Security Entry..." : "Change Password"}
            </button>
          </form>
        )}

        {/* --- STEP 4: SUCCESS RECOVERY COMPLETE --- */}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#DAF1DE] text-[#051F20] rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4 shadow-inner">✓</div>
            <h3 className="text-2xl font-black text-[#051F20]">Updated!</h3>
            <p className="text-[#235347] text-sm mt-2">Your structural credentials have been reset successfully.</p>
            <Link href="/login" className="block w-full bg-[#051F20] text-[#DAF1DE] py-3.5 rounded-xl mt-6 font-bold text-center">
              Sign In Now
            </Link>
          </div>
        )}

        {step !== "success" && (
          <p className="text-center text-[#235347] text-sm font-medium mt-6">
            Remembered details?{" "}
            <Link href="/login" className="text-[#0B2B26] hover:text-[#051F20] font-bold hover:underline transition">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}