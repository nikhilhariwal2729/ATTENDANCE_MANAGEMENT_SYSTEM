import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

export default function Teams() {
	const [teams, setTeams] = useState([]);
	const [organizations, setOrganizations] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingTeam, setEditingTeam] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		organizationId: '',
		managerId: '',
		maxMembers: 50,
		status: 'active',
		color: '#3B82F6'
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			// This would be replaced with actual API calls
			setOrganizations([
				{ id: 1, name: 'Sample Organization' },
				{ id: 2, name: 'Tech Corp' },
				{ id: 3, name: 'Education Inc' }
			]);
			
			setUsers([
				{ id: 1, name: 'John Manager', role: 'manager' },
				{ id: 2, name: 'Sarah Teacher', role: 'teacher' },
				{ id: 3, name: 'Mike Member', role: 'member' }
			]);
			
			setTeams([
				{
					id: 1,
					name: 'Development Team',
					description: 'Software development team',
					organizationId: 1,
					organizationName: 'Sample Organization',
					managerId: 1,
					managerName: 'John Manager',
					maxMembers: 15,
					status: 'active',
					color: '#10B981',
					memberCount: 8,
					createdAt: '2024-01-15'
				},
				{
					id: 2,
					name: 'Marketing Team',
					description: 'Marketing and communications',
					organizationId: 1,
					organizationName: 'Sample Organization',
					managerId: 2,
					managerName: 'Sarah Teacher',
					maxMembers: 10,
					status: 'active',
					color: '#F59E0B',
					memberCount: 5,
					createdAt: '2024-01-16'
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
			if (editingTeam) {
				// Update existing team
				setTeams(prev => 
					prev.map(team => 
						team.id === editingTeam.id 
							? { 
								...team, 
								...formData,
								organizationName: organizations.find(org => org.id === parseInt(formData.organizationId))?.name,
								managerName: users.find(user => user.id === parseInt(formData.managerId))?.name
							}
							: team
					)
				);
			} else {
				// Create new team
				const newTeam = {
					id: Date.now(),
					...formData,
					organizationId: parseInt(formData.organizationId),
					managerId: formData.managerId ? parseInt(formData.managerId) : null,
					organizationName: organizations.find(org => org.id === parseInt(formData.organizationId))?.name,
					managerName: formData.managerId ? users.find(user => user.id === parseInt(formData.managerId))?.name : null,
					memberCount: 0,
					createdAt: new Date().toISOString().split('T')[0]
				};
				setTeams(prev => [...prev, newTeam]);
			}
			
			resetForm();
			setShowForm(false);
		} catch (error) {
			console.error('Failed to save team:', error);
		}
	};

	const handleEdit = (team) => {
		setEditingTeam(team);
		setFormData({
			name: team.name,
			description: team.description,
			organizationId: team.organizationId.toString(),
			managerId: team.managerId ? team.managerId.toString() : '',
			maxMembers: team.maxMembers,
			status: team.status,
			color: team.color
		});
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this team?')) {
			try {
				setTeams(prev => prev.filter(team => team.id !== id));
			} catch (error) {
				console.error('Failed to delete team:', error);
			}
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			organizationId: '',
			managerId: '',
			maxMembers: 50,
			status: 'active',
			color: '#3B82F6'
		});
		setEditingTeam(null);
	};

	const getStatusBadge = (status) => {
		const colors = {
			active: 'bg-green-100 text-green-800 border-green-200',
			inactive: 'bg-red-100 text-red-800 border-red-200',
			archived: 'bg-gray-100 text-gray-800 border-gray-200'
		};
		return (
			<span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status] || colors.inactive}`}>
				{status}
							</span>
		);
	};

	const getMemberCountBadge = (current, max) => {
		const percentage = (current / max) * 100;
		let color = 'bg-green-100 text-green-800';
		if (percentage > 80) color = 'bg-red-100 text-red-800';
		else if (percentage > 60) color = 'bg-yellow-100 text-yellow-800';
		
		return (
			<span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
				{current}/{max}
			</span>
		);
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
						<h1 className="text-3xl font-bold text-gray-900">Teams</h1>
						<p className="mt-2 text-gray-600">
							Manage teams within your organizations.
						</p>
					</div>
					<button
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						+ Add Team
					</button>
				</div>

				{/* Form Modal */}
				{showForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
							<h2 className="text-xl font-semibold mb-4">
								{editingTeam ? 'Edit Team' : 'Add New Team'}
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
											Organization *
										</label>
										<select
											required
											value={formData.organizationId}
											onChange={(e) => setFormData(prev => ({ ...prev, organizationId: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="">Select Organization</option>
											{organizations.map(org => (
												<option key={org.id} value={org.id}>{org.name}</option>
											))}
										</select>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
										rows={3}
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Manager
										</label>
										<select
											value={formData.managerId}
											onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="">No Manager</option>
											{users.filter(user => ['admin', 'manager', 'teacher'].includes(user.role)).map(user => (
												<option key={user.id} value={user.id}>{user.name} ({user.role})</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Max Members
										</label>
										<input
											type="number"
											min="1"
											max="100"
											value={formData.maxMembers}
											onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
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
											<option value="archived">Archived</option>
										</select>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Team Color
									</label>
									<div className="flex items-center space-x-3">
										<input
											type="color"
											value={formData.color}
											onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
											className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
										/>
										<span className="text-sm text-gray-500">{formData.color}</span>
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
										{editingTeam ? 'Update' : 'Create'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Teams List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">All Teams</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Team
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Organization
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Manager
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Members
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{teams.map((team) => (
									<tr key={team.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div 
													className="w-4 h-4 rounded-full mr-3"
													style={{ backgroundColor: team.color }}
												></div>
												<div>
													<div className="text-sm font-medium text-gray-900">{team.name}</div>
													<div className="text-sm text-gray-500">{team.description}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{team.organizationName}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{team.managerName || 'No Manager'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{getMemberCountBadge(team.memberCount, team.maxMembers)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{getStatusBadge(team.status)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-2">
												<button
													onClick={() => handleEdit(team)}
													className="text-blue-600 hover:text-blue-900"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(team.id)}
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
