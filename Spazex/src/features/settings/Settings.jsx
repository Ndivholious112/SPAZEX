import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiGlobe, 
  FiBell, 
  FiShield, 
  FiMoon, 
  FiSun,
  FiCheck,
  FiChevronRight,
  FiHelpCircle,
  FiLogOut,
  FiLock,
  FiMail,
  FiSend,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    lowStock: true,
    salesAlerts: true,
    promotions: false,
    weeklyReport: true
  });

  const [languageChanged, setLanguageChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Support Modal State
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportData, setSupportData] = useState({
    subject: '',
    message: '',
    email: user?.email || ''
  });
  const [supportSent, setSupportSent] = useState(false);

  // Load notification settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spazex_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  // Save notification settings to localStorage
  const saveNotificationSettings = () => {
    localStorage.setItem('spazex_notifications', JSON.stringify(notifications));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setLanguageChanged(true);
    setTimeout(() => setLanguageChanged(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Password Change Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Simulate password change
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 2000);
  };

  // Support Handlers
  const handleSupportChange = (e) => {
    const { name, value } = e.target;
    setSupportData(prev => ({ ...prev, [name]: value }));
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (supportData.subject && supportData.message) {
      setSupportSent(true);
      setTimeout(() => {
        setSupportSent(false);
        setShowSupportModal(false);
        setSupportData({
          subject: '',
          message: '',
          email: user?.email || ''
        });
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and configurations</p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFE] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-2xl font-bold text-gray-800">
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{user?.displayName || 'User'}</h2>
            <p className="text-gray-700">{user?.email}</p>
            {user?.shopName && (
              <p className="text-sm text-gray-700 mt-1">🏪 {user.shopName}</p>
            )}
          </div>
          <Link 
            to="/profile"
            className="bg-white/30 hover:bg-white/50 text-gray-800 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
          >
            Edit Profile
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Language Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <FiGlobe className="w-6 h-6" />
            </div>
            {languageChanged && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                <FiCheck className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Language</h3>
          <p className="text-gray-500 text-sm mt-1">Choose your preferred language</p>
          <select 
            value={language}
            onChange={handleLanguageChange}
            className="mt-3 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4D9FF] focus:border-transparent outline-none transition-all bg-gray-50"
          >
            <option value="en">English</option>
            <option value="zu">isiZulu</option>
            <option value="xh">isiXhosa</option>
            <option value="af">Afrikaans</option>
            <option value="st">Sesotho</option>
            <option value="ts">Xitsonga</option>
          </select>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <FiBell className="w-6 h-6" />
            </div>
            {saveSuccess && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                <FiCheck className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Notifications</h3>
          <p className="text-gray-500 text-sm mt-1">Configure your alert preferences</p>
          
          <div className="mt-3 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Low Stock Alerts</span>
              <button
                onClick={() => handleNotificationToggle('lowStock')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.lowStock ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.lowStock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Sales Alerts</span>
              <button
                onClick={() => handleNotificationToggle('salesAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.salesAlerts ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.salesAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Weekly Reports</span>
              <button
                onClick={() => handleNotificationToggle('weeklyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.weeklyReport ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
          
          <button
            onClick={saveNotificationSettings}
            className="mt-3 w-full bg-[#1E293B] text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Save Preferences
          </button>
        </div>

        {/* Theme Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              {theme === 'dark' ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Theme</h3>
          <p className="text-gray-500 text-sm mt-1">
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </p>
          <button
            onClick={toggleTheme}
            className="mt-3 w-full bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {theme === 'dark' ? (
              <>
                <FiSun className="w-4 h-4" /> Light Mode
              </>
            ) : (
              <>
                <FiMoon className="w-4 h-4" /> Dark Mode
              </>
            )}
          </button>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <FiShield className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Security</h3>
          <p className="text-gray-500 text-sm mt-1">Manage your password and security</p>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="mt-3 w-full bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Change Password
          </button>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <FiHelpCircle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Help & Support</h3>
          <p className="text-gray-500 text-sm mt-1">Get help or contact our team</p>
          <button 
            onClick={() => setShowSupportModal(true)}
            className="mt-3 w-full bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-4 py-3 rounded-xl transition-all w-full md:w-auto"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {passwordSuccess ? (
              <div className="text-center py-8">
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-800">Password Changed!</p>
                <p className="text-gray-500 mt-1">Your password has been updated successfully.</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                      placeholder="Enter new password (min 6 chars)"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-red-600 text-sm">{passwordError}</p>
                )}
                
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError('');
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex-1 py-2 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#1E293B] text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Contact Support</h3>
              <button 
                onClick={() => {
                  setShowSupportModal(false);
                  setSupportSent(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {supportSent ? (
              <div className="text-center py-8">
                <FiSend className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-800">Message Sent!</p>
                <p className="text-gray-500 mt-1">Our team will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={supportData.email}
                      onChange={handleSupportChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={supportData.subject}
                    onChange={handleSupportChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                    placeholder="What is this about?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={supportData.message}
                    onChange={handleSupportChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C4D9FF] transition-all"
                    placeholder="Describe your issue or question..."
                    required
                  />
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSupportModal(false);
                      setSupportSent(false);
                    }}
                    className="flex-1 py-2 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#1E293B] text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;