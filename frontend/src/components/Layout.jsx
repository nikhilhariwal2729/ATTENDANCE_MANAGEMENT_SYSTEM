import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

export default function Layout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const getNavItems = () => {
		const baseItems = [
			{
				name: 'Dashboard',
				path: '/dashboard',
				icon: '🏠',
				roles: ['admin', 'manager', 'teacher', 'member']
			},
			{
				name: 'Self Attendance',
				path: '/attendance/self',
				icon: '👤',
				roles: ['admin', 'manager', 'teacher', 'member']
			},
			{
				name: 'Mark Attendance',
				path: '/attendance/mark',
				icon: '✅',
				roles: ['admin', 'manager', 'teacher']
			},
			{
				name: 'Attendance Records',
				path: '/attendance/records',
				icon: '📊',
				roles: ['admin', 'manager', 'teacher']
			},
			{
				name: 'My Attendance',
				path: '/my-attendance',
				icon: '📈',
				roles: ['admin', 'manager', 'teacher', 'member']
			},
			{
				name: 'Reports',
				path: '/reports',
				icon: '📋',
				roles: ['admin', 'manager']
			}
		];

		// Admin-only items
		if (user?.role === 'admin') {
			baseItems.push(
				{
					name: 'Organizations',
					path: '/admin/organizations',
					icon: '🏢',
					roles: ['admin']
				},
				{
					name: 'Teams',
					path: '/admin/teams',
					icon: '👥',
					roles: ['admin']
				},
				{
					name: 'Users',
					path: '/admin/users',
					icon: '👤',
					roles: ['admin']
				}
			);
		}

		return baseItems;
	};

	const filteredNavItems = getNavItems().filter(item => 
		item.roles.includes(user?.role)
	);

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				></div>
			)}

			{/* Sidebar */}
			<div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
				sidebarOpen ? 'translate-x-0' : '-translate-x-full'
			}`}>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white text-xl font-bold">A</span>
							</div>
							<span className="text-xl font-bold text-gray-900">AttendanceMS</span>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
						{filteredNavItems.map((item) => (
							<button
								key={item.path}
								onClick={() => {
									navigate(item.path);
									setSidebarOpen(false);
								}}
								className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
									isActive(item.path)
										? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								<span className="text-lg">{item.icon}</span>
								<span className="font-medium">{item.name}</span>
							</button>
						))}
					</nav>

					{/* User Info */}
					<div className="p-4 border-t border-gray-200">
						<div className="flex items-center space-x-3 mb-3">
							<div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
								<span className="text-white text-sm font-bold">S</span>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{user?.name || 'User'}
								</p>
								<p className="text-xs text-gray-500 capitalize">
									{user?.role || 'member'}
								</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<span>↪</span>
							<span>Logout</span>
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
				{/* Top Bar */}
				<div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
					<div className="flex items-center justify-between h-16 px-6">
						{/* Mobile menu button */}
						<button
							onClick={() => setSidebarOpen(true)}
							className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>

						{/* Page Title */}
						<div className="flex-1 lg:ml-0">
							<h1 className="text-lg font-semibold text-gray-900">
								{(() => {
									const currentItem = filteredNavItems.find(item => isActive(item.path));
									return currentItem ? currentItem.name : 'Dashboard';
								})()}
							</h1>
						</div>

						{/* User Menu */}
						<div className="flex items-center space-x-4">
							<div className="hidden md:flex items-center space-x-3">
								<div className="text-right">
									<p className="text-sm font-medium text-gray-900">
										{user?.name || 'User'}
									</p>
									<p className="text-xs text-gray-500 capitalize">
										{user?.role || 'member'}
									</p>
								</div>
								<div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
									<span className="text-white text-sm font-bold">
										{user?.name?.charAt(0) || 'U'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Page Content */}
				<main className="flex-1 p-6">
					{children}
				</main>
				
				{/* Footer */}
				<div className="flex-shrink-0">
					<Footer />
				</div>
			</div>
		</div>
	);
}
