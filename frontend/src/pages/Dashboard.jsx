import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
	const { user } = useAuth();
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalTeams: 0,
		totalOrganizations: 0,
		todayAttendance: 0,
		monthlyAttendance: 0,
	});

	useEffect(() => {
		// Fetch dashboard statistics
		const fetchStats = async () => {
			try {
				// This would be replaced with actual API calls
				setStats({
					totalUsers: 25,
					totalTeams: 8,
					totalOrganizations: 3,
					todayAttendance: 89,
					monthlyAttendance: 92,
				});
			} catch (error) {
				console.error('Failed to fetch stats:', error);
			}
		};

		fetchStats();
	}, []);

	const StatCard = ({ title, value, icon, color, change }) => (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
					{change && (
						<p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
							{change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
						</p>
					)}
				</div>
				<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
					<span className="text-2xl">{icon}</span>
				</div>
			</div>
		</div>
	);

	const QuickAction = ({ title, description, icon, href, color }) => (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
			<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} mb-4`}>
				<span className="text-2xl">{icon}</span>
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-600 text-sm mb-4">{description}</p>
			<a
				href={href}
				className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
			>
				Get started
				<svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	);

	return (
		<Layout>
			<div className="space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="mt-2 text-gray-600">
						Welcome back! Here's what's happening with your attendance system.
					</p>
				</div>

				{/* Statistics Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<StatCard
						title="Total Users"
						value={stats.totalUsers}
						icon="👥"
						color="bg-blue-100 text-blue-600"
						change={12}
					/>
					<StatCard
						title="Total Teams"
						value={stats.totalTeams}
						icon="🏢"
						color="bg-green-100 text-green-600"
						change={8}
					/>
					<StatCard
						title="Organizations"
						value={stats.totalOrganizations}
						icon="🏛️"
						color="bg-purple-100 text-purple-600"
						change={0}
					/>
					<StatCard
						title="Today's Attendance"
						value={`${stats.todayAttendance}%`}
						icon="✅"
						color="bg-orange-100 text-orange-600"
						change={-3}
					/>
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'teacher') && (
							<QuickAction
								title="Mark Attendance"
								description="Record attendance for team members"
								icon="✅"
								href="/attendance/mark"
								color="bg-green-100 text-green-600"
							/>
						)}
						<QuickAction
							title="View Reports"
							description="Generate attendance reports and analytics"
							icon="📊"
							href="/reports"
							color="bg-blue-100 text-blue-600"
						/>
						{user?.role === 'admin' && (
							<QuickAction
								title="Manage Users"
								description="Add, edit, or remove system users"
								icon="👤"
								href="/admin/users"
								color="bg-purple-100 text-purple-600"
							/>
						)}
						<QuickAction
							title="My Attendance"
							description="View your personal attendance history"
							icon="📈"
							href="/my-attendance"
							color="bg-orange-100 text-orange-600"
						/>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-green-400 rounded-full"></div>
							<span className="text-sm text-gray-600">Attendance marked for Development Team</span>
							<span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
							<span className="text-sm text-gray-600">New user registered: John Doe</span>
							<span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
							<span className="text-sm text-gray-600">Monthly report generated</span>
							<span className="text-xs text-gray-400 ml-auto">1 day ago</span>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}


