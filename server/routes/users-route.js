const express = require('express');
const router = express.Router();
const {
    usersForgotPassword,
    usersUpdatePassword
} = require('../controllers/usersController');

router.post('/users/web/forgot-password', usersForgotPassword);

router.put('/users/web/update-password', usersUpdatePassword);

module.exports = router;