import React, { useState, useMemo } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiCheck, FiCreditCard, FiDollarSign, FiArrowUpRight, FiPackage, FiAlertTriangle, FiShield, FiImage } from 'react-icons/fi';
import useInventory from '../../hooks/useInventory';
import useSales from '../../hooks/useSales';
import api from '../../services/api';
import { mutate } from 'swr';

// Import products data for image lookup
import productsData from '../../data/products.json';

const FIXED_DISCOUNT = 0.0; // discount removed

// Helper function to get image from products data by keyword matching
const getProductImage = (productName) => {
  if (!productName) return '';
  if (!productsData || productsData.length === 0) return '';
  
  const searchTerm = productName.toLowerCase().trim();
  const matchedProduct = productsData.find(p => {
    const productNameLower = p.name.toLowerCase();
    if (productNameLower.includes(searchTerm)) return true;
    if (searchTerm.includes(productNameLower)) return true;
    return false;
  });
  
  return matchedProduct ? matchedProduct.image : '';
};

// Helper function to get initials from product name
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
};

// Helper function to get a consistent color based on product name
const getPlaceholderColor = (name) => {
  if (!name) return 'bg-gray-200 text-gray-500';
  
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
    'bg-green-100 text-green-600',
    'bg-yellow-100 text-yellow-600',
    'bg-red-100 text-red-600',
    'bg-indigo-100 text-indigo-600',
    'bg-teal-100 text-teal-600',
    'bg-orange-100 text-orange-600',
    'bg-cyan-100 text-cyan-600'
  ];
  
  // Use the sum of character codes to get a consistent index
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

