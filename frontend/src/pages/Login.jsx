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
			<div className="flex-1 flex items-center justify-center">
				<form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
					<h1 className="text-xl font-semibold mb-4">Login</h1>
					{error && <div className="text-red-600 text-sm mb-2">{error}</div>}
					<input className="w-full border p-2 rounded mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<input type="password" className="w-full border p-2 rounded mb-4" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button className="w-full bg-indigo-600 text-white p-2 rounded mb-3">Sign in</button>
					<div className="text-center text-sm text-gray-600">
						Don't have an account?{' '}
						<Link to="/register" className="text-indigo-600 hover:underline">Register here</Link>
					</div>
				</form>
			</div>
			<Footer />
		</div>
	);
}


