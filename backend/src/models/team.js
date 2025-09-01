module.exports = (sequelize, DataTypes) => {
	const Team = sequelize.define('Team', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [2, 255],
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		organizationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Organizations',
				key: 'id',
			},
		},
		managerId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		maxMembers: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 50,
		},
		status: {
			type: DataTypes.STRING(20),
			defaultValue: 'active',
			validate: {
				isIn: [['active', 'inactive', 'archived']],
			},
		},
		color: {
			type: DataTypes.STRING(7), // Hex color code
			allowNull: true,
			defaultValue: '#3B82F6',
		},
	}, {
		tableName: 'Teams',
		indexes: [
			{
				fields: ['organizationId'],
			},
			{
				fields: ['managerId'],
			},
			{
				fields: ['status'],
			},
		],
	});

	return Team;
};


