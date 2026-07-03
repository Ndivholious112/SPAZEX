import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const DashboardCharts = ({ data = [] }) => {
  const labels = data.map((entry) => entry.label);
  const values = data.map((entry) => entry.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weekly Revenue',
        data: values,
        fill: true,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#d1d5db',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(15, 23, 42, 0.08)' },
        ticks: { color: '#6b7280', font: { size: 12 }, callback: (value) => `R${value / 1000}k` },
      },
    },
    elements: {
      line: { borderJoinStyle: 'round' },
    },
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-[0.16em]">Sales Trend</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Weekly Revenue</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#4f46e5]">
          <span>+18%</span>
          <span className="h-2 w-2 rounded-full bg-[#4f46e5]" />
          Compared to last week
        </div>
      </div>
      <div className="h-[320px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DashboardCharts;
