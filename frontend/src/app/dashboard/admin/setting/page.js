'use client';
import React, { useState } from 'react';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex@company.com',
    role: 'Admin',
    phone: '+1 234 567 8900',
    joined: 'Jan 2023',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setIsEditing(false);
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-gray-600">
                  {profile.name.charAt(0)}
                </span>
              </div>
              {isEditing ? (
                <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Change Photo
                </button>
              ) : (
                <p className="text-sm text-gray-500">Admin</p>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              {/* Edit/Save */}
              <div className="flex justify-end">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  {isEditing ? (
                    <input
                      value={profile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  {isEditing ? (
                    <select
                      value={profile.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Editor</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.role}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  {isEditing ? (
                    <input
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="text-gray-900">{profile.joined}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Security</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg">
                Change Password
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg">
                Two-Factor Auth
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Account</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg">
                Download Data
              </button>
              <button className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-lg">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-sign-in-alt text-gray-500"></i>
              </div>
              <div>
                <p className="text-sm">Logged in</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-cog text-gray-500"></i>
              </div>
              <div>
                <p className="text-sm">Updated settings</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}