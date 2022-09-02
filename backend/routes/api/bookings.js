const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const {User, Spot, Review, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
const helperFuncs = require('../../utils/helperFuncs')
const customValidators = require('../../utils/validation')



// router.get('/current',

// );




module.exports = router
