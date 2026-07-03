import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiPackage, FiTrendingUp, FiBarChart2, FiCpu, FiTruck, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      closeMobileMenu();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/inventory', icon: FiPackage, label: 'Products' },
    { path: '/ai-coach', icon: FiCpu, label: 'AI Coach' },
    { path: '/suppliers', icon: FiTruck, label: 'Suppliers' },
  ];

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { path: '/features', label: 'Features' },
    { path: '/for-owners', label: 'For Owners' },
    { path: '/about', label: 'About' },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="bg-[#FBFBFB] border-b border-[#C4D9FF]/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-[#C4D9FF] rounded-xl flex items-center justify-center font-bold text-white shadow-inner group-hover:bg-[#C5BAFE] transition-colors duration-300">
              S
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Spazex</span>
          </Link>

          {/* Desktop Menu: navigation moved to Sidebar */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links moved to the Sidebar component for desktop layouts */}
          </div>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-2 transition-colors border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C4D9FF] flex items-center justify-center text-gray-800 font-semibold">
                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 hidden lg:inline">
                    {user?.displayName || 'User'}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user?.displayName}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      {user?.shopName && (
                        <p className="text-sm text-gray-600 mt-1">🏪 {user.shopName}</p>
                      )}
                    </div>
                    
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiSettings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full border-t border-gray-100 mt-2 pt-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#C4D9FF] text-gray-800 px-6 py-2.5 rounded-full font-semibold hover:bg-[#C5BAFE] hover:scale-105 transition-all duration-300 shadow-sm"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-8 h-8" />
              ) : (
                <FiMenu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden bg-white border-b border-[#C4D9FF] overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-4 space-y-2">
          {/* User Info for mobile */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 px-2 py-3 mb-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#C4D9FF] flex items-center justify-center text-gray-800 font-semibold">
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={closeMobileMenu}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              {item.label}
            </Link>
          ))}

          {/* Analytics group for mobile */}
          <div>
            <button
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
              className="w-full flex items-center justify-between gap-3 text-gray-700 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <FiTrendingUp className="w-5 h-5" />
                Analytics
              </span>
              <svg className={`w-4 h-4 transform transition-transform ${analyticsOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </button>

            {analyticsOpen && (
              <div className="mt-2 pl-4 flex flex-col">
                <Link to="/sales" onClick={closeMobileMenu} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiTrendingUp className="w-5 h-5" />
                  Sales
                </Link>
                <Link to="/forecast" onClick={closeMobileMenu} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiBarChart2 className="w-5 h-5" />
                  Forecast
                </Link>
              </div>
            )}
          </div>

          {/* Additional links for authenticated users */}
          {isAuthenticated && (
            <>
              <Link 
                to="/settings" 
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                <FiSettings className="w-5 h-5" />
                Settings
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                <FiUser className="w-5 h-5" />
                Profile
              </Link>
            </>
          )}
          
          <div className="pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="block text-center bg-[#C4D9FF] text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-[#C5BAFE] transition-all"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;