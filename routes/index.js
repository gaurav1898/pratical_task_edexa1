const express = require('express');
const router = express.Router();

//Defining routes after /api

router.use('/user', require('./user'));

module.exports = router;