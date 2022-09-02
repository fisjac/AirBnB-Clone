const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser, properAuth } = require('../../utils/auth');
const customValidators = require('../../utils/validation');
const {User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
const errorCatching = require('../../utils/errorCatching');
const helperFuncs = require('../../utils/helperFuncs');

// GET all spots
router.get(
  '/',
  async (req, res, next) => {
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
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    let spots = await Spot.findAll({
      where: {ownerId: req.user.dataValues.id},
    })
    res.status = 200;
    res.json({'Spots': spots});
  }
);

// Create a spot owned by current user
router.post('/',
  restoreUser,
  requireAuth,
  customValidators.validateSpot,
  async (req, res, next) => {
    req.body.ownerId = req.user.dataValues.id
    let spot = await Spot.create(req.body);
    res.status = 201;
    return res.json(spot);
  }
);

// Get all spot details by id
router.get('/:spotId',
  errorCatching.exists(Spot, 'spotId'),
  async (req, res, next) => {
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
  restoreUser,
  errorCatching.checkOwnership(Spot, 'spotId'),
  errorCatching.ownershipStatusMustBe(true),
  requireAuth,
  async (req, res, next) => {
    req.body.spotId = req.params.spotId;
    const image = await SpotImage.create(req.body);
    res.status = 200;
    res.json(image);
  }
);

// Create a review for a spot
router.post('/:spotId/reviews',
  errorCatching.exists(Spot, 'spotId'),
  restoreUser,
  requireAuth,
  errorCatching.hasAlreadyReviewed,
  customValidators.validateReview,
  async (req, res, next) => {
    let review = await Review.create(req.body);
    res.status = 201;
    res.json(review)
  }
);

// Get all reviews for a spot
router.get('/:spotId/reviews',
  errorCatching.exists(Spot, 'spotId'),
  async (req, res, next) => {
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
  restoreUser,
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId'),
  errorCatching.ownershipStatusMustBe(true),
  customValidators.validateSpot,
  async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);
    spot.set(req.body);
    spot = await spot.save()
    res.status = 200
    return res.json(spot)
  }
);

// Delete a spot
router.delete('/:spotId',
errorCatching.exists(Spot,'spotId'),
  restoreUser,
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId'),
  errorCatching.ownershipStatusMustBe(true),
  async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();
    res.status = 200;
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

router.post('/:spotId/bookings',
  errorCatching.exists(Spot,'spotId'),
  errorCatching.spotIsAvailable,
  restoreUser,
  requireAuth,
  errorCatching.checkOwnership(Spot, 'spotId'),
  errorCatching.ownershipStatusMustBe(false),
  customValidators.validateBooking,
  async(req, res, next) => {
    console.log(req.body)
    const booking = await Booking.create(req.body);
    res.status = 200;
    res.json(booking);
  }
);

module.exports = router
