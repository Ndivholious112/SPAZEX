import React from 'react';

const AICoach = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800">AI Business Coach</h1>
      <p className="text-gray-600 mt-2">Get AI-powered business advice and recommendations</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Chat with AI Coach</h3>
          <p className="text-gray-600 mt-2">Ask questions about your business and get personalized advice</p>
          <button className="mt-4 bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">
            Start Chat
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
          <p className="text-gray-600 mt-2">Get AI-powered recommendations for your business</p>
          <button className="mt-4 bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">
            View Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;