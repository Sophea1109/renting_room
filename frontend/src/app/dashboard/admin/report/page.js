"use client";

import React, { useEffect, useState } from "react";
import { FaFlag, FaUser, FaInfoCircle, FaClock } from "react-icons/fa";
import { request } from "@/utils/api"; // Ensure you use your existing request wrapper

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Use your consistent API request helper
      const response = await request("http://127.0.0.1:8000/api/admin/user-reports");
      setReports(response.data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a2a2b] to-[#0d3537] rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/20 min-h-[500px]">
      {/* HEADER */}
      <div className="p-8 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
            <FaFlag className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              User Reports
            </h3>
            <p className="text-emerald-300/70 text-sm">Review incoming reports and user feedback</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        {loading ? (
          <div className="text-center py-20 text-emerald-400">Loading reports...</div>
        ) : reports.length > 0 ? (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white/5 border border-emerald-500/20 p-6 rounded-xl hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <FaInfoCircle className="text-emerald-400" />
                    </div>
                    <h4 className="text-white font-semibold">{report.reason || "General Report"}</h4>
                  </div>
                  <span className="text-emerald-300/50 text-xs flex items-center gap-1">
                    <FaClock size={10} /> {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {report.details}
                </p>

                <div className="flex items-center gap-2 text-emerald-400/80 text-xs mt-4 pt-4 border-t border-emerald-500/10">
                  <FaUser size={12} />
                  <span>Reported by: {report.user?.name || "Anonymous User"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-emerald-300/50">
            <FaFlag className="text-4xl mx-auto mb-4 opacity-30" />
            <p>No reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
}