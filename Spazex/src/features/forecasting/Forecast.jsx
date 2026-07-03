import React from 'react';

const Forecast = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Demand Forecast</h1>
      <p className="text-gray-600 mt-2">View demand forecasts and predictions</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Today's Forecast</h3>
          <p className="text-gray-600 mt-2">No data available</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Weekly Trends</h3>
          <p className="text-gray-600 mt-2">No data available</p>
        </div>
      </div>
    </div>
  );
};

export default Forecast;