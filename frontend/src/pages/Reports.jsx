import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from 'chart.js';
import { exportReportsData, exportAttendanceSummary, generateFilename } from '../utils/csvExport';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

export default function Reports() {
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		teamId: '',
		dateFrom: '2024-01-01',
		dateTo: '2024-01-31'
	});
	const [reportData, setReportData] = useState({
		attendanceTrend: [],
		teamPerformance: [],
		userAttendance: [],
		statusDistribution: [],
		monthlyStats: []
	});

	useEffect(() => {
		fetchReportData();
	}, [filters]);

	const fetchReportData = async () => {
		try {
			setLoading(true);
			// This would be replaced with actual API calls
			// Simulating API response with sample data
			setReportData({
				attendanceTrend: [
					{ date: '2024-01-01', present: 85, absent: 15, late: 5 },
					{ date: '2024-01-02', present: 88, absent: 12, late: 3 },
					{ date: '2024-01-03', present: 82, absent: 18, late: 7 },
					{ date: '2024-01-04', present: 90, absent: 10, late: 2 },
					{ date: '2024-01-05', present: 87, absent: 13, late: 4 },
					{ date: '2024-01-08', present: 89, absent: 11, late: 3 },
					{ date: '2024-01-09', present: 86, absent: 14, late: 6 },
					{ date: '2024-01-10', present: 91, absent: 9, late: 1 },
					{ date: '2024-01-11', present: 88, absent: 12, late: 4 },
					{ date: '2024-01-12', present: 85, absent: 15, late: 5 },
					{ date: '2024-01-15', present: 87, absent: 13, late: 3 },
					{ date: '2024-01-16', present: 89, absent: 11, late: 2 },
					{ date: '2024-01-17', present: 84, absent: 16, late: 6 },
					{ date: '2024-01-18', present: 90, absent: 10, late: 1 },
					{ date: '2024-01-19', present: 86, absent: 14, late: 4 },
					{ date: '2024-01-20', present: 88, absent: 12, late: 3 }
				],
				teamPerformance: [
					{ team: 'Development Team', present: 92, absent: 8, late: 2, total: 100 },
					{ team: 'Marketing Team', present: 88, absent: 12, late: 4, total: 100 },
					{ team: 'HR Team', present: 95, absent: 5, late: 1, total: 100 },
					{ team: 'Sales Team', present: 85, absent: 15, late: 6, total: 100 }
				],
				userAttendance: [
					{ user: 'Mike Member', present: 18, absent: 2, late: 1, total: 21 },
					{ user: 'Lisa Member', present: 17, absent: 3, late: 2, total: 22 },
					{ user: 'John Manager', present: 20, absent: 1, late: 0, total: 21 },
					{ user: 'Sarah Teacher', present: 19, absent: 2, late: 1, total: 22 }
				],
				statusDistribution: [
					{ status: 'Present', count: 74, percentage: 74 },
					{ status: 'Absent', count: 18, percentage: 18 },
					{ status: 'Late', count: 6, percentage: 6 },
					{ status: 'Leave', count: 2, percentage: 2 }
				],
				monthlyStats: [
					{ month: 'Jan 2024', totalDays: 22, avgAttendance: 87.5, totalHours: 1540 },
					{ month: 'Dec 2023', totalDays: 21, avgAttendance: 86.2, totalHours: 1448 },
					{ month: 'Nov 2023', totalDays: 22, avgAttendance: 88.1, totalHours: 1550 }
				]
			});
		} catch (error) {
			console.error('Failed to fetch report data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	// Chart configurations
	const attendanceTrendData = {
		labels: reportData.attendanceTrend.map(item => item.date),
		datasets: [
			{
				label: 'Present',
				data: reportData.attendanceTrend.map(item => item.present),
				borderColor: 'rgb(34, 197, 94)',
				backgroundColor: 'rgba(34, 197, 94, 0.1)',
				fill: true,
				tension: 0.4
			},
			{
				label: 'Absent',
				data: reportData.attendanceTrend.map(item => item.absent),
				borderColor: 'rgb(239, 68, 68)',
				backgroundColor: 'rgba(239, 68, 68, 0.1)',
				fill: true,
				tension: 0.4
			},
			{
				label: 'Late',
				data: reportData.attendanceTrend.map(item => item.late),
				borderColor: 'rgb(245, 158, 11)',
				backgroundColor: 'rgba(245, 158, 11, 0.1)',
				fill: true,
				tension: 0.4
			}
		]
	};

	const teamPerformanceData = {
		labels: reportData.teamPerformance.map(item => item.team),
		datasets: [
			{
				label: 'Present',
				data: reportData.teamPerformance.map(item => item.present),
				backgroundColor: 'rgba(34, 197, 94, 0.8)',
				borderColor: 'rgb(34, 197, 94)',
				borderWidth: 1
			},
			{
				label: 'Absent',
				data: reportData.teamPerformance.map(item => item.absent),
				backgroundColor: 'rgba(239, 68, 68, 0.8)',
				borderColor: 'rgb(239, 68, 68)',
				borderWidth: 1
			},
			{
				label: 'Late',
				data: reportData.teamPerformance.map(item => item.late),
				backgroundColor: 'rgba(245, 158, 11, 0.8)',
				borderColor: 'rgb(245, 158, 11)',
				borderWidth: 1
			}
		]
	};

	const statusDistributionData = {
		labels: reportData.statusDistribution.map(item => item.status),
		datasets: [
			{
				data: reportData.statusDistribution.map(item => item.count),
				backgroundColor: [
					'rgba(34, 197, 94, 0.8)',
					'rgba(239, 68, 68, 0.8)',
					'rgba(245, 158, 11, 0.8)',
					'rgba(59, 130, 246, 0.8)'
				],
				borderColor: [
					'rgb(34, 197, 94)',
					'rgb(239, 68, 68)',
					'rgb(245, 158, 11)',
					'rgb(59, 130, 246)'
				],
				borderWidth: 2
			}
		]
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Attendance Analytics'
			}
		},
		scales: {
			y: {
				beginAtZero: true
			}
		}
	};

	const handleExportCSV = () => {
		try {
			// Export attendance trend data
			const trendData = reportData.attendanceTrend.map(item => ({
				date: item.date,
				present: item.present,
				absent: item.absent,
				late: item.late,
				leave: item.leave,
				half_day: item.half_day,
				total: item.total
			}));
			
			const filename = generateFilename('attendance_report');
			exportReportsData(trendData, filename);
			
			console.log('CSV export completed successfully');
		} catch (error) {
			console.error('Failed to export CSV:', error);
		}
	};

	const handleExportSummaryCSV = () => {
		try {
			// Export user attendance summary
			const summaryData = reportData.userAttendance.map(user => ({
				userName: user.name,
				totalDays: user.totalDays,
				presentDays: user.presentDays,
				absentDays: user.absentDays,
				lateDays: user.lateDays,
				attendancePercentage: user.attendancePercentage,
				totalWorkHours: user.totalWorkHours
			}));
			
			const filename = generateFilename('attendance_summary');
			exportAttendanceSummary(summaryData, filename);
			
			console.log('Summary CSV export completed successfully');
		} catch (error) {
			console.error('Failed to export summary CSV:', error);
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
						<h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
						<p className="mt-2 text-gray-600">
							Comprehensive attendance reports and visualizations.
						</p>
					</div>
					<div className="flex space-x-3">
						<button
							onClick={handleExportCSV}
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
						>
							<span>📊</span>
							<span>Export CSV</span>
						</button>
						<button
							onClick={handleExportSummaryCSV}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
						>
							<span>📈</span>
							<span>Export Summary</span>
						</button>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
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
								Team
							</label>
							<select
								value={filters.teamId}
								onChange={(e) => handleFilterChange('teamId', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All Teams</option>
								<option value="1">Development Team</option>
								<option value="2">Marketing Team</option>
								<option value="3">HR Team</option>
							</select>
						</div>
					</div>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<span className="text-2xl">📊</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Total Days</p>
								<p className="text-2xl font-bold text-gray-900">
									{reportData.attendanceTrend.length}
								</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<span className="text-2xl">✅</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Avg Attendance</p>
								<p className="text-2xl font-bold text-gray-900">
									{Math.round(reportData.attendanceTrend.reduce((sum, item) => sum + item.present, 0) / reportData.attendanceTrend.length)}%
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
								<p className="text-sm font-medium text-gray-600">Total Late</p>
								<p className="text-2xl font-bold text-gray-900">
									{reportData.attendanceTrend.reduce((sum, item) => sum + item.late, 0)}
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
								<p className="text-sm font-medium text-gray-600">Total Absent</p>
								<p className="text-2xl font-bold text-gray-900">
									{reportData.attendanceTrend.reduce((sum, item) => sum + item.absent, 0)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Charts Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Attendance Trend */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h3>
						<Line data={attendanceTrendData} options={chartOptions} height={300} />
					</div>

					{/* Team Performance */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
						<Bar data={teamPerformanceData} options={chartOptions} height={300} />
					</div>

					{/* Status Distribution */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
						<div className="flex justify-center">
							<div className="w-64 h-64">
								<Doughnut data={statusDistributionData} options={chartOptions} />
							</div>
						</div>
					</div>

					{/* Monthly Statistics */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
						<div className="space-y-4">
							{reportData.monthlyStats.map((stat, index) => (
								<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">{stat.month}</p>
										<p className="text-sm text-gray-500">{stat.totalDays} working days</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-blue-600">{stat.avgAttendance}%</p>
										<p className="text-sm text-gray-500">{stat.totalHours} hrs</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* User Attendance Table */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">Individual User Performance</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Present
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Absent
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Late
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Total Days
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Attendance %
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{reportData.userAttendance.map((user, index) => (
									<tr key={index} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">{user.user}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
												{user.present}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
												{user.absent}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
												{user.late}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{user.total}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
												{Math.round((user.present / user.total) * 100)}%
											</span>
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


