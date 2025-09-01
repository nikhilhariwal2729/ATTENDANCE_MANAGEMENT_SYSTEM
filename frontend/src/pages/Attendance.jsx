import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Attendance() {
	const [selectedTeam, setSelectedTeam] = useState('');
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
	const [teams, setTeams] = useState([]);
	const [teamMembers, setTeamMembers] = useState([]);
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchTeams();
	}, []);

	useEffect(() => {
		if (selectedTeam && selectedDate) {
			fetchTeamMembers();
			fetchAttendanceRecords();
		}
	}, [selectedTeam, selectedDate]);

	const fetchTeams = async () => {
		try {
			// This would be replaced with actual API call
			setTeams([
				{ id: 1, name: 'Development Team', color: '#10B981' },
				{ id: 2, name: 'Marketing Team', color: '#F59E0B' },
				{ id: 3, name: 'HR Team', color: '#8B5CF6' },
			]);
		} catch (error) {
			console.error('Failed to fetch teams:', error);
		}
	};

	const fetchTeamMembers = async () => {
		try {
			// This would be replaced with actual API call
			setTeamMembers([
				{ id: 1, name: 'John Manager', email: 'john@example.com', role: 'manager' },
				{ id: 2, name: 'Mike Developer', email: 'mike@example.com', role: 'member' },
				{ id: 3, name: 'Sarah Designer', email: 'sarah@example.com', role: 'member' },
			]);
		} catch (error) {
			console.error('Failed to fetch team members:', error);
		}
	};

	const fetchAttendanceRecords = async () => {
		try {
			// This would be replaced with actual API call
			setAttendanceRecords([
				{ userId: 1, status: 'present', checkInTime: '09:00' },
				{ userId: 2, status: 'late', checkInTime: '09:30' },
				{ userId: 3, status: 'absent' },
			]);
		} catch (error) {
			console.error('Failed to fetch attendance records:', error);
		}
	};

	const markAttendance = async (userId, status) => {
		try {
			setLoading(true);
			// This would be replaced with actual API call
			await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
			
			// Update local state
			setAttendanceRecords(prev => {
				const existing = prev.find(r => r.userId === userId);
				if (existing) {
					return prev.map(r => r.userId === userId ? { ...r, status } : r);
				} else {
					return [...prev, { userId, status, checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) }];
				}
			});
		} catch (error) {
			console.error('Failed to mark attendance:', error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'present': return 'bg-green-100 text-green-800 border-green-200';
			case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'absent': return 'bg-red-100 text-red-800 border-red-200';
			case 'leave': return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'half_day': return 'bg-orange-100 text-orange-800 border-orange-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'present': return '✅';
			case 'late': return '⏰';
			case 'absent': return '❌';
			case 'leave': return '🏖️';
			case 'half_day': return '⏳';
			default: return '❓';
		}
	};

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
					<p className="mt-2 text-gray-600">
						Record attendance for team members on a specific date.
					</p>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Select Team
							</label>
							<select
								value={selectedTeam}
								onChange={(e) => setSelectedTeam(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Choose a team</option>
								{teams.map(team => (
									<option key={team.id} value={team.id}>
										{team.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Select Date
							</label>
							<input
								type="date"
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				</div>

				{/* Attendance Grid */}
				{selectedTeam && teamMembers.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{teamMembers.map(member => {
								const record = attendanceRecords.find(r => r.userId === member.id);
								const status = record?.status || 'not_marked';
								
								return (
									<div key={member.id} className="border border-gray-200 rounded-lg p-4">
										<div className="flex items-center justify-between mb-3">
											<div>
												<h3 className="font-medium text-gray-900">{member.name}</h3>
												<p className="text-sm text-gray-500">{member.email}</p>
												<p className="text-xs text-gray-400 capitalize">{member.role}</p>
											</div>
											<div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
												{getStatusIcon(status)} {status.replace('_', ' ')}
											</div>
										</div>
										
										{record?.checkInTime && (
											<p className="text-xs text-gray-500 mb-3">
												Check-in: {record.checkInTime}
											</p>
										)}
										
										<div className="flex space-x-2">
											{['present', 'late', 'absent', 'leave', 'half_day'].map(statusOption => (
												<button
													key={statusOption}
													onClick={() => markAttendance(member.id, statusOption)}
													disabled={loading}
													className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
														status === statusOption
															? 'bg-blue-600 text-white'
															: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
													}`}
												>
													{statusOption.replace('_', ' ')}
												</button>
											))}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Summary */}
				{selectedTeam && attendanceRecords.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Summary</h2>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
							{['present', 'late', 'absent', 'leave', 'half_day'].map(status => {
								const count = attendanceRecords.filter(r => r.status === status).length;
								return (
									<div key={status} className="text-center">
										<div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl ${getStatusColor(status)}`}>
											{getStatusIcon(status)}
										</div>
										<p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
										<p className="text-sm text-gray-500 capitalize">{status.replace('_', ' ')}</p>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}


