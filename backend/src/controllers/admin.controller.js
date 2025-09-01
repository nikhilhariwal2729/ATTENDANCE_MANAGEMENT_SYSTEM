const { Organization, Team, User } = require('../models');

exports.createOrganization = async (req, res) => {
	try {
		const { name } = req.body;
		const org = await Organization.create({ name });
		return res.status(201).json(org);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create organization', error: err.message });
	}
};

exports.listOrganizations = async (req, res) => {
	try {
		const orgs = await Organization.findAll();
		return res.json(orgs);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list organizations', error: err.message });
	}
};

exports.createTeam = async (req, res) => {
	try {
		const { name, organizationId } = req.body;
		const team = await Team.create({ name, organizationId });
		return res.status(201).json(team);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create team', error: err.message });
	}
};

exports.listTeams = async (req, res) => {
	try {
		const teams = await Team.findAll();
		return res.json(teams);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list teams', error: err.message });
	}
};

exports.createUser = async (req, res) => {
	try {
		const { name, email, role } = req.body;
		const user = await User.create({ name, email, role });
		return res.status(201).json(user);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create user', error: err.message });
	}
};

exports.listUsers = async (req, res) => {
	try {
		const users = await User.findAll();
		return res.json(users);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list users', error: err.message });
	}
};

exports.assignManagerToTeam = async (req, res) => {
	try {
		const { teamId, userId } = req.params;
		const team = await Team.findByPk(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });
		const user = await User.findByPk(userId);
		if (!user) return res.status(404).json({ message: 'User not found' });
		team.managerId = user.id;
		await team.save();
		return res.json(team);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to assign manager', error: err.message });
	}
};



