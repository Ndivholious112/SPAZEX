import React from 'react';
import ForecastOverview from './components/ForecastOverview';
import ForecastCoachTip from './components/ForecastCoachTip';
import ForecastChart from './components/ForecastChart';
import ForecastTable from './components/ForecastTable';
import ForecastSuggestions from './components/ForecastSuggestions';
import { formatCurrency } from '../../utils/formatters';
import WhatsAppFab from '../sales/components/WhatsAppFab';

const Forecast = () => {
  const [loading, setLoading] = React.useState(true);

  const history = [
    { label: 'Mon', value: 80 },
    { label: 'Tue', value: 90 },
    { label: 'Wed', value: 70 },
    { label: 'Thu', value: 100 },
    { label: 'Fri', value: 120 },
    { label: 'Sat', value: 150 },
    { label: 'Sun', value: 110 },
  ];

  const forecast = [
    { label: 'Mon', value: 95 },
    { label: 'Tue', value: 100 },
    { label: 'Wed', value: 90 },
    { label: 'Thu', value: 110 },
    { label: 'Fri', value: 130 },
    { label: 'Sat', value: 160 },
    { label: 'Sun', value: 120 },
  ];

  const rows = [
    { id: 1, name: 'Bread', predicted: 40, price: 20.0, suggestOrder: 20 },
    { id: 2, name: 'Milk', predicted: 30, price: 15.0, suggestOrder: 10 },
    { id: 3, name: 'Eggs', predicted: 25, price: 12.0, suggestOrder: 15 },
  ];

  const suggestions = [
    { title: 'Order Bread', text: 'Predicted demand is high for bread on Friday and Saturday. Order more stock.' },
    { title: 'Staffing', text: 'Consider extra staff on Saturday (predicted peak).' },
  ];

  React.useEffect(() => {
    // load cached rows/forecast if present
    try {
      const cachedRows = localStorage.getItem('forecastRows');
      if (cachedRows) setRows(JSON.parse(cachedRows));
    } catch {}

    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    try { localStorage.setItem('forecastRows', JSON.stringify(rows)); } catch (e) {}
  }, [rows]);

  const totalPredictedRevenue = rows.reduce((s, r) => s + r.predicted * r.price, 0);

  const stats = {
    revenue: totalPredictedRevenue,
    units: rows.reduce((s, r) => s + r.predicted, 0),
    change: 8,
    changeDisplay: '+8%',
    advice: 'Stock up on Bread for the weekend.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Demand Forecast</h1>
        <div className="text-sm text-gray-500">Estimated revenue: <strong>{formatCurrency(totalPredictedRevenue)}</strong></div>
      </div>

      <p className="text-gray-600 mt-2">User-friendly demand predictions and actionable suggestions.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ForecastCoachTip title="Weekend Outlook" tip="Predicted spike on Saturday — order staples early. Put combos near the till to sell more." />
          <ForecastOverview stats={stats} loading={loading} />

          <ForecastChart history={history} forecast={forecast} />

          <ForecastTable rows={rows} />
        </div>

        <div className="space-y-6">
          <ForecastSuggestions items={suggestions} />
        </div>
      </div>

      <WhatsAppFab message={'Hi, help with my forecast please.'} />
    </div>
  );
};

export default Forecast;