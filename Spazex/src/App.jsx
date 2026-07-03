import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { 
  FiArrowRight, 
  FiTrendingDown, 
  FiHelpCircle, 
  FiBarChart2,
  FiTrendingUp,
  FiCheck,
  FiPhone,
  FiPlay,
  FiHome,
  FiClipboard,
  FiUser
} from 'react-icons/fi';
import { 
  FaBreadSlice, 
  FaWineBottle 
} from 'react-icons/fa';
import { 
  MdOutlineInventory, 
  MdOutlineAnalytics,
  MdOutlinePsychology,
  MdOutlineLanguage
} from 'react-icons/md';

// Auth Pages
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';

// Protected Pages
import Dashboard from './features/dashboard/Dashboard';
import Inventory from './features/inventory/Inventory';
import Sales from './features/sales/Sales';
import Invoices from './features/invoices/Invoices';
import Forecast from './features/forecasting/Forecast';
import AICoach from './features/ai-coach/AICoach';
import Suppliers from './features/suppliers/Suppliers';
import Settings from './features/settings/Settings';
import Profile from './features/settings/Profile';

// Landing Page Components (inline)
const Hero = () => (
  <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-[#E8F9FF]/50 to-[#FBFBFB]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5BAFE]/20 text-[#1E293B] font-medium text-sm mb-6 border border-[#C5BAFE]/30">
            <span className="flex h-2 w-2 rounded-full bg-[#C5BAFE]"></span>
            Built for South African Spaza Shops
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
            Empowering Township <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Entrepreneurship</span><br/>
            Through AI.
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Spazex is your digital business partner. We help informal retailers make smarter decisions, forecast demand, and grow profits with an affordable, easy-to-use mobile application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/login" className="bg-[#1E293B] text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl text-center flex justify-center items-center gap-2">
              Start Growing Today
              <FiArrowRight className="w-5 h-5" />
            </a>
            <a href="#features" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 text-center">
              See How it Works
            </a>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="relative mx-auto w-full max-w-[320px] floating hidden md:block">
          <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl relative border-4 border-gray-800 z-10">
            <div className="bg-[#FBFBFB] rounded-[2.5rem] overflow-hidden h-[640px] relative flex flex-col">
              <div className="h-6 w-full flex justify-between items-center px-6 pt-2 text-[10px] text-gray-500 font-medium">
                <span>09:41</span>
                <div className="flex gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </div>
              </div>
              
              <div className="px-6 pt-6 pb-4 bg-white rounded-b-3xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Welcome back,</p>
                    <p className="font-bold text-gray-900 text-lg">Thandi's Tuckshop</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#C4D9FF] flex items-center justify-center text-white font-bold">T</div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="bg-[#E8F9FF] border border-[#C4D9FF]/50 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-sm text-blue-900">Spazex AI Insight</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-snug">Bread sales usually increase by 25% on Fridays. Consider ordering 20 additional loaves tomorrow.</p>
                  <button className="mt-3 w-full bg-blue-600 text-white text-xs py-2 rounded-xl font-medium">Add to Restock List</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Today's Sales</p>
                    <p className="font-bold text-lg text-gray-800">R 1,240</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Low Stock</p>
                    <p className="font-bold text-lg text-red-500">4 Items</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">Top Selling Items</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                          <FaBreadSlice className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Blue Ribbon Bread</span>
                      </div>
                      <span className="text-sm text-green-600 font-bold">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-600">
                          <FaWineBottle className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Coca-Cola 2L</span>
                      </div>
                      <span className="text-sm text-green-600 font-bold">+8%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white h-16 w-full absolute bottom-0 border-t border-gray-100 flex justify-around items-center px-6">
                <div className="flex flex-col items-center text-blue-600">
                  <FiHome className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center text-gray-400">
                  <FiClipboard className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center text-gray-400">
                  <FiUser className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C5BAFE]/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C4D9FF]/40 rounded-full blur-2xl -z-10"></div>
        </div>
      </div>
    </div>
  </section>
);

