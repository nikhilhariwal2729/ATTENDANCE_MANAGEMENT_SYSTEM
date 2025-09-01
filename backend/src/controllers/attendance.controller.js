const { Attendance, User, Team } = require('../models');
const { Op } = require('sequelize');

// Self-attendance: User marks their own attendance
exports.markSelfAttendance = async (req, res) => {
	try {
		const { 
			action,            // 'check-in' | 'check-out'
			teamId,            // ID of the team the user belongs to
			notes,             // Optional notes
			location           // Optional location
		} = req.body;

		const userId = req.user.id; // Current user's ID from JWT token
		const currentDate = new Date().toISOString().split('T')[0];
		const currentTime = new Date().toLocaleTimeString('en-US', { 
			hour12: false, 
			hour: '2-digit', 
			minute: '2-digit',
			second: '2-digit'
		});

		// Validate required fields
		if (!action || !teamId) {
			return res.status(400).json({ 
				success: false, 
				message: 'action and teamId are required' 
			});
		}

		// Check if user belongs to the specified team
		const teamMembership = await Team.findOne({
			include: [{
				model: User,
				as: 'members',
				where: { id: userId }
			}],
			where: { id: teamId }
		});

		if (!teamMembership) {
			return res.status(403).json({ 
				success: false, 
				message: 'You are not a member of this team' 
			});
		}

		// Find existing attendance record for today
		let attendanceRecord = await Attendance.findOne({
			where: { userId, teamId, date: currentDate }
		});

		if (action === 'check-in') {
			if (!attendanceRecord) {
				// Create new attendance record
				attendanceRecord = await Attendance.create({
					userId,
					teamId,
					date: currentDate,
					status: 'present',
					checkInTime: currentTime,
					notes: notes || 'Self check-in',
					markedBy: userId, // User marks their own attendance
					ipAddress: req.ip,
					location: location || 'Self-service'
				});
			} else {
				// Update existing record with check-in time
				await attendanceRecord.update({
					status: 'present',
					checkInTime: currentTime,
					notes: notes || attendanceRecord.notes || 'Self check-in',
					ipAddress: req.ip,
					location: location || attendanceRecord.location || 'Self-service'
				});
			}

			return res.status(201).json({
				success: true,
				message: 'Check-in successful',
				data: {
					...attendanceRecord.toJSON(),
					action: 'check-in',
					time: currentTime
				}
			});

		} else if (action === 'check-out') {
			if (!attendanceRecord) {
				return res.status(400).json({ 
					success: false, 
					message: 'No check-in record found for today. Please check-in first.' 
				});
			}

			if (!attendanceRecord.checkInTime) {
				return res.status(400).json({ 
					success: false, 
					message: 'No check-in time recorded. Please check-in first.' 
				});
			}

			// Calculate work hours
			const checkInTime = new Date(`2000-01-01T${attendanceRecord.checkInTime}`);
			const checkOutTime = new Date(`2000-01-01T${currentTime}`);
			const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert to hours

			// Determine status based on work hours
			let status = 'present';
			if (workHours < 4) status = 'half_day';
			else if (workHours < 6) status = 'present';

			// Update attendance record
			await attendanceRecord.update({
				checkOutTime: currentTime,
				workHours: parseFloat(workHours.toFixed(2)),
				status: status,
				notes: notes || attendanceRecord.notes || 'Self check-out',
				ipAddress: req.ip,
				location: location || attendanceRecord.location || 'Self-service'
			});

			return res.json({
				success: true,
				message: 'Check-out successful',
				data: {
					...attendanceRecord.toJSON(),
					action: 'check-out',
					time: currentTime,
					workHours: parseFloat(workHours.toFixed(2))
				}
			});

		} else {
			return res.status(400).json({ 
				success: false, 
				message: 'Invalid action. Use "check-in" or "check-out"' 
			});
		}

	} catch (err) {
		console.error('Error in self-attendance:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to process self-attendance', 
			error: err.message 
		});
	}
};

