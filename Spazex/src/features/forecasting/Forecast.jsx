import React, { useState, useEffect } from 'react';
import './Forecast.css';
import ForecastOverview from './components/ForecastOverview';
import ForecastCoachTip from './components/ForecastCoachTip';
import ForecastChart from './components/ForecastChart';
import ForecastTable from './components/ForecastTable';
import ForecastSuggestions from './components/ForecastSuggestions';
import { formatCurrency } from '../../utils/formatters';
import WhatsAppFab from '../sales/components/WhatsAppFab';
import { getInventory, getSales, saveInventory } from '../../services/api';
import { FiTrendingUp, FiCpu, FiTrendingDown, FiCheckCircle } from 'react-icons/fi';

const defaultHistory = [
  { label: 'Mon', value: 80 },
  { label: 'Tue', value: 90 },
  { label: 'Wed', value: 70 },
  { label: 'Thu', value: 100 },
  { label: 'Fri', value: 120 },
  { label: 'Sat', value: 150 },
  { label: 'Sun', value: 110 },
];

const Forecast = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [forecastModel, setForecastModel] = useState('exponential'); // naive, linear, exponential
  const [growthFactor, setGrowthFactor] = useState(5); // percent
  const [weekendMultiplier, setWeekendMultiplier] = useState(1.3); // float
  const [restockNotification, setRestockNotification] = useState('');

  // Load inventory and sales data
  const loadData = async () => {
    try {
      const inv = await getInventory();
      setInventory(inv || []);
    } catch (e) {
      console.error('Failed to load inventory', e);
      setInventory([]);
    }

    try {
      const salesData = await getSales();
      setSales(salesData || []);
    } catch (e) {
      console.error('Failed to load sales', e);
      setSales([]);
    }
  };

  useEffect(() => {
    loadData();
    const t = setTimeout(() => setLoading(false), 350);

    // Listen to inventory changes from other pages
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('spazex_inventory_updated', handleUpdate);

    return () => {
      clearTimeout(t);
      window.removeEventListener('spazex_inventory_updated', handleUpdate);
    };
  }, []);

  // One-click restock handler
  const handleRestock = async (productId, amount) => {
    if (amount <= 0) return;
    try {
      const inv = await getInventory();
      let productName = '';
      const updated = (inv || []).map(p => {
        if (p.id === productId) {
          productName = p.name;
          return { ...p, stock: p.stock + amount, lastUpdated: new Date().toISOString().split('T')[0] };
        }
        return p;
      });
      await saveInventory(updated);
      setInventory(updated);
      setRestockNotification(`Successfully ordered and restocked ${amount} units of ${productName}!`);
      setTimeout(() => setRestockNotification(''), 4000);
    } catch (e) {
      console.error('Failed to restock inventory', e);
    }
  };

  // Dynamically calculate predictions for the table
  const rows = React.useMemo(() => {
    return inventory.map(item => {
      // Find actual historical sales for this product
      const productSales = sales.filter(s => s.productName === item.name);
      const salesQty = productSales.reduce((sum, s) => sum + (s.quantity || 1), 0);

      // Establish base prediction: historical weekly sales or sensible categories fallback
      let baseWeekly = salesQty;
      if (baseWeekly === 0) {
        if (item.category === 'Bakery') baseWeekly = 30;
        else if (item.category === 'Beverages') baseWeekly = 25;
        else if (item.category === 'Grains') baseWeekly = 15;
        else if (item.category === 'Cooking') baseWeekly = 10;
        else baseWeekly = 12;
      }

      // Calculate model output
      let predicted = baseWeekly;
      if (forecastModel === 'naive') {
        predicted = baseWeekly;
      } else if (forecastModel === 'linear') {
        predicted = Math.ceil(baseWeekly * (1 + growthFactor / 100));
      } else if (forecastModel === 'exponential') {
        predicted = Math.ceil(baseWeekly * Math.pow(1 + growthFactor / 100, 1.2));
      }

      // Ensure a reasonable prediction
      predicted = Math.max(5, predicted);

      // Suggest order = predicted - current stock
      const suggestOrder = Math.max(0, predicted - item.stock);

      return {
        id: item.id,
        name: item.name,
        predicted,
        price: item.price,
        suggestOrder
      };
    });
  }, [inventory, sales, forecastModel, growthFactor]);

  // Aggregate stats
  const totalPredictedRevenue = rows.reduce((s, r) => s + r.predicted * r.price, 0);
  const totalUnits = rows.reduce((s, r) => s + r.predicted, 0);

  const stats = {
    revenue: totalPredictedRevenue,
    units: totalUnits,
    change: growthFactor,
    changeDisplay: `${growthFactor >= 0 ? '+' : ''}${growthFactor}%`,
    advice: totalUnits > 100 ? 'Predicted high demand! Stock up on top sellers early.' : 'Demand steady. Ensure standard stock levels.',
  };

  // Generate historical data chart (last 7 days) from actual sales, or defaultHistory
  const historyChart = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalSalesVal = sales.reduce((sum, s) => sum + s.amount, 0);
    if (totalSalesVal === 0) {
      return defaultHistory;
    }

    // Distribute actual sales
    const dayMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    sales.forEach(s => {
      try {
        const d = new Date(s.date);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        if (dayMap[dayLabel] !== undefined) {
          dayMap[dayLabel] += s.amount;
        }
      } catch {}
    });

    // Check if everything is 0
    const totalDayMapVal = Object.values(dayMap).reduce((a, b) => a + b, 0);
    if (totalDayMapVal === 0) return defaultHistory;

    return days.map(label => ({ label, value: Math.round(dayMap[label]) }));
  }, [sales]);

  // Generate forecast data chart (next 7 days) dynamically based on predicted revenue and weekend spike multiplier
  const forecastChart = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyBaseRevenue = totalPredictedRevenue / 7;

    // Distribute daily based on weekend spike
    return days.map(day => {
      const isWeekend = ['Fri', 'Sat', 'Sun'].includes(day);
      const multiplier = isWeekend ? weekendMultiplier : 0.85; // slightly lower weekday baseline
      return {
        label: day,
        value: Math.round(dailyBaseRevenue * multiplier)
      };
    });
  }, [totalPredictedRevenue, weekendMultiplier]);

  // Dynamically build smart recommendations/suggestions
  const suggestions = React.useMemo(() => {
    const list = [];
    // Find item with highest suggested order
    const sortedByOrder = [...rows].sort((a, b) => b.suggestOrder - a.suggestOrder);
    if (sortedByOrder[0] && sortedByOrder[0].suggestOrder > 0) {
      list.push({
        title: `Restock ${sortedByOrder[0].name}`,
        text: `Demand is predicted to reach ${sortedByOrder[0].predicted} units next week. We suggest restocking by ${sortedByOrder[0].suggestOrder} units.`
      });
    }

    // Add staffing suggestion based on weekend spike factor
    if (weekendMultiplier >= 1.3) {
      list.push({
        title: 'Adjust Weekend Staffing',
        text: 'A peak demand spike is expected on Friday and Saturday. Schedule extra helpers at the till to keep checkout lines fast.'
      });
    } else {
      list.push({
        title: 'Off-Peak Promotion',
        text: 'Forecasted weekend spike is low. Try introducing a weekend special combo to boost impulse buys.'
      });
    }

    // Add supplier advice
    list.push({
      title: 'Optimal Buying Windows',
      text: 'Order bakery items by Wednesday noon to lock in weekend deliveries and secure better wholesale pricing.'
    });

    return list;
  }, [rows, weekendMultiplier]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 spx-forecast">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Demand Forecast</h1>
          <p className="text-gray-600 mt-2">User-friendly demand predictions and actionable suggestions.</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase block tracking-wider font-bold">Estimated Weekly Revenue</span>
          <span className="text-2xl font-black text-blue-600">{formatCurrency(totalPredictedRevenue)}</span>
        </div>
      </div>

      {restockNotification && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
          <FiCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">{restockNotification}</span>
        </div>
      )}

      {/* Model Controls Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiCpu className="text-blue-500" />
          Interactive Forecasting Engine Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Forecasting Model</label>
            <select
              value={forecastModel}
              onChange={(e) => setForecastModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 bg-white focus:outline-none focus:border-[#7c8cff] text-sm"
            >
              <option value="naive">Historical (Naive Model)</option>
              <option value="linear">Linear Trend (Growth Adjusted)</option>
              <option value="exponential">Exponential (High Growth Projection)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Select the mathematical logic used to forecast weekly sales.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 flex justify-between">
              <span>Target Sales Growth</span>
              <span className="text-blue-600 font-bold">{growthFactor >= 0 ? '+' : ''}{growthFactor}%</span>
            </label>
            <input
              type="range"
              min="-20"
              max="50"
              value={growthFactor}
              onChange={(e) => setGrowthFactor(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#7c8cff]"
            />
            <p className="text-xs text-gray-400 mt-1">Adjust target weekly growth based on community events or paydays.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 flex justify-between">
              <span>Weekend Spike Multiplier</span>
              <span className="text-blue-600 font-bold">{weekendMultiplier}x</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={weekendMultiplier}
              onChange={(e) => setWeekendMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#7c8cff]"
            />
            <p className="text-xs text-gray-400 mt-1">Multiply weekend daily sales compared to average weekday sales.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ForecastCoachTip title="Weekend Outlook" tip="Predicted spike on Saturday — order staples early. Put combos near the till to sell more." />
          
          <ForecastOverview stats={stats} loading={loading} />

          <ForecastChart history={historyChart} forecast={forecastChart} />

          <ForecastTable rows={rows} onRestock={handleRestock} />
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