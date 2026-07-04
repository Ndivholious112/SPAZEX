import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiSmartphone,
  FiCheck,
  FiMapPin
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    shopName: '',
    phone: '',
    address: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || user?.displayName || '',
        email: userData.email || user?.email || '',
        shopName: userData.shopName || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    } else if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        shopName: '',
        phone: '',
        address: ''
      });
    }
  }, [user, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserData({
        displayName: formData.displayName,
        shopName: formData.shopName,
        phone: formData.phone,
        address: formData.address
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/settings" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your personal information</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFE] rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-800">
            {formData.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800">Profile Photo</h3>
            <p className="text-sm text-gray-500 mt-1">Upload a new photo or change your avatar</p>
            <button type="button" className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Change Photo
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all disabled:cursor-not-allowed disabled:opacity-80"
                placeholder="Enter your email"
                disabled
                readOnly
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                placeholder="Enter your shop name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Address
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-6 text-gray-400 w-5 h-5" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                placeholder="Enter your shop address"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1E293B] text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiSave className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            to="/settings"
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-center"
          >
            Cancel
          </Link>
        </div>

        {saved && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700">
            <FiCheck className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;