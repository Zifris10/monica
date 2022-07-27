const express = require('express');
const app = express();
app.use(require('./index-route'));
app.use(require('./users-route'));
app.use(require('./super-admin-route'));
app.use(require('./artists-route'));
app.use(require('./multimedia-route'));
app.use(require('./generals-route'));
module.exports = app;