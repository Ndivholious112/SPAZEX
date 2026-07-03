import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/settings" className="text-gray-500 hover:text-gray-700 transition-colors">
          ← Back to Settings
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
      </div>
      
      <div className="max-w-2xl bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#C4D9FF] flex items-center justify-center text-3xl font-bold text-gray-800">
            JD
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
            <p className="text-gray-600">john@example.com</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value="john@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input type="text" value="John's Spaza Shop" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly />
          </div>
          <button className="mt-4 bg-[#C4D9FF] text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;