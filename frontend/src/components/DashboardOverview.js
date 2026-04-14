'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Home, Building, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sortable wrapper
function SortableCard({ item, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // chart data from API
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  // performance summary from API
  const [performance, setPerformance] = useState({
    averageMonthlyGrowth: 0,
    occupancyRate: 0,
    occupiedRooms: 0,
    totalRooms: 0,
  });

  // stats cards (kept in state for DnD reordering)
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`http://localhost:8000/api/owner/dashboard?owner_id=${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((data) => {
        // build stats cards from API
        setStats([
          {
            id: 'totalRooms',
            title: 'Total Rooms',
            value: data.cards.totalRooms,
            icon: Home,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
          },
          {
            id: 'totalRevenue',
            title: 'Total Revenue',
            value: `$${data.cards.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100',
          },
          {
            id: 'occupiedRooms',
            title: 'Occupied Rooms',
            value: data.cards.occupiedRooms,
            icon: Building,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
          },
          {
            id: 'availableRooms',
            title: 'Available Rooms',
            value: data.cards.availableRooms,
            icon: Home,
            color: 'text-amber-600',
            bg: 'bg-amber-100',
          },
        ]);

        // revenue chart — directly from API
        setRevenueData(data.charts.monthlyRevenue);

        // occupancy breakdown — occupied vs available
        setOccupancyData([
          { name: 'Occupied', rooms: data.cards.occupiedRooms },
          { name: 'Available', rooms: data.cards.availableRooms },
        ]);

        // performance summary
        setPerformance({
          averageMonthlyGrowth: data.performanceSummary.averageMonthlyGrowth,
          occupancyRate: data.performanceSummary.occupancyRate,
          occupiedRooms: data.cards.occupiedRooms,
          totalRooms: data.cards.totalRooms,
        });

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stats.findIndex((i) => i.id === active.id);
    const newIndex = stats.findIndex((i) => i.id === over.id);

    const updated = [...stats];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    setStats(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  const growthPositive = performance.averageMonthlyGrowth >= 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 text-sm">Drag cards to reorder</p>
      </div>

      {/* Stats Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={stats} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
              <SortableCard key={item.id} item={item}>
                <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${item.bg}`}>
                      <item.icon size={26} className={item.color} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{item.title}</p>
                      <p className="text-xl font-bold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                </div>
              </SortableCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Trend — real monthly data from API */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
              <p className="text-gray-500 text-sm">Monthly revenue (last 6 months)</p>
            </div>
            <div className={`flex items-center gap-2 ${growthPositive ? 'text-green-600' : 'text-red-500'}`}>
              {growthPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span className="font-medium">
                {growthPositive ? '+' : ''}{performance.averageMonthlyGrowth}%
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  fill="#fef3c7"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Breakdown — real occupied/available from API */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Occupancy Breakdown</h3>
              <p className="text-gray-500 text-sm">Current room occupancy status</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-purple-600">
                {performance.occupiedRooms} occupied
              </span>
              {' '}/{' '}
              <span className="text-gray-600">{performance.totalRooms} total</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  allowDecimals={false}
                  domain={[0, performance.totalRooms || 'auto']}
                />
                <Tooltip
                  formatter={(value) => [value, 'Rooms']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="rooms"
                  name="Rooms"
                  radius={[6, 6, 0, 0]}
                  fill="#8b5cf6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Avg. Monthly Growth</p>
            <p className="text-2xl font-bold text-gray-800">
              {growthPositive ? '+' : ''}{performance.averageMonthlyGrowth}%
            </p>
            <p className="text-xs text-gray-500">Based on last 6 months</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-800">{performance.occupancyRate}%</p>
            <p className="text-xs text-gray-500">
              {performance.occupiedRooms} of {performance.totalRooms} rooms occupied
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
