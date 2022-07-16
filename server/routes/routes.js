const express = require('express');
const app = express();
app.use(require('./index-route'));
module.exports = app;