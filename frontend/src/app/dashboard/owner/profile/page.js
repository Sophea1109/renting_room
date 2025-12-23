"use client";

import React, { useState } from "react";
import OwnerSidebar from "@/components/OwnerSidebar";
import OwnerHeader from "@/components/OwnerHeader";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiHome,
  FiCamera,
  FiLock,
  FiGlobe,
  FiBriefcase,
  FiCheckCircle
} from "react-icons/fi";
import Image from "next/image";

export default function OwnerProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Profile data
  const [profile, setProfile] = useState({
    name: "Vann Sophon",
    email: "vannsophon@email.com",
    phone: "+855 12 345 678",
    bio: "Property owner with 5+ years of experience managing rental properties in Phnom Penh. Focused on providing comfortable and affordable housing solutions.",
    address: "123 Street 271, Chamkarmon, Phnom Penh",
    joinDate: "January 15, 2020",
    properties: 8,
    activeTenants: 12,
    rating: 4.8,
    avatar: "/users/user-03.jpg",
    website: "www.vannsophon-properties.com",
    company: "Sophon Properties Ltd.",
    language: "Khmer, English",
    notifications: true,
    emailNotifications: true,
    twoFactorAuth: false
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle save profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    setShowSuccessAlert(true);
    
    // Auto-hide success alert
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  // Simulate avatar upload
  const handleAvatarUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      // In real app, you would update the avatar URL here
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <OwnerHeader />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          {/* Success Alert */}
          {showSuccessAlert && (
            <div className="mb-6 animate-slide-in">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-lg">
                <div className="flex items-center">
                  <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      Profile updated successfully!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSuccessAlert(false)}
                    className="text-green-800 hover:text-green-600"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center gap-2"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-700 hover:to-emerald-600 transition-all flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info & Stats */}
            <div className="lg:col-span-1 space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                      <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="w-16 h-16 text-gray-400" />
                          {/* In real app: <Image src={profile.avatar} alt={profile.name} fill className="object-cover" /> */}
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={handleAvatarUpload}
                          disabled={isUploading}
                          className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          {isUploading ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <FiCamera className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Name & Rating */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="text-gray-500 text-center border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        profile.name
                      )}
                    </h2>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">{profile.rating}/5.0</span>
                    </div>

                    {/* Bio */}
                    <div className="text-center mb-6">
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full text-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <p className="text-gray-600">{profile.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex items-center">
                      <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          className="flex-1 text-gray-500 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.email}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="flex-1 text-gray-500 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.phone}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          className="flex-1 text-gray-500 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.address}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Stats</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Properties</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.properties}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiHome className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Active Tenants</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.activeTenants}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FiUser className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.joinDate}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FiCalendar className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Account Settings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Settings Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="company"
                            value={profile.company}
                            onChange={handleInputChange}
                            className="w-full text-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-gray-700">{profile.company}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="website"
                            value={profile.website}
                            onChange={handleInputChange}
                            className="w-full text-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-gray-700 flex items-center">
                            <FiGlobe className="w-4 h-4 mr-2 text-gray-400" />
                            {profile.website}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Languages
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="language"
                            value={profile.language}
                            onChange={handleInputChange}
                            className="w-full text-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-gray-700">{profile.language}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive push notifications for important updates</p>
                        </div>
                        {isEditing ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications"
                              checked={profile.notifications}
                              onChange={handleInputChange}
                              className="sr-only peer text-gray-500"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.notifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {profile.notifications ? 'Enabled' : 'Disabled'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive email updates about your properties</p>
                        </div>
                        {isEditing ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="emailNotifications"
                              checked={profile.emailNotifications}
                              onChange={handleInputChange}
                              className="sr-only peer text-gray-500"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {profile.emailNotifications ? 'Enabled' : 'Disabled'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Security</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        {isEditing ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="twoFactorAuth"
                              checked={profile.twoFactorAuth}
                              onChange={handleInputChange}
                              className="sr-only peer text-gray-500"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.twoFactorAuth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {profile.twoFactorAuth ? 'Enabled' : 'Disabled'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                          <FiLock className="w-4 h-4" />
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "Added new property", time: "2 hours ago", type: "property" },
                    { action: "Updated room pricing", time: "1 day ago", type: "update" },
                    { action: "Responded to tenant inquiry", time: "2 days ago", type: "message" },
                    { action: "Scheduled property inspection", time: "3 days ago", type: "schedule" },
                    { action: "Received payment", time: "1 week ago", type: "payment" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                      <div className={`p-2 rounded-lg mr-4 ${
                        activity.type === 'property' ? 'bg-blue-100' :
                        activity.type === 'update' ? 'bg-yellow-100' :
                        activity.type === 'message' ? 'bg-green-100' :
                        activity.type === 'schedule' ? 'bg-purple-100' : 'bg-emerald-100'
                      }`}>
                        {activity.type === 'property' && <FiHome className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'update' && <FiEdit2 className="w-4 h-4 text-yellow-600" />}
                        {activity.type === 'message' && <FiMail className="w-4 h-4 text-green-600" />}
                        {activity.type === 'schedule' && <FiCalendar className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'payment' && <FiBriefcase className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}