module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [2, 100],
			},
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				notEmpty: true,
			},
		},
		passwordHash: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		role: {
			type: DataTypes.STRING(20),
			allowNull: false,
			defaultValue: 'member',
			validate: {
				isIn: [['admin', 'manager', 'teacher', 'member']],
			},
		},
		status: {
			type: DataTypes.STRING(20),
			defaultValue: 'active',
			validate: {
				isIn: [['active', 'inactive', 'suspended']],
			},
		},
		lastLoginAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		profileImage: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
	}, {
		tableName: 'Users',
		indexes: [
			{
				unique: true,
				fields: ['email'],
			},
			{
				fields: ['role'],
			},
			{
				fields: ['status'],
			},
		],
	});

	return User;
};


