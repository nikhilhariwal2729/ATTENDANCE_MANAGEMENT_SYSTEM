import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function SelfAttendance() {
	const { user } = useAuth();
	const [teams, setTeams] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState('');
	const [todayRecord, setTodayRecord] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [notes, setNotes] = useState('');
	const [location, setLocation] = useState('');
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		fetchUserTeams();
	}, []);

	useEffect(() => {
		if (selectedTeam) {
			fetchTodayRecord();
		}
	}, [selectedTeam]);

	// Real-time clock update
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const fetchUserTeams = async () => {
		try {
			// This would be replaced with actual API call
			// const { data } = await api.get('/user/teams');
			setTeams([
				{ id: 1, name: 'Development Team', color: '#10B981' },
				{ id: 2, name: 'Marketing Team', color: '#F59E0B' },
				{ id: 3, name: 'HR Team', color: '#8B5CF6' }
			]);
			
			// Auto-select first team if user has teams
			if (teams.length > 0) {
				setSelectedTeam(teams[0].id);
			}
		} catch (error) {
			console.error('Failed to fetch teams:', error);
		}
	};

	const fetchTodayRecord = async () => {
		try {
			// This would be replaced with actual API call
			// const { data } = await api.get('/attendance/my-attendance');
			const mockData = {
				todayRecord: {
					id: 1,
					date: new Date().toISOString().split('T')[0],
					status: 'present',
					checkInTime: '09:00',
					checkOutTime: null,
					workHours: null,
					notes: 'Self check-in'
				}
			};
			setTodayRecord(mockData.todayRecord);
		} catch (error) {
			console.error('Failed to fetch today\'s record:', error);
		}
	};

	const handleCheckIn = async () => {
		if (!selectedTeam) {
			setMessage('Please select a team first');
			return;
		}

		try {
			setLoading(true);
			setMessage('');

			// This would be replaced with actual API call
			// const { data } = await api.post('/attendance/self', {
			//     action: 'check-in',
			//     teamId: selectedTeam,
			//     notes: notes,
			//     location: location
			// });

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			const currentTime = new Date().toLocaleTimeString('en-US', { 
				hour12: false, 
				hour: '2-digit', 
				minute: '2-digit' 
			});

			const newRecord = {
				id: Date.now(),
				date: new Date().toISOString().split('T')[0],
				status: 'present',
				checkInTime: currentTime,
				checkOutTime: null,
				workHours: null,
				notes: notes || 'Self check-in',
				location: location || 'Office'
			};

			setTodayRecord(newRecord);
			setMessage('✅ Check-in successful! Welcome to work.');
			setNotes('');
			setLocation('');

		} catch (error) {
			console.error('Check-in failed:', error);
			setMessage('❌ Check-in failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleCheckOut = async () => {
		if (!todayRecord || !todayRecord.checkInTime) {
			setMessage('❌ No check-in record found. Please check-in first.');
			return;
		}

		try {
			setLoading(true);
			setMessage('');

			// This would be replaced with actual API call
			// const { data } = await api.post('/attendance/self', {
			//     action: 'check-out',
			//     teamId: selectedTeam,
			//     notes: notes,
			//     location: location
			// });

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			const currentTime = new Date().toLocaleTimeString('en-US', { 
				hour12: false, 
				hour: '2-digit', 
				minute: '2-digit' 
			});

			// Calculate work hours
			const checkInTime = new Date(`2000-01-01T${todayRecord.checkInTime}`);
			const checkOutTime = new Date(`2000-01-01T${currentTime}`);
			const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

			const updatedRecord = {
				...todayRecord,
				checkOutTime: currentTime,
				workHours: parseFloat(workHours.toFixed(2)),
				notes: notes || todayRecord.notes || 'Self check-out',
				location: location || todayRecord.location || 'Office'
			};

			setTodayRecord(updatedRecord);
			setMessage(`✅ Check-out successful! You worked ${workHours.toFixed(2)} hours today.`);
			setNotes('');
			setLocation('');

		} catch (error) {
			console.error('Check-out failed:', error);
			setMessage('❌ Check-out failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status) => {
		const colors = {
			present: 'bg-green-100 text-green-800 border-green-200',
			absent: 'bg-red-100 text-red-800 border-red-200',
			late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			leave: 'bg-blue-100 text-blue-800 border-blue-200',
			half_day: 'bg-orange-100 text-orange-800 border-orange-200'
		};
		return (
			<span className={`px-3 py-1 text-sm font-medium rounded-full border ${colors[status] || colors.absent}`}>
				{status}
			</span>
		);
	};

	const formatTime = (date) => {
		return date.toLocaleTimeString('en-US', { 
			hour12: false, 
			hour: '2-digit', 
			minute: '2-digit',
			second: '2-digit'
		});
	};

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Self Attendance</h1>
					<p className="mt-2 text-gray-600">
						Mark your own attendance with check-in and check-out.
					</p>
				</div>

				{/* Current Time Display */}
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
					<div className="text-center">
						<p className="text-sm font-medium opacity-90">Current Time</p>
						<p className="text-4xl font-bold mt-2" id="current-time">
							{formatTime(currentTime)}
						</p>
						<p className="text-sm opacity-90 mt-2">
							{currentTime.toLocaleDateString('en-US', { 
								weekday: 'long', 
								year: 'numeric', 
								month: 'long', 
								day: 'numeric' 
							})}
						</p>
					</div>
				</div>

				{/* Team Selection */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Team</h2>
					<select
						value={selectedTeam}
						onChange={(e) => setSelectedTeam(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Choose your team</option>
						{teams.map(team => (
							<option key={team.id} value={team.id}>
								{team.name}
							</option>
						))}
					</select>
				</div>

				{/* Today's Status */}
				{selectedTeam && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Status</h2>
						
						{todayRecord ? (
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
									<div>
										<p className="text-sm font-medium text-gray-600">Status</p>
										<div className="mt-1">{getStatusBadge(todayRecord.status)}</div>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-600">Date</p>
										<p className="text-lg font-semibold text-gray-900">{todayRecord.date}</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="p-4 bg-blue-50 rounded-lg">
										<p className="text-sm font-medium text-blue-600">Check-in Time</p>
										<p className="text-xl font-bold text-blue-900">
											{todayRecord.checkInTime || 'Not checked in'}
										</p>
									</div>
									<div className="p-4 bg-green-50 rounded-lg">
										<p className="text-sm font-medium text-green-600">Check-out Time</p>
										<p className="text-xl font-bold text-green-900">
											{todayRecord.checkOutTime || 'Not checked out'}
										</p>
									</div>
								</div>

								{todayRecord.workHours && (
									<div className="p-4 bg-purple-50 rounded-lg">
										<p className="text-sm font-medium text-purple-600">Work Hours Today</p>
										<p className="text-xl font-bold text-purple-900">
											{todayRecord.workHours} hours
										</p>
									</div>
								)}

								{todayRecord.notes && (
									<div className="p-4 bg-gray-50 rounded-lg">
										<p className="text-sm font-medium text-gray-600">Notes</p>
										<p className="text-gray-900">{todayRecord.notes}</p>
									</div>
								)}
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-gray-500">No attendance record for today yet.</p>
								<p className="text-sm text-gray-400 mt-1">Use the check-in button below to start your day.</p>
							</div>
						)}
					</div>
				)}

				{/* Check-in/Check-out Actions */}
				{selectedTeam && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h2>
						
						{/* Notes and Location */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Notes (Optional)
								</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Any notes about your attendance..."
									rows={3}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Location (Optional)
								</label>
								<input
									type="text"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
									placeholder="e.g., Office, Home, Client Site"
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							{(!todayRecord || !todayRecord.checkInTime) ? (
								<button
									onClick={handleCheckIn}
									disabled={loading}
									className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{loading ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
											Checking In...
										</div>
									) : (
										<div className="flex items-center justify-center">
											<span className="text-xl mr-2">✅</span>
											Check In
										</div>
									)}
								</button>
							) : (
								<button
									onClick={handleCheckOut}
									disabled={loading}
									className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{loading ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
											Checking Out...
										</div>
									) : (
										<div className="flex items-center justify-center">
											<span className="text-xl mr-2">🏠</span>
											Check Out
										</div>
									)}
								</button>
							)}
						</div>

						{/* Status Message */}
						{message && (
							<div className={`mt-4 p-4 rounded-lg ${
								message.includes('✅') 
									? 'bg-green-50 text-green-800 border border-green-200' 
									: 'bg-red-50 text-red-800 border border-red-200'
							}`}>
								{message}
							</div>
						)}
					</div>
				)}

				{/* Instructions */}
				<div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
					<h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Self-Attendance</h3>
					<div className="space-y-2 text-blue-800">
						<p>• <strong>Check-in:</strong> Mark your arrival when you start work</p>
						<p>• <strong>Check-out:</strong> Mark your departure when you finish work</p>
						<p>• <strong>Notes:</strong> Add any relevant information about your attendance</p>
						<p>• <strong>Location:</strong> Specify where you're working from</p>
						<p>• <strong>Automatic:</strong> Work hours are calculated automatically</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
