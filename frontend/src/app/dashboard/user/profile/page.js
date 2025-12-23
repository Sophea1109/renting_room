"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Camera, Upload, Save, User, Mail, UserCircle,
  Loader2, CheckCircle, Edit2, ArrowLeft, ChevronLeft
} from "lucide-react";

export default function ProfilePage() {
  const fileInputRef = useRef(null);

  // Load user from localStorage or set defaults
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored
      ? JSON.parse(stored)
      : {
          name: "",
          email: "",
          gender: "",
          avatar: "/users/default-avatar.svg",
        };
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save changes to localStorage
  const saveToLocal = (newUser) => {
    localStorage.setItem("userProfile", JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = () => {
    if (!avatarFile) return alert("Please select an image first.");

    const reader = new FileReader();
    reader.onload = () => {
      const newUser = { ...user, avatar: reader.result };
      saveToLocal(newUser);
      setAvatarFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    };
    reader.readAsDataURL(avatarFile);
  };

  const handleProfileUpdate = () => {
    setIsSaving(true);
    const newUser = { ...user, name, email, gender };
    saveToLocal(newUser);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 500); // simulate saving delay
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={24} />
            Back
          </button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircle className="text-green-600" size={24} />
            <span className="text-green-700 font-medium">Profile updated successfully!</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Camera className="text-white" size={32} />
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-1/2 translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                <Edit2 size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {avatarFile && (
              <div className="space-y-4">
                <button
                  onClick={handleAvatarUpload}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform"
                >
                  Upload New Avatar
                </button>
                <p className="text-sm text-gray-500 text-center">Selected: {avatarFile.name}</p>
              </div>
            )}

            {/* Account Info */}
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-3 text-gray-600">
              <div className="flex items-center gap-3"><User size={18} /><span>{user.name || "Not set"}</span></div>
              <div className="flex items-center gap-3"><Mail size={18} /><span>{user.email}</span></div>
              <div className="flex items-center gap-3"><UserCircle size={18} /><span>{user.gender || "Not specified"}</span></div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              {/* Name */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><User size={16} />Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Mail size={16} />Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Gender */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><UserCircle size={16} />Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isSaving}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
