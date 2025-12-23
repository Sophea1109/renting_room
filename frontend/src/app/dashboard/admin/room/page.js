'use client';
import React, { useMemo, useState } from 'react';

export default function RoomDashboardPage() {
  const [rooms, setRooms] = useState([
    { id: 1, title: 'Sunny Studio Downtown', owner: 'Olivia Brown', status: 'active', price: 800 },
    { id: 2, title: 'Cozy Loft Near Park', owner: 'Michael Chen', status: 'inactive', price: 950 },
    { id: 3, title: 'Modern Apartment Cityview', owner: 'Sara Ahmed', status: 'active', price: 1200 },
    { id: 4, title: 'Quiet Room Suburbs', owner: 'David Lee', status: 'inactive', price: 600 },
    { id: 5, title: 'Shared Flat Central', owner: 'Priya Patel', status: 'active', price: 700 },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', owner: '', status: 'active', price: 0 });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ status: 'all' });

  // Stats
  const stats = useMemo(() => {
    const total = rooms.length;
    const active = rooms.filter(r => r.status === 'active').length;
    const pending = rooms.filter(r => r.status === 'inactive').length;
    return { total, active, pending };
  }, [rooms]);

  // Filtered rooms
  const visibleRooms = rooms.filter(r => filter.status === 'all' || r.status === filter.status);

  // Handlers
  const openCreate = () => {
    setCreateForm({ title: '', owner: '', status: 'active', price: 0 });
    setCreateOpen(true);
  };
  const closeCreate = () => setCreateOpen(false);
  const saveCreate = () => {
    const nextId = Math.max(0, ...rooms.map(r => r.id)) + 1;
    setRooms(prev => [{ id: nextId, ...createForm }, ...prev]);
    setCreateOpen(false);
  };
  const applyFilter = partial => setFilter(prev => ({ ...prev, ...partial }));
  const setStatus = (id, status) => setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  const removeRoom = id => {
    if (!window.confirm('Remove this room?')) return;
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // Helpers
  const renderStatusBadge = status => {
    const color = status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    return <span className={`px-2 py-1 rounded-full text-sm font-medium ${color}`}>{status}</span>;
  };

  const renderActionButtons = room => (
    <div className="flex gap-2">
      {room.status === 'inactive' && (
        <button
          onClick={() => setStatus(room.id, 'active')}
          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
        >
          <i className="fas fa-upload"></i>
          <span>Publish</span>
        </button>
      )}
      {room.status === 'active' && (
        <button
          onClick={() => setStatus(room.id, 'inactive')}
          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 shadow-sm"
        >
          <i className="fas fa-box-archive"></i>
          <span>Archive</span>
        </button>
      )}
      <button
        onClick={() => removeRoom(room.id)}
        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-sm"
      >
        <i className="fas fa-trash"></i>
        <span>Delete</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="text-2xl font-semibold">Room Dashboard</h1>
        <p className="text-gray-700">Manage rooms, publishing, and visibility</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><i className="fas fa-door-open"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.total}</h3>
            <p>Total Rooms</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full"><i className="fas fa-check-circle"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.active}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><i className="fas fa-clock"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.pending}</h3>
            <p>Inactive</p>
          </div>
        </div>
      </div>

      {/* Room Management */}
      <div className="user-management bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Room Management</h3>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
            onClick={openCreate}
          >
            <i className="fas fa-plus"></i> Create Room
          </button>
        </div>

        {/* Filter */}
        <div>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            onClick={() => setFilterOpen(v => !v)}
          >
            <i className="fas fa-filter"></i> Filter
          </button>

          {filterOpen && (
            <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <label className="font-medium">Status</label>
                <select
                  value={filter.status}
                  onChange={e => applyFilter({ status: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                  onClick={() => { setFilter({ status: 'all' }); setFilterOpen(false); }}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rooms Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRooms.map(room => (
                <tr key={room.id} className="border-b">
                  <td className="px-4 py-2">{room.title}</td>
                  <td className="px-4 py-2">{room.owner}</td>
                  <td className="px-4 py-2">{renderStatusBadge(room.status)}</td>
                  <td className="px-4 py-2">${room.price}</td>
                  <td className="px-4 py-2">{renderActionButtons(room)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="text-lg font-semibold">Create Room</div>
            <input
              type="text"
              value={createForm.title}
              onChange={e => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Title"
            />
            <input
              type="text"
              value={createForm.owner}
              onChange={e => setCreateForm(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Owner"
            />
            <select
              value={createForm.status}
              onChange={e => setCreateForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="number"
              value={createForm.price}
              onChange={e => setCreateForm(prev => ({ ...prev, price: Math.max(0, Number(e.target.value) || 0) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Price"
              min={0}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200" onClick={closeCreate}>
                Cancel
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200" onClick={saveCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
