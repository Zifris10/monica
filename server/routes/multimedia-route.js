const express = require('express');
const router = express.Router();
const { tokensVerifyExpireSuperAdmin } = require('../helpers/jwt');
const {
    multimediaSuperAdminRender,
    multimediaSuperAdminAdd,
    multimediaSuperAdminDelete
} = require('../controllers/multimediaController');

router.get('/multimedia/super-admin/render', tokensVerifyExpireSuperAdmin, multimediaSuperAdminRender);

router.post('/multimedia/super-admin/add', tokensVerifyExpireSuperAdmin, multimediaSuperAdminAdd);

router.delete('/multimedia/super-admin/delete', tokensVerifyExpireSuperAdmin, multimediaSuperAdminDelete);

module.exports = router;