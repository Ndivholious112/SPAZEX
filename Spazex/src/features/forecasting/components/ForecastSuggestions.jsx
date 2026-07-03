import React from 'react';

const SuggestionCard = ({ title, text }) => (
  <div className="rounded-lg p-4 shadow-sm border border-gray-100 bg-white">
    <p className="font-semibold text-gray-800">{title}</p>
    <p className="text-sm text-gray-600 mt-2">{text}</p>
  </div>
);

const ForecastSuggestions = ({ items = [] }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold">Suggestions</h3>
    <div className="grid grid-cols-1 gap-3">
      {items.length ? items.map((it, i) => <SuggestionCard key={i} title={it.title} text={it.text} />) : <SuggestionCard title="No suggestions" text="Everything looks normal." />}
    </div>
  </div>
);

export default ForecastSuggestions;
