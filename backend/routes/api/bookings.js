const express = require('express');
const router = express.Router();
const { requireAuth} = require('../../utils/auth');
const {Spot, Booking} = require('../../db/models');
const customValidators = require('../../utils/validation')
const helperFuncs = require('../../utils/helperFuncs')
const errorCatching = require('../../utils/errorCatching')

router.get('/current',
  requireAuth,
  async (_req, res) => {
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

    res.status(200).json({Bookings: bookings});
  }
);

router.put('/:bookingId',
  errorCatching.exists(Booking,'bookingId'),
  requireAuth,
  errorCatching.checkOwnership(Booking, 'bookingId'),
  errorCatching.ownershipStatusMustBe(true),
  async (req, _res, next) => { //is booking in the past
    let booking = await Booking.findByPk(req.params.bookingId);
    booking = booking.toJSON();
    if (Date.parse(booking.endDate) <= Date.now()) {
      const err = new Error("Past bookings cannot be modified");
      err.status = 403
      next(err);
    } else next();
  },
  customValidators.validateBooking,
  async (req, res) => {
    let booking = await Booking.findByPk(req.params.bookingId)
    booking.set(req.body);
    const editedBooking = await booking.save();
    res.status(200).json(editedBooking)
  }
);

router.delete('/:bookingId',
  errorCatching.exists(Booking, 'bookingId'),
  requireAuth,
  errorCatching.checkOwnership(Booking, 'bookingId'),
  errorCatching.ownershipStatusMustBe(true),
  async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    await booking.destroy();
    res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    });
  }
);

module.exports = router
