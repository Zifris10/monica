const express = require('express');
const router = express.Router();
const {
    superAdminLogin,
    verifyTokenForgotPassword,
    viewPrincipal
} = require('../controllers/indexController');

router.get('/recuperar-contrasena', verifyTokenForgotPassword);

router.post('/super-admin/login', superAdminLogin);

router.get('/', viewPrincipal);

module.exports = router;