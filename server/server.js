require('dotenv').config();
require('./cron-jobs/cronJobs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const PORT = parseInt(process.env.PORT);
app.set('views', '../views');
app.set('view engine', 'pug');
app.use(express.json());
app.use(fileUpload());
app.use(require('./routes/routes'));
app.use(express.static(path.resolve(__dirname, '../public')));
app.listen(PORT, () => {
    console.log('Puerto escuchando en', PORT);
});