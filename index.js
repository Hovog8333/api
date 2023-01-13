require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('./models//userModel');
const router = require('./router');

const app = express();
app.use(express.json());
app.use('/api', router);





app.listen(process.env.PORT);