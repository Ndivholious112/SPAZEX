import React from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <p className="text-gray-600 mt-2">Configure your account settings</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/profile" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
          <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </Link>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Language</h3>
          <p className="text-gray-600 mt-2">Change your preferred language</p>
          <select className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C4D9FF] focus:border-transparent outline-none">
            <option value="en">English</option>
            <option value="zu">Zulu</option>
            <option value="xh">Xhosa</option>
            <option value="af">Afrikaans</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;