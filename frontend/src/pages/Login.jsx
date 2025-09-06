import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleCredentialClick = (credEmail, credPassword) => {
		setEmail(credEmail);
		setPassword(credPassword);
		setError('');
	};

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		try {
			await login(email, password);
			navigate('/');
		} catch (err) {
			setError(err?.response?.data?.message || 'Login failed');
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<div className="flex-1 flex items-center justify-center py-12">
				<div className="w-full max-w-md">
					{/* Login Form */}
					<form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
						<div className="text-center mb-6">
							<h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
							<p className="text-gray-600 mt-2">Sign in to your attendance account</p>
						</div>
						
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
								{error}
							</div>
						)}
						
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
								<input 
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
									placeholder="Enter your email" 
									value={email} 
									onChange={(e) => setEmail(e.target.value)} 
								/>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
								<input 
									type="password" 
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
									placeholder="Enter your password" 
									value={password} 
									onChange={(e) => setPassword(e.target.value)} 
								/>
							</div>
						</div>
						
						<button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-medium">
							Sign In
						</button>
						
						<div className="text-center text-sm text-gray-600 mt-4">
							Don't have an account?{' '}
							<Link to="/register" className="text-blue-600 hover:underline font-medium">Register here</Link>
						</div>
					</form>

					{/* Demo Credentials */}
					<div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
						<h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">🎯 Demo Credentials</h3>
						<div className="space-y-3">
							<div 
								className="bg-white rounded-lg p-3 border border-blue-100 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
								onClick={() => handleCredentialClick('admin@attendance.com', 'admin123')}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-gray-900">👑 Admin</p>
										<p className="text-sm text-gray-600">Full system access</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-mono text-blue-600">admin@attendance.com</p>
										<p className="text-sm font-mono text-blue-600">admin123</p>
									</div>
								</div>
							</div>
							
							<div 
								className="bg-white rounded-lg p-3 border border-blue-100 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
								onClick={() => handleCredentialClick('john@sampleorg.com', 'password123')}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-gray-900">👨‍💼 Manager</p>
										<p className="text-sm text-gray-600">Team management</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-mono text-blue-600">john@sampleorg.com</p>
										<p className="text-sm font-mono text-blue-600">password123</p>
									</div>
								</div>
							</div>
							
							<div 
								className="bg-white rounded-lg p-3 border border-blue-100 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
								onClick={() => handleCredentialClick('sarah@sampleorg.com', 'password123')}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-gray-900">👩‍🏫 Teacher</p>
										<p className="text-sm text-gray-600">Mark attendance</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-mono text-blue-600">sarah@sampleorg.com</p>
										<p className="text-sm font-mono text-blue-600">password123</p>
									</div>
								</div>
							</div>
							
							<div 
								className="bg-white rounded-lg p-3 border border-blue-100 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
								onClick={() => handleCredentialClick('mike@sampleorg.com', 'password123')}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-gray-900">👤 Member</p>
										<p className="text-sm text-gray-600">View own records</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-mono text-blue-600">mike@sampleorg.com</p>
										<p className="text-sm font-mono text-blue-600">password123</p>
									</div>
								</div>
							</div>
						</div>
						
						<div className="mt-4 text-center">
							<p className="text-sm text-blue-700">
								💡 <strong>Tip:</strong> Click on any credential to auto-fill the form
							</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}