// Helper function to render product image with placeholder
const renderProductImage = (product, size = 'large') => {
  const imageUrl = product.image || getProductImage(product.name);
  
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-full h-28 xs:h-32 sm:h-40 md:h-48 lg:h-52',
    cart: 'w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12'
  };
  
  const imageSize = sizeClasses[size] || sizeClasses.large;
  const initials = getInitials(product.name);
  const colorClass = getPlaceholderColor(product.name);
  
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={product.name}
        className={`${imageSize} object-cover ${size === 'large' ? 'rounded-t-2xl' : 'rounded-xl'}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          const fallback = document.createElement('div');
          fallback.className = `${imageSize} ${colorClass} ${size === 'large' ? 'rounded-t-2xl' : 'rounded-xl'} flex items-center justify-center font-semibold text-lg xs:text-xl sm:text-2xl`;
          fallback.textContent = initials;
          parent.appendChild(fallback);
        }}
      />
    );
  }
  
  // Show initials placeholder
  return (
    <div className={`${imageSize} ${colorClass} ${size === 'large' ? 'rounded-t-2xl' : 'rounded-xl'} flex items-center justify-center font-semibold text-lg xs:text-xl sm:text-2xl`}>
      {initials}
    </div>
  );
};

const Dashboard = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('card');
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
    const disc = 0;
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

    (async () => {
      try {
        const saleRecord = {
          items: cartItems,
          total: finalTotal,
          paymentMethod,
        };
        const sale = await addSale(saleRecord);
        for (const it of cartItems) {
          const inv = inventory.find((i) => i.id === it.id);
          if (inv) {
            const newStock = Math.max(0, (inv.stock || inv.qty || 0) - (it.qty || 0));
            await updateInventoryItem(inv.id, { stock: newStock });
          }
        }
        try {
          const createdInv = await api.addInvoice({
            saleRef: sale.id,
            paymentMethod,
            amount: sale.total || 0,
            date: new Date().toLocaleDateString(),
            dueDate: '',
            status: paymentMethod === 'cash' ? 'Pending' : 'Paid'
          });
          setLastInvoiceId(createdInv.id);
          const latest = await api.getInvoices();
          mutate('invoices', latest, false);
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
    <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 md:py-12 min-h-screen">
      
      <header className="border-b border-[#C4D9FF]/20 pb-4 xs:pb-5 sm:pb-6 mb-6 xs:mb-7 sm:mb-8">
        <div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm xs:text-base text-gray-600 mt-1 sm:mt-2">Welcome to your Spazex dashboard!</p>
        </div>

        {/* Cart Container Block */}
        <div className="mt-4 xs:mt-5 sm:mt-6 w-full">
          <button
            onClick={toggleCart}
            className={`w-full sm:w-auto relative bg-white border px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl text-gray-700 hover:text-gray-900 transition-all shadow-sm flex items-center justify-center gap-1.5 xs:gap-2 font-medium cursor-pointer text-sm xs:text-base ${
              cartOpen ? 'border-[#C4D9FF] bg-[#E8F9FF]' : 'border-[#C4D9FF]/40 hover:bg-[#E8F9FF]'
            }`}
            aria-label="Toggle cart"
          >
            <FiShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
            <span>My Cart</span>
            {totalCartItemsCount > 0 && (
              <span className="bg-[#C4D9FF] text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCartItemsCount}
              </span>
            )}
          </button>

          {/* Inline Collapsible Cart */}
          {cartOpen && (
            <div className="mt-3 xs:mt-4 w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-3 xs:p-4 sm:p-5 flex flex-col transition-all duration-300">
              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-3 xs:mb-4 border-b pb-2 xs:pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm xs:text-base font-bold text-gray-800">Cart Details</h2>
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
                <div className="py-6 xs:py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <FiShoppingBag className="w-8 h-8 text-gray-300" />
                  <p className="text-gray-500 text-xs">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-50 max-h-48 xs:max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-2 xs:py-2.5 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-3">
                        <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0 w-full xs:w-auto">
                          {renderProductImage(item, 'cart')}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-gray-900 truncate">{item.name}</h4>
                            <span className="text-xs text-gray-500">R{item.price.toFixed(2)} each</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full xs:w-auto justify-between xs:justify-end">
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

                          <div className="text-right min-w-[45px] xs:min-w-[50px]">
                            <span className="text-xs font-semibold text-gray-900">
                              R{(item.qty * item.price).toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

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

                    {paymentMethod === 'cash' && (
                      <div className="mt-2.5 bg-gray-50 p-2 rounded-lg border border-gray-100 space-y-1.5">
                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 xs:gap-2">
                          <label htmlFor="cashReceived" className="text-xs font-semibold text-gray-600">
                            Cash Handed:
                          </label>
                          <div className="relative rounded-md shadow-sm w-full xs:max-w-[95px]">
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

                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-800">R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs text-gray-800 pt-1.5 border-t border-dashed border-gray-100">
                      <span>Total:</span>
                      <span className="text-sm text-gray-900">R{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < finalTotal)}
                    className="mt-3 w-full bg-[#C5BAFF] hover:bg-[#C4D9FF] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-800 py-2 xs:py-2.5 rounded-xl font-bold transition-all duration-300 shadow-sm text-xs cursor-pointer"
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
        <div className="mb-6 xs:mb-7 sm:mb-8 p-3 xs:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 xs:gap-3 text-green-800">
          <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
            <FiCheck className="w-4 h-4 xs:w-5 xs:h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm xs:text-base">Order Completed Successfully!</h4>
            <p className="text-xs xs:text-sm text-green-700">Thank you for your purchase.</p>
            {lastInvoiceId && (
              <p className="text-xs mt-1">
                Invoice created: <a href="/invoices" className="font-bold text-green-800 underline">{lastInvoiceId} — view invoices</a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 mb-6 xs:mb-7 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs xs:text-sm text-gray-500">Total Revenue</p>
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">R{(sales.reduce((s, x) => s + (x.total || x.amount || 0), 0)).toFixed(2)}</p>
            </div>
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <FiDollarSign className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs xs:text-sm text-gray-500">Total Orders</p>
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{sales.length}</p>
            </div>
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <FiShoppingBag className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs xs:text-sm text-gray-500">Low Stock</p>
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-orange-600">{(inventory.filter(i => (i.stock || i.qty || 0) <= 15)).length}</p>
            </div>
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <FiAlertTriangle className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs xs:text-sm text-gray-500">Total Products</p>
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-violet-600">{inventory.length}</p>
            </div>
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
              <FiPackage className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <main className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
        {(inventory && inventory.length ? inventory : []).map((product) => (
          <article
            key={product.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#E8F9FF] to-[#C4D9FF]/10">
              {renderProductImage(product, 'large')}
              <div className="absolute top-1.5 xs:top-2 right-1.5 xs:right-2 bg-white/90 backdrop-blur-sm px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-semibold text-gray-700 shadow-sm">
                {product.stock || 0} in stock
              </div>
            </div>
            
            <div className="p-2.5 xs:p-3 sm:p-4 flex flex-col flex-1">
              <div>
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 min-h-[32px] xs:min-h-[36px] sm:min-h-[40px]">{product.name}</h3>
                <p className="text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1 truncate">{product.brand || product.supplier || ''}</p>
              </div>
              
              <div className="mt-2 xs:mt-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-0">
                <p className="text-base xs:text-lg sm:text-xl font-bold text-gray-800">R{product.price.toFixed(2)}</p>
                <span className={`text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full ${
                  (product.stock || 0) <= 5 ? 'bg-red-100 text-red-700' :
                  (product.stock || 0) <= 15 ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {(product.stock || 0) <= 5 ? 'Low Stock' :
                   (product.stock || 0) <= 15 ? 'Running Low' :
                   'In Stock'}
                </span>
              </div>
              
              <button
                onClick={() => addToCart(product)}
                disabled={(product.stock || 0) <= 0}
                className={`mt-2 xs:mt-3 sm:mt-4 w-full py-1.5 xs:py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer text-xs xs:text-sm ${
                  (product.stock || 0) <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#C4D9FF] hover:bg-[#C5BAFF] text-gray-800'
                }`}
              >
                {(product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;