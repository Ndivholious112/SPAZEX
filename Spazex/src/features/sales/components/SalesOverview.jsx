import React from 'react';

const Sparkline = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-8">
      {data.map((d, i) => (
        <div key={i} className="w-2 bg-[#C4D9FF] rounded-t-sm" style={{ height: `${(d.value / max) * 100}%` }} />
      ))}
    </div>
  );
};

const SalesOverview = ({ stats, sparkData, loading }) => {
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Today's Sales</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-gray-800">{stats.today}</p>
            <p className={`text-sm font-medium ${stats.change >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {stats.changeDisplay}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Yesterday: {stats.yesterday} • Profit: <span className={stats.profit >= 0 ? 'text-green-700 font-semibold' : 'text-orange-700 font-semibold'}>{stats.profitDisplay}</span></p>
        </div>

        <div className="w-36">
          <Sparkline data={sparkData} />
        </div>
      </div>

      {/* Human readable advice */}
      {stats.advice && (
        <div className="mt-4 bg-[#FFF7ED] border border-orange-100 text-orange-800 rounded-lg p-3 text-sm">
          <strong className="block font-semibold">Advice</strong>
          <p className="mt-1">{stats.advice}</p>
        </div>
      )}
    </div>
  );
};

export default SalesOverview;
