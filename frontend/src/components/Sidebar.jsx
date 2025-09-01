import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
	const { user } = useAuth();
	return (
		<div className="w-56 min-h-screen bg-gray-100 border-r p-4 space-y-2">
			<Link className="block p-2 rounded hover:bg-gray-200" to="/">Dashboard</Link>
			{(user?.role === 'manager' || user?.role === 'teacher') && (
				<Link className="block p-2 rounded hover:bg-gray-200" to="/attendance">Attendance</Link>
			)}
			<Link className="block p-2 rounded hover:bg-gray-200" to="/my-attendance">My Attendance</Link>
			{(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'teacher') && (
				<Link className="block p-2 rounded hover:bg-gray-200" to="/reports">Reports</Link>
			)}
		</div>
	);
}



