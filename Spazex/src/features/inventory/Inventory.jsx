import React, { useState, useRef } from 'react';
import useInventory from '../../hooks/useInventory';
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
  FiCpu,
  FiImage,
  FiChevronDown,
  FiMoreVertical,
  FiCamera,
  FiUpload,
  FiInfo,
  FiTrendingDown
} from 'react-icons/fi';

// Import products data from JSON file
import productsData from '../../data/products.json';

const Inventory = () => {
  // Use inventory hook (single source of truth)
  const { inventory, loading, add, update, remove } = useInventory();

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  
  // Form States
  const [currentProduct, setCurrentProduct] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState('damaged');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [duplicateProduct, setDuplicateProduct] = useState(null);
  
  // Add/Edit Form States
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    stock: 0,
    price: 0,
    costPrice: 0,
    supplier: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Get unique categories from products data
  const getAvailableCategories = () => {
    const categories = new Set();
    if (productsData && productsData.length > 0) {
      productsData.forEach(product => {
        if (product.category) {
          categories.add(product.category);
        }
      });
    }
    if (inventory && inventory.length > 0) {
      inventory.forEach(item => {
        if (item.category) {
          categories.add(item.category);
        }
      });
    }
    return ['', 'Others', ...Array.from(categories).sort()];
  };

  const availableCategories = getAvailableCategories();

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

  // Get unique categories for filter
  const filterCategories = ['All Categories', ...new Set((inventory || []).map(item => item.category))];

  // Check for duplicate product (case-insensitive)
  const checkDuplicate = (productName, excludeId = null) => {
    if (!productName) return null;
    
    const normalizedName = productName.toLowerCase().trim();
    return inventory.find(item => 
      item.name.toLowerCase().trim() === normalizedName && 
      (excludeId === null || item.id !== excludeId)
    );
  };

  // CRUD Operations
  const addProduct = async (newProduct) => {
    // Check for duplicate before adding
    const existing = checkDuplicate(newProduct.name);
    if (existing) {
      setDuplicateProduct(existing);
      setShowDuplicateAlert(true);
      // Close the add modal
      setShowAddModal(false);
      return;
    }

    // Use uploaded image if available, otherwise try to get from catalog
    const image = newProduct.image || getProductImage(newProduct.name);
    const product = {
      ...newProduct,
      image: image,
      lastUpdated: new Date().toISOString().split('T')[0],
      // Ensure costPrice is set, default to price if not provided
      costPrice: newProduct.costPrice || newProduct.price * 0.7 // Default 70% of selling price
    };
    await add(product);
    setShowAddModal(false);
    resetForm();
  };

  const editProduct = async (updatedProduct) => {
    // Check for duplicate excluding the current product
    const existing = checkDuplicate(updatedProduct.name, updatedProduct.id);
    if (existing) {
      setDuplicateProduct(existing);
      setShowDuplicateAlert(true);
      // Close the edit modal
      setShowEditModal(false);
      return;
    }

    // Use uploaded image if available, otherwise try to get from catalog
    const image = updatedProduct.image || getProductImage(updatedProduct.name);
    const changes = { 
      ...updatedProduct, 
      image: image,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    await update(updatedProduct.id, changes);
    setShowEditModal(false);
    resetForm();
  };

  const deleteProduct = async (productId) => {
    await remove(productId);
    setShowDeleteModal(false);
    setCurrentProduct(null);
  };

  const adjustStock = async (productId, quantity) => {
    const item = (inventory || []).find((i) => i.id === productId);
    if (!item) return;
    const newStock = Math.max(0, item.stock - quantity);
    await update(productId, { stock: newStock, lastUpdated: new Date().toISOString().split('T')[0] });
    setShowAdjustModal(false);
    setCurrentProduct(null);
    setAdjustmentQty(1);
  };

  // Modal Handlers
  const openAddModal = () => {
    resetForm();
    setImagePreview(null);
    setShowDuplicateAlert(false);
    setDuplicateProduct(null);
    if (addFileInputRef.current) {
      addFileInputRef.current.value = '';
    }
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      category: product.category,
      stock: product.stock,
      price: product.price,
      costPrice: product.costPrice || product.price * 0.7,
      supplier: product.supplier || '',
      image: product.image || null
    });
    setImagePreview(product.image || null);
    setShowDuplicateAlert(false);
    setDuplicateProduct(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
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
      brand: '',
      category: '',
      stock: 0,
      price: 0,
      costPrice: 0,
      supplier: '',
      image: null
    });
    setImagePreview(null);
    setShowDuplicateAlert(false);
    setDuplicateProduct(null);
  };

  // Form Change Handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' || name === 'costPrice' ? parseFloat(value) || 0 : value
    }));
  };

  // Image Upload Handler
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, WEBP, or GIF)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({
          ...prev,
          image: imageData
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    if (addFileInputRef.current) {
      addFileInputRef.current.value = '';
    }
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
  };

  const toggleMobileMenu = (id) => {
    setMobileMenuOpen(mobileMenuOpen === id ? null : id);
  };

  // Calculate profit margin
  const calculateProfitMargin = (price, costPrice) => {
    if (!costPrice || costPrice === 0) return null;
    return ((price - costPrice) / price) * 100;
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
    
    if (criticalItems.length > 0) {
      recommendations.push({
        type: 'critical',
        icon: FiX,
        iconColor: 'text-red-400',
        title: 'Critical Stock Alert',
        description: `${criticalItems.length} product(s) are critically low: ${criticalItems.map(i => i.name).join(', ')}`
      });
    }
    
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
    
    // Low profit margin items
    const lowMarginItems = inventory.filter(item => {
      if (!item.costPrice || item.costPrice === 0) return false;
      const margin = ((item.price - item.costPrice) / item.price) * 100;
      return margin < 20;
    });
    if (lowMarginItems.length > 0) {
      recommendations.push({
        type: 'margin',
        icon: FiTrendingDown,
        iconColor: 'text-red-400',
        title: 'Low Margin Alert',
        description: `${lowMarginItems.slice(0, 2).map(i => i.name).join(' • ')} have margins below 20%. Consider price review.`
      });
    }
    
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
                          (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || selectedCategory === '' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.stock <= 15).length;
  const criticalStockItems = inventory.filter(item => item.stock <= 5).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const totalCostValue = inventory.reduce((sum, item) => sum + (item.stock * (item.costPrice || item.price * 0.7)), 0);
  const potentialProfit = totalValue - totalCostValue;

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
  const renderProductImage = (product) => {
    const imageUrl = product.image || getProductImage(product.name);
    
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            // Show placeholder on image error
            const parent = e.target.parentElement;
            const placeholder = document.createElement('div');
            const initials = getInitials(product.name);
            const colorClass = getPlaceholderColor(product.name);
            placeholder.className = `w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0 ${colorClass}`;
            placeholder.textContent = initials;
            parent.appendChild(placeholder);
          }}
        />
      );
    }
    
    // Show initials placeholder
    const initials = getInitials(product.name);
    const colorClass = getPlaceholderColor(product.name);
    
    return (
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0 ${colorClass}`}>
        {initials}
      </div>
    );
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-12 sm:py-16">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <FiInbox className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
        Start building your inventory by adding your first product. Track stock, manage suppliers, and grow your business!
      </p>
      <button 
        onClick={openAddModal}
        className="bg-[#C4D9FF] text-gray-800 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-[#C5BAFE] transition-all duration-300 flex items-center gap-2 mx-auto shadow-sm hover:shadow-md text-sm sm:text-base"
      >
        <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
        Add Your First Product
      </button>
    </div>
  );

  // Image Upload Component
  const ImageUploadSection = ({ preview, onUpload, onRemove, fileInputRef, label }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label || 'Product Image'}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:border-[#C4D9FF] transition-colors">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onUpload}
        />
        
        {preview ? (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Product preview" 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover mx-auto"
            />
            <button
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
              type="button"
            >
              <FiX className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-2">Click below to change image</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              type="button"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <FiCamera className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Upload Product Image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 2MB)</p>
              <p className="text-xs text-blue-600 mt-2">Click to browse</p>
            </div>
          </div>
        )}
      </div>
      {!preview && (
        <p className="text-xs text-gray-400 mt-1">Upload a custom image or leave blank to auto-load from catalog</p>
      )}
    </div>
  );

  // Profit Margin Badge Component
  const ProfitMarginBadge = ({ price, costPrice }) => {
    if (!costPrice || costPrice === 0) return null;
    const margin = ((price - costPrice) / price) * 100;
    
    let color = 'bg-green-100 text-green-700';
    if (margin < 20) color = 'bg-red-100 text-red-700';
    else if (margin < 35) color = 'bg-yellow-100 text-yellow-700';
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {margin.toFixed(0)}%
      </span>
    );
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Consistent Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Inventory</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Never miss a sale again. Track your stock, get automatic alerts, and let our AI suggest what to order before you run out.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#C4D9FF] text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards - Only show if there are products */}
      {inventory.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Items</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Low Stock</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">{lowStockItems}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Critical</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{criticalStockItems}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Potential Profit</p>
                <p className="text-sm sm:text-2xl font-bold text-green-600 truncate">R{potentialProfit.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter - Only show if there are products */}
      {inventory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4D9FF] focus:border-transparent outline-none transition-all"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4D9FF] focus:border-transparent outline-none bg-white"
            >
              {filterCategories.map(cat => (
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
        <div className="space-y-4 sm:space-y-6">
          {/* Inventory Table - Desktop */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
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
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Margin</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map((item) => {
                      const status = getStockStatus(item.stock);
                      const StatusIcon = status.icon;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {renderProductImage(item)}
                              <div>
                                <p className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.brand || item.supplier}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className="text-xs sm:text-sm text-gray-600">{item.category}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className="font-medium text-gray-800 text-sm sm:text-base">{item.stock} units</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className="text-sm font-medium text-gray-800">R{item.price.toFixed(2)}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className="text-sm text-gray-500">R{(item.costPrice || item.price * 0.7).toFixed(2)}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <ProfitMarginBadge price={item.price} costPrice={item.costPrice} />
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${status.iconColor}`} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <button 
                                onClick={() => openAdjustModal(item)}
                                className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Adjust Stock"
                              >
                                <FiPackage className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button 
                                onClick={() => openEditModal(item)}
                                className="p-1.5 sm:p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <FiEdit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button 
                                onClick={() => openDeleteModal(item)}
                                className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-12">
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
              filteredInventory.map((item) => {
                const status = getStockStatus(item.stock);
                const StatusIcon = status.icon;
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {renderProductImage(item)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.brand || item.supplier}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-600">{item.category}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className={`w-3 h-3 ${status.iconColor}`} />
                              {status.label}
                            </span>
                            <ProfitMarginBadge price={item.price} costPrice={item.costPrice} />
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => toggleMobileMenu(item.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <FiMoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {mobileMenuOpen === item.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            <button 
                              onClick={() => { openAdjustModal(item); setMobileMenuOpen(null); }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FiPackage className="w-4 h-4" />
                              Adjust Stock
                            </button>
                            <button 
                              onClick={() => { openEditModal(item); setMobileMenuOpen(null); }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button 
                              onClick={() => { openDeleteModal(item); setMobileMenuOpen(null); }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-800">{item.stock} units</span>
                      <span className="text-sm font-medium text-gray-800">R{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Recommendations Panel */}
          <div className="bg-[#1E293B] text-white rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5" />
                AI Restock Intel
              </h3>
              <Link 
                to="/ai-coach"
                className="flex items-center gap-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-blue-600/20 hover:border-blue-600/40"
              >
                <FiCpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Talk to AI Coach
              </Link>
            </div>
            
            {getAIRecommendations().length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <FiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-300 text-sm sm:text-base">Everything looks good!</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">No immediate actions needed</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  {getAIRecommendations().map((rec, index) => {
                    const RecIcon = rec.icon;
                    return (
                      <div key={index} className="bg-white/10 p-3 sm:p-4 rounded-2xl border border-white/5 hover:bg-white/15 transition-all duration-200">
                        <div className="flex items-center gap-2 mb-1">
                          <RecIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${rec.iconColor}`} />
                          <p className="text-xs sm:text-sm font-semibold text-white">{rec.title}</p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 mt-1">{rec.description}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Duplicate Product Alert Modal */}
      {showDuplicateAlert && duplicateProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiInfo className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Product Already Exists</h3>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">"{duplicateProduct.name}"</span> is already in your inventory.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Current stock: <span className="font-medium">{duplicateProduct.stock} units</span>
                <br />
                Price: <span className="font-medium">R{duplicateProduct.price.toFixed(2)}</span>
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDuplicateAlert(false);
                    setDuplicateProduct(null);
                    // Open edit modal for the existing product
                    openEditModal(duplicateProduct);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300"
                >
                  Update Existing
                </button>
                <button 
                  onClick={() => {
                    setShowDuplicateAlert(false);
                    setDuplicateProduct(null);
                    // Reopen the add modal if it was closed
                    if (!showAddModal && !showEditModal) {
                      openAddModal();
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add New Product</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  placeholder="Enter product name"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Product names must be unique</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  placeholder="Enter brand name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all appearance-none pr-10 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map((category) => (
                      category && (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      )
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  placeholder="Supplier name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
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
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (R) *</label>
                <input
                  type="number"
                  name="costPrice"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  placeholder="What you paid"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">The price you paid to purchase this product</p>
              </div>
              
              {/* Image Upload Section */}
              <ImageUploadSection 
                preview={imagePreview}
                onUpload={(e) => handleImageUpload(e, 'add')}
                onRemove={removeImage}
                fileInputRef={addFileInputRef}
                label="Product Image (Optional)"
              />
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 sm:py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={() => addProduct(formData)}
                className="flex-1 bg-[#1E293B] text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit Product</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Product names must be unique</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all appearance-none pr-10 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map((category) => (
                      category && (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      )
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleFormChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (R)</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost (R)</label>
                  <input
                    type="number"
                    name="costPrice"
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleFormChange}
                    className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
              
              {/* Image Upload Section */}
              <ImageUploadSection 
                preview={imagePreview}
                onUpload={(e) => handleImageUpload(e, 'edit')}
                onRemove={removeImage}
                fileInputRef={editFileInputRef}
                label="Product Image"
              />
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 sm:py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={() => editProduct({ ...formData, id: currentProduct.id })}
                className="flex-1 bg-[#1E293B] text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Adjust {currentProduct.name}
              </h3>
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
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
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
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
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all text-sm sm:text-base"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs sm:text-sm text-red-700">
                  <span className="font-bold">Warning:</span> This will reduce stock by {adjustmentQty} units
                </p>
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  New stock will be: <span className="font-bold">{Math.max(0, currentProduct.stock - adjustmentQty)} units</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 py-2.5 sm:py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={() => adjustStock(currentProduct.id, adjustmentQty)}
                className="flex-1 bg-[#1E293B] text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FiTrash2 className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Delete Product</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Are you sure you want to delete <span className="font-bold">{currentProduct.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 sm:py-3 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteProduct(currentProduct.id)}
                  className="flex-1 bg-red-600 text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
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