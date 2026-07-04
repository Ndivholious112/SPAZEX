import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const NewSale = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('Paid');
  const [error, setError] = useState('');

  // Load inventory from current user storage
  useEffect(() => {
    if (!open) return;
    setError('');

    const loadInventory = async () => {
      try {
        const items = await api.getInventory();
        setProducts(items || []);
        if (items && items.length > 0) {
          setSelectedProductId(items[0].id.toString());
        }
      } catch (e) {
        console.error('Failed to load inventory for sale', e);
      }
    };

    loadInventory();
  }, [open]);

  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
  const price = selectedProduct ? selectedProduct.price : 0;
  const stock = selectedProduct ? selectedProduct.stock : 0;
  const totalAmount = (price * quantity).toFixed(2);

  // Added 'async' right here to allow the use of 'await' inside the submit flow
  const submit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Please select a product.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (quantity > stock) {
      setError(`Insufficient stock. Only ${stock} items available.`);
      return;
    }

    // Deduct stock in user-scoped inventory storage
    try {
      const inventory = await api.getInventory();
      const updatedInventory = (inventory || []).map(p => {
        if (p.id === selectedProduct.id) {
          return { ...p, stock: Math.max(0, p.stock - quantity) };
        }
        return p;
      });
      await api.saveInventory(updatedInventory);
    } catch (e) {
      console.error('Failed to update inventory after sale', e);
    }

    onAdd && onAdd({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      order: `#${Math.floor(Math.random() * 9000) + 1000}`,
      customer: customer.trim() || 'Walk-in Customer',
      amount: parseFloat(totalAmount),
      status: status,
      productName: selectedProduct.name,
      quantity: parseInt(quantity)
    });

    setCustomer('');
    setQuantity(1);
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">+ New Sale</button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={submit} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Record New Sale</h3>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 font-medium">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Customer Name</label>
              <input 
                value={customer} 
                onChange={(e) => setCustomer(e.target.value)} 
                placeholder="Walk-in Customer"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c8cff]" 
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Product</label>
              <select 
                value={selectedProductId} 
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 bg-white focus:outline-none focus:border-[#7c8cff]"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (R{p.price.toFixed(2)} - Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={stock}
                  value={quantity} 
                  onChange={(e) => {
                    setQuantity(Math.max(1, parseInt(e.target.value) || 0));
                    setError('');
                  }} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#7c8cff]" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 bg-white focus:outline-none focus:border-[#7c8cff]"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Total Price</span>
                <span className="text-2xl font-black text-gray-800">R {totalAmount}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Unit Price: R{price.toFixed(2)}</span>
                <span className={`text-xs block font-semibold ${stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                  Stock Left: {stock}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setOpen(false)} 
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl bg-[#C4D9FF] text-gray-800 font-bold hover:bg-[#C5BAFE] transition-colors"
              >
                Complete Sale
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewSale;