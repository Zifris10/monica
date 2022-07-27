const express = require('express');
const router = express.Router();
const { tokensVerifyExpireSuperAdmin } = require('../helpers/jwt');
const {
    generalsSuperAdminRender,
    generalsSuperAdminUpdate
} = require('../controllers/generalsController');

router.get('/generals/super-admin/render', tokensVerifyExpireSuperAdmin, generalsSuperAdminRender);

router.put('/generals/super-admin/update', tokensVerifyExpireSuperAdmin, generalsSuperAdminUpdate);

module.exports = router;