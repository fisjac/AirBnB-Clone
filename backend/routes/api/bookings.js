const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const {User, Spot, Review, Booking, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
const helperFuncs = require('../../utils/helperFuncs')
const customValidators = require('../../utils/validation')
const errorCatching = require('../../utils/errorCatching')



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

router.put('/:bookingId',
  errorCatching.exists(Booking,'bookingId'),
  restoreUser,
  requireAuth,
  errorCatching.checkOwnership(Booking, 'bookingId'),
  errorCatching.ownershipStatusMustBe(true),
  customValidators.validateBooking,
  async (req, res, _next) => {
    let booking = await Booking.findByPk(req.params.bookingId)
    booking.set(req.body);
    const editedBooking = await booking.save();
    res.status = 200;
    res.json(editedBooking)
  }
)


module.exports = router