// Get user's own attendance records
exports.getMyAttendance = async (req, res) => {
	try {
		const userId = req.user.id; // Current user's ID from JWT token
		const { startDate, endDate, status } = req.query;

		// Build where clause
		const where = { userId };
		if (startDate && endDate) {
			where.date = { [Op.between]: [startDate, endDate] };
		}
		if (status) {
			where.status = status;
		}

		// Get attendance records
		const records = await Attendance.findAll({ 
			where, 
			include: [
				{ model: Team, as: 'team', attributes: ['id', 'name', 'color'] },
				{ model: User, as: 'markedByUser', attributes: ['id', 'name'] }
			],
			order: [['date', 'DESC']]
		});

		// Calculate statistics
		const totalDays = records.length;
		const presentDays = records.filter(r => r.status === 'present').length;
		const absentDays = records.filter(r => r.status === 'absent').length;
		const lateDays = records.filter(r => r.status === 'late').length;
		const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
		const totalWorkHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);

		// Get today's record if exists
		const today = new Date().toISOString().split('T')[0];
		const todayRecord = records.find(r => r.date === today);

		return res.json({
			success: true,
			data: {
				attendance: records,
				statistics: {
					totalDays,
					presentDays,
					absentDays,
					lateDays,
					attendancePercentage,
					totalWorkHours: parseFloat(totalWorkHours.toFixed(2))
				},
				todayRecord: todayRecord || null,
				filters: { startDate, endDate, status }
			}
		});

	} catch (err) {
		console.error('Error fetching my attendance:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to fetch your attendance', 
			error: err.message 
		});
	}
};

// Mark attendance for a user (existing function - for managers/teachers)
exports.markAttendance = async (req, res) => {
	try {
		const { 
			userId,           // ID of the user whose attendance is being marked
			teamId,           // ID of the team the user belongs to
			date,             // Date of attendance (YYYY-MM-DD)
			status,           // present | absent | late | leave | half_day
			checkInTime,      // Check-in time (HH:MM:SS)
			checkOutTime,     // Check-out time (HH:MM:SS)
			workHours,        // Total work hours (decimal)
			notes,            // Additional notes
			ipAddress,        // IP address of the device marking attendance
			location          // Location where attendance was marked
		} = req.body;

		// Validate required fields
		if (!userId || !teamId || !date || !status) {
			return res.status(400).json({ 
				success: false, 
				message: 'userId, teamId, date, and status are required' 
			});
		}

		// Check if attendance record already exists for this user on this date
		const existingRecord = await Attendance.findOne({
			where: { userId, teamId, date }
		});

		let attendanceRecord;

		if (existingRecord) {
			// Update existing record
			await existingRecord.update({
				status,
				checkInTime: checkInTime || existingRecord.checkInTime,
				checkOutTime: checkOutTime || existingRecord.checkOutTime,
				workHours: workHours || existingRecord.workHours,
				notes: notes || existingRecord.notes,
				ipAddress: ipAddress || existingRecord.ipAddress,
				location: location || existingRecord.location
			});
			attendanceRecord = existingRecord;
		} else {
			// Create new record
			attendanceRecord = await Attendance.create({
				userId,
				teamId,
				date,
				status,
				checkInTime,
				checkOutTime,
				workHours,
				notes,
				markedBy: req.user.id, // ID of the user marking the attendance
				ipAddress: req.ip || ipAddress,
				location: location || 'Office'
			});
		}

		// Return success response
		return res.status(201).json({
			success: true,
			message: 'Attendance marked successfully',
			data: attendanceRecord
		});

	} catch (err) {
		console.error('Error marking attendance:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to mark attendance', 
			error: err.message 
		});
	}
};

