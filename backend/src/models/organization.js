module.exports = (sequelize, DataTypes) => {
	const Organization = sequelize.define('Organization', {
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
		address: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true,
			validate: {
				isEmail: true,
			},
		},
		website: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		logo: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		status: {
			type: DataTypes.STRING(20),
			defaultValue: 'active',
			validate: {
				isIn: [['active', 'inactive']],
			},
		},
	}, {
		tableName: 'Organizations',
		indexes: [
			{
				fields: ['name'],
			},
			{
				fields: ['status'],
			},
		],
	});

	return Organization;
};


