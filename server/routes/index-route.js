const express = require('express');
const router = express.Router();
const { loginViewSuperAdmin } = require('../controllers/indexController');

router.get('/auth-super-admin', loginViewSuperAdmin);

module.exports = router;