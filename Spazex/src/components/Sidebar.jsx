import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiTrendingUp, FiBarChart2, FiCpu, FiTruck, FiSettings, FiUser, FiFileText } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	const authenticatedNavItems = [
		{ path: '/dashboard', icon: FiHome, label: 'Dashboard' },
		{ path: '/inventory', icon: FiPackage, label: 'Products' },
		{ path: '/invoices', icon: FiFileText, label: 'Invoices' },
		{ path: '/ai-coach', icon: FiCpu, label: 'AI Coach' },
		{ path: '/suppliers', icon: FiTruck, label: 'Suppliers' },
	];

	const publicNavItems = [
		{ path: '/features', label: 'Features' },
		{ path: '/for-owners', label: 'For Owners' },
		{ path: '/about', label: 'About' },
	];

	const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

	const [analyticsOpen, setAnalyticsOpen] = React.useState(true);

	return (
		<aside className="hidden md:flex md:flex-col w-64 bg-[#FBFBFB] border-r border-[#C4D9FF]/30 p-4">

			<nav className="flex-1">
				{navItems.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-[#E8F9FF] hover:text-gray-900 transition-colors ${location.pathname === item.path ? 'bg-[#E8F9FF]' : ''}`}
					>
						{item.icon && <item.icon className="w-5 h-5" />}
						<span>{item.label}</span>
					</Link>
				))}

				{/* Analytics group */}
				<div className="mt-4">
					<button
						onClick={() => setAnalyticsOpen(!analyticsOpen)}
						className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
					>
						<span className="flex items-center gap-3">
							<FiTrendingUp className="w-5 h-5" />
							<span>Analytics</span>
						</span>
						<svg className={`w-4 h-4 transform transition-transform ${analyticsOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
						</svg>
					</button>

					{analyticsOpen && (
						<div className="mt-2 pl-6 flex flex-col">
							<Link
								to="/sales"
								className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-[#E8F9FF] transition-colors ${location.pathname === '/sales' ? 'bg-[#E8F9FF]' : ''}`}
							>
								<FiTrendingUp className="w-4 h-4" />
								<span>Sales</span>
							</Link>

							<Link
								to="/forecast"
								className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-[#E8F9FF] transition-colors ${location.pathname === '/forecast' ? 'bg-[#E8F9FF]' : ''}`}
							>
								<FiBarChart2 className="w-4 h-4" />
								<span>Forecast</span>
							</Link>
						</div>
					)}
				</div>
			</nav>

			<div className="mt-4">
				<Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
					<FiSettings className="w-5 h-5" />
					<span>Settings</span>
				</Link>

				{isAuthenticated ? (
					<Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 mt-2">
						<FiUser className="w-5 h-5" />
						<span>Profile</span>
					</Link>
				) : (
					<Link to="/login" className="block mt-3 bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-full text-center font-semibold hover:bg-[#C5BAFE]">
						Get Started
					</Link>
				)}
			</div>
		</aside>
	);
};

export default Sidebar;
