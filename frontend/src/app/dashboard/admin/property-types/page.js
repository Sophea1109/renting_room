"use client";

import React, { useState, useEffect } from "react";
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { fetchPropertyTypes, createPropertyType, updatePropertyType, deletePropertyType } from "@/utils/api";

export default function PropertyTypesDashboard() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTypeName, setNewTypeName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load All Property Types from Backend
  const loadTypes = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetchPropertyTypes();
      setTypes(response.data || response || []);
    } catch (err) {
      setErrorMessage(err.message || "Failed to load property types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  // Handle Create Submit
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    setActionLoading(true);
    setErrorMessage("");
    try {
      await createPropertyType(newTypeName.trim());
      setNewTypeName("");
      await loadTypes(); // Refresh list
    } catch (err) {
      setErrorMessage(err.message || "Failed to create property type");
    } finally {
      setActionLoading(false);
    }
  };

  // Setup inline edit mode
  const startEditing = (type) => {
    setEditingId(type.id);
    setEditingName(type.name);
  };

  // Handle Update Submit
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    setActionLoading(true);
    setErrorMessage("");
    try {
      await updatePropertyType(id, editingName.trim());
      setEditingId(null);
      await loadTypes();
    } catch (err) {
      setErrorMessage(err.message || "Failed to update property type");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Click
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property type?")) return;

    setActionLoading(true);
    setErrorMessage("");
    try {
      await deletePropertyType(id);
      await loadTypes();
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete property type");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 min-h-screen bg-[#061819] text-[#DAF1DE] antialiased">
      
      {/* Header Panel */}
      <div className="relative overflow-hidden mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] border border-emerald-500/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/30">
            <FiHome className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Properties Management
            </h1>
            <p className="text-emerald-300/60 text-sm mt-0.5">
              Configure, categorize, and update global property asset classifications.
            </p>
          </div>
        </div>
      </div>

      {/* Global Error Notice */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
          <FiAlertCircle className="shrink-0 text-base" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: Creator Control Panel */}
        <div className="bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] p-6 rounded-2xl border border-emerald-500/10 shadow-lg sticky top-6">
          <div className="mb-4">
            <h3 className="font-semibold text-white text-sm tracking-wider uppercase">
              Add New Classification
            </h3>
            <p className="text-emerald-300/50 text-xs mt-1">
              Create a fresh tier or umbrella group for listing management.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-emerald-300/70">Category Name</label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g., Townhouse, Studio, Loft"
                disabled={actionLoading}
                className="w-full px-3.5 py-2.5 bg-[#051617] border border-emerald-500/20 rounded-xl text-white placeholder-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-sm transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading || !newTypeName.trim()}
              className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#051617] disabled:text-emerald-900 font-medium text-sm rounded-xl text-white transition-all duration-200 shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2"
            >
              {actionLoading && !editingId ? <FiLoader className="animate-spin text-base" /> : <FiPlus className="text-base" />}
              Save Category
            </button>
          </form>
        </div>

        {/* RIGHT: Data Table Display */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] rounded-2xl border border-emerald-500/10 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3 text-emerald-300/60 text-sm">
              <FiLoader size={28} className="animate-spin text-emerald-400" />
              <span className="font-medium tracking-wide">Syncing data engine...</span>
            </div>
          ) : types.length === 0 ? (
            <div className="p-16 text-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#051617] flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <FiHome size={20} />
              </div>
              <p className="text-white font-medium text-sm">No configurations found</p>
              <p className="text-emerald-300/40 text-xs mt-1">
                Populate your inventory types using the setup menu on the left panel.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#051617]/60 border-b border-emerald-500/10 text-emerald-300/60 text-xs font-semibold tracking-wider uppercase">
                    <th className="px-6 py-4">Classification Details</th>
                    <th className="px-6 py-4 text-right">Actions Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10 text-sm">
                  {types.map((type) => (
                    <tr key={type.id} className="hover:bg-[#051617]/30 transition-colors duration-150 group">
                      <td className="px-6 py-4.5 font-medium text-emerald-100">
                        {editingId === type.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-3 py-1.5 bg-[#051617] border border-emerald-500/40 rounded-lg text-white text-sm outline-none w-full max-w-xs focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            autoFocus
                          />
                        ) : (
                          <span className="group-hover:text-white transition-colors">{type.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4.5 text-right vertical-align-middle">
                        {editingId === type.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleUpdate(type.id)}
                              disabled={actionLoading}
                              className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all duration-150 border border-emerald-500/30"
                              title="Commit Changes"
                            >
                              <FiCheck size={15} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 bg-[#051617] text-emerald-400/70 hover:bg-emerald-950 hover:text-white rounded-lg transition-all duration-150 border border-emerald-500/10"
                              title="Discard"
                            >
                              <FiX size={15} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2 opacity-90 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <button
                              onClick={() => startEditing(type)}
                              className="p-2 bg-[#051617]/80 text-emerald-300/70 hover:bg-emerald-600 hover:text-white rounded-lg transition-all duration-150 border border-emerald-500/10"
                              title="Modify Entry"
                            >
                              <FiEdit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(type.id)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-150 border border-red-500/20"
                              title="Remove Entry"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}