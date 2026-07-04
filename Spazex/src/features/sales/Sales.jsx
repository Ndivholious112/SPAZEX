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
  { id: 1, date: '2026-06-30', order: '#1001', customer: 'Thabo', amount: 111.0, status: 'Paid', productName: 'Blue Ribbon Bread', quantity: 6 },
  { id: 2, date: '2026-06-29', order: '#1002', customer: 'Lindiwe', amount: 66.0, status: 'Pending', productName: 'Coca-Cola 2L', quantity: 3 },
  { id: 3, date: '2026-06-28', order: '#1003', customer: 'Sizwe', amount: 225.0, status: 'Paid', productName: 'Maize Meal 5kg', quantity: 5 },
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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const cached = localStorage.getItem('salesRows');
      const parsed = cached ? JSON.parse(cached) : null;
      setRows(parsed && parsed.length ? parsed : defaultRows);
    } catch (e) {
      setRows(defaultRows);
    }

    // simulate fetch latency
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    try { localStorage.setItem('salesRows', JSON.stringify(rows)); } catch (e) {}
  }, [rows]);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  const stats = React.useMemo(() => {
    return {
      today: formatCurrency(total),
      yesterday: formatCurrency(total * 0.9),
      profit: total * 0.3,
      profitDisplay: formatCurrency(total * 0.3),
      change: 12,
      changeDisplay: '+12%',
      advice: rows.length ? `Your top items are selling steadily. Click "+ New Sale" to record new transactions.` : null,
    };
  }, [total, rows.length]);

  const addSale = (sale) => {
    setRows((r) => [sale, ...r]);
  };

  const deleteSale = (saleId) => {
    const saleToDelete = rows.find(r => r.id === saleId);
    if (!saleToDelete) return;

    if (window.confirm(`Are you sure you want to delete this sale for ${saleToDelete.customer}? This will restore stock to inventory.`)) {
      if (saleToDelete.productName && saleToDelete.quantity) {
        try {
          const cached = localStorage.getItem('spazex_inventory');
          if (cached) {
            let inventory = JSON.parse(cached);
            inventory = inventory.map(p => {
              if (p.name === saleToDelete.productName) {
                return { ...p, stock: p.stock + saleToDelete.quantity };
              }
              return p;
            });
            localStorage.setItem('spazex_inventory', JSON.stringify(inventory));
            window.dispatchEvent(new Event('spazex_inventory_updated'));
          }
        } catch (e) {
          console.error(e);
        }
      }

      setRows((prev) => prev.filter(r => r.id !== saleId));
    }
  };

  // Compute chartData dynamically from rows, falling back to defaultChart
  const chartData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = days[d.getDay()];
      const dateString = d.toISOString().split('T')[0];
      last7Days.push({ label, dateString, value: 0 });
    }

    rows.forEach(r => {
      const match = last7Days.find(day => day.dateString === r.date);
      if (match) {
        match.value += r.amount;
      }
    });

    const totalVal = last7Days.reduce((sum, d) => sum + d.value, 0);
    if (totalVal === 0) {
      return defaultChart;
    }
    return last7Days.map(({ label, value }) => ({ label, value }));
  }, [rows]);

  // Compute topSellers dynamically from rows
  const topSellers = React.useMemo(() => {
    const productMap = {};
    rows.forEach(r => {
      const pName = r.productName || 'Other';
      const qty = r.quantity || 1;
      const amt = r.amount || 0;
      if (!productMap[pName]) {
        productMap[pName] = { name: pName, units: 0, revenue: 0 };
      }
      productMap[pName].units += qty;
      productMap[pName].revenue += amt;
    });

    const sorted = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));

    if (sorted.length === 0) {
      return [
        { name: 'Bread', units: 24, revenue: 480, rank: 1 },
        { name: 'Milk', units: 18, revenue: 270, rank: 2 },
        { name: 'Eggs', units: 12, revenue: 180, rank: 3 },
      ];
    }
    return sorted;
  }, [rows]);

  // build alerts & boosters for ActionCenter
  const alerts = rows.length < 5 ? [{ title: 'Low Sales Volume', message: 'Sales are lower than usual. Try a promotion on basic staples.' }] : [];
  const boosters = [{ title: 'Bundle suggestion', message: 'People buying bread also buy milk. Try offering a small discount when bought together.' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative spx-sales">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <p className="text-gray-600 mt-2">Data-to-Action: see key numbers and next steps.</p>
        </div>
        <NewSale onAdd={addSale} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SalesOverview stats={stats} sparkData={chartData} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={chartData} />
            <SalesPieChart items={topSellers} />
          </div>

          <SalesTable rows={rows} onDelete={deleteSale} />
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