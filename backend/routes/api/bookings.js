const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const { check } = require('express-validator');
const {User, Spot, Review, sequelize} = require('../../db/models');
const { Op } = require('sequelize');



// router.get('/current',

// );




module.exports = router
