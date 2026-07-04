import React from 'react';
import './Sales.css';
import SalesOverview from './components/SalesOverview';
import SalesChart from './components/SalesChart';
import SalesTable from './components/SalesTable';
import NewSale from './NewSale';
import ActionCenter from './components/ActionCenter';
import TopSellers from './components/TopSellers';
import SalesPieChart from './components/SalesPieChart';
import WhatsAppFab from './components/WhatsAppFab';
import { formatCurrency } from '../../utils/formatters';

const defaultRows = [
  { id: 1, date: '2026-06-30', order: '#1001', customer: 'Thabo', amount: 125.0, status: 'Paid' },
  { id: 2, date: '2026-06-29', order: '#1002', customer: 'Lindiwe', amount: 76.5, status: 'Pending' },
  { id: 3, date: '2026-06-28', order: '#1003', customer: 'Sizwe', amount: 240.0, status: 'Paid' },
];

const defaultChart = [
  { label: 'Mon', value: 120 },
  { label: 'Tue', value: 80 },
  { label: 'Wed', value: 140 },
  { label: 'Thu', value: 60 },
  { label: 'Fri', value: 180 },
  { label: 'Sat', value: 200 },
  { label: 'Sun', value: 90 },
];

const Sales = () => {
  const [rows, setRows] = React.useState([]);
  const [chartData, setChartData] = React.useState(defaultChart);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const cached = localStorage.getItem('salesRows');
      const parsed = cached ? JSON.parse(cached) : null;
      setRows(parsed && parsed.length ? parsed : defaultRows);
    } catch (e) {
      setRows(defaultRows);
    }

    const cachedChart = localStorage.getItem('salesChart');
    if (cachedChart) {
      try { setChartData(JSON.parse(cachedChart)); } catch { setChartData(defaultChart); }
    }

    // simulate fetch latency
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    try { localStorage.setItem('salesRows', JSON.stringify(rows)); } catch (e) {}
  }, [rows]);

  React.useEffect(() => {
    try { localStorage.setItem('salesChart', JSON.stringify(chartData)); } catch (e) {}
  }, [chartData]);

  const total = rows.reduce((s, r) => s + r.amount, 0);
  const stats = {
    today: formatCurrency(total),
    yesterday: formatCurrency(total * 0.9),
    profit: total * 0.3,
    profitDisplay: formatCurrency(total * 0.3),
    change: 10, // placeholder percent
    changeDisplay: '+10%',
    advice: rows.length ? `Your top item is selling steadily. Consider a bundle to increase basket size.` : null,
  };

  const addSale = (sale) => {
    setRows((r) => [sale, ...r]);
  };

  // build alerts & boosters for ActionCenter
  const alerts = rows.length < 5 ? [{ title: 'Low Sales Volume', message: 'Sales are lower than usual. Try a promotion on basic staples.' }] : [];
  const boosters = [{ title: 'Bundle suggestion', message: 'People buying bread also buy milk. Try offering a small discount when bought together.' }];

  const topSellers = [
    { name: 'Bread', units: 24, revenue: 480, rank: 1 },
    { name: 'Milk', units: 18, revenue: 270, rank: 2 },
    { name: 'Eggs', units: 12, revenue: 180, rank: 3 },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 relative spx-sales">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
        <NewSale onAdd={addSale} />
      </div>

      <p className="text-gray-600 mt-2">Data-to-Action: see key numbers and next steps.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SalesOverview stats={stats} sparkData={chartData} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={chartData} />
            <SalesPieChart items={topSellers} />
          </div>

          <SalesTable rows={rows} />
        </div>

        <div className="space-y-6">
          <TopSellers items={topSellers} />
          <ActionCenter alerts={alerts} boosters={boosters} />
        </div>
      </div>

      <WhatsAppFab message={'Hi, I need help understanding my sales dashboard.'} />
    </div>
  );
};

export default Sales;