import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { exportUserAttendance, formatAttendanceDataForCSV, generateFilename } from '../utils/csvExport';

export default function MyAttendance() {
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		dateFrom: '',
		dateTo: '',
		status: ''
	});

	useEffect(() => {
		fetchMyAttendance();
	}, [filters]);

	const fetchMyAttendance = async () => {
		try {
			setLoading(true);
			// This would be replaced with actual API call
			// const { data } = await api.get('/attendance/user/me', { params: filters });
			setAttendanceRecords([
				{
					id: 1,
					date: '2024-01-20',
					teamName: 'Development Team',
					teamColor: '#10B981',
					status: 'present',
					checkInTime: '09:00',
					checkOutTime: '17:00',
					workHours: 8.0,
					notes: 'On time',
					markedBy: 'John Manager'
				},
				{
					id: 2,
					date: '2024-01-19',
					teamName: 'Development Team',
					teamColor: '#10B981',
					status: 'present',
					checkInTime: '08:45',
					checkOutTime: '17:15',
					workHours: 8.5,
					notes: 'Early arrival',
					markedBy: 'John Manager'
				},
				{
					id: 3,
					date: '2024-01-18',
					teamName: 'Development Team',
					teamColor: '#10B981',
					status: 'late',
					checkInTime: '09:30',
					checkOutTime: '17:00',
					workHours: 7.5,
					notes: 'Traffic delay',
					markedBy: 'John Manager'
				},
				{
					id: 4,
					date: '2024-01-17',
					teamName: 'Development Team',
					teamColor: '#10B981',
					status: 'present',
					checkInTime: '09:00',
					checkOutTime: '17:00',
					workHours: 8.0,
					notes: 'Regular day',
					markedBy: 'John Manager'
				},
				{
					id: 5,
					date: '2024-01-16',
					teamName: 'Development Team',
					teamColor: '#10B981',
					status: 'absent',
					checkInTime: null,
					checkOutTime: null,
					workHours: 0,
					notes: 'Called in sick',
					markedBy: 'John Manager'
				}
			]);
		} catch (error) {
			console.error('Failed to fetch attendance records:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const filteredRecords = attendanceRecords.filter(record => {
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

	// Calculate statistics
	const totalDays = filteredRecords.length;
	const presentDays = filteredRecords.filter(r => r.status === 'present').length;
	const absentDays = filteredRecords.filter(r => r.status === 'absent').length;
	const lateDays = filteredRecords.filter(r => r.status === 'late').length;
	const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
	const totalWorkHours = filteredRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);

	const handleExportCSV = () => {
		try {
			// Format data for CSV export
			const formattedData = formatAttendanceDataForCSV(filteredRecords);
			
			// Generate filename with current date and time
			const filename = generateFilename('my_attendance');
			
			// Export to CSV
			exportUserAttendance(formattedData, filename);
			
			// Show success message
			console.log('CSV export completed successfully');
		} catch (error) {
			console.error('Failed to export CSV:', error);
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
						<h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
						<p className="mt-2 text-gray-600">
							View your personal attendance records and statistics.
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
				<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<span className="text-2xl">📊</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Total Days</p>
								<p className="text-2xl font-bold text-gray-900">{totalDays}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<span className="text-2xl">✅</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Present</p>
								<p className="text-2xl font-bold text-gray-900">{presentDays}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-red-100 rounded-lg">
								<span className="text-2xl">❌</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Absent</p>
								<p className="text-2xl font-bold text-gray-900">{absentDays}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<span className="text-2xl">⏰</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Late</p>
								<p className="text-2xl font-bold text-gray-900">{lateDays}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 rounded-lg">
								<span className="text-2xl">📈</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Attendance %</p>
								<p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
							</div>
						</div>
					</div>
				</div>

				{/* Work Hours Summary */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Work Hours Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<p className="text-3xl font-bold text-blue-600">{totalWorkHours.toFixed(1)}</p>
							<p className="text-sm text-gray-600">Total Work Hours</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-green-600">
								{totalDays > 0 ? (totalWorkHours / totalDays).toFixed(1) : 0}
							</p>
							<p className="text-sm text-gray-600">Average Hours/Day</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-purple-600">
								{totalDays > 0 ? Math.round((totalWorkHours / totalDays / 8) * 100) : 0}%
							</p>
							<p className="text-sm text-gray-600">Efficiency Rate</p>
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
										Date & Team
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Time Details
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Work Hours
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Notes
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
													<div className="text-sm font-medium text-gray-900">{record.date}</div>
													<div className="text-sm text-gray-500">{record.teamName}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center space-x-2">
												<span className="text-lg">{getStatusIcon(record.status)}</span>
												{getStatusBadge(record.status)}
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


