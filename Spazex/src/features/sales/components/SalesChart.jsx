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

const SalesChart = ({ data }) => {
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: values,
        fill: true,
        backgroundColor: 'rgba(196,217,255,0.3)',
        borderColor: '#C4D9FF',
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#C4D9FF',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, mode: 'index', intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280' },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { color: '#6B7280' },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-56">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales (last 7 days)</h3>
      <div className="h-40">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
