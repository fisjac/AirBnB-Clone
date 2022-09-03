const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const {User, Spot, Review, Booking, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
const helperFuncs = require('../../utils/helperFuncs')
const customValidators = require('../../utils/validation')



router.get('/current',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    let bookings = await Booking.findAll({
      include: [
        {
          model: Spot
        },
      ]
    });

    for (let booking of bookings) {
      booking.dataValues.Spot.dataValues.previewImage = await helperFuncs.getPreviewForSpot(booking.dataValues.Spot);
    };

    res.status = 200;
    res.json(bookings);
  }
);




module.exports = router
