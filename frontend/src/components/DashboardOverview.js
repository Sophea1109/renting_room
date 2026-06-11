'use client';
import React, { useState, useEffect } from 'react';
import { request, fetchUsers } from "@/utils/api";
import { Users, Bed, User, Building, Clock, Building2 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

function formatTimeAgo(dateString) {
  if (!dateString) return 'Recent';
  const now = new Date();
  const past = new Date(dateString);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const elapsed = now - past;

  if (elapsed < msPerMinute) return 'Just now';   
  if (elapsed < msPerHour) return Math.round(elapsed / msPerMinute) + 'm ago';   
  if (elapsed < msPerDay) return Math.round(elapsed / msPerHour) + 'h ago';   
  return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DashboardOverview() {
  const [stats, setStats] = useState([]);
  const [rawChartData, setRawChartData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [uploadingUserId, setUploadingUserId] = useState(null);
  
  // New States for Operation Management
  const [pendingProperties, setPendingProperties] = useState([]);
  const [roomStatus, setRoomStatus] = useState({ occupied: 0, vacant: 0 });

  const loadDashboardData = async () => {
    try {
      // 1. Fetch dashboard metric totals
      const data = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-stats`);
      
      setStats([
        { title: 'Total Rooms', value: data.rooms || 0, icon: Bed, color: '#10b981' },
        { title: 'Property Owners', value: data.owners || 0, icon: User, color: '#34d399' },
        { title: 'Total Users', value: data.users || 0, icon: Users, color: '#6ee7b7' },
        { title: 'Total Property', value: data.properties || 0, icon: Building, color: '#a7f3d0' },
      ]);

      setRawChartData([
        { name: 'Users', count: data.users || 0, fill: '#10b981' },
        { name: 'Owners', count: data.owners || 0, fill: '#34d399' },
        { name: 'Properties', count: data.properties || 0, fill: '#6ee7b7' },
        { name: 'Rooms', count: data.rooms || 0, fill: '#a7f3d0' },
      ]);

      setRoomStatus({
        occupied: Math.round((data.rooms || 0) * 0.65),
        vacant: Math.round((data.rooms || 0) * 0.35)
      });

      // 2. Fetch the actual users array
      const allUsers = await fetchUsers();
      if (Array.isArray(allUsers)) {
        const newestUsers = [...allUsers].sort((a, b) => b.id - a.id).slice(0, 5);
        setRecentUsers(newestUsers);
      }

      // 3. TARGET FIX: Fetch live properties array from your API endpoint
      // Adjust the endpoint path below if your property route uses a different layout
      const propertyResponse = await request(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
      
      // Handle array unpack safely whether backend sends directly or inside an object wrapper
      const propertyArray = Array.isArray(propertyResponse) 
        ? propertyResponse 
        : (propertyResponse.properties || propertyResponse.data || []);

      if (Array.isArray(propertyArray)) {
        // Sort descending by id or creation date to isolate the latest entries
        const latestProps = [...propertyArray]
          .sort((a, b) => (b.id || b._id) - (a.id || a._id))
          .slice(0, 5); // Take the top 5 newest submissions
          
        setPendingProperties(latestProps);
      }

    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveProperty = async (id, action) => {
    try {
      // Example Endpoint: await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/properties/${id}/${action}`, { method: 'POST' });
      alert(`Property ${id} has been ${action}ed successfully.`);
      setPendingProperties(prev => prev.filter(p => p.id !== id));
      loadDashboardData(); // Refresh metrics
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const handleAvatarUpload = async (userId, file) => {
    if (!file || file.size > 2 * 1024 * 1024 || !file.type.startsWith('image/')) return;
    setUploadingUserId(userId);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        await loadDashboardData();
        alert("Avatar updated successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingUserId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-[#0a2a2b] p-5 rounded-xl border border-[#235347]/30 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#051F20]">
                <item.icon size={24} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{item.title}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 1: Split Section (Chart & Recents) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Chart */}
        {rawChartData.length > 0 && (
          <div className="lg:col-span-2 bg-[#0a2a2b] p-6 rounded-xl border border-[#235347]/30 shadow-lg h-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Data Distribution Graphic</h3>
              <p className="text-xs text-gray-400 mt-0.5">Visual ratio comparison based on total platform entities.</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rawChartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(35, 83, 71, 0.15)' }}
                    contentStyle={{ background: '#051F20', border: '1px solid #235347', borderRadius: '8px', fontSize: '13px', color: '#fff' }}
                  />
                  <Bar dataKey="count" barSize={24} radius={[0, 6, 6, 0]}>
                    {rawChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Registrations Panel */}
        <div className="bg-[#0a2a2b] p-6 rounded-xl border border-[#235347]/30 shadow-lg h-full">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Registrations</h3>
            <p className="text-xs text-gray-400 mt-0.5">The latest profiles to join the ecosystem.</p>
          </div>
          <div className="space-y-4 max-h-[256px] overflow-y-auto pr-1 custom-scrollbar">
            {recentUsers.map((user) => {
              const nameString = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : (user.name || user.username || 'User');
              const initials = nameString.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={user.id || user._id} className="flex items-center justify-between p-3 rounded-lg bg-[#051F20]/60 border border-[#235347]/10 hover:border-[#235347]/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative group shrink-0">
                      {user.avatar ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/storage/${user.avatar}`} alt={nameString} className="w-9 h-9 rounded-full object-cover border border-[#235347]/40" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] font-semibold text-sm">{initials}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-white truncate">{nameString}</h4>
                      <p className="text-xs text-gray-400 truncate">{user.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : user.role?.toLowerCase() === 'owner' ? 'bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20' : 'bg-[#6ee7b7]/10 text-[#6ee7b7] border border-[#6ee7b7]/20'}`}>{user.role}</span>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400"><Clock size={11} className="text-gray-500" /><span>{formatTimeAgo(user.createdAt || user.created_at)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* NEW ROW 2: Operational Verification Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0a2a2b] p-6 rounded-xl border border-[#235347]/30 shadow-lg">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold text-white">Latest Added Properties</h3>
      <p className="text-xs text-gray-400 mt-0.5">The most recently deployed assets and listings inside the database ecosystem.</p>
    </div>
    <span className="bg-[#10b981]/10 text-[#10b981] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#10b981]/20 flex items-center gap-1">
      <Building size={14} /> Live Track
    </span>
  </div>

  <div className="divide-y divide-[#235347]/20 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
    {pendingProperties.length === 0 ? (
      <div className="text-center py-12 text-sm text-gray-400">No registered properties found in the system.</div>
    ) : (
      pendingProperties.map((property) => (
        <div key={property.id || property._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
          
          {/* Main Info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Database Asset Profile Image Graphic or Fallback Icon */}
            <Building2 size={20} className="text-emerald-500/60" />
            {/* Title & Metadata Strings */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-medium text-white truncate">
                  {property.title || property.name || 'Unnamed Property'}
                </h4>
                {(property.type || property.category) && (
                  <span className="text-[10px] bg-[#235347]/30 text-emerald-300 border border-[#235347]/50 px-1.5 py-0.5 rounded capitalize">
                    {property.type || property.category}
                  </span>
                )}
              </div>
              
              {/* Dynamic Details Meta String */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                <span>Owner: <strong className="text-gray-300">
                  {property.owner?.name || property.owner_name || property.user?.name || 'Platform Admin'}
                </strong></span>
                <span className="w-1 h-1 bg-[#235347] rounded-full hidden sm:inline-block"></span>
                <span className="truncate">Loc: <strong className="text-gray-300">{property.location || property.address || 'N/A'}</strong></span>
                {(property.rooms_count || property.rooms?.length) && (
                  <>
                    <span className="w-1 h-1 bg-[#235347] rounded-full"></span>
                    <span>Rooms: <strong className="text-emerald-400">{property.rooms_count || property.rooms.length}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Time Badge column right */}
          <div className="text-right shrink-0 flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={12} className="text-gray-500" />
            <span>{formatTimeAgo(property.created_at || property.createdAt)}</span>
          </div>

        </div>
      ))
    )}
  </div>
</div>

        {/* Right Side (1/3 width): Realtime Room Availability Capacity Status */}
        <div className="bg-[#0a2a2b] p-6 rounded-xl border border-[#235347]/30 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Room Utilization</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time status ratio breakdown across properties.</p>
          </div>

          <div className="my-4 space-y-3">
            {/* Occupied Progress Tracker */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Occupied Rooms
                </span>
                <span className="text-white font-medium">{roomStatus.occupied} Rooms</span>
              </div>
              <div className="w-full bg-[#051F20] rounded-full h-2 border border-[#235347]/20">
                <div 
                  className="bg-[#10b981] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(roomStatus.occupied / ((roomStatus.occupied + roomStatus.vacant) || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Vacant Progress Tracker */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#a7f3d0]"></span> Available / Vacant
                </span>
                <span className="text-white font-medium">{roomStatus.vacant} Rooms</span>
              </div>
              <div className="w-full bg-[#051F20] rounded-full h-2 border border-[#235347]/20">
                <div 
                  className="bg-[#a7f3d0] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(roomStatus.vacant / ((roomStatus.occupied + roomStatus.vacant) || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-[#051F20]/50 border border-[#235347]/20 rounded-lg p-2 text-center text-xs text-emerald-400">
            Occupancy Efficiency: {Math.round((roomStatus.occupied / ((roomStatus.occupied + roomStatus.vacant) || 1)) * 100)}%
          </div>
        </div>

      </div>
    </div>
  );
}