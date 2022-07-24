const express = require('express');
const router = express.Router();
const {
    superAdminLogin,
    verifyTokenForgotPassword
} = require('../controllers/indexController');

router.get('/recuperar-contrasena', verifyTokenForgotPassword);

router.post('/super-admin/login', superAdminLogin);

module.exports = router;