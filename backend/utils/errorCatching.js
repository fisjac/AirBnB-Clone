const {User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../db/models');
const { Op } = require('sequelize');

// Define middleware to check if spotId exists
const spotExists = async (req, _res, next) => { //check if spotId exists
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) { //If the spotId doesn't exist return an error
    const err = new Error("Spot couldn't be found")
    err.status = 404
    err.message = "Spot couldn't be found"
    next(err)
  } else {
    req.body.spotId = spot.dataValues.id;
    next()
  }
};

// Define middleware to check if review exists
const reviewExists = async (req, _res, next) => { //check if reviewId exists
  let review = await Review.findByPk(req.params.reviewId);
  if (!review) { //If the spotId doesn't exist return an error
    const err = new Error("Review couldn't be found")
    err.status = 404
    err.message = "Review couldn't be found"
    next(err)
  } else {
    req.body.reviewId = review.dataValues.id;
    next()
  }
};

// Define middleware to check if currentUser owns spot
const checkOwnership = async (req, _res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);
  let userId = req.user.dataValues.id;
  let ownerId = spot.dataValues.ownerId;
  req.isOwner = true
  if (ownerId !== userId) {
    req.isOwner = false;
  }
  next();
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

  existingBookings = arrayToJSON(bookings);
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
  // console.log(existingBookings);
};


module.exports = {
  spotExists, reviewExists,
  checkOwnership, ownershipStatusMustBe,
  hasAlreadyReviewed, alreadyHasNImages,
  spotIsAvailable,

};
