const express = require('express');
const router = express.Router();
const { requireAuth} = require('../../utils/auth');
const customValidators = require('../../utils/validation');
const {User, Spot, Review, SpotImage, ReviewImage, Booking} = require('../../db/models');
const errorCatching = require('../../utils/errorCatching');
const helperFuncs = require('../../utils/helperFuncs');

// GET all spots
router.get(
  '/',
  async (req, res) => {
    const allSpots = await Spot.findAll();
    for (let spot of allSpots) {
      spot.dataValues.avgRating = await helperFuncs.avgRatingForSpot(spot);
      spot.dataValues.previewImage = await helperFuncs.getPreviewForSpot(spot);
    }
    res.statusCode = 200;
    return res.json({Spots: allSpots});
  }
);

// Get spots owned by current user
router.get('/current',
  requireAuth,
  async (req, res) => {
    let spots = await Spot.findAll({
      where: {ownerId: req.user.dataValues.id},
    })
    res.status = 200;
    res.json({'Spots': spots});
  }
);

// Create a spot owned by current user
router.post('/',
  requireAuth,
  customValidators.validateSpot,
  async (req, res) => {
    req.body.ownerId = req.user.dataValues.id
    let spot = await Spot.create(req.body);
    res.status = 201;
    return res.json(spot);
  }
);

// Get all spot details by id
router.get('/:spotId',
  errorCatching.exists(Spot, 'spotId'),
  async (req, res) => {
    let spot = await Spot
      .findByPk(req.params.spotId, {
        include: [
          { model: SpotImage },
          { model: User, as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          },
        ]
      });
    spot.dataValues.avgStarRating = await helperFuncs.avgRatingForSpot(spot);
    let count = await Review.count({where: {'spotId': req.params.spotId}})
    spot.dataValues.numReviews = count
    res.status = 200;
    res.json(spot);
  }
);

// Add image to a spot
router.post('/:spotId/images',
  errorCatching.exists(Spot, 'spotId'),
  errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  errorCatching.ownershipStatusMustBe(true),
  requireAuth,
  async (req, res) => {
    req.body.spotId = req.params.spotId;
    const image = await SpotImage.create(req.body);
    res.status = 200;
    res.json(image);
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
    res.status = 201;
    res.json(review)
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
    res.status = 200;
    res.json({'Reviews': reviews});
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
    let spot = await Spot.findByPk(req.params.spotId);
    spot.set(req.body);
    spot = await spot.save()
    res.status = 200
    return res.json(spot)
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
    res.status = 200;
    res.json(booking);
  }
);

// Get booking based on spotId
router.get('/:spotId/bookings',
  errorCatching.exists(Spot,'spotId'),
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId', 'ownerId'),
  errorCatching.ownershipStatusMustBe(true),
  async (_req, res) => {
    let bookings = await Booking.findAll({
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    });
    res.status = 200;
    res.json(bookings);
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
    res.status = 200;
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

module.exports = router
