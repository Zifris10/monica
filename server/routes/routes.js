const express = require('express');
const app = express();
app.use(require('./index-route'));
app.use(require('./users-route'));
app.use(require('./super-admin-route'));
module.exports = app;