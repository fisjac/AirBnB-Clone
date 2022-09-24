const {Review, ReviewImage, Booking} = require('../db/models');
const { Op } = require('sequelize');
const helperFuncs = require('./helperFuncs');

// Define middleware to check if spotId exists
const exists = (Model, paramId) => {
  return async (req, _res, next) => { //check if id exists
    let instance = await Model.findByPk(req.params[paramId]);
    if (!instance) { //If the id doesn't exist return an error
      const err = new Error(`${Model.name} couldn't be found`);
      err.status = 404;
      err.errors= {"Resource not found": `This ${Model.name} does not exist`};
      next(err);
    } else {
      req.body[paramId] = instance.dataValues.id;
      next()
    };
  };
};

// Returns a middleware func to check if currentUser owns [instance]
const checkOwnership = (Model, paramId, fKey = 'userId', joinModel = null) => {
  return async (req, _res, next) => {
    let options = joinModel ? {include: joinModel} : {};
    let userId = req.user.dataValues.id;
    let instance = await Model.findByPk(req.params[paramId], options);
    let ownerId = joinModel ?
      instance.dataValues[joinModel.name].dataValues[fKey] :
      instance.dataValues[fKey];
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
      const err = new Error('Forbidden');
      err.status = 403;
      err.errors= {"Forbidden": 'User cannot access this resource'};
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
    err.errors = {"User already reviewed": 'User has already reviewed this listing'};
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
      err.errors= {"Max images": `Cannot add more than ${num} images`}
      next(err);
    } else { next() }
  }
};

// Define middleware to check if spot is already booked
const spotIsAvailable = async (req, _res, next) => {
  let { startDate, endDate } = req.body;
  [newStart, newEnd] = [Date.parse(startDate), Date.parse(endDate)]
  const bookings = await Booking.findAll({where: {'spotId': req.params.spotId}});

  existingBookings = helperFuncs.arrayToJSON(bookings);
  let bookingError = false;
  const err = new Error("Sorry, this spot is already booked for the specified dates");
  err.status = 403;
  err.errors = {};
  for (let booking of bookings) {
    let [startDate, endDate] = [Date.parse(booking.dataValues.startDate), Date.parse(booking.dataValues.endDate)];
    if (newStart >= startDate && newStart <= endDate) {
      bookingError = true;
      err.errors.startDate = "Start date conflicts with an existing booking"
    }

    if (newEnd >= startDate && newEnd <= endDate) {
      bookingError = true;
      err.errors.endDate = "End date conflicts with an existing booking"
    }

    if (newStart < startDate && newEnd > endDate) {
      bookingError = true;
      err.errors.duration = "New reservation contains an existing booking"
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
