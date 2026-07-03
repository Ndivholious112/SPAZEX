import React from 'react';

const Card = ({ title, children, tone = 'neutral' }) => {
  const toneClass = tone === 'alert' ? 'bg-[#FFF7ED] text-orange-800 border-orange-100' : 'bg-white';
  return (
    <div className={`rounded-lg p-4 shadow-sm border ${tone === 'alert' ? 'border-orange-100' : 'border-gray-100'} ${toneClass}`}>
      <p className="font-semibold text-gray-800">{title}</p>
      <div className="mt-2 text-sm text-gray-600">{children}</div>
    </div>
  );
};

const ActionCenter = ({ alerts = [], boosters = [] }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Needs Attention</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.length ? alerts.map((a, i) => (
            <Card key={i} title={a.title} tone="alert">{a.message}</Card>
          )) : (<Card title="All good">No urgent issues detected.</Card>)}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Profit Boosters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {boosters.length ? boosters.map((b, i) => (
            <Card key={i} title={b.title}>{b.message}</Card>
          )) : (<Card title="Suggestions">We'll suggest combos and promotions here.</Card>)}
        </div>
      </div>
    </div>
  );
};

export default ActionCenter;
