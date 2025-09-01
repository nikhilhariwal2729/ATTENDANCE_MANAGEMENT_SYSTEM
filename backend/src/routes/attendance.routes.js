const { Router } = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const controller = require('../controllers/attendance.controller');

const router = Router();

router.use(authenticateJWT);

// Self-attendance: Users mark their own attendance
router.post('/self', controller.markSelfAttendance);           // Check-in/Check-out
router.get('/my-attendance', controller.getMyAttendance);     // Get user's own attendance

// Mark attendance for a single user (for managers/teachers)
router.post('/mark', authorizeRoles('manager', 'teacher'), controller.markAttendance);

// Mark attendance for multiple users at once (bulk operation)
router.post('/mark-bulk', authorizeRoles('manager', 'teacher'), controller.markBulkAttendance);

// Update existing attendance record
router.put('/update', authorizeRoles('manager', 'teacher'), controller.updateAttendance);

// Get attendance for a specific team
router.get('/team/:id', authorizeRoles('manager', 'teacher', 'admin'), controller.getTeamAttendance);

// Get attendance for a specific user
router.get('/user/:id', controller.getUserAttendance);

// Generate attendance reports
router.get('/reports', authorizeRoles('manager', 'teacher', 'admin'), controller.getReports);

module.exports = router;


