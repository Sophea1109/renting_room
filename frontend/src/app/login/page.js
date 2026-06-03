"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginApi } from "@/utils/api";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Hits your backend: Route::post('/login', [AuthController::class, 'login']);
      const response = await loginApi(email, password);

      if (response.access_token && response.user) {
        // Cache credentials securely for subsequent Sanctum header authorization
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Synchronize Global React Context
        setUser(response.user);

        // SCHEMA ROLE-BASED REDIRECTION ENGINE
        const userRole = response.user.role; // 'admin' | 'owner' | 'user'

        if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "owner") {
          router.push("/dashboard/owner");
        } else {
          router.push("/dashboard/user/homepage");
        }
      } else {
        setError(response.error || response.message || "Authentication credentials rejected.");
      }
    } catch (err) {
      setError(err.message || "A network exception occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DAF1DE] px-4 py-12">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#8EB69B]/30 transition-all duration-300">
        
        {/* Logo Headings Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <img
              src="/images/logo.png"
              alt="FindRoommate Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-[#051F20] tracking-tight">Welcome Back</h1>
          <p className="text-[#235347] text-sm font-medium mt-1">Sign in to manage your spaces</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-xs font-semibold shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Block */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163832] text-[#051F20] placeholder-[#8EB69B]/60 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Block */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#235347] mb-1.5 tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#8EB69B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163832] text-[#051F20] transition pr-11"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#235347] hover:text-[#051F20] transition text-lg"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember State & Recover Elements */}
          <div className="mb-6 flex items-center justify-between text-sm pt-1">
  <label className="flex items-center cursor-pointer select-none">
    <input
      type="checkbox"
      className="rounded border-[#8EB69B] text-[#0B2B26] focus:ring-[#163832]/30 w-4 h-4"
    />
    <span className="ml-2 text-xs font-semibold text-[#235347]">Remember me</span>
  </label>
  
  {/* Connected cleanly to your new directory layout */}
  <Link
    href="/forgot-password"
    className="text-xs font-bold text-[#0B2B26] hover:text-[#051F20] hover:underline transition"
  >
    Forgot password?
  </Link>
</div>
          {/* Form Action Dispatcher */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2B26] hover:bg-[#051F20] text-[#DAF1DE] font-semibold py-3.5 rounded-xl transition shadow-lg shadow-[#0B2B26]/20 disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating Session..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[#235347] text-sm font-medium mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-[#0B2B26] hover:text-[#051F20] font-bold hover:underline transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}