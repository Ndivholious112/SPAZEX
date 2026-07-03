import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#FBFBFB] border-b border-[#C4D9FF]/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-[#C4D9FF] rounded-xl flex items-center justify-center font-bold text-white shadow-inner group-hover:bg-[#C5BAFE] transition-colors duration-300">
              S
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Spazex</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/features" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C4D9FF] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/for-owners" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group"
            >
              For Owners
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C4D9FF] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C4D9FF] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link 
              to="/login" 
              className="bg-[#C4D9FF] text-gray-800 px-6 py-2.5 rounded-full font-semibold hover:bg-[#C5BAFE] hover:scale-105 transition-all duration-300 shadow-sm"
            >
              Get Started
            </Link>
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
          ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-4 space-y-3">
          <Link 
            to="/features" 
            className="block text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={closeMobileMenu}
          >
            Features
          </Link>
          <Link 
            to="/for-owners" 
            className="block text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={closeMobileMenu}
          >
            For Owners
          </Link>
          <Link 
            to="/about" 
            className="block text-gray-600 hover:text-blue-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={closeMobileMenu}
          >
            About
          </Link>
          
          <div className="pt-2 border-t border-gray-100">
            <Link 
              to="/login" 
              className="block text-center bg-[#C4D9FF] text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-[#C5BAFE] transition-all"
              onClick={closeMobileMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;