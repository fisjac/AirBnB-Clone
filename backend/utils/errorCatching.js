const {User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../db/models');
const { Op } = require('sequelize');
const helperFuncs = require('./helperFuncs');

// Define middleware to check if spotId exists

const exists = (Model, paramId) => {
  return async (req, _res, next) => { //check if id exists
    let instance = await Model.findByPk(req.params[paramId]);
    if (!instance) { //If the id doesn't exist return an error
      const err = new Error(`${Model.name} couldn't be found`)
      err.status = 404
      next(err)
    } else {
      req.body.spotId = instance.dataValues.id;
      next()
    };
  };
};

// Returns a middleware func to check if currentUser owns [instance]
const checkOwnership = (Model, targetId) => {
  return async (req, _res, next) => {
    let instance = await Model.findByPk(req.params[targetId]);
    let userId = req.user.dataValues.id;
    let ownerId = instance.dataValues.ownerId;
    req.isOwner = true
    if (ownerId !== userId) {
      req.isOwner = false;
    }
    next();
  };
};

// Define whether user must or must not be owner
const ownershipStatusMustBe = (status) => {
  return (req, _res, next) => {
    if (req.isOwner === status) {
      next();
    } else {
      const err = new Error('Forbidden')
      err.status = 403
      next(err);
    }
  }
};

// Define middleware to check if currentUser has already reviewed spot
const hasAlreadyReviewed = async (req, _res, next) => {
  let review = await Review.findOne({
    where: {
      [Op.and]: [
        {'spotId': req.params.spotId},
        {'userId': req.body.userId}
      ]
    }
  });
  if (review) {
    const err = new Error();
    err.message = "User already has a review for this spot";
    err.status = 403;
    next(err);
  } else {
    next();
  };
};

// define middleware to check if number of reviews exceeds value
const alreadyHasNImages = (num) => {
  return async (req, _res, next) => {
    const numImages = await ReviewImage.count({
      where: {'reviewId': req.params.reviewId}
    })
    if (numImages >= num) {
      const err = new Error();
      err.message = "Maximum number of images for this resource was reached";
      err.status = 403;
      next(err);
    } else { next() }
  }
};

// Define middleware to check if spot is already booked
const spotIsAvailable = async (req, res, next) => {
  let { startDate, endDate } = req.body;
  [req.newStart, req.newEnd] = [new Date(startDate), new Date(endDate)]
  const bookings = await Booking.findAll({where: {'spotId': req.params.spotId}});

  existingBookings = helperFuncs.arrayToJSON(bookings);
  let bookingError = false;
  const err = new Error("Sorry, this spot is already booked for the specified dates");
  err.status = 403;
  for (let booking of bookings) {
    let {startDate, endDate} = booking;

    if (req.newStart >= startDate && req.newStart <= endDate) {
      bookingError = true;
      err.errors.startDate = "Start date conflicts with an existing booking"
    }

    if (req.newEnd >= startDate && req.newEnd <= endDate) {
      bookingError = true;
      err.errors.startDate = "End date conflicts with an existing booking"
    }

    if (req.newStart <= startDate && req.newEnd >= endDate) {
      bookingError = true;
      err.errors.startDate = "New reservation contains an existing booking"
    }
  };

  if (bookingError) {
    next(err);
  } else {
    next();
  };
};


module.exports = {
  exists,
  checkOwnership, ownershipStatusMustBe,
  hasAlreadyReviewed, alreadyHasNImages,
  spotIsAvailable,
};
