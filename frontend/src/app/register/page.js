"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

// ---------------- Logo ----------------
function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-36 h-24 object-contain"
      />
    </div>
  );
}

// ---------------- Input ----------------
function Input({ label, value, setValue, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
        required
      />
    </div>
  );
}

// ---------------- Page ----------------
export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  // Step 2
  const [telegramId, setTelegramId] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // ---------------- Step 1 ----------------
  const goNext = () => {
    if (!name || !email || !password || !gender) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }
    setMessage(null);
    setStep(2);
  };

  // ---------------- Fake OTP ----------------
  const sendOTP = () => {
    if (!telegramId) {
      setMessage({ text: "Telegram ID is required", type: "error" });
      return;
    }

    setOtpSent(true);
    setMessage({ text: "OTP sent! Use 1234 to register.", type: "success" });
  };

  // ---------------- Fake Register ----------------
  const register = () => {
    if (!otp) {
      setMessage({ text: "OTP is required", type: "error" });
      return;
    }

    if (otp !== "1234") {
      setMessage({ text: "Invalid OTP. Use 1234.", type: "error" });
      return;
    }

    const user = {
      name,
      email,
      avatar: "/users/default-avatar.svg",
    };

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    setMessage({ text: "Registration successful!", type: "success" });
    setTimeout(() => router.push("/dashboard/user/homepage"), 800);
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-6">
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <Logo />

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {step === 1 ? "Create Account" : "Verify Telegram"}
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message.text}
          </p>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input label="Name" value={name} setValue={setName} />
            <Input label="Email" value={email} setValue={setEmail} type="email" />
            <Input
              label="Password"
              value={password}
              setValue={setPassword}
              type="password"
            />

            <div>
              <label className="block mb-1 text-white font-medium">Gender</label>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                required
              >
                <option value="" className="text-black">Select Gender</option>
                <option value="male" className="text-black">Male</option>
                <option value="female" className="text-black">Female</option>
                <option value="other" className="text-black">Other</option>
              </select>
            </div>

            <button
              onClick={goNext}
              className="w-full bg-green-500 p-3 rounded text-white font-bold"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input label="Telegram ID" value={telegramId} setValue={setTelegramId} />
            <Input
              label="Telegram Username"
              value={telegramUsername}
              setValue={setTelegramUsername}
            />

            {!otpSent ? (
              <button
                onClick={sendOTP}
                className="w-full bg-yellow-500 p-3 rounded text-white font-bold"
              >
                Send OTP
              </button>
            ) : (
              <>
                <Input label="OTP" value={otp} setValue={setOtp} />
                <button
                  onClick={register}
                  className="w-full bg-green-500 p-3 rounded text-white font-bold"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
