import React from 'react';

const ForecastCoachTip = ({ title, tip }) => {
  return (
    <div className="bg-[#FEF3C7] border border-yellow-100 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-yellow-800">{title}</p>
          <p className="mt-1 text-sm text-yellow-900">{tip}</p>
        </div>
        <div className="hidden sm:block">
          <button
            onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(`Hi, can you help me with my forecast?`))}
            className="bg-yellow-600 text-white px-3 py-2 rounded-lg font-semibold"
          >
            Ask Coach
          </button>
        </div>
      </div>
      <div className="block sm:hidden mt-3">
        <button
          onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(`Hi, can you help me with my forecast?`))}
          className="w-full bg-yellow-600 text-white px-3 py-2 rounded-lg font-semibold"
        >
          Ask Coach
        </button>
      </div>
    </div>
  );
};

export default ForecastCoachTip;