const Problem = () => {
  const problems = [
    { icon: FiTrendingDown, title: 'Stock Shortages', description: 'Without proper tracking, shops frequently run out of popular products, forcing customers to go to competitors and resulting in lost revenue.', color: 'text-red-500', bg: 'bg-red-100' },
    { icon: FiHelpCircle, title: 'Guesswork Purchasing', description: 'Money gets tied up in slow-moving stock because ordering decisions are based on feeling rather than historical data and demand trends.', color: 'text-orange-500', bg: 'bg-orange-100' },
    { icon: FiBarChart2, title: 'No Profit Visibility', description: 'Without sales analytics, owners cannot identify which products are actually generating profit versus those that are losing money.', color: 'text-blue-500', bg: 'bg-blue-100' }
  ];

  return (
    <section id="problem" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Challenge We're Solving</h2>
          <p className="text-lg text-gray-600">Many spaza shop owners rely on memory, notebooks, and guesswork. This leads to costly mistakes in an industry with tight margins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-red-200 transition-colors group">
              <div className={`w-14 h-14 ${problem.bg} rounded-xl flex items-center justify-center ${problem.color} mb-6 group-hover:scale-110 transition-transform`}>
                <problem.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { 
      icon: MdOutlineInventory, 
      title: 'Smart Inventory Tracking', 
      description: 'Ditch the notebook. Spazex automatically tracks your products, alerts you when stock is low, and provides instant restocking recommendations based on actual sales.', 
      bullets: ['Live product tracking', 'Automated low stock alerts'],
      color: 'text-blue-600',
      bg: 'bg-[#E8F9FF]'
    },
    { 
      icon: MdOutlineAnalytics, 
      title: 'Demand Forecasting', 
      description: 'Our AI predicts what your customers will buy before they do. It analyzes historical sales, weekends, month-end spending, and seasonal trends to optimize your orders.', 
      bullets: ['Month-end & weekend predictions', 'Seasonal trend analysis'],
      color: 'text-purple-600',
      bg: 'bg-[#C5BAFE]/20'
    },
    { 
      icon: MdOutlinePsychology, 
      title: 'AI Business Coach', 
      description: 'Get personalized business advice directly on your phone. From pricing strategies to customer retention tips, your digital partner is always ready to help you grow.', 
      bullets: ['Plain-language recommendations', 'Identify unusual sales patterns'],
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    { 
      icon: MdOutlineLanguage, 
      title: 'Multilingual Assistant', 
      description: 'Technology should speak your language. Spazex provides support and insights in English, isiZulu, Sesotho, and isiXhosa (with voice interactions coming soon).', 
      bullets: ['4 Local languages supported', 'Culturally relevant advice'],
      color: 'text-gray-800',
      bg: 'bg-gray-100'
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#FBFBFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Our Solution</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Enterprise Intelligence,<br/>Built for Spazas.</h2>
            <p className="text-lg text-gray-600">Spazex combines inventory management, sales analysis, and predictive intelligence into one plain-language application.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-[#C4D9FF]/30 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center ${feature.color} mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                {feature.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Persona = () => (
  <section id="persona" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C4D9FF] font-medium text-xs mb-6 w-max border border-white/10">Real Impact</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Thandi (42)</h2>
            <p className="text-gray-300 mb-6 text-lg">Thandi runs a busy spaza shop in Soweto. Before Spazex, she tracked her stock using a dog-eared notebook. She never really knew which products generated the most profit or exactly when to reorder, leading to frustrating stockouts of bread and maize meal.</p>
            <p className="text-gray-300 mb-8 text-lg">Now, Spazex acts as her digital partner. It tells her exactly what to buy, warns her of low stock before she runs out, and helps her track every Rand.</p>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div><div className="text-3xl font-bold text-[#C4D9FF] mb-1">+30%</div><div className="text-sm text-gray-400">Increase in Profit</div></div>
              <div><div className="text-3xl font-bold text-[#C5BAFE] mb-1">0</div><div className="text-sm text-gray-400">Lost Sales from Stockouts</div></div>
            </div>
          </div>
          <div className="bg-gray-800 relative min-h-[300px] lg:min-h-full flex items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl transform rotate-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C4D9FF] to-[#C5BAFE] rounded-full flex items-center justify-center text-white text-xl font-bold">T</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Thandi's Tuckshop</h4>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md">Verified Owner</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                <p className="text-sm text-gray-600 italic">"I couldn't afford expensive computer systems. Spazex on my phone is like having a clever manager helping me every day. My shelves are never empty of the things people want."</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4D9FF]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5BAFE]/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section id="cta" className="py-24 bg-[#E8F9FF] relative overflow-hidden">
    <div className="absolute inset-0 bg-[#C4D9FF]/5 pattern-dots"></div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Grow Your Business?</h2>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join thousands of South African spaza shop owners using AI to work smarter, not harder. Download Spazex today.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href="/login" className="bg-[#1E293B] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
          <FiPhone className="w-6 h-6" />
          Get the App Now
        </a>
        <button className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-3">
          <FiPlay className="w-6 h-6" />
          Watch Demo
        </button>
      </div>
    </div>
  </section>
);

// Simple placeholder pages
const About = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">About Spazex</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const ForOwners = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">For Shop Owners</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

// Protected route paths that should show the sidebar
const protectedPaths = [
  '/dashboard',
  '/inventory',
  '/sales',
  '/invoices',
  '/forecast',
  '/ai-coach',
  '/suppliers',
  '/settings',
  '/profile'
];

// Layout Components
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#FBFBFB] via-[#E8F9FF] to-[#C5BAFE]/20 flex flex-col">
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2">
        <div className="w-8 h-8 bg-[#C4D9FF] rounded-lg flex items-center justify-center font-bold text-white shadow-inner">S</div>
        <span className="text-xl font-bold text-gray-800">Spazex</span>
      </Link>
    </div>
    <main className="flex-grow flex items-center justify-center px-4">
      {children}
    </main>
    <div className="py-4 text-center text-sm text-gray-500">
      &copy; 2026 Spazex. Empowering Township Entrepreneurship.
    </div>
  </div>
);

const MainLayout = ({ children }) => {
  const location = useLocation();
  const showSidebar = protectedPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        {showSidebar && <Sidebar />}
        <main className={`flex-grow ${showSidebar ? '' : 'w-full'}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - No Navbar, No Sidebar, No Footer */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          <Route path="/register" element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          } />
          <Route path="/forgot-password" element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          } />

          {/* Public Routes - With Navbar and Footer */}
          <Route path="/" element={
            <MainLayout>
              <>
                <Hero />
                <Problem />
                <Features />
                <Persona />
                <CTA />
              </>
            </MainLayout>
          } />
          <Route path="/features" element={
            <MainLayout>
              <Features />
            </MainLayout>
          } />
          <Route path="/for-owners" element={
            <MainLayout>
              <ForOwners />
            </MainLayout>
          } />
          <Route path="/about" element={
            <MainLayout>
              <About />
            </MainLayout>
          } />

          {/* Protected Routes - With Navbar, Sidebar (via protectedPaths match), and Footer */}
          <Route path="/dashboard" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/inventory" element={
            <MainLayout>
              <Inventory />
            </MainLayout>
          } />
          <Route path="/sales" element={
            <MainLayout>
              <Sales />
            </MainLayout>
          } />
          <Route path="/invoices" element={
            <MainLayout>
              <Invoices />
            </MainLayout>
          } />
          <Route path="/forecast" element={
            <MainLayout>
              <Forecast />
            </MainLayout>
          } />
          <Route path="/ai-coach" element={
            <MainLayout>
              <AICoach />
            </MainLayout>
          } />
          <Route path="/suppliers" element={
            <MainLayout>
              <Suppliers />
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <Settings />
            </MainLayout>
          } />
          <Route path="/profile" element={
            <MainLayout>
              <Profile />
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;