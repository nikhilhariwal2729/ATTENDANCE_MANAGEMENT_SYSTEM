const bcrypt = require('bcrypt');
const { User, Organization, Team, TeamMember } = require('../models');

async function seedDatabase() {
	try {
		console.log('🌱 Starting database seeding...');

		// Create default admin user
		const adminPassword = await bcrypt.hash('admin123', 10);
		const adminUser = await User.create({
			name: 'System Administrator',
			email: 'admin@attendance.com',
			passwordHash: adminPassword,
			role: 'admin',
			status: 'active',
		});
		console.log('✅ Admin user created:', adminUser.email);

		// Create sample organization
		const organization = await Organization.create({
			name: 'Sample Organization',
			description: 'A sample organization for testing the attendance system',
			address: '123 Main Street, City, Country',
			phone: '+1-555-0123',
			email: 'info@sampleorg.com',
			website: 'https://sampleorg.com',
			status: 'active',
		});
		console.log('✅ Organization created:', organization.name);

		// Create sample teams
		const teams = await Promise.all([
			Team.create({
				name: 'Development Team',
				description: 'Software development team',
				organizationId: organization.id,
				managerId: adminUser.id,
				maxMembers: 15,
				status: 'active',
				color: '#10B981', // Green
			}),
			Team.create({
				name: 'Marketing Team',
				description: 'Marketing and communications team',
				organizationId: organization.id,
				maxMembers: 10,
				status: 'active',
				color: '#F59E0B', // Amber
			}),
			Team.create({
				name: 'HR Team',
				description: 'Human resources team',
				organizationId: organization.id,
				maxMembers: 8,
				status: 'active',
				color: '#8B5CF6', // Purple
			}),
		]);
		console.log('✅ Teams created:', teams.map(t => t.name).join(', '));

		// Create sample users
		const sampleUsers = await Promise.all([
			User.create({
				name: 'John Manager',
				email: 'john@sampleorg.com',
				passwordHash: await bcrypt.hash('password123', 10),
				role: 'manager',
				status: 'active',
			}),
			User.create({
				name: 'Sarah Teacher',
				email: 'sarah@sampleorg.com',
				passwordHash: await bcrypt.hash('password123', 10),
				role: 'teacher',
				status: 'active',
			}),
			User.create({
				name: 'Mike Member',
				email: 'mike@sampleorg.com',
				passwordHash: await bcrypt.hash('password123', 10),
				role: 'member',
				status: 'active',
			}),
			User.create({
				name: 'Lisa Member',
				email: 'lisa@sampleorg.com',
				passwordHash: await bcrypt.hash('password123', 10),
				role: 'member',
				status: 'active',
			}),
		]);
		console.log('✅ Sample users created:', sampleUsers.map(u => u.name).join(', '));

		// Assign users to teams
		await Promise.all([
			TeamMember.create({
				teamId: teams[0].id, // Development Team
				userId: sampleUsers[0].id, // John Manager
				status: 'active',
			}),
			TeamMember.create({
				teamId: teams[0].id, // Development Team
				userId: sampleUsers[2].id, // Mike Member
				status: 'active',
			}),
			TeamMember.create({
				teamId: teams[1].id, // Marketing Team
				userId: sampleUsers[1].id, // Sarah Teacher
				status: 'active',
			}),
			TeamMember.create({
				teamId: teams[1].id, // Marketing Team
				userId: sampleUsers[3].id, // Lisa Member
				status: 'active',
			}),
		]);
		console.log('✅ Team members assigned');

		// Assign team managers
		await Promise.all([
			teams[1].update({ managerId: sampleUsers[1].id }), // Sarah manages Marketing
			teams[2].update({ managerId: adminUser.id }), // Admin manages HR
		]);
		console.log('✅ Team managers assigned');

		console.log('🎉 Database seeding completed successfully!');
		console.log('\n📋 Default Login Credentials:');
		console.log('Admin: admin@attendance.com / admin123');
		console.log('Manager: john@sampleorg.com / password123');
		console.log('Teacher: sarah@sampleorg.com / password123');
		console.log('Member: mike@sampleorg.com / password123');

	} catch (error) {
		console.error('❌ Database seeding failed:', error);
		throw error;
	}
}

module.exports = { seedDatabase };
