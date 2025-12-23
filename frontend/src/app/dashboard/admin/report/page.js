'use client';

import React, { useMemo, useState } from 'react';

export default function ReportDashboardPage() {
  const [reports, setReports] = useState([
    { id: 101, title: 'Spam listing reported', status: 'open', priority: 'high', assignee: 'Moderator A', date: '2025-12-01' },
    { id: 102, title: 'Payment dispute', status: 'open', priority: 'medium', assignee: 'Finance B', date: '2025-12-05' },
    { id: 103, title: 'Harassment complaint', status: 'resolved', priority: 'high', assignee: 'Support C', date: '2025-12-10' },
    { id: 104, title: 'Bug: image upload failed', status: 'open', priority: 'low', assignee: 'Engineer D', date: '2025-12-14' },
    { id: 105, title: 'Inaccurate room details', status: 'resolved', priority: 'medium', assignee: 'Moderator A', date: '2025-12-18' },
  ]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', status: 'open', priority: 'low', assignee: '' });

  const stats = useMemo(() => {
    const total = reports.length;
    const open = reports.filter(r => r.status === 'open').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const high = reports.filter(r => r.priority === 'high').length;
    return { total, open, resolved, high };
  }, [reports]);

  const applyFilter = (partial) => setFilter(prev => ({ ...prev, ...partial }));
  const visibleReports = reports.filter(r => {
    const statusOk = filter.status === 'all' ? true : r.status === filter.status;
    const priorityOk = filter.priority === 'all' ? true : r.priority === filter.priority;
    return statusOk && priorityOk;
  });

  const setStatus = (id, status) => setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  const removeReport = (id) => {
    if (!window.confirm('Delete this report?')) return;
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const exportCSV = () => {
    const header = ['id','title','status','priority','assignee','date'].join(',');
    const rows = visibleReports.map(r => [r.id, r.title, r.status, r.priority, r.assignee, r.date]
      .map(v => `"${String(v).replace(/\"/g,'\"')}"`).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openCreate = () => {
    setCreateForm({ title: '', status: 'open', priority: 'low', assignee: '' });
    setCreateOpen(true);
  };
  const closeCreate = () => setCreateOpen(false);
  const saveCreate = () => {
    const nextId = Math.max(0, ...reports.map(r => r.id)) + 1;
    const date = new Date().toISOString().slice(0,10);
    setReports(prev => [{ id: nextId, date, ...createForm }, ...prev]);
    setCreateOpen(false);
  };

  // Badge colors for status and priority
  const badgeColors = {
    open: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-purple-100 text-purple-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">Report Dashboard</h1>
        <p className="text-gray-500">Track platform issues, moderation, and resolutions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">Total Reports</div>
          <div className="text-xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">Open</div>
          <div className="text-xl font-bold text-gray-800">{stats.open}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">Resolved</div>
          <div className="text-xl font-bold text-gray-800">{stats.resolved}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">High Priority</div>
          <div className="text-xl font-bold text-gray-800">{stats.high}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold">Reports</h3>
        <div className="flex gap-2">
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <i className="fas fa-plus"></i> Create
          </button>
          <button
            onClick={exportCSV}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 flex items-center gap-1"
          >
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      {/* Filter */}
      <div>
        <button
          className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
          onClick={() => setFilterOpen(prev => !prev)}
        >
          <i className="fas fa-filter"></i> Filter
        </button>
        {filterOpen && (
          <div className="bg-white border rounded shadow p-4 mt-2 space-y-3 w-80">
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => applyFilter({ status: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Priority</label>
              <select
                value={filter.priority}
                onChange={(e) => applyFilter({ priority: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                onClick={() => { setFilter({ status: 'all', priority: 'all' }); setFilterOpen(false); }}
              >
                Reset
              </button>
              <button
                className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
                onClick={() => setFilterOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="p-3 text-left border-b">ID</th>
              <th className="p-3 text-left border-b">Title</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Priority</th>
              <th className="p-3 text-left border-b">Assignee</th>
              <th className="p-3 text-left border-b">Date</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleReports.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-3 border-b text-gray-800">{r.id}</td>
                <td className="p-3 border-b text-gray-800">{r.title}</td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeColors[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeColors[r.priority]}`}>
                    {r.priority}
                  </span>
                </td>
                <td className="p-3 border-b text-gray-800">{r.assignee}</td>
                <td className="p-3 border-b text-gray-500">{r.date}</td>
                <td className="p-3 border-b flex gap-2">
                  {r.status !== 'resolved' && (
                    <button
                      className="bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 text-sm"
                      onClick={() => setStatus(r.id, 'resolved')}
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 text-sm"
                    onClick={() => removeReport(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="text-lg font-semibold text-gray-800">Create Report</div>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
              placeholder="Title"
            />
            <select
              value={createForm.status}
              onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
            >
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={createForm.priority}
              onChange={(e) => setCreateForm(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="text"
              value={createForm.assignee}
              onChange={(e) => setCreateForm(prev => ({ ...prev, assignee: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
              placeholder="Assignee"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200" onClick={closeCreate}>
                Cancel
              </button>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200" onClick={saveCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
