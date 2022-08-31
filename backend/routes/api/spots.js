const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const { check } = require('express-validator');
const {Spot, Review, SpotImage, sequelize} = require('../../db/models');

// Create custom validator
const validateSpot = [
  check('address')
    .exists({checkFalsy: true})
    .withMessage("Street address is required"),
  check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
  check('state')
    .exists({checkFalsy: true})
    .withMessage("State is required"),
  check('country')
    .exists({checkFalsy: true})
    .withMessage("Country is required"),
  check('lat')
    .exists({checkFalsy: true})
    .withMessage("Latitude is not valid"),
  check('lng')
    .exists({checkFalsy: true})
    .withMessage("lng is not valid"),
  check('name')
    .exists({checkFalsy: true})
    .withMessage("Name must be less than 50 character")
    .isLength({ max: 50 }),
  check('description')
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
  check('price')
    .exists({checkFalsy: true})
    .withMessage("Price per day is required"),
  handleValidationErrors
];

// GET all spots
router.get(
  '/',
  async (req, res, next) => {
    const allSpots = await Spot.findAll({
      attributes: {
        include: [
          [
            // adding subquery for average ratings
            sequelize.literal(`(
              select avg(stars)
              from reviews as review
              where
                review.spotId = spot.id
            )`), 'avgRating'
          ],
          [
            // adding subquery for preview image
            sequelize.literal(`(
              select url
              from spotImages as spotimage
              where
                spotimage.spotId = spot.id
                and
                  spotimage.preview = true
            )`), 'previewImage'
          ],
        ]
      },
    });
    res.statusCode = 200;
    return res.json({Spots: allSpots});
  }
);

// Edit a spot
router.put('/:spotId',
  restoreUser,
  requireAuth,
  validateSpot,
  async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) { //If the spotId doesn't exist return an error
      const err = new Error("Spot couldn't be found")
      err.status = 404
      err.message = "Spot couldn't be found"
      return next(err)
    } else {
      spot.set(req.body);
      spot = await spot.save()
      res.status = 200
      return res.json(spot)
    }
  }
);

module.exports = router
