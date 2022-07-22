const express = require('express');
const app = express();
app.use(require('./index-route'));
app.use(require('./users-route'));
module.exports = app;