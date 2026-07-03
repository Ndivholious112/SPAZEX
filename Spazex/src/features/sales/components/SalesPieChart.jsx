import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#C4D9FF', '#E8F9FF', '#C5BAFF', '#FBCFE8', '#FFD7A8', '#CDEBB0'];

const SalesPieChart = ({ items = [] }) => {
  const labels = items.map((i) => i.name);
  const values = items.map((i) => i.units);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, values.length),
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom', labels: { color: '#374151' } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} units` } },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-56">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Share</h3>
      <div className="h-40">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesPieChart;
