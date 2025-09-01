import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

export default function Organizations() {
	const [organizations, setOrganizations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingOrg, setEditingOrg] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		address: '',
		phone: '',
		email: '',
		website: '',
		status: 'active'
	});

	useEffect(() => {
		fetchOrganizations();
	}, []);

	const fetchOrganizations = async () => {
		try {
			setLoading(true);
			// This would be replaced with actual API call
			// const { data } = await api.get('/admin/orgs');
			setOrganizations([
				{
					id: 1,
					name: 'Sample Organization',
					description: 'A sample organization for testing',
					address: '123 Main Street, City, Country',
					phone: '+1-555-0123',
					email: 'info@sampleorg.com',
					website: 'https://sampleorg.com',
					status: 'active',
					createdAt: '2024-01-15'
				}
			]);
		} catch (error) {
			console.error('Failed to fetch organizations:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingOrg) {
				// Update existing organization
				// await api.put(`/admin/orgs/${editingOrg.id}`, formData);
				setOrganizations(prev => 
					prev.map(org => 
						org.id === editingOrg.id 
							? { ...org, ...formData }
							: org
					)
				);
			} else {
				// Create new organization
				// const { data } = await api.post('/admin/orgs', formData);
				const newOrg = {
					id: Date.now(),
					...formData,
					createdAt: new Date().toISOString().split('T')[0]
				};
				setOrganizations(prev => [...prev, newOrg]);
			}
			
			resetForm();
			setShowForm(false);
		} catch (error) {
			console.error('Failed to save organization:', error);
		}
	};

	const handleEdit = (org) => {
		setEditingOrg(org);
		setFormData({
			name: org.name,
			description: org.description,
			address: org.address,
			phone: org.phone,
			email: org.email,
			website: org.website,
			status: org.status
		});
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this organization?')) {
			try {
				// await api.delete(`/admin/orgs/${id}`);
				setOrganizations(prev => prev.filter(org => org.id !== id));
			} catch (error) {
				console.error('Failed to delete organization:', error);
			}
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			address: '',
			phone: '',
			email: '',
			website: '',
			status: 'active'
		});
		setEditingOrg(null);
	};

	const getStatusBadge = (status) => {
		const colors = {
			active: 'bg-green-100 text-green-800 border-green-200',
			inactive: 'bg-red-100 text-red-800 border-red-200'
		};
		return (
			<span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status] || colors.inactive}`}>
				{status}
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
						<h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
						<p className="mt-2 text-gray-600">
							Manage your organizations and their settings.
						</p>
					</div>
					<button
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						+ Add Organization
					</button>
				</div>

				{/* Form Modal */}
				{showForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
							<h2 className="text-xl font-semibold mb-4">
								{editingOrg ? 'Edit Organization' : 'Add New Organization'}
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
											Status
										</label>
										<select
											value={formData.status}
											onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
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

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Address
										</label>
										<textarea
											value={formData.address}
											onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
											rows={2}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone
										</label>
										<input
											type="tel"
											value={formData.phone}
											onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email
										</label>
										<input
											type="email"
											value={formData.email}
											onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Website
										</label>
										<input
											type="url"
											value={formData.website}
											onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
											className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
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
										{editingOrg ? 'Update' : 'Create'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Organizations List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">All Organizations</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Contact
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Created
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{organizations.map((org) => (
									<tr key={org.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div>
												<div className="text-sm font-medium text-gray-900">{org.name}</div>
												<div className="text-sm text-gray-500">{org.description}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">{org.email}</div>
											<div className="text-sm text-gray-500">{org.phone}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{getStatusBadge(org.status)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{org.createdAt}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-2">
												<button
													onClick={() => handleEdit(org)}
													className="text-blue-600 hover:text-blue-900"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(org.id)}
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
