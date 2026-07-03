import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import Features from './components/Features';

// Page components
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

const AICoach = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">AI Business Coach</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const Support = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">Support</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const Terms = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const Privacy = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                {/* <Features /> */}
              </>
            } />
            {/* <Route path="/features" element={<Features />} /> */}
            <Route path="/for-owners" element={<ForOwners />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;