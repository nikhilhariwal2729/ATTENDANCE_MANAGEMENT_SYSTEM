import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { exportAttendanceRecords, formatAttendanceDataForCSV, generateFilename } from '../utils/csvExport';

export default function AttendanceRecords() {
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [teams, setTeams] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		teamId: '',
		userId: '',
		dateFrom: '',
		dateTo: '',
		status: ''
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
				{ id: 1, name: 'John Manager', role: 'manager' },
				{ id: 2, name: 'Sarah Teacher', role: 'teacher' },
				{ id: 3, name: 'Mike Member', role: 'member' },
				{ id: 4, name: 'Lisa Member', role: 'member' }
			]);
			
			setAttendanceRecords([
				{
					id: 1,
					userName: 'Mike Member',
					teamName: 'Development Team',
					teamColor: '#10B981',
					date: '2024-01-20',
					status: 'present',
					checkInTime: '09:00',
					checkOutTime: '17:00',
					workHours: 8.0,
					notes: 'On time',
					markedBy: 'John Manager',
					ipAddress: '192.168.1.100',
					location: 'Office Building A'
				},
				{
					id: 2,
					userName: 'Lisa Member',
					teamName: 'Marketing Team',
					teamColor: '#F59E0B',
					date: '2024-01-20',
					status: 'late',
					checkInTime: '09:30',
					checkOutTime: '17:00',
					workHours: 7.5,
					notes: 'Traffic delay',
					markedBy: 'Sarah Teacher',
					ipAddress: '192.168.1.101',
					location: 'Office Building B'
				},
				{
					id: 3,
					userName: 'Mike Member',
					teamName: 'Development Team',
					teamColor: '#10B981',
					date: '2024-01-19',
					status: 'present',
					checkInTime: '08:45',
					checkOutTime: '17:15',
					workHours: 8.5,
					notes: 'Early arrival',
					markedBy: 'John Manager',
					ipAddress: '192.168.1.100',
					location: 'Office Building A'
				},
				{
					id: 4,
					userName: 'Lisa Member',
					teamName: 'Marketing Team',
					teamColor: '#F59E0B',
					date: '2024-01-19',
					status: 'absent',
					checkInTime: null,
					checkOutTime: null,
					workHours: 0,
					notes: 'Called in sick',
					markedBy: 'Sarah Teacher',
					ipAddress: '192.168.1.101',
					location: 'Remote'
				}
			]);
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const filteredRecords = attendanceRecords.filter(record => {
		if (filters.teamId && record.teamName !== teams.find(t => t.id === parseInt(filters.teamId))?.name) return false;
		if (filters.userId && record.userName !== users.find(u => u.id === parseInt(filters.userId))?.name) return false;
		if (filters.dateFrom && record.date < filters.dateFrom) return false;
		if (filters.dateTo && record.date > filters.dateTo) return false;
		if (filters.status && record.status !== filters.status) return false;
		return true;
	});

	const getStatusBadge = (status) => {
		const colors = {
			present: 'bg-green-100 text-green-800 border-green-200',
			absent: 'bg-red-100 text-red-800 border-red-200',
			late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			leave: 'bg-blue-100 text-blue-800 border-blue-200',
			half_day: 'bg-orange-100 text-orange-800 border-orange-200'
		};
		return (
			<span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status] || colors.absent}`}>
				{status}
			</span>
		);
	};

	const getStatusIcon = (status) => {
		const icons = {
			present: '✅',
			absent: '❌',
			late: '⏰',
			leave: '🏖️',
			half_day: '⏳'
		};
		return icons[status] || '❓';
	};

	const handleExportCSV = () => {
		try {
			// Format data for CSV export
			const formattedData = formatAttendanceDataForCSV(filteredRecords);
			
			// Generate filename with current date and time
			const filename = generateFilename('attendance_records');
			
			// Export to CSV
			exportAttendanceRecords(formattedData, filename);
			
			// Show success message (you could add a toast notification here)
			console.log('CSV export completed successfully');
		} catch (error) {
			console.error('Failed to export CSV:', error);
			// You could add error handling/notification here
		}
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
						<h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
						<p className="mt-2 text-gray-600">
							View and manage attendance records across all teams.
						</p>
					</div>
					<button
						onClick={handleExportCSV}
						className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
					>
						<span>📊</span>
						<span>Export CSV</span>
					</button>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Team
							</label>
							<select
								value={filters.teamId}
								onChange={(e) => handleFilterChange('teamId', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All Teams</option>
								{teams.map(team => (
									<option key={team.id} value={team.id}>{team.name}</option>
								))}
							</select>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								User
							</label>
							<select
								value={filters.userId}
								onChange={(e) => handleFilterChange('userId', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All Users</option>
								{users.map(user => (
									<option key={user.id} value={user.id}>{user.name}</option>
								))}
							</select>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Date From
							</label>
							<input
								type="date"
								value={filters.dateFrom}
								onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Date To
							</label>
							<input
								type="date"
								value={filters.dateTo}
								onChange={(e) => handleFilterChange('dateTo', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</label>
							<select
								value={filters.status}
								onChange={(e) => handleFilterChange('status', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All Status</option>
								<option value="present">Present</option>
								<option value="absent">Absent</option>
								<option value="late">Late</option>
								<option value="leave">Leave</option>
								<option value="half_day">Half Day</option>
							</select>
						</div>
					</div>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<span className="text-2xl">✅</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Present Today</p>
								<p className="text-2xl font-bold text-gray-900">
									{filteredRecords.filter(r => r.status === 'present').length}
								</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-red-100 rounded-lg">
								<span className="text-2xl">❌</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Absent Today</p>
								<p className="text-2xl font-bold text-gray-900">
									{filteredRecords.filter(r => r.status === 'absent').length}
								</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<span className="text-2xl">⏰</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Late Today</p>
								<p className="text-2xl font-bold text-gray-900">
									{filteredRecords.filter(r => r.status === 'late').length}
								</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<span className="text-2xl">📊</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Total Records</p>
								<p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Attendance Records Table */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">
							Attendance Records ({filteredRecords.length})
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										User & Team
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date & Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Time Details
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Work Hours
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Notes & Details
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredRecords.map((record) => (
									<tr key={record.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div 
													className="w-3 h-3 rounded-full mr-3"
													style={{ backgroundColor: record.teamColor }}
												></div>
												<div>
													<div className="text-sm font-medium text-gray-900">{record.userName}</div>
													<div className="text-sm text-gray-500">{record.teamName}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="space-y-1">
												<div className="text-sm text-gray-900">{record.date}</div>
												<div className="flex items-center space-x-2">
													<span className="text-lg">{getStatusIcon(record.status)}</span>
													{getStatusBadge(record.status)}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												<div>In: {record.checkInTime || 'N/A'}</div>
												<div>Out: {record.checkOutTime || 'N/A'}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{record.workHours} hrs
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-900">
												<div className="font-medium">{record.notes}</div>
												<div className="text-gray-500 text-xs mt-1">
													Marked by: {record.markedBy}
												</div>
												<div className="text-gray-500 text-xs">
													IP: {record.ipAddress} | {record.location}
												</div>
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
