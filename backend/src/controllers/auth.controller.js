const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function generateToken(user) {
	return jwt.sign(
		{ 
			id: user.id, 
			email: user.email, 
			role: user.role,
			name: user.name 
		},
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	);
}

exports.register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		
		// Validation
		if (!name || !email || !password) {
			return res.status(400).json({ 
				success: false,
				message: 'Missing required fields: name, email, and password are required' 
			});
		}

		if (password.length < 6) {
			return res.status(400).json({ 
				success: false,
				message: 'Password must be at least 6 characters long' 
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ 
				success: false,
				message: 'Email already registered' 
			});
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// Create user
		const user = await User.create({ 
			name, 
			email, 
			passwordHash, 
			role: role || 'member',
			status: 'active'
		});

		// Generate token
		const token = generateToken(user);

		// Return success response
		return res.status(201).json({ 
			success: true,
			message: 'User registered successfully',
			data: {
				token,
				user: { 
					id: user.id, 
					name: user.name, 
					email: user.email, 
					role: user.role,
					status: user.status
				} 
			}
		});

	} catch (err) {
		console.error('Registration error:', err);
		return res.status(500).json({ 
			success: false,
			message: 'Registration failed', 
			error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(400).json({ 
				success: false,
				message: 'Email and password are required' 
			});
		}

		// Find user
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ 
				success: false,
				message: 'Invalid credentials' 
			});
		}

		// Check if user is active
		if (user.status !== 'active') {
			return res.status(401).json({ 
				success: false,
				message: 'Account is not active. Please contact administrator.' 
			});
		}

		// Verify password
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			return res.status(401).json({ 
				success: false,
				message: 'Invalid credentials' 
			});
		}

		// Update last login
		await user.update({ lastLoginAt: new Date() });

		// Generate token
		const token = generateToken(user);

		// Return success response
		return res.json({ 
			success: true,
			message: 'Login successful',
			data: {
				token,
				user: { 
					id: user.id, 
					name: user.name, 
					email: user.email, 
					role: user.role,
					status: user.status
				} 
			}
		});

	} catch (err) {
		console.error('Login error:', err);
		return res.status(500).json({ 
			success: false,
			message: 'Login failed', 
			error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
		});
	}
};

exports.getProfile = async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, {
			attributes: { exclude: ['passwordHash'] }
		});

		if (!user) {
			return res.status(404).json({ 
				success: false,
				message: 'User not found' 
			});
		}

		return res.json({ 
			success: true,
			data: { user } 
		});

	} catch (err) {
		console.error('Get profile error:', err);
		return res.status(500).json({ 
			success: false,
			message: 'Failed to get profile', 
			error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
		});
	}
};


