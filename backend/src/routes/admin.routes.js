const { Router } = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const controller = require('../controllers/admin.controller');

const router = Router();

router.use(authenticateJWT, authorizeRoles('admin'));

router.post('/orgs', controller.createOrganization);
router.get('/orgs', controller.listOrganizations);
router.post('/teams', controller.createTeam);
router.get('/teams', controller.listTeams);
router.post('/users', controller.createUser);
router.get('/users', controller.listUsers);
router.post('/teams/:teamId/assign-manager/:userId', controller.assignManagerToTeam);

module.exports = router;



