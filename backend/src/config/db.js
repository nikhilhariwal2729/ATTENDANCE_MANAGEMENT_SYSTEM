const { sequelize } = require('../models');
const { seedDatabase } = require('./seeder');

async function initDatabase() {
	try {
		// Test connection
		await sequelize.authenticate();
		console.log('✅ Database connection established successfully.');

		// Sync models (create tables)
		await sequelize.sync({ force: true }); // force: true will drop and recreate tables
		console.log('✅ Database tables synchronized.');

		// Seed initial data
		await seedDatabase();

		console.log('🚀 Database initialization completed successfully!');
	} catch (error) {
		console.error('❌ Database initialization failed:', error);
		throw error;
	}
}

module.exports = { initDatabase };


