import React from 'react';

const Sales = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
        <button className="bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">
          + New Sale
        </button>
      </div>
      <p className="text-gray-600 mt-2">Track your sales here...</p>
      
      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6">
          <p className="text-gray-500 text-center">No sales recorded yet</p>
        </div>
      </div>
    </div>
  );
};

export default Sales;