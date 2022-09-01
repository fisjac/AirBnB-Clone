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
    const allSpots = await Spot.findAll(
      {
        attributes: {
          include: [
            [
              sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'
            ]]
        },
        include: {model : Review, attributes: []}
      }
    );
    for (let spot of allSpots) {
      let preview = await spot.getSpotImages({
        attributes: ['url'],
        where: {preview: true}
      })
      spot.dataValues.previewImage = preview[0].dataValues.url
    }
    //   {
    //   attributes: {
    //     include: [
    //       [
    //         // adding subquery for average ratings
    //         sequelize.literal(`(
    //           select avg(stars)
    //           from Reviews as Review
    //           where
    //             Review.spotId = Spot.id
    //         )`), 'avgRating'
    //       ],
    //       [
    //         // adding subquery for preview image
    //         sequelize.literal(`(
    //           select url
    //           from SpotImages as SpotImage
    //           where
    //             SpotImage.spotId = Spot.id
    //             and
    //               SpotImage.preview = true
    //         )`), 'preview'
    //       ],
    //     ]
    //   },
    // }

    res.statusCode = 200;
    return res.json({Spots: allSpots});
  }
);

// Define middleware to check if spotId exists
const spotExists = async (req, _res, next) => { //check if spotId exists
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) { //If the spotId doesn't exist return an error
    const err = new Error("Spot couldn't be found")
    err.status = 404
    err.message = "Spot couldn't be found"
    next(err)
  } else {
    next()
  }
};

// Define middleware to check if currentUser owns spot
const checkOwnership = async (req, _res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);
  let userId = req.user.dataValues.id;
  let ownerId = spot.dataValues.ownerId;
  if (ownerId !== userId) {
    console.log(`user ${userId} is not owner ${ownerId}`);
    console.log('setting user to null');
    req.user = null;
  };
  next();
};

// Create a spot with ownedBy current user
router.post('/',
  restoreUser,
  requireAuth,
  validateSpot,
  async (req, res, next) => {
    req.body.ownerId = req.user.dataValues.id
    let spot = await Spot.create(req.body);
    res.status = 201;
    return res.json(spot);
  }
);

// Add image to a spot
router.post('/:spotId/images',
  spotExists,
  restoreUser,
  checkOwnership,
  requireAuth,
  async (req, res, next) => {
    req.body.spotId = req.params.spotId;
    const image = await SpotImage.create(req.body);
    res.status = 200;
    res.json(image);
  }
)


// Edit a spot
router.put('/:spotId',
  spotExists,
  restoreUser,
  checkOwnership,
  requireAuth,
  validateSpot,
  async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);
    spot.set(req.body);
    spot = await spot.save()
    res.status = 200
    return res.json(spot)
  }
);

module.exports = router
