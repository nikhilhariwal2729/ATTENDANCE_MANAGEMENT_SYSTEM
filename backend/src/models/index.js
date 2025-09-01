const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false,
		define: {
			timestamps: true,
		},
	}
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = require('./user')(sequelize, DataTypes);
db.Organization = require('./organization')(sequelize, DataTypes);
db.Team = require('./team')(sequelize, DataTypes);
db.Attendance = require('./attendance')(sequelize, DataTypes);
db.TeamMember = require('./teamMember')(sequelize, DataTypes);

// Define associations
db.Organization.hasMany(db.Team, { foreignKey: 'organizationId', as: 'teams' });
db.Team.belongsTo(db.Organization, { foreignKey: 'organizationId', as: 'organization' });

db.Team.belongsTo(db.User, { foreignKey: 'managerId', as: 'manager' });
db.User.hasMany(db.Team, { foreignKey: 'managerId', as: 'managedTeams' });

// Many-to-many relationship between Team and User through TeamMember
db.Team.belongsToMany(db.User, { through: db.TeamMember, as: 'members', foreignKey: 'teamId' });
db.User.belongsToMany(db.Team, { through: db.TeamMember, as: 'teams', foreignKey: 'userId' });

db.User.hasMany(db.Attendance, { foreignKey: 'userId', as: 'attendanceRecords' });
db.Attendance.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Team.hasMany(db.Attendance, { foreignKey: 'teamId', as: 'attendanceRecords' });
db.Attendance.belongsTo(db.Team, { foreignKey: 'teamId', as: 'team' });

module.exports = db;


