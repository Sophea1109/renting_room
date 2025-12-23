// components/admin/AnalyticsChart.jsx
'use client';

import { useEffect, useRef } from 'react';

export default function AnalyticsChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    // This is a mock implementation. In a real app, use Chart.js or Recharts
    const canvas = chartRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Mock chart drawing
      const data = [30, 45, 60, 75, 90, 75, 60, 45, 30, 45, 60, 75];
      const padding = 40;
      const width = canvas.width - padding * 2;
      const height = canvas.height - padding * 2;
      const step = width / (data.length - 1);
      
      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding - (data[0] / 100 * height));
      
      data.forEach((value, index) => {
        const x = padding + (index * step);
        const y = canvas.height - padding - (value / 100 * height);
        ctx.lineTo(x, y);
      });
      
      ctx.strokeStyle = '#4361ee';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Fill area under line
      ctx.lineTo(padding + (data.length - 1) * step, canvas.height - padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.closePath();
      ctx.fillStyle = 'rgba(67, 97, 238, 0.1)';
      ctx.fill();
    }
  }, []);

  return (
    <div className="analytics-chart">
      <div className="chart-header">
        <h3>Analytics Overview</h3>
        <select className="time-select">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef} width="400" height="200"></canvas>
      </div>
      <div className="chart-stats">
        <div className="chart-stat">
          <span className="stat-label">Avg. Daily Users</span>
          <span className="stat-value">1,234</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Growth Rate</span>
          <span className="stat-value">+12.5%</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Peak Hours</span>
          <span className="stat-value">2-4 PM</span>
        </div>
      </div>
    </div>
  );
}