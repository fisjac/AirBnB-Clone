const express = require('express');
const router = express.Router();
const { requireAuth} = require('../../utils/auth');
const customValidators = require('../../utils/validation');
const {Op} = require('sequelize')
const {User, Spot, Review, SpotImage, ReviewImage, Booking} = require('../../db/models');
const errorCatching = require('../../utils/errorCatching');
const helperFuncs = require('../../utils/helperFuncs');
const { query } = require('express');

// GET all spots
router.get(
  '/',
  customValidators.validateSpotQuery,
  async (req, res) => {

    const queries = {
      minLat: {'name': 'lat', 'func': Op.gte},
      maxLat: {'name': 'lat', 'func': Op.lte},
      minLng: {'name': 'lng', 'func': Op.gte},
      maxLng: {'name': 'lng', 'func': Op.lte},
      minPrice: {'name': 'price', 'func': Op.gte},
      maxPrice: {'name': 'price', 'func': Op.lte},
      city: {'name': 'city', 'func': Op.eq},
      state: {'name': 'state', 'func': Op.eq},
      country: {'name': 'country', 'func': Op.eq},
    };

    // Dynamic WHERE object code
    let where;
    let queryParams = [];
    for (let key in req.query) { //loop over all of the req.query params
      if (Object.keys(queries).includes(key)) { // if instructions are specified...
        // grab values
        let column = queries[key].name;
        let func = queries[key].func;
        let val = req.query[key];
        let newQuery = {[column]: {[func]: val} } // format the values into a query
        queryParams.push(newQuery); //add it to the array of queries
      };
    };

    // If there are any where params, add it to the where object
    if (queryParams.length) {
      where = {[Op.and]: queryParams};
    };

    // Pagination code
    const pagination = {};

    let {page, size} = req.query;
    if (!page) page = 1;
    if (!size) size = 20;

    page = parseInt(page);
    size = parseInt(size);
    console.log(page, size)

    if (page > 0 && size > 0) {
      pagination.limit = size
      pagination.offset = (page - 1) * size
    }

    // Get spots
    let allSpots = await Spot.scope('showAll').findAll({where, ...pagination});
    for (let spot of allSpots) {
      spot.dataValues.avgRating = await helperFuncs.avgRatingForSpot(spot);
      spot.dataValues.previewImage = await helperFuncs.getPreviewForSpot(spot);
    }
    res.status(200).json({
      spots: allSpots,
      page: page,
      size: size
    });
  }
);

// Get spots owned by current user
router.get('/current',
  requireAuth,
  async (req, res) => {
    let spots = await Spot.scope('showAll').findAll({
      where: {ownerId: req.user.dataValues.id},
    })
    for (let spot of spots) {
      spot.dataValues.avgRating = await helperFuncs.avgRatingForSpot(spot);
      spot.dataValues.previewImage = await helperFuncs.getPreviewForSpot(spot);
    }
    res.status(200).json({'spots': spots});
  }
);

// Create a spot owned by current user
router.post('/',
  requireAuth,
  customValidators.validateSpot,
  async (req, res) => {
    req.body.ownerId = req.user.dataValues.id
    let spot = await Spot.create(req.body);
    res.status(201).json(spot);
  }
);

// Get all spot details by id
router.get('/:spotId',
  errorCatching.exists(Spot, 'spotId'),
  async (req, res) => {
    let spot = await Spot
      .scope('showAll')
      .findByPk(req.params.spotId, {
        include: [
          { model: SpotImage,
            attributes: ['id', 'url', 'preview']
          },
          { model: User, as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          },
        ]
      });
    spot.dataValues.avgStarRating = await helperFuncs.avgRatingForSpot(spot);
    let count = await Review.count({where: {'spotId': req.params.spotId}})
    spot.dataValues.numReviews = count
    res.status(200).json(spot);
  }
);

// Add image to a spot
router.post('/:spotId/images',
  errorCatching.exists(Spot, 'spotId'),
  errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  errorCatching.ownershipStatusMustBe(true),
  requireAuth,
  customValidators.validateImage,
  async (req, res) => {
    req.body.spotId = req.params.spotId;
    const image = await SpotImage.create(req.body);
    res.status(200).json(image);
  }
);

// Create a review for a spot
router.post('/:spotId/reviews',
  errorCatching.exists(Spot, 'spotId'),
  requireAuth,
  errorCatching.hasAlreadyReviewed,
  customValidators.validateReview,
  async (req, res) => {
    let review = await Review.create(req.body);
    res.status(201).json(review)
  }
);

// Get all reviews for a spot
router.get('/:spotId/reviews',
  errorCatching.exists(Spot, 'spotId'),
  async (req, res) => {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {model: ReviewImage},
      ],
      where: {'spotId': req.body.spotId}
    });
    res.status(200).json({'reviews': reviews});
  }

);

// Edit a spot
router.put('/:spotId',
  errorCatching.exists(Spot,'spotId'),
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  errorCatching.ownershipStatusMustBe(true),
  customValidators.validateSpot,
  async (req, res) => {
    let spot = await Spot
    .scope('showAll')
    .findByPk(req.params.spotId);
    spot.set(req.body);
    spot = await spot.save();
    res.status(200).json(spot);
  }
);

// Create booking based on spotId
router.post('/:spotId/bookings',
  errorCatching.exists(Spot,'spotId'),
  errorCatching.spotIsAvailable,
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  errorCatching.ownershipStatusMustBe(false),
  customValidators.validateBooking,
  async(req, res) => {
    console.log(req.body)
    const booking = await Booking.create(req.body);
    res.status(200).json(booking);
  }
);

// Get booking based on spotId
router.get('/:spotId/bookings',
  errorCatching.exists(Spot,'spotId'),
  // requireAuth,
  // errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  async (req, res) => {
    let bookings;
    if (!req.isOwner) {
      bookings = await Booking.findAll({
          attributes: ['spotId', 'startDate', 'endDate'],
          where: {'spotId' : req.params.spotId}
        });
    } else {
      bookings = await Booking.findAll({
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        where: {'spotId' : req.params.spotId}
      });
    }
    res.status(200).json({bookings: bookings});
  }
);

// Delete a spot
router.delete('/:spotId',
  errorCatching.exists(Spot,'spotId'),
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  errorCatching.ownershipStatusMustBe(true),
  async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();
    res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

module.exports = router
