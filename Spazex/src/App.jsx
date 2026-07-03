import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth Pages
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';

// Protected Pages
import Dashboard from './features/dashboard/Dashboard';
import Inventory from './features/inventory/Inventory';
import Sales from './features/sales/Sales';
import Forecast from './features/forecasting/Forecast';
import AICoach from './features/ai-coach/AICoach';
import Suppliers from './features/suppliers/Suppliers';
import Settings from './features/settings/Settings';
import Profile from './features/settings/Profile';

// Simple placeholder for public pages
const Home = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Spazex</h1>
      <p className="text-lg text-gray-600">Empowering Township Entrepreneurship Through Artificial Intelligence</p>
      <div className="mt-8 flex justify-center gap-4">
        <a href="/login" className="bg-[#C4D9FF] text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-[#C5BAFE] transition-all">
          Get Started
        </a>
      </div>
    </div>
  </div>
);

const Features = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">Features</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const ForOwners = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">For Shop Owners</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const About = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">About Spazex</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/for-owners" element={<ForOwners />} />
              <Route path="/about" element={<About />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes (Authenticated) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/ai-coach" element={<AICoach />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;