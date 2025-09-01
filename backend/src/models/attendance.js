module.exports = (sequelize, DataTypes) => {
	const Attendance = sequelize.define('Attendance', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		teamId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Teams',
				key: 'id',
			},
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(20),
			allowNull: false,
			defaultValue: 'absent',
			validate: {
				isIn: [['present', 'absent', 'late', 'leave', 'half_day']],
			},
		},
		checkInTime: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		checkOutTime: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		workHours: {
			type: DataTypes.DECIMAL(4, 2), // 99.99 hours
			allowNull: true,
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		markedBy: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		ipAddress: {
			type: DataTypes.STRING(45), // IPv6 support
			allowNull: true,
		},
		location: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
	}, {
		tableName: 'Attendances',
		indexes: [
			{
				unique: true,
				fields: ['userId', 'teamId', 'date'],
			},
			{
				fields: ['teamId'],
			},
			{
				fields: ['date'],
			},
			{
				fields: ['status'],
			},
			{
				fields: ['markedBy'],
			},
		],
	});

	return Attendance;
};


