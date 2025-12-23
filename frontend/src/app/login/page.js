"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser() || {};

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setAlert({ message: "Please enter email and password!", type: "error" });
      setLoading(false);
      return;
    }

    // Mock login logic based on email
    let role = "user";
    if (email === "admin@example.com") role = "admin";
    else if (email === "owner@example.com") role = "owner";

    const loggedInUser = {
      id: 1,
      name: email.split("@")[0],
      email,
      avatar: "/users/default-avatar.svg",
      role,
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("isLoggedIn", "true");

    // Update context
    if (setUser) setUser(loggedInUser);

    setAlert({ message: `Welcome ${loggedInUser.name} (${role})!`, type: "success" });

    // Redirect based on role
    setTimeout(() => {
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "owner") router.push("/dashboard/owner");
      else router.push("/dashboard/user/homepage");
    }, 1000);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-6">
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        <img src="/images/logo.png" alt="Logo" className="w-35 h-24 mx-auto mb-6 drop-shadow-xl" />
        <h2 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField label="Email" placeholder="Enter your email" value={email} setValue={setEmail} type="email" disabled={loading} />
          <InputField label="Password" placeholder="Enter your password" value={password} setValue={setPassword} type="password" disabled={loading} />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg transition transform ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, value, setValue, type = "text", disabled = false }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-white drop-shadow-sm">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 backdrop-blur-sm transition ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
        required
      />
    </div>
  );
}

function Alert({ message, type = "success", onClose }) {
  const bgColor = type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  return (
    <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg ${bgColor} z-50`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold text-xl leading-none hover:opacity-70 transition">&times;</button>
      </div>
    </div>
  );
}
