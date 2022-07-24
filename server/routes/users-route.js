const express = require('express');
const router = express.Router();
const { tokensVerifyExpireSuperAdmin } = require('../helpers/jwt');
const {
    usersSuperAdminForgotPassword,
    usersSuperAdminUpdatePassword,
    usersSuperAdminGet,
    usersSuperAdminUpdate
} = require('../controllers/usersController');

router.post('/users/super-admin/forgot-password', usersSuperAdminForgotPassword);

router.put('/users/super-admin/update-password', usersSuperAdminUpdatePassword);

router.get('/users/super-admin/get', tokensVerifyExpireSuperAdmin, usersSuperAdminGet);

router.put('/users/super-admin/update', tokensVerifyExpireSuperAdmin, usersSuperAdminUpdate);

module.exports = router;