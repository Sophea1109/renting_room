"use client";

import { useState, useEffect } from "react";

// --- Logo Component ---
function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <img src="images/logo.png" alt="Logo" className="w-35 h-24 object-contain" />
    </div>
  );
}

// --- Input Field Component ---
function InputField({ label, placeholder, value, setValue, type = "text" }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-white drop-shadow-sm">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 backdrop-blur-sm transition"
        required
      />
    </div>
  );
}

// --- Alert Component ---
function Alert({ message, type = "success", onClose }) {
  const bgColor =
    type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return (
    <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg ${bgColor} z-50`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">&times;</button>
      </div>
    </div>
  );
}

// --- Forgot Password Page (Frontend-only) ---
export default function ForgotPasswordPage() {
  const [telegramId, setTelegramId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Fake OTP
  const FAKE_OTP = "1234";

  // Resend countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // --- Send OTP (Frontend-only) ---
  const sendOtp = () => {
    if (!telegramId && !email) {
      setAlert({ message: "Please enter either your Telegram ID or Email!", type: "error" });
      return;
    }

    setAlert({ message: `OTP sent! Use ${FAKE_OTP} to reset your password.`, type: "success" });
    setStep(2);
    setResendCooldown(30);
  };

  // --- Resend OTP ---
  const handleResendCode = () => {
    if (resendCooldown === 0) sendOtp();
  };

  // --- Reset Password (Frontend-only) ---
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setAlert({ message: "Please fill in all fields!", type: "error" });
      return;
    }

    if (code !== FAKE_OTP) {
      setAlert({ message: "Invalid OTP. Use 1234.", type: "error" });
      return;
    }

    setAlert({ message: "Password reset successfully!", type: "success" });
    setStep(1);
    setTelegramId("");
    setEmail("");
    setCode("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        <Logo />
        <h2 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-lg">Forgot Password</h2>

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
            className="space-y-6"
          >
            <InputField
              label="Telegram ID"
              placeholder="123456789"
              value={telegramId}
              setValue={setTelegramId}
            />
            <InputField
              label="Email"
              placeholder="example@mail.com"
              value={email}
              setValue={setEmail}
              type="email"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <InputField
                label="Verification Code"
                placeholder="Enter OTP"
                value={code}
                setValue={setCode}
              />
              <InputField
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                setValue={setNewPassword}
                type="password"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform"
              >
                Reset Password
              </button>
            </form>

            <div className="mt-4 text-center">
              {resendCooldown > 0 ? (
                <span className="text-white/80">Resend code in {resendCooldown}s</span>
              ) : (
                <button
                  onClick={handleResendCode}
                  className="text-yellow-300 font-medium hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-white/90">
          Back to <a href="/login" className="text-yellow-300 hover:underline font-medium">Login</a>
        </p>
      </div>
    </div>
  );
}
