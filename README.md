# Attendance Management System

A comprehensive web-based attendance management system built with React frontend and Node.js backend.

## Features

### For Users
- User registration and authentication
- Clock in/out functionality
- View personal attendance history
- Real-time attendance status

### For Team Leaders
- Manage team members
- View team attendance reports
- Generate attendance analytics
- Export attendance data

### For Administrators
- User management
- Organization management
- Team management
- System-wide reports and analytics
- Advanced data export capabilities

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```
Attendance-Management-System/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database and seeder configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── main.jsx        # App entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Attendance-Management-System
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/attendance-system
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Clock In/Out**: Use the attendance page to clock in and out
3. **View Reports**: Access attendance reports and analytics
4. **Manage Users** (Admin): Add, edit, and manage users and teams

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance/records` - Get attendance records
- `GET /api/attendance/reports` - Get attendance reports

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@attendance-system.com or create an issue in the repository.
