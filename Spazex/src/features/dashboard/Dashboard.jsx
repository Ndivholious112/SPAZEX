import React from 'react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your Spazex dashboard!</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">R0.00</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm text-gray-500">Profit Margin</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">0%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;