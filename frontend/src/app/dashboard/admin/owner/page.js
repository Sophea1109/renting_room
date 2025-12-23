'use client';
import React, { useMemo, useState, useCallback } from 'react';

// Constants for better maintainability
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'all',
};

const ACTION_TYPES = {
  ACTIVATE: 'activate',
  SUSPEND: 'suspend',
  REMOVE: 'remove',
};

export default function OwnerDashboardPage() {
  const [owners, setOwners] = useState([
    { id: 1, name: 'Olivia Brown', email: 'olivia@estate.com', status: STATUS.ACTIVE, rooms: 8 },
    { id: 2, name: 'Michael Chen', email: 'michael@homes.io', status: STATUS.ACTIVE, rooms: 12 },
    { id: 3, name: 'Sara Ahmed', email: 'sara@rentals.co', status: STATUS.INACTIVE, rooms: 4 },
    { id: 4, name: 'David Lee', email: 'david@properties.net', status: STATUS.ACTIVE, rooms: 15 },
    { id: 5, name: 'Priya Patel', email: 'priya@stay.me', status: STATUS.INACTIVE, rooms: 2 },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', status: STATUS.ACTIVE, rooms: 0 });
  const [filter, setFilter] = useState({ status: STATUS.ALL });

  // Memoized statistics
  const stats = useMemo(() => {
    const total = owners.length;
    const active = owners.filter(o => o.status === STATUS.ACTIVE).length;
    const pending = owners.filter(o => o.status === STATUS.INACTIVE).length;
    const totalRooms = owners.reduce((sum, o) => sum + (o.rooms || 0), 0);
    return { total, active, pending, totalRooms };
  }, [owners]);

  // Filtered owners
  const visibleOwners = useMemo(() => {
    return owners.filter(o => filter.status === STATUS.ALL || o.status === filter.status);
  }, [owners, filter.status]);

  // Handlers
  const handleOpenCreate = useCallback(() => {
    setCreateForm({ name: '', email: '', status: STATUS.ACTIVE, rooms: 0 });
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => setIsCreateOpen(false), []);

  const handleSaveCreate = useCallback(() => {
    const nextId = owners.length > 0 ? Math.max(...owners.map(o => o.id)) + 1 : 1;
    setOwners(prev => [{ id: nextId, ...createForm }, ...prev]);
    setIsCreateOpen(false);
  }, [createForm, owners]);

  const handleApplyFilter = useCallback(partial => setFilter(prev => ({ ...prev, ...partial })), []);
  const handleResetFilter = useCallback(() => { setFilter({ status: STATUS.ALL }); setIsFilterOpen(false); }, []);

  const handleOwnerAction = useCallback((action, id) => {
    switch (action) {
      case ACTION_TYPES.ACTIVATE:
        setOwners(prev => prev.map(o => o.id === id ? { ...o, status: STATUS.ACTIVE } : o));
        break;
      case ACTION_TYPES.SUSPEND:
        setOwners(prev => prev.map(o => o.id === id ? { ...o, status: STATUS.INACTIVE } : o));
        break;
      case ACTION_TYPES.REMOVE:
        if (window.confirm('Remove this owner?')) {
          setOwners(prev => prev.filter(o => o.id !== id));
        }
        break;
    }
  }, []);

  const handleCreateFormChange = useCallback((field, value) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Render helpers
  const renderStatusBadge = (status) => {
    const color = status === STATUS.ACTIVE ? 'bg-green-100 text-green-800' :
                  status === STATUS.INACTIVE ? 'bg-yellow-100 text-yellow-800' : '';
    return <span className={`px-2 py-1 rounded-full text-sm font-medium ${color}`}>{status}</span>;
  };

  const renderActionButtons = (owner) => (
    <div className="flex gap-2">
      {owner.status === STATUS.INACTIVE && (
        <button
          onClick={() => handleOwnerAction(ACTION_TYPES.ACTIVATE, owner.id)}
          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
        >
          <i className="fas fa-user-check"></i>
          <span>Activate</span>
        </button>
      )}
      {owner.status === STATUS.ACTIVE && (
        <button
          onClick={() => handleOwnerAction(ACTION_TYPES.SUSPEND, owner.id)}
          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 shadow-sm"
        >
          <i className="fas fa-user-slash"></i>
          <span>Suspend</span>
        </button>
      )}
      <button
        onClick={() => handleOwnerAction(ACTION_TYPES.REMOVE, owner.id)}
        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-sm"
      >
        <i className="fas fa-trash"></i>
        <span>Remove</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
        <p className="text-gray-700">Manage property owners, approvals, and activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><i className="fas fa-users"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.total}</h3>
            <p>Total Owners</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full"><i className="fas fa-user-check"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.active}</h3>
            <p>Active Owners</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><i className="fas fa-user-clock"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.pending}</h3>
            <p>Pending/Inactive</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-full"><i className="fas fa-home"></i></div>
          <div>
            <h3 className="text-xl font-semibold">{stats.totalRooms}</h3>
            <p>Total Rooms</p>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="user-management bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Owner Management</h3>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
            onClick={handleOpenCreate}
          >
            <i className="fas fa-plus"></i> Create Owner
          </button>
        </div>

        {/* Filter Section */}
        <div>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            onClick={() => setIsFilterOpen(v => !v)}
          >
            <i className="fas fa-filter"></i> Filter
          </button>

          {isFilterOpen && (
            <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <label className="font-medium">Status</label>
                <select
                  value={filter.status}
                  onChange={e => handleApplyFilter({ status: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value={STATUS.ALL}>All</option>
                  <option value={STATUS.ACTIVE}>Active</option>
                  <option value={STATUS.INACTIVE}>Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                  onClick={handleResetFilter}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Owners Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Rooms</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleOwners.map(owner => (
                <tr key={owner.id} className="border-b">
                  <td className="px-4 py-2">{owner.name}</td>
                  <td className="px-4 py-2">{owner.email}</td>
                  <td className="px-4 py-2">{renderStatusBadge(owner.status)}</td>
                  <td className="px-4 py-2">{owner.rooms}</td>
                  <td className="px-4 py-2">{renderActionButtons(owner)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="text-lg font-semibold">Create Owner</div>

            <input
              type="text"
              value={createForm.name}
              onChange={e => handleCreateFormChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Name"
              autoFocus
            />
            <input
              type="email"
              value={createForm.email}
              onChange={e => handleCreateFormChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Email"
            />
            <select
              value={createForm.status}
              onChange={e => handleCreateFormChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value={STATUS.ACTIVE}>Active</option>
              <option value={STATUS.INACTIVE}>Inactive</option>
            </select>
            <input
              type="number"
              value={createForm.rooms}
              onChange={e => handleCreateFormChange('rooms', Math.max(0, Number(e.target.value) || 0))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Rooms"
              min={0}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200" onClick={handleCloseCreate}>
                Cancel
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200" onClick={handleSaveCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
