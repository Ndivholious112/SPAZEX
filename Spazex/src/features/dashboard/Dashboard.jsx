import React, { useState, useMemo } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiCheck, FiCreditCard, FiDollarSign, FiArrowUpRight, FiPackage, FiAlertTriangle, FiShield } from 'react-icons/fi';
import useInventory from '../../hooks/useInventory';
import useSales from '../../hooks/useSales';
import api from '../../services/api';
import { mutate } from 'swr';

const FIXED_DISCOUNT = 1.0;

const Dashboard = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cash'
  const [cashReceived, setCashReceived] = useState('');

  const toggleCart = () => setCartOpen(prev => !prev);

  const { inventory = [], update: updateInventoryItem } = useInventory();
  const { sales = [], add: addSale } = useSales();

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, { ...product, qty: 1 }];
    });
    // REMOVED: setCartOpen(true) so it doesn't force pop or drop down anymore
    setCheckoutSuccess(false);
  };

  const updateQty = (productId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    resetPaymentStates();
  };

  const resetPaymentStates = () => {
    setPaymentMethod('card');
    setCashReceived('');
  };

  const { subtotal, discount, finalTotal } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const disc = sub > 0 ? Math.min(sub, FIXED_DISCOUNT) : 0;
    return {
      subtotal: sub,
      discount: disc,
      finalTotal: Math.max(0, sub - disc),
    };
  }, [cartItems]);

  const changeDue = useMemo(() => {
    if (paymentMethod !== 'cash') return 0;
    const cash = parseFloat(cashReceived) || 0;
    return Math.max(0, cash - finalTotal);
  }, [cashReceived, finalTotal, paymentMethod]);

  const handleCheckout = () => {
    if (paymentMethod === 'cash') {
      const cash = parseFloat(cashReceived) || 0;
      if (cash < finalTotal) {
        alert('Insufficient cash amount provided!');
        return;
      }
    }

    // record sale and update inventory
    (async () => {
      try {
        const saleRecord = {
          items: cartItems,
          total: finalTotal,
          paymentMethod,
        };
        const sale = await addSale(saleRecord);
        // decrement inventory stocks
        for (const it of cartItems) {
          const inv = inventory.find((i) => i.id === it.id);
          if (inv) {
            const newStock = Math.max(0, (inv.stock || inv.qty || 0) - (it.qty || 0));
            await updateInventoryItem(inv.id, { stock: newStock });
          }
        }
        // create an invoice and refresh invoices listing
        try {
          const createdInv = await api.addInvoice({
            saleRef: sale.id,
            paymentMethod,
            amount: sale.total || 0,
            date: new Date().toLocaleDateString(),
            dueDate: '',
            status: paymentMethod === 'cash' ? 'Pending' : 'Paid'
          });
          console.debug('Invoice created', createdInv);
          setLastInvoiceId(createdInv.id);
          // fetch latest invoices and update SWR cache directly
          const latest = await api.getInvoices();
          mutate('invoices', latest, false);
          console.debug('Invoices cache updated', latest.length);
        } catch (e) {
          console.error('Failed to create invoice', e);
        }
      } catch (e) {
        console.error('Failed to record sale', e);
      }
      setCheckoutSuccess(true);
      setCartItems([]);
      resetPaymentStates();
      setCartOpen(false);
    })();
  };

  const totalCartItemsCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItems]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      <header className="border-b border-[#C4D9FF]/20 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your Spazex dashboard!</p>
        </div>

        {/* Cart Container Block */}
        <div className="mt-6 w-full">
          <button
            onClick={toggleCart}
            className={`w-full sm:w-auto relative bg-white border px-5 py-2.5 rounded-xl text-gray-700 hover:text-gray-900 transition-all shadow-sm flex items-center justify-center gap-2 font-medium cursor-pointer ${
              cartOpen ? 'border-[#C4D9FF] bg-[#E8F9FF]' : 'border-[#C4D9FF]/40 hover:bg-[#E8F9FF]'
            }`}
            aria-label="Toggle cart"
          >
            <FiShoppingBag className="w-5 h-5 text-gray-600" />
            <span>My Cart</span>
            {totalCartItemsCount > 0 && (
              <span className="bg-[#C4D9FF] text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCartItemsCount}
              </span>
            )}
          </button>

          {/* Inline Collapsible Cart - Only shows after clicking the button above */}
          {cartOpen && (
            <div className="mt-4 w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col transition-all duration-300">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-800">Cart Details</h2>
                  {totalCartItemsCount > 0 && (
                    <span className="bg-[#E8F9FF] text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalCartItemsCount} {totalCartItemsCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <FiShoppingBag className="w-8 h-8 text-gray-300" />
                  <p className="text-gray-500 text-xs">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Items list */}
                  <ul className="divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-2.5 flex justify-between items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 truncate">{item.name}</h4>
                          <span className="text-xs text-gray-500">R{item.price.toFixed(2)} each</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-md transition-colors cursor-pointer"
                            >
                              <FiMinus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-4 text-center text-xs font-semibold text-gray-800 select-none">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-md transition-colors cursor-pointer"
                            >
                              <FiPlus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <div className="text-right min-w-[50px]">
                            <span className="text-xs font-semibold text-gray-900">
                              R{(item.qty * item.price).toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Payment Method Selector */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-[#E8F9FF] border-[#C4D9FF] text-gray-800'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <FiCreditCard className="w-3.5 h-3.5" />
                        <span>Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          paymentMethod === 'cash'
                            ? 'bg-[#E8F9FF] border-[#C4D9FF] text-gray-800'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <FiDollarSign className="w-3.5 h-3.5" />
                        <span>Cash</span>
                      </button>
                    </div>

                    {/* Cash Tender Input Block */}
                    {paymentMethod === 'cash' && (
                      <div className="mt-2.5 bg-gray-50 p-2 rounded-lg border border-gray-100 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <label htmlFor="cashReceived" className="text-xs font-semibold text-gray-600">
                            Cash Handed:
                          </label>
                          <div className="relative rounded-md shadow-sm max-w-[95px]">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-xs">R</span>
                            </div>
                            <input
                              type="number"
                              id="cashReceived"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                              className="block w-full pl-5 pr-1.5 py-0.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C4D9FF] focus:border-[#C4D9FF] font-semibold text-gray-800"
                            />
                          </div>
                        </div>
                        {parseFloat(cashReceived) >= finalTotal && (
                          <div className="flex justify-between text-xs font-bold text-green-700 pt-1 border-t border-dashed border-gray-200">
                            <span>Change Due:</span>
                            <span>R{changeDue.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing Overview */}
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-800">R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>Discount:</span>
                      <span className="font-medium">-R{discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs text-gray-800 pt-1.5 border-t border-dashed border-gray-100">
                      <span>Total:</span>
                      <span className="text-sm text-gray-900">R{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Complete Order Action Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < finalTotal)}
                    className="mt-3 w-full bg-[#C5BAFF] hover:bg-[#C4D9FF] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-800 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-sm text-xs cursor-pointer"
                  >
                    Complete Order
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Success banner */}
      {checkoutSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
            <FiCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold">Order Completed Successfully!</h4>
            <p className="text-sm text-green-700">Thank you for your purchase.</p>
            {lastInvoiceId && (
              <p className="text-sm mt-1">
                Invoice created: <a href="/invoices" className="font-bold text-green-800 underline">{lastInvoiceId} — view invoices</a>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">R{(sales.reduce((s, x) => s + (x.total || x.amount || 0), 0)).toFixed(2)}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FiArrowUpRight className="w-4 h-4" />
              +14%
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-400">Daily spaza sales across maize, noodles, milk and beans.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">{sales.length}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              <FiPackage className="w-4 h-4" />
              Live
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-400">Orders being fulfilled from the spaza counter and takeaway window.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Low Stock Items</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">{(inventory.filter(i => (i.stock || i.qty || 0) <= 15)).length}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              <FiAlertTriangle className="w-4 h-4" />
              Urgent
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-400">Maize meal, soap and tea running low — restock the shelves quickly.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Total Products</h3>
              <p className="text-3xl font-bold text-gray-900 mt-3">{inventory.length}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              <FiShield className="w-4 h-4" />
              Solid
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-400">Strong margin on everyday essentials for the neighborhood shop.</p>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(inventory && inventory.length ? inventory : []).map((product) => (
          <article
            key={product.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 border border-gray-100 flex flex-col justify-between transition-all duration-300 group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E8F9FF] flex items-center justify-center text-gray-700 mb-4">
                <FiShoppingBag className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
              <p className="text-lg font-bold text-gray-800 mt-2">R{product.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="mt-6 w-full bg-[#C4D9FF] hover:bg-[#C5BAFF] text-gray-800 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              Add to Cart
            </button>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;