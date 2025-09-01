module.exports = (sequelize, DataTypes) => {
	const TeamMember = sequelize.define('TeamMember', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		teamId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Teams',
				key: 'id',
			},
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		joinedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		status: {
			type: DataTypes.STRING(20),
			defaultValue: 'active',
			validate: {
				isIn: [['active', 'inactive']],
			},
		},
	}, {
		tableName: 'TeamMembers',
		indexes: [
			{
				unique: true,
				fields: ['teamId', 'userId'],
			},
		],
	});

	return TeamMember;
};
