import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

export default function Users() {
	const [users, setUsers] = useState([]);
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: 'member',
		status: 'active',
		teamIds: []
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			// This would be replaced with actual API calls
			setTeams([
				{ id: 1, name: 'Development Team', color: '#10B981' },
				{ id: 2, name: 'Marketing Team', color: '#F59E0B' },
				{ id: 3, name: 'HR Team', color: '#8B5CF6' }
			]);
			
			setUsers([
				{
					id: 1,
					name: 'System Administrator',
					email: 'admin@attendance.com',
					role: 'admin',
					status: 'active',
					teams: ['Development Team', 'HR Team'],
					lastLoginAt: '2024-01-20 10:30',
					createdAt: '2024-01-15'
				},
				{
					id: 2,
					name: 'John Manager',
					email: 'john@sampleorg.com',
					role: 'manager',
					status: 'active',
					teams: ['Development Team'],
					lastLoginAt: '2024-01-20 09:15',
					createdAt: '2024-01-16'
				},
				{
					id: 3,
					name: 'Sarah Teacher',
					email: 'sarah@sampleorg.com',
					role: 'teacher',
					status: 'active',
					teams: ['Marketing Team'],
					lastLoginAt: '2024-01-20 08:45',
					createdAt: '2024-01-17'
				},
				{
					id: 4,
					name: 'Mike Member',
					email: 'mike@sampleorg.com',
					role: 'member',
					status: 'active',
					teams: ['Development Team'],
					lastLoginAt: '2024-01-19 17:20',
					createdAt: '2024-01-18'
				}
			]);
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingUser) {
				// Update existing user
				setUsers(prev => 
					prev.map(user => 
						user.id === editingUser.id 
							? { 
								...user, 
								...formData,
								teams: teams.filter(team => formData.teamIds.includes(team.id.toString())).map(team => team.name)
							}
							: user
					)
				);
			} else {
				// Create new user
				const newUser = {
					id: Date.now(),
					...formData,
					teams: teams.filter(team => formData.teamIds.includes(team.id.toString())).map(team => team.name),
					lastLoginAt: null,
					createdAt: new Date().toISOString().split('T')[0]
				};
				setUsers(prev => [...prev, newUser]);
			}
			
			resetForm();
			setShowForm(false);
		} catch (error) {
			console.error('Failed to save user:', error);
		}
	};

	const handleEdit = (user) => {
		setEditingUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			password: '',
			role: user.role,
			status: user.status,
			teamIds: teams.filter(team => user.teams.includes(team.name)).map(team => team.id.toString())
		});
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			try {
				setUsers(prev => prev.filter(user => user.id !== id));
			} catch (error) {
				console.error('Failed to delete user:', error);
			}
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			password: '',
			role: 'member',
			status: 'active',
			teamIds: []
		});
		setEditingUser(null);
	};

	const getRoleBadge = (role) => {
		const colors = {
			admin: 'bg-purple-100 text-purple-800 border-purple-200',
			manager: 'bg-blue-100 text-blue-800 border-blue-200',
			teacher: 'bg-green-100 text-green-800 border-green-200',
			member: 'bg-gray-100 text-gray-800 border-gray-200'
		};
		return (
			<span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[role] || colors.member}`}>
				{role}
			</span>
		);
	};

	const getStatusBadge = (status) => {
		const colors = {
			active: 'bg-green-100 text-green-800 border-green-200',
			inactive: 'bg-red-100 text-red-800 border-red-200',
			suspended: 'bg-yellow-100 text-yellow-800 border-yellow-200'
		};
		return (
			<span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status] || colors.inactive}`}>
				{status}
			</span>
		);
	};

	const getTeamBadges = (userTeams) => {
		return userTeams.map((teamName, index) => {
			const team = teams.find(t => t.name === teamName);
			return (
				<span
					key={index}
					className="inline-block px-2 py-1 text-xs font-medium rounded-full mr-1 mb-1"
					style={{ 
						backgroundColor: team?.color + '20', 
						color: team?.color,
						border: `1px solid ${team?.color}`
					}}
				>
					{teamName}
				</span>
			);
		});
	};

	if (loading) {
		return (
			<Layout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Users</h1>
						<p className="mt-2 text-gray-600">
							Manage system users and their permissions.
						</p>
					</div>
					<button
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						+ Add User
					</button>
				</div>

				{/* Form Modal */}
				{showForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
							<h2 className="text-xl font-semibold mb-4">
								{editingUser ? 'Edit User' : 'Add New User'}
							</h2>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Name *
										</label>
										<input
											type="text"
											required
											value={formData.name}
											onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email *
										</label>
										<input
											type="email"
											required
											value={formData.email}
											onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Password {!editingUser && '*'}
										</label>
										<input
											type="password"
											required={!editingUser}
											value={formData.password}
											onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Role *
										</label>
										<select
											required
											value={formData.role}
											onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="member">Member</option>
											<option value="teacher">Teacher</option>
											<option value="manager">Manager</option>
											<option value="admin">Admin</option>
										</select>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<select
										value={formData.status}
										onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
										<option value="suspended">Suspended</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Assign to Teams
									</label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
										{teams.map(team => (
											<label key={team.id} className="flex items-center space-x-2">
												<input
													type="checkbox"
													checked={formData.teamIds.includes(team.id.toString())}
													onChange={(e) => {
														if (e.target.checked) {
															setFormData(prev => ({
																...prev,
																teamIds: [...prev.teamIds, team.id.toString()]
															}));
														} else {
															setFormData(prev => ({
																...prev,
																teamIds: prev.teamIds.filter(id => id !== team.id.toString())
															}));
														}
													}}
													className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700">{team.name}</span>
											</label>
										))}
									</div>
								</div>

								<div className="flex justify-end space-x-3 pt-4">
									<button
										type="button"
										onClick={() => setShowForm(false)}
										className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
									>
										{editingUser ? 'Update' : 'Create'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Users List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">All Users</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Role & Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Teams
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Last Login
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{users.map((user) => (
									<tr key={user.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div>
												<div className="text-sm font-medium text-gray-900">{user.name}</div>
												<div className="text-sm text-gray-500">{user.email}</div>
												<div className="text-xs text-gray-400">Created: {user.createdAt}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="space-y-1">
												{getRoleBadge(user.role)}
												{getStatusBadge(user.status)}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap">
												{getTeamBadges(user.teams)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{user.lastLoginAt || 'Never'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-2">
												<button
													onClick={() => handleEdit(user)}
													className="text-blue-600 hover:text-blue-900"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(user.id)}
													className="text-red-600 hover:text-red-900"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
}
