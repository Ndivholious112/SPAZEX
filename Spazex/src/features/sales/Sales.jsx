import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SalesOverview from './components/SalesOverview';
import SalesChart from './components/SalesChart';
import SalesTable from './components/SalesTable';
import NewSale from './NewSale';
import ActionCenter from './components/ActionCenter';
import TopSellers from './components/TopSellers';
import SalesPieChart from './components/SalesPieChart';
import WhatsAppFab from './components/WhatsAppFab';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const defaultChart = [
  { label: 'Mon', value: 0 },
  { label: 'Tue', value: 0 },
  { label: 'Wed', value: 0 },
  { label: 'Thu', value: 0 },
  { label: 'Fri', value: 0 },
  { label: 'Sat', value: 0 },
  { label: 'Sun', value: 0 },
];

const Sales = () => {
  const { user, isAuthenticated } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    shopName: '',
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    bestDay: ''
  });

  // Load sales data for the logged-in user
  useEffect(() => {
    let mounted = true;

    const loadSales = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // Get sales for the current user
        const sales = await api.getSales(user.uid);
        if (!mounted) return;
        setRows(sales || []);
        
        // Calculate user stats
        if (sales && sales.length > 0) {
          const total = sales.reduce((s, r) => s + (r.amount || 0), 0);
          const orders = sales.length;
          const avg = orders > 0 ? total / orders : 0;
          
          // Find best day
          const dayCount = {};
          sales.forEach(sale => {
            if (sale.date) {
              const day = new Date(sale.date).toLocaleDateString('en-US', { weekday: 'long' });
              dayCount[day] = (dayCount[day] || 0) + 1;
            }
          });
          let bestDay = 'N/A';
          let maxCount = 0;
          for (const [day, count] of Object.entries(dayCount)) {
            if (count > maxCount) {
              maxCount = count;
              bestDay = day;
            }
          }
          
          setUserStats({
            shopName: user.shopName || user.displayName || 'My Shop',
            totalSales: total,
            totalOrders: orders,
            averageOrder: avg,
            bestDay: bestDay
          });
        } else {
          setUserStats({
            shopName: user.shopName || user.displayName || 'My Shop',
            totalSales: 0,
            totalOrders: 0,
            averageOrder: 0,
            bestDay: 'N/A'
          });
        }
      } catch (e) {
        console.error('Failed to load sales', e);
        if (!mounted) return;
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSales();

    return () => { mounted = false; };
  }, [user, isAuthenticated]);

  // Calculate total from rows
  const total = rows.reduce((s, r) => s + (r.amount || 0), 0);

  // Stats with user context
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = rows.filter(r => r.date === today);
    const todayTotal = todaySales.reduce((s, r) => s + (r.amount || 0), 0);
    
    // Calculate yesterday's sales
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdaySales = rows.filter(r => r.date === yesterdayStr);
    const yesterdayTotal = yesterdaySales.reduce((s, r) => s + (r.amount || 0), 0);
    
    const change = yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0;
    
    // Generate advice based on sales data
    let advice = null;
    if (rows.length === 0) {
      advice = 'Start recording your sales to get insights and grow your business! 🚀';
    } else if (rows.length < 5) {
      advice = `Your top items are selling steadily. Click "+ New Sale" to record new transactions.`;
    } else if (change > 20) {
      advice = `📈 Great job! Your sales are up ${Math.round(change)}% compared to yesterday. Keep it up!`;
    } else if (change < -20) {
      advice = `📉 Sales are down ${Math.round(Math.abs(change))}% from yesterday. Consider checking stock levels and running a promotion.`;
    } else {
      advice = `💡 Your sales are steady. Keep tracking and look for opportunities to upsell popular items.`;
    }

    return {
      today: formatCurrency(todayTotal),
      yesterday: formatCurrency(yesterdayTotal),
      profit: total * 0.3,
      profitDisplay: formatCurrency(total * 0.3),
      change: Math.round(change),
      changeDisplay: change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`,
      advice: advice,
      totalOrders: rows.length,
      averageOrder: rows.length > 0 ? formatCurrency(total / rows.length) : formatCurrency(0),
      shopName: userStats.shopName,
      bestDay: userStats.bestDay
    };
  }, [rows, total, userStats]);

  // Add sale with user context - FIXED to properly handle cart items
  const addSale = async (sale) => {
    if (!user) {
      alert('Please log in to record sales.');
      return;
    }

    try {
      // If sale has items (from cart), create individual sale records for each item
      if (sale.items && sale.items.length > 0) {
        const createdSales = [];
        
        for (const item of sale.items) {
          const saleWithUser = {
            ...sale,
            userId: user.uid,
            userEmail: user.email,
            shopName: user.shopName || user.displayName || 'My Shop',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            // Individual sale fields
            customer: sale.customer || 'Walk-in Customer',
            productName: item.name || 'Unknown Product',
            quantity: item.qty || 1,
            amount: (item.qty || 1) * (item.price || 0),
            price: item.price || 0,
            status: sale.paymentMethod === 'cash' ? 'Pending' : 'Paid',
            order: `#${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5)}`,
            total: sale.total || 0,
            paymentMethod: sale.paymentMethod || 'card'
          };
          
          const created = await api.addSale(saleWithUser);
          createdSales.push(created);
        }
        
        setRows((r) => [...createdSales, ...r]);
        
        // Update inventory after sale
        try {
          const inventory = await api.getInventory();
          if (inventory) {
            const updatedInventory = inventory.map(item => {
              const soldItem = sale.items.find(i => i.id === item.id);
              if (soldItem) {
                return { ...item, stock: Math.max(0, (item.stock || 0) - (soldItem.qty || 0)) };
              }
              return item;
            });
            await api.saveInventory(updatedInventory);
          }
        } catch (e) {
          console.error('Failed to update inventory', e);
        }
      } else {
        // Single sale (from NewSale component)
        const saleWithUser = {
          ...sale,
          userId: user.uid,
          userEmail: user.email,
          shopName: user.shopName || user.displayName || 'My Shop',
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString(),
          customer: sale.customer || 'Walk-in Customer',
          productName: sale.productName || 'Various Items',
          quantity: sale.quantity || 1,
          amount: sale.total || sale.amount || 0,
          status: sale.paymentMethod === 'cash' ? 'Pending' : 'Paid',
          order: `#${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5)}`
        };
        
        const created = await api.addSale(saleWithUser);
        setRows((r) => [created, ...r]);
      }
      
    } catch (e) {
      console.error('Failed to save sale', e);
      alert('Unable to save sale right now. Please try again.');
    }
  };

  // Delete sale with user validation
  const deleteSale = async (saleId) => {
    const saleToDelete = rows.find(r => r.id === saleId);
    if (!saleToDelete) return;

    // Only allow deletion if the sale belongs to the current user
    if (saleToDelete.userId && saleToDelete.userId !== user?.uid) {
      alert('You can only delete your own sales.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete this sale for ${saleToDelete.customer || 'customer'}? This will restore stock to inventory.`)) {
      if (saleToDelete.productName && saleToDelete.quantity) {
        try {
          const cached = await api.getInventory();
          const inventory = cached || [];
          const updatedInventory = inventory.map(p => {
            if (p.name === saleToDelete.productName) {
              return { ...p, stock: (p.stock || 0) + (saleToDelete.quantity || 0) };
            }
            return p;
          });
          await api.saveInventory(updatedInventory);
        } catch (e) {
          console.error('Failed to restore inventory', e);
        }
      }

      try {
        await api.removeSale(saleId);
      } catch (e) {
        console.error('Failed to delete sale', e);
      }

      setRows((prev) => prev.filter(r => r.id !== saleId));
    }
  };

  // Compute chartData dynamically from rows
  const chartData = useMemo(() => {
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
        match.value += r.amount || 0;
      }
    });

    const totalVal = last7Days.reduce((sum, d) => sum + d.value, 0);
    if (totalVal === 0) {
      return defaultChart;
    }
    return last7Days.map(({ label, value }) => ({ label, value }));
  }, [rows]);

  // Compute topSellers dynamically from rows - FIXED to handle multiple items
  const topSellers = useMemo(() => {
    const productMap = {};
    rows.forEach(r => {
      // Skip if productName is 'Other' or 'Various Items' or empty
      const pName = r.productName || 'Unknown';
      if (pName === 'Other' || pName === 'Various Items' || pName === 'Unknown') {
        // Try to extract product name from the sale
        if (r.items && r.items.length > 0) {
          r.items.forEach(item => {
            const itemName = item.name || 'Unknown';
            if (itemName !== 'Other' && itemName !== 'Various Items') {
              if (!productMap[itemName]) {
                productMap[itemName] = { name: itemName, units: 0, revenue: 0 };
              }
              productMap[itemName].units += item.qty || 1;
              productMap[itemName].revenue += (item.qty || 1) * (item.price || 0);
            }
          });
        }
        return;
      }
      
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
        { name: 'No sales yet', units: 0, revenue: 0, rank: 1 },
        { name: 'Start selling!', units: 0, revenue: 0, rank: 2 },
      ];
    }
    return sorted;
  }, [rows]);

  // Build alerts & boosters for ActionCenter based on user data
  const alerts = useMemo(() => {
    const alertList = [];
    if (rows.length < 3) {
      alertList.push({ 
        title: 'Low Sales Volume', 
        message: 'Sales are lower than usual. Try a promotion on basic staples or reach out to regular customers.' 
      });
    }
    if (stats.change < -20) {
      alertList.push({ 
        title: 'Sales Decline', 
        message: `Your sales are down ${Math.abs(stats.change)}% from yesterday. Consider checking stock and running a special offer.` 
      });
    }
    if (rows.length === 0) {
      alertList.push({ 
        title: 'No Sales Recorded', 
        message: 'You haven\'t recorded any sales yet. Start by adding your first sale to see insights!' 
      });
    }
    return alertList;
  }, [rows, stats.change]);

  const boosters = useMemo(() => {
    const boosterList = [];
    if (rows.length > 0) {
      boosterList.push({ 
        title: 'Bundle Suggestion', 
        message: 'People buying bread also buy milk. Try offering a small discount when bought together to increase sales.' 
      });
    }
    if (topSellers.length > 0 && topSellers[0].name !== 'No sales yet' && topSellers[0].name !== 'Start selling!') {
      boosterList.push({ 
        title: `Top Seller: ${topSellers[0].name}`, 
        message: `Your best-selling item is ${topSellers[0].name}. Consider promoting it or bundling it with other products.` 
      });
    }
    return boosterList;
  }, [rows, topSellers]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#C4D9FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Please Log In</h3>
          <p className="text-gray-500">You need to be logged in to view your sales data.</p>
        </div>
      </div>
    );
  }

  // Welcome message with user name
  const welcomeMessage = user?.displayName 
    ? `Welcome back, ${user.displayName}!` 
    : `Welcome to your Sales Dashboard!`;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 relative spx-sales">
      {/* User Welcome Banner */}
      {user && (
        <div className="bg-gradient-to-r from-[#E8F9FF] to-[#C4D9FF]/30 rounded-2xl p-4 mb-6 border border-[#C4D9FF]/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                👋 {welcomeMessage}
              </h2>
              <p className="text-sm text-gray-600">
                {userStats.shopName} • {rows.length} total sales • Best day: {userStats.bestDay}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/80 px-3 py-1 rounded-full text-gray-700">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <p className="text-gray-600 mt-2">Data-to-Action: see key numbers and next steps.</p>
        </div>
        <NewSale onAdd={addSale} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SalesOverview 
            stats={stats} 
            sparkData={chartData} 
            loading={loading} 
            userName={user?.displayName}
          />

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

      <WhatsAppFab message={`Hi, I need help understanding my sales dashboard. I'm from ${userStats.shopName}.`} />
    </div>
  );
};

export default Sales;