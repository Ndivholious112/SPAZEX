import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

const ForecastOverview = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <p className="text-sm text-gray-500">Predicted for Today</p>
      <div className="flex items-baseline gap-4">
        <p className="text-3xl font-bold text-gray-800">{formatCurrency(stats.revenue)}</p>
        <p className={`text-sm font-medium ${stats.change >= 0 ? 'text-green-600' : 'text-orange-600'}`}>{stats.changeDisplay}</p>
      </div>
      <p className="text-xs text-gray-500 mt-1">Expected units: <span className="font-semibold">{stats.units}</span></p>

      {stats.advice && (
        <div className="mt-3 bg-[#F0FDF4] border border-green-100 text-green-800 rounded-lg p-3 text-sm">
          <strong className="block font-semibold">Action</strong>
          <p className="mt-1">{stats.advice}</p>
        </div>
      )}
    </div>
  );
};

export default ForecastOverview;
