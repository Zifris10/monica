const express = require('express');
const router = express.Router();
const {
    visitsUserAdd
} = require('../controllers/visitsController');

router.post('/visits/user/add', visitsUserAdd);

module.exports = router;