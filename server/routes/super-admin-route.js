const express = require('express');
const router = express.Router();
const {
    superAdminLoginView,
    superAdminDashboard
} = require('../controllers/superAdminsController');

router.get('/auth-super-admin', superAdminLoginView);

router.get('/dashboard-super-admin', superAdminDashboard);

module.exports = router;