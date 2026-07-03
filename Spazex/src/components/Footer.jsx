import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#C4D9FF]/30 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C4D9FF] text-sm font-bold text-white shadow-inner">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-800">
                Spazex
              </span>
            </div>

            <p className="max-w-xs leading-relaxed text-gray-600">
              Empowering South African township entrepreneurs with AI-powered
              business tools to grow and succeed.
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex gap-3">
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#C4D9FF] transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#C4D9FF] transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#C4D9FF] transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#C4D9FF] transition-colors"
                aria-label="YouTube"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 font-bold text-gray-800">Platform</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/features" className="transition-colors hover:text-blue-600">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/ai-coach" className="transition-colors hover:text-blue-600">
                  Business Coach
                </Link>
              </li>
              <li>
                <Link to="/support" className="transition-colors hover:text-blue-600">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-bold text-gray-800">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/about" className="transition-colors hover:text-blue-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
          &copy; 2026 Spazex. Empowering Township Entrepreneurship.
        </div>
      </div>
    </footer>
  );
};

export default Footer;