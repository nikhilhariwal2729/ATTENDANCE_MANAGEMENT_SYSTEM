import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
	const { user, logout } = useAuth();
	return (
		<div className="w-full bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
			<Link to="/" className="font-semibold">AttendanceMS</Link>
			<div className="flex items-center gap-4">
				{user && <span className="text-sm text-gray-300">{user.name} ({user.role})</span>}
				{user ? (
					<button className="px-3 py-1 bg-gray-700 rounded" onClick={logout}>Logout</button>
				) : (
					<Link to="/login" className="px-3 py-1 bg-indigo-600 rounded">Login</Link>
				)}
			</div>
		</div>
	);
}




