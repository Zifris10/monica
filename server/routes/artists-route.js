const express = require('express');
const router = express.Router();
const { tokensVerifyExpireSuperAdmin } = require('../helpers/jwt');
const {
    artistsSuperAdminRender,
    artistsSuperAdminAdd,
    artistsSuperAdminUpdate,
    artistsSuperAdminDelete,
    artistsSuperAdminUpdateImage,
    artistsSuperAdminUpdateOrder
} = require('../controllers/artistsController');

router.get('/artists/super-admin/render', tokensVerifyExpireSuperAdmin, artistsSuperAdminRender);

router.post('/artists/super-admin/add', tokensVerifyExpireSuperAdmin, artistsSuperAdminAdd);

router.put('/artists/super-admin/update', tokensVerifyExpireSuperAdmin, artistsSuperAdminUpdate);

router.delete('/artists/super-admin/delete', tokensVerifyExpireSuperAdmin, artistsSuperAdminDelete);

router.put('/artists/super-admin/update-image', tokensVerifyExpireSuperAdmin, artistsSuperAdminUpdateImage);

router.put('/artists/super-admin/update-order', tokensVerifyExpireSuperAdmin, artistsSuperAdminUpdateOrder);

module.exports = router;