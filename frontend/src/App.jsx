import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import AttendanceRecords from './pages/AttendanceRecords';
import SelfAttendance from './pages/SelfAttendance';
import MyAttendance from './pages/MyAttendance';
import Reports from './pages/Reports';
import Organizations from './pages/admin/Organizations';
import Teams from './pages/admin/Teams';
import Users from './pages/admin/Users';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected Routes */}
					<Route path="/dashboard" element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					} />

					{/* Attendance Routes */}
					<Route path="/attendance/mark" element={
						<ProtectedRoute allowedRoles={['admin', 'manager', 'teacher']}>
							<Attendance />
						</ProtectedRoute>
					} />

					<Route path="/attendance/records" element={
						<ProtectedRoute allowedRoles={['admin', 'manager', 'teacher']}>
							<AttendanceRecords />
						</ProtectedRoute>
					} />

					<Route path="/attendance/self" element={
						<ProtectedRoute>
							<SelfAttendance />
						</ProtectedRoute>
					} />

					<Route path="/my-attendance" element={
						<ProtectedRoute>
							<MyAttendance />
						</ProtectedRoute>
					} />

					{/* Reports Route */}
					<Route path="/reports" element={
						<ProtectedRoute allowedRoles={['admin', 'manager']}>
							<Reports />
						</ProtectedRoute>
					} />

					{/* Admin Routes */}
					<Route path="/admin/organizations" element={
						<ProtectedRoute allowedRoles={['admin']}>
							<Organizations />
						</ProtectedRoute>
					} />

					<Route path="/admin/teams" element={
						<ProtectedRoute allowedRoles={['admin']}>
							<Teams />
						</ProtectedRoute>
					} />

					<Route path="/admin/users" element={
						<ProtectedRoute allowedRoles={['admin']}>
							<Users />
						</ProtectedRoute>
					} />

					{/* Default Route */}
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
