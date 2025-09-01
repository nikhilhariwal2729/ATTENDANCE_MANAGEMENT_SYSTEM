import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function Register() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'member'
	});
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { register } = useAuth();

	function handleChange(e) {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		try {
			await register({
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role
			});
			navigate('/');
		} catch (err) {
			setError(err?.response?.data?.message || 'Registration failed');
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<div className="flex-1 flex items-center justify-center">
				<form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
					<h1 className="text-xl font-semibold mb-4">Register</h1>
					{error && <div className="text-red-600 text-sm mb-2">{error}</div>}
					
					<input 
						className="w-full border p-2 rounded mb-3" 
						placeholder="Full Name" 
						name="name"
						value={formData.name} 
						onChange={handleChange}
						required
					/>
					
					<input 
						className="w-full border p-2 rounded mb-3" 
						placeholder="Email" 
						type="email"
						name="email"
						value={formData.email} 
						onChange={handleChange}
						required
					/>
					
					<input 
						type="password" 
						className="w-full border p-2 rounded mb-3" 
						placeholder="Password" 
						name="password"
						value={formData.password} 
						onChange={handleChange}
						required
					/>
					
					<input 
						type="password" 
						className="w-full border p-2 rounded mb-3" 
						placeholder="Confirm Password" 
						name="confirmPassword"
						value={formData.confirmPassword} 
						onChange={handleChange}
						required
					/>
					
					<select 
						className="w-full border p-2 rounded mb-4" 
						name="role"
						value={formData.role} 
						onChange={handleChange}
					>
						<option value="member">Member</option>
						<option value="manager">Manager</option>
						<option value="teacher">Teacher</option>
						<option value="admin">Admin</option>
					</select>
					
					<button className="w-full bg-indigo-600 text-white p-2 rounded mb-3">Create Account</button>
					
					<div className="text-center text-sm text-gray-600">
						Already have an account?{' '}
						<Link to="/login" className="text-indigo-600 hover:underline">Login here</Link>
					</div>
				</form>
			</div>
			<Footer />
		</div>
	);
}
