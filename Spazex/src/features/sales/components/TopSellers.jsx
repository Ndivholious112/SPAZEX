import React from 'react';

const TopSellers = ({ items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold mb-3">Top Sellers</h3>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Img</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{it.name}</div>
              <div className="text-xs text-gray-500">{it.units} sold • R{it.revenue}</div>
            </div>
            <div className="text-sm text-gray-700">{it.rank}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellers;
