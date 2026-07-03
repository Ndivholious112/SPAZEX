import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const ForecastChart = ({ history = [], forecast = [] }) => {
  const labels = [...history.map((d) => d.label), ...forecast.map((d) => d.label)];
  const historyVals = history.map((d) => d.value);
  const forecastVals = Array(history.length).fill(null).concat(forecast.map((d) => d.value));

  const data = {
    labels,
    datasets: [
      {
        label: 'History',
        data: historyVals.concat(Array(forecast.length).fill(null)),
        borderColor: '#94A3B8',
        backgroundColor: 'rgba(148,163,184,0.1)',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Forecast',
        data: forecastVals,
        borderColor: '#C4D9FF',
        backgroundColor: 'rgba(196,217,255,0.25)',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { grid: { display: false }, ticks: { color: '#6B7280' } }, y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6B7280' } } },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-56">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Forecast (next 7 days)</h3>
      <div className="h-40">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ForecastChart;
