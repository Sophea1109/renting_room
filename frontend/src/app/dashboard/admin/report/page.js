"use client";

import React, { useEffect, useState } from "react";
import { FaFlag, FaUser, FaInfoCircle, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import { request } from "@/utils/api";

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await request("http://127.0.0.1:8000/api/admin/user-reports");
      setReports(response.data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS FUNCTION
  const handleAction = async (id, action) => {
    try {
      await request.post(`http://127.0.0.1:8000/api/admin/user-reports/${id}/action`, { action });
      
      // Update local state to show change immediately
      setReports((prev) => 
        prev.map((r) => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'dismissed' } : r)
      );
    } catch (error) {
      alert("Failed to process action.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/20 min-h-[500px]">
      {/* ... Header remains the same ... */}
      
      <div className="p-8">
        {loading ? (
          <div className="text-center py-20 text-emerald-400">Loading...</div>
        ) : reports.length > 0 ? (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white/5 border border-emerald-500/20 p-6 rounded-xl">
                {/* ... existing header and body content ... */}
                <p className="text-gray-300 text-sm mb-4">{report.details}</p>

                {/* ACTION BUTTONS */}
                <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10">
                  <span className="text-emerald-400/80 text-xs">
                    Reported by: {report.user?.name || "Anonymous"}
                  </span>
                  
                  {report.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction(report.id, 'approve')}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs transition"
                      >
                        <FaCheck size={10} /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(report.id, 'dismiss')}
                        className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/40 text-red-200 px-3 py-1 rounded text-xs transition"
                      >
                        <FaTimes size={10} /> Dismiss
                      </button>
                    </div>
                  ) : (
                    <span className="text-emerald-400 font-bold capitalize text-sm">{report.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-emerald-300/50">No reports found.</div>
        )}
      </div>
    </div>
  );
}