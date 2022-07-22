const express = require('express');
const router = express.Router();
const {
    loginViewSuperAdmin,
    superAdminLogin,
    verifyTokenForgotPassword
} = require('../controllers/indexController');

router.get('/auth-super-admin', loginViewSuperAdmin);

router.get('/recuperar-contrasena', verifyTokenForgotPassword);

router.post('/super-admin/login', superAdminLogin);

module.exports = router;