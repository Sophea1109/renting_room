"use client";

import React, { useState } from "react";
import OwnerSidebar from "@/components/OwnerSidebar";
import OwnerHeader from "@/components/OwnerHeader";
import {
  FiSettings,
  FiBell,
  FiLock,
  FiCreditCard,
  FiGlobe,
  FiDatabase,
  FiShield,
  FiUsers,
  FiHelpCircle,
  FiSave,
  FiCheckCircle,
  FiMail,
  FiEye,
  FiEyeOff,
  FiSmartphone,
  FiCalendar,
  FiUpload,
  FiTrash2
} from "react-icons/fi";

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    language: "english",
    timezone: "Asia/Phnom_Penh",
    dateFormat: "DD/MM/YYYY",
    currency: "USD",
    autoBackup: true,
    theme: "light",
    compactMode: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newBooking: true,
    paymentReceived: true,
    tenantMessages: true,
    maintenanceRequests: true,
    newsletter: false,
    marketingEmails: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    suspiciousActivity: true,
    autoLogout: true
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showProperties: true,
    dataSharing: false,
    analytics: true,
    cookies: true
  });

  // Handle section changes
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Handle setting changes
  const handleSettingChange = (section, field, value) => {
    switch (section) {
      case "general":
        setGeneralSettings(prev => ({ ...prev, [field]: value }));
        break;
      case "notifications":
        setNotificationSettings(prev => ({ ...prev, [field]: value }));
        break;
      case "security":
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case "privacy":
        setPrivacySettings(prev => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessAlert(true);
      
      // Auto-hide success alert
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    }, 1500);
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  // Handle export data
  const handleExportData = () => {
    alert("Data export functionality would be implemented here.");
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
    );
    
    if (confirmed) {
      alert("Account deletion functionality would be implemented here.");
    }
  };

  const sections = [
    { id: "general", label: "General", icon: FiSettings },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiLock },
    { id: "privacy", label: "Privacy", icon: FiShield },
    { id: "data", label: "Data", icon: FiDatabase },
    { id: "help", label: "Help", icon: FiHelpCircle }
  ];

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
                      Settings saved successfully!
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
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar - Settings navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all ${
                          activeSection === section.id
                            ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Right content - Settings details */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* General Settings */}
                {activeSection === "general" && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">General Settings</h2>
                    <p className="text-gray-600 mb-6">Manage your general account preferences</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={generalSettings.language}
                          onChange={(e) => handleSettingChange("general", "language", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          <option value="english">English</option>
                          <option value="khmer">Khmer</option>
                          <option value="chinese">Chinese</option>
                          <option value="french">French</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          <option value="Asia/Phnom_Penh">Asia/Phnom Penh (GMT+7)</option>
                          <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                          <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Format
                        </label>
                        <select
                          value={generalSettings.dateFormat}
                          onChange={(e) => handleSettingChange("general", "dateFormat", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={generalSettings.currency}
                          onChange={(e) => handleSettingChange("general", "currency", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          <option value="USD">US Dollar ($)</option>
                          <option value="KHR">Cambodian Riel (៛)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Auto Backup</p>
                          <p className="text-sm text-gray-500">Automatically backup your data weekly</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.autoBackup}
                            onChange={(e) => handleSettingChange("general", "autoBackup", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Compact Mode</p>
                          <p className="text-sm text-gray-500">Use compact layout for better space utilization</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.compactMode}
                            onChange={(e) => handleSettingChange("general", "compactMode", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeSection === "notifications" && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Settings</h2>
                    <p className="text-gray-600 mb-6">Configure how you receive notifications</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
                        <div className="space-y-4">
                          {[
                            { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
                            { key: "pushNotifications", label: "Push Notifications", description: "Receive browser push notifications" },
                            { key: "smsNotifications", label: "SMS Notifications", description: "Receive SMS notifications (charges may apply)" }
                          ].map((channel) => (
                            <div key={channel.key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                                <p className="text-sm text-gray-500">{channel.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[channel.key]}
                                  onChange={(e) => handleSettingChange("notifications", channel.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === "security" && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Security Settings</h2>
                    <p className="text-gray-600 mb-6">Manage your account security and password</p>
                    
                    <div className="space-y-6">
                      {/* Change Password */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={securitySettings.currentPassword}
                                onChange={(e) => handleSettingChange("security", "currentPassword", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility("current")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                {showCurrentPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                value={securitySettings.newPassword}
                                onChange={(e) => handleSettingChange("security", "newPassword", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={securitySettings.confirmPassword}
                                onChange={(e) => handleSettingChange("security", "confirmPassword", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Security Features */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Features</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={securitySettings.twoFactorAuth}
                                onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Login Alerts</p>
                              <p className="text-sm text-gray-500">Get notified of new sign-ins to your account</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={securitySettings.loginAlerts}
                                onChange={(e) => handleSettingChange("security", "loginAlerts", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Auto Logout</p>
                              <p className="text-sm text-gray-500">Automatically log out after 30 minutes of inactivity</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={securitySettings.autoLogout}
                                onChange={(e) => handleSettingChange("security", "autoLogout", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === "privacy" && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Privacy Settings</h2>
                    <p className="text-gray-600 mb-6">Control your privacy and data sharing preferences</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Who can see your profile
                            </label>
                            <select
                              value={privacySettings.profileVisibility}
                              onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                              <option value="public">Public (Everyone)</option>
                              <option value="tenants">Tenants Only</option>
                              <option value="private">Private (Only Me)</option>
                            </select>
                          </div>
                          
                          <div className="space-y-3">
                            {[
                              { key: "showEmail", label: "Show Email Address" },
                              { key: "showPhone", label: "Show Phone Number" },
                              { key: "showProperties", label: "Show My Properties" }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={item.key}
                                  checked={privacySettings[item.key]}
                                  onChange={(e) => handleSettingChange("privacy", item.key, e.target.checked)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={item.key} className="ml-3 text-sm text-gray-700">
                                  {item.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Analytics</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Data Sharing</p>
                              <p className="text-sm text-gray-500">Allow us to use your data to improve our services</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={privacySettings.dataSharing}
                                onChange={(e) => handleSettingChange("privacy", "dataSharing", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Usage Analytics</p>
                              <p className="text-sm text-gray-500">Help us understand how you use our platform</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={privacySettings.analytics}
                                onChange={(e) => handleSettingChange("privacy", "analytics", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Settings */}
                {activeSection === "data" && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Data Management</h2>
                    <p className="text-gray-600 mb-6">Manage your account data and exports</p>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Export Your Data</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Download a copy of all your data including properties, tenants, transactions, and messages.
                        </p>
                        <button
                          onClick={handleExportData}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                          <FiUpload className="w-4 h-4" />
                          Export All Data
                        </button>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Section */}
                {activeSection === "help" && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Help & Support</h2>
                    <p className="text-gray-600 mb-6">Get help with using the platform</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-all">
                        <FiHelpCircle className="w-8 h-8 text-blue-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Help Center</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Browse our documentation and FAQs for answers to common questions.
                        </p>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Visit Help Center →
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-all">
                        <FiMail className="w-8 h-8 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Support</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Need help? Contact our support team for personalized assistance.
                        </p>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Contact Support →
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-500 transition-all">
                        <FiGlobe className="w-8 h-8 text-purple-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Community Forum</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Connect with other property owners and share experiences.
                        </p>
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          Join Community →
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6 hover:border-yellow-500 transition-all">
                        <FiCalendar className="w-8 h-8 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Training</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Book a one-on-one training session with our experts.
                        </p>
                        <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                          Schedule Now →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other sections can be added similarly */}
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