// Mark attendance for multiple users at once (bulk operation)
exports.markBulkAttendance = async (req, res) => {
	try {
		const { 
			teamId,           // ID of the team
			date,             // Date of attendance
			attendanceData,   // Array of attendance records
			ipAddress,        // IP address
			location          // Location
		} = req.body;

		if (!teamId || !date || !Array.isArray(attendanceData)) {
			return res.status(400).json({
				success: false,
				message: 'teamId, date, and attendanceData array are required'
			});
		}

		const results = [];
		const errors = [];

		// Process each attendance record
		for (const record of attendanceData) {
			try {
				const { userId, status, checkInTime, checkOutTime, workHours, notes } = record;

				// Check if record exists
				const existingRecord = await Attendance.findOne({
					where: { userId, teamId, date }
				});

				let attendanceRecord;

				if (existingRecord) {
					// Update existing
					await existingRecord.update({
						status,
						checkInTime: checkInTime || existingRecord.checkInTime,
						checkOutTime: checkOutTime || existingRecord.checkOutTime,
						workHours: workHours || existingRecord.workHours,
						notes: notes || existingRecord.notes
					});
					attendanceRecord = existingRecord;
				} else {
					// Create new
					attendanceRecord = await Attendance.create({
						userId,
						teamId,
						date,
						status,
						checkInTime,
						checkOutTime,
						workHours,
						notes,
						markedBy: req.user.id,
						ipAddress: req.ip || ipAddress,
						location: location || 'Office'
					});
				}

				results.push(attendanceRecord);
			} catch (error) {
				errors.push({ userId: record.userId, error: error.message });
			}
		}

		return res.json({
			success: true,
			message: `Processed ${results.length} attendance records`,
			data: { results, errors },
			summary: {
				successful: results.length,
				failed: errors.length,
				total: attendanceData.length
			}
		});

	} catch (err) {
		console.error('Error in bulk attendance marking:', err);
		return res.status(500).json({
			success: false,
			message: 'Failed to process bulk attendance',
			error: err.message
		});
	}
};

// Update existing attendance record
exports.updateAttendance = async (req, res) => {
	try {
		const { 
			id,               // Attendance record ID
			status,           // New status
			checkInTime,      // New check-in time
			checkOutTime,     // New check-out time
			workHours,        // New work hours
			notes,            // New notes
			reason            // Reason for update
		} = req.body;

		const record = await Attendance.findByPk(id);
		if (!record) {
			return res.status(404).json({ 
				success: false, 
				message: 'Attendance record not found' 
			});
		}

		// Update the record
		await record.update({
			status: status || record.status,
			checkInTime: checkInTime || record.checkInTime,
			checkOutTime: checkOutTime || record.checkOutTime,
			workHours: workHours || record.workHours,
			notes: notes || record.notes
		});

		// Log the update (you could add an audit trail here)
		console.log(`Attendance record ${id} updated by user ${req.user.id}. Reason: ${reason || 'No reason provided'}`);

		return res.json({
			success: true,
			message: 'Attendance updated successfully',
			data: record
		});

	} catch (err) {
		console.error('Error updating attendance:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to update attendance', 
			error: err.message 
		});
	}
};

// Get attendance for a specific team
exports.getTeamAttendance = async (req, res) => {
	try {
		const { id: teamId } = req.params;
		const { startDate, endDate, status } = req.query;

		// Build where clause
		const where = { teamId };
		if (startDate && endDate) {
			where.date = { [Op.between]: [startDate, endDate] };
		}
		if (status) {
			where.status = status;
		}

		// Get team with members
		const team = await Team.findByPk(teamId, { 
			include: [{ model: User, as: 'members' }] 
		});
		
		if (!team) {
			return res.status(404).json({ 
				success: false, 
				message: 'Team not found' 
			});
		}

		// Get attendance records
		const records = await Attendance.findAll({ 
			where,
			include: [
				{ model: User, as: 'user', attributes: ['id', 'name', 'email'] },
				{ model: User, as: 'markedByUser', attributes: ['id', 'name'] }
			],
			order: [['date', 'DESC'], ['userId', 'ASC']]
		});

		return res.json({
			success: true,
			data: {
				team: {
					id: team.id,
					name: team.name,
					color: team.color
				},
				attendance: records,
				filters: { startDate, endDate, status }
			}
		});

	} catch (err) {
		console.error('Error fetching team attendance:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to fetch team attendance', 
			error: err.message 
		});
	}
};

