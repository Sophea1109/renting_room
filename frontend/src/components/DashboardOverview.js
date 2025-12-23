'use client';

import React, { useState } from 'react';
import { Home, Users, Building, DollarSign, TrendingUp, User } from 'lucide-react';
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
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
  const [stats, setStats] = useState([
    {
      id: 'rooms',
      title: 'Total Rooms',
      value: 12,
      icon: Home,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      id: 'Report',
      title: 'Total Report',
      value: 5,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      id: 'occupied',
      title: 'Occupied Rooms',
      value: 7,
      icon: Building,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      id: 'Owner',
      title: 'Total Owner',
      value: '10',
      icon: User,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
  ]);

  // Graph data
  const revenueData = [
    { month: 'Jan', revenue: 4200, occupancy: 65 },
    { month: 'Feb', revenue: 4300, occupancy: 68 },
    { month: 'Mar', revenue: 4500, occupancy: 72 },
    { month: 'Apr', revenue: 4600, occupancy: 75 },
    { month: 'May', revenue: 4800, occupancy: 78 },
    { month: 'Jun', revenue: 4850, occupancy: 80 },
    { month: 'Jul', revenue: 4900, occupancy: 82 },
  ];

  const occupancyData = [
    { day: 'Mon', occupied: 6, available: 6 },
    { day: 'Tue', occupied: 7, available: 5 },
    { day: 'Wed', occupied: 7, available: 5 },
    { day: 'Thu', occupied: 6, available: 6 },
    { day: 'Fri', occupied: 8, available: 4 },
    { day: 'Sat', occupied: 8, available: 4 },
    { day: 'Sun', occupied: 7, available: 5 },
  ];

  // sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  // reorder logic
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 text-sm">Drag cards to reorder</p>
      </div>

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

      {/* Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
              <p className="text-gray-500 text-sm">Monthly revenue over time</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp size={20} />
              <span className="font-medium">+15.2%</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
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

        {/* Occupancy Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Weekly Occupancy</h3>
              <p className="text-gray-500 text-sm">Room occupancy this week</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-purple-600">7 occupied</span>
              {' '}/{' '}
              <span className="text-gray-600">12 total</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[0, 12]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="occupied"
                  name="Occupied Rooms"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="available"
                  name="Available Rooms"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Avg. Monthly Growth</p>
            <p className="text-2xl font-bold text-gray-800">+2.8%</p>
            <p className="text-xs text-gray-500">Compared to last month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-800">83.3%</p>
            <p className="text-xs text-gray-500">7 of 12 rooms occupied</p>
          </div>
        </div>
      </div>
    </div>
  );
}