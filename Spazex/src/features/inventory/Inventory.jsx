import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiAlertCircle, 
  FiCheckCircle,
  FiX,
  FiPackage,
  FiDollarSign,
  FiSearch,
  FiInbox,
  FiTrendingUp,
  FiBell,
  FiShoppingCart,
  FiZap,
  FiClock,
  FiCpu
} from 'react-icons/fi';

const Inventory = () => {
  // State Management with localStorage
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('spazex_inventory');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default data if no saved data
    return [
      { 
        id: 1, 
        name: 'Blue Ribbon Bread', 
        category: 'Bakery', 
        stock: 45, 
        price: 18.50,
        supplier: 'Blue Ribbon',
        lastUpdated: '2026-07-03'
      },
      { 
        id: 2, 
        name: 'Coca-Cola 2L', 
        category: 'Beverages', 
        stock: 32, 
        price: 22.00,
        supplier: 'Coca-Cola',
        lastUpdated: '2026-07-02'
      },
      { 
        id: 3, 
        name: 'Maize Meal 5kg', 
        category: 'Grains', 
        stock: 12, 
        price: 45.00,
        supplier: 'Ace',
        lastUpdated: '2026-07-01'
      },
      { 
        id: 4, 
        name: 'Cooking Oil 2L', 
        category: 'Cooking', 
        stock: 8, 
        price: 65.00,
        supplier: 'Sunflower',
        lastUpdated: '2026-07-03'
      },
      { 
        id: 5, 
        name: 'Sugar 2.5kg', 
        category: 'Groceries', 
        stock: 3, 
        price: 35.00,
        supplier: 'Selati',
        lastUpdated: '2026-07-02'
      }
    ];
  });

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('spazex_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form States
  const [currentProduct, setCurrentProduct] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState('damaged');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Add/Edit Form States
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    supplier: ''
  });

  // Get unique categories for filter
  const categories = ['All Categories', ...new Set(inventory.map(item => item.category))];

  // CRUD Operations
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: Math.max(0, ...inventory.map(p => p.id), 0) + 1,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setInventory([...inventory, product]);
    setShowAddModal(false);
    resetForm();
  };

  const editProduct = (updatedProduct) => {
    const updatedInventory = inventory.map(item => 
      item.id === updatedProduct.id 
        ? { ...updatedProduct, lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    );
    setInventory(updatedInventory);
    setShowEditModal(false);
    resetForm();
  };

  const deleteProduct = (productId) => {
    setInventory(inventory.filter(item => item.id !== productId));
    setShowDeleteModal(false);
    setCurrentProduct(null);
  };

  const adjustStock = (productId, quantity) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === productId) {
        let newStock = Math.max(0, item.stock - quantity);
        return {
          ...item,
          stock: newStock,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    setInventory(updatedInventory);
    setShowAdjustModal(false);
    setCurrentProduct(null);
    setAdjustmentQty(1);
  };

  // Modal Handlers
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      supplier: product.supplier
    });
    setShowEditModal(true);
  };

  const openAdjustModal = (product) => {
    setCurrentProduct(product);
    setAdjustmentQty(1);
    setAdjustmentReason('damaged');
    setShowAdjustModal(true);
  };

  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      stock: 0,
      price: 0,
      supplier: ''
    });
  };

  // Form Change Handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Status configuration with proper icons
  const getStockStatus = (stock) => {
    if (stock <= 5) return { 
      label: 'Critical', 
      color: 'text-red-700', 
      bg: 'bg-red-100',
      icon: FiX,
      iconColor: 'text-red-500'
    };
    if (stock <= 15) return { 
      label: 'Low', 
      color: 'text-orange-700', 
      bg: 'bg-orange-100',
      icon: FiAlertCircle,
      iconColor: 'text-orange-500'
    };
    if (stock <= 30) return { 
      label: 'Medium', 
      color: 'text-yellow-700', 
      bg: 'bg-yellow-100',
      icon: FiAlertCircle,
      iconColor: 'text-yellow-500'
    };
    return { 
      label: 'Good', 
      color: 'text-green-700', 
      bg: 'bg-green-100',
      icon: FiCheckCircle,
      iconColor: 'text-green-500'
    };
  };

  // Generate AI Recommendations based on inventory
  const getAIRecommendations = () => {
    const recommendations = [];
    const lowStockItems = inventory.filter(item => item.stock <= 15);
    const criticalItems = inventory.filter(item => item.stock <= 5);
    
    // Critical stock alert
    if (criticalItems.length > 0) {
      recommendations.push({
        type: 'critical',
        icon: FiX,
        iconColor: 'text-red-400',
        title: 'Critical Stock Alert',
        description: `${criticalItems.length} product(s) are critically low: ${criticalItems.map(i => i.name).join(', ')}`
      });
    }
    
    // Low stock recommendations
    if (lowStockItems.length > 0) {
      const topLow = lowStockItems.slice(0, 2);
      recommendations.push({
        type: 'restock',
        icon: FiShoppingCart,
        iconColor: 'text-orange-400',
        title: 'Restock Recommendations',
        description: `${topLow.map(i => `${i.name} (${i.stock} units)`).join(' • ')}`
      });
    }
    
    // High demand prediction (based on stock levels)
    const highDemandItems = inventory.filter(item => item.stock > 30);
    if (highDemandItems.length > 0) {
      recommendations.push({
        type: 'demand',
        icon: FiZap,
        iconColor: 'text-yellow-400',
        title: 'High Demand Items',
        description: `${highDemandItems.slice(0, 2).map(i => i.name).join(' • ')} selling fast. Consider increasing stock.`
      });
    }
    
    // Value optimization
    const highValueItems = inventory.filter(item => item.price * item.stock > 500);
    if (highValueItems.length > 0) {
      recommendations.push({
        type: 'value',
        icon: FiDollarSign,
        iconColor: 'text-green-400',
        title: 'High Value Items',
        description: `${highValueItems.slice(0, 2).map(i => i.name).join(' • ')} have significant inventory value.`
      });
    }
    
    // Time-based recommendation
    if (inventory.length > 0) {
      recommendations.push({
        type: 'time',
        icon: FiClock,
        iconColor: 'text-blue-400',
        title: 'Weekly Review',
        description: `Review your inventory performance. ${inventory.length} products in stock.`
      });
    }
    
    return recommendations;
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || selectedCategory === '' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.stock <= 15).length;
  const criticalStockItems = inventory.filter(item => item.stock <= 5).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiInbox className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start building your inventory by adding your first product. Track stock, manage suppliers, and grow your business!
      </p>
      <button 
        onClick={openAddModal}
        className="bg-[#C4D9FF] text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-[#C5BAFE] transition-all duration-300 flex items-center gap-2 mx-auto shadow-sm hover:shadow-md"
      >
        <FiPlus className="w-5 h-5" />
        Add Your First Product
      </button>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Consistent Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Never miss a sale again. Track your stock, get automatic alerts, and let our AI suggest what to order before you run out.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards - Only show if there are products */}
      {inventory.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <FiPackage className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems}</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                <FiAlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalStockItems}</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                <FiX className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">R{totalValue.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <FiDollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter - Only show if there are products */}
      {inventory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, categories, or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4D9FF] focus:border-transparent outline-none transition-all"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4D9FF] focus:border-transparent outline-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Inventory Table or Empty State */}
      {inventory.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-16">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products match your search</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                  className="mt-4 text-[#C4D9FF] hover:text-[#C5BAFE] font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map((item) => {
                      const status = getStockStatus(item.stock);
                      const StatusIcon = status.icon;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.supplier}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{item.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{item.stock} units</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-800">R{item.price.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                <StatusIcon className={`w-3.5 h-3.5 ${status.iconColor}`} />
                                {status.label}
                              </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openAdjustModal(item)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Adjust Stock"
                              >
                                <FiPackage className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => openEditModal(item)}
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => openDeleteModal(item)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AI Recommendations Panel - Now under the table */}
          <div className="bg-[#1E293B] text-white rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5" />
                AI Restock Intel
              </h3>
              <Link 
                to="/ai-coach"
                className="flex items-center gap-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-blue-600/20 hover:border-blue-600/40"
              >
                <FiCpu className="w-4 h-4" />
                Talk to AI Coach
              </Link>
            </div>
            
            {getAIRecommendations().length === 0 ? (
              <div className="text-center py-8">
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-300">Everything looks good!</p>
                <p className="text-sm text-gray-400 mt-1">No immediate actions needed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {getAIRecommendations().map((rec, index) => {
                  const RecIcon = rec.icon;
                  return (
                    <div key={index} className="bg-white/10 p-4 rounded-2xl border border-white/5 hover:bg-white/15 transition-all duration-200">
                      <div className="flex items-center gap-2 mb-1">
                        <RecIcon className={`w-5 h-5 ${rec.iconColor}`} />
                        <p className="text-sm font-semibold text-white">{rec.title}</p>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{rec.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                  placeholder="e.g., Bakery, Beverages"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                  placeholder="Supplier name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) *</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => addProduct(formData)}
                className="flex-1 bg-[#1E293B] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
                disabled={!formData.name || !formData.category}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Product</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) *</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => editProduct({ ...formData, id: currentProduct.id })}
                className="flex-1 bg-[#1E293B] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
                disabled={!formData.name || !formData.category}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && currentProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Adjust {currentProduct.name}
              </h3>
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock: <span className="font-bold text-gray-900">{currentProduct.stock} units</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select 
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                >
                  <option value="damaged">⚠️ Damaged / Expired</option>
                  <option value="stolen">🚫 Stolen / Lost</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  max={currentProduct.stock}
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Math.max(1, Math.min(currentProduct.stock, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-700">
                  <span className="font-bold">Warning:</span> This will reduce stock by {adjustmentQty} units
                </p>
                <p className="text-sm text-red-600 mt-1">
                  New stock will be: <span className="font-bold">{Math.max(0, currentProduct.stock - adjustmentQty)} units</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => adjustStock(currentProduct.id, adjustmentQty)}
                className="flex-1 bg-[#1E293B] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-bold">{currentProduct.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteProduct(currentProduct.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;