// Get attendance for a specific user
exports.getUserAttendance = async (req, res) => {
	try {
		const { id: userId } = req.params;
		const { startDate, endDate, status } = req.query;

		// Build where clause
		const where = { userId };
		if (startDate && endDate) {
			where.date = { [Op.between]: [startDate, endDate] };
		}
		if (status) {
			where.status = status;
		}

		// Get attendance records
		const records = await Attendance.findAll({ 
			where, 
			include: [
				{ model: Team, as: 'team', attributes: ['id', 'name', 'color'] },
				{ model: User, as: 'markedByUser', attributes: ['id', 'name'] }
			],
			order: [['date', 'DESC']]
		});

		// Calculate statistics
		const totalDays = records.length;
		const presentDays = records.filter(r => r.status === 'present').length;
		const absentDays = records.filter(r => r.status === 'absent').length;
		const lateDays = records.filter(r => r.status === 'late').length;
		const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
		const totalWorkHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);

		return res.json({
			success: true,
			data: {
				attendance: records,
				statistics: {
					totalDays,
					presentDays,
					absentDays,
					lateDays,
					attendancePercentage,
					totalWorkHours: parseFloat(totalWorkHours.toFixed(2))
				},
				filters: { startDate, endDate, status }
			}
		});

	} catch (err) {
		console.error('Error fetching user attendance:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to fetch user attendance', 
			error: err.message 
		});
	}
};

// Generate attendance reports
exports.getReports = async (req, res) => {
	try {
		const { 
			scope = 'team',    // team | user | organization
			id,                 // team ID, user ID, or org ID
			startDate,          // Start date for report
			endDate,            // End date for report
			groupBy = 'date'    // date | user | team | status
		} = req.query;

		const where = {};
		if (startDate && endDate) {
			where.date = { [Op.between]: [startDate, endDate] };
		}

		let userIds = [];
		let scopeData = null;

		// Determine scope and get relevant users
		if (scope === 'team') {
			const team = await Team.findByPk(id, { 
				include: [{ model: User, as: 'members' }] 
			});
			if (!team) {
				return res.status(404).json({ 
					success: false, 
					message: 'Team not found' 
				});
			}
			userIds = (team.members || []).map(u => u.id);
			scopeData = { type: 'team', id: team.id, name: team.name };
		} else if (scope === 'user') {
			userIds = [id];
			const user = await User.findByPk(id);
			scopeData = { type: 'user', id: user.id, name: user.name };
		}

		if (userIds.length) {
			where.userId = { [Op.in]: userIds };
		}

		// Get attendance data
		const data = await Attendance.findAll({ 
			where,
			include: [
				{ model: User, as: 'user', attributes: ['id', 'name', 'email'] },
				{ model: Team, as: 'team', attributes: ['id', 'name', 'color'] }
			],
			order: [['date', 'ASC']]
		});

		// Generate report based on groupBy
		let reportData = {};
		
		if (groupBy === 'date') {
			// Group by date
			data.forEach(record => {
				const date = record.date;
				if (!reportData[date]) {
					reportData[date] = { present: 0, absent: 0, late: 0, leave: 0, half_day: 0, total: 0 };
				}
				reportData[date][record.status]++;
				reportData[date].total++;
			});
		} else if (groupBy === 'user') {
			// Group by user
			data.forEach(record => {
				const userId = record.userId;
				if (!reportData[userId]) {
					reportData[userId] = { 
						name: record.user.name, 
						present: 0, absent: 0, late: 0, leave: 0, half_day: 0, total: 0 
					};
				}
				reportData[userId][record.status]++;
				reportData[userId].total++;
			});
		}

		return res.json({
			success: true,
			data: {
				scope: scopeData,
				report: reportData,
				rawData: data,
				filters: { startDate, endDate, groupBy }
			}
		});

	} catch (err) {
		console.error('Error generating report:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Failed to generate report', 
			error: err.message 
		});
	}
};


