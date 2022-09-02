const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const { check } = require('express-validator');
const {User, Spot, Review, SpotImage, ReviewImage, sequelize} = require('../../db/models');
const { Op } = require('sequelize');

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

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
  check('stars')
    .exists({checkFalsy: true})
    .withMessage("Stars ,must be an integer from 1 to 5"),
    handleValidationErrors
];

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

// Define middleware to check if currentUser owns spot
const checkOwnership = async (req, _res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);
  let userId = req.user.dataValues.id;
  let ownerId = spot.dataValues.ownerId;
  if (ownerId !== userId) {
    req.user = null;
  }
  next();
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



// add avgRating to spot instance
const avgRating = async (spot) => {
  let ratings = await spot.getReviews({
    attributes:['stars']})
  if (!ratings.length) {
    return null;
  } else {
    let avgRating = ratings.reduce((sum, review) =>{
      return sum += review.dataValues.stars
    },0) / ratings.length;
    return avgRating;
  };
};


// Add previewImage to each record
const getPreview = async (spot) => {
  let preview = await spot.getSpotImages({
    attributes: ['url'],
    where: {preview: true}
  });
  let hasPreview = preview[0];
  if (!hasPreview) return null;
  let url = preview[0].dataValues.url;
  return url
}


// GET all spots
router.get(
  '/',
  async (req, res, next) => {
    const allSpots = await Spot.findAll();
    for (let spot of allSpots) {
      spot.dataValues.avgRating = await avgRating(spot);
      spot.dataValues.previewImage = await getPreview(spot)
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
)

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

// Get all spot details by id
router.get('/:spotId',
  spotExists,
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
    spot.dataValues.avgStarRating = await avgRating(spot);
    let count = await Review.count({where: {'spotId': req.params.spotId}})
    spot.dataValues.numReviews = count
    res.status = 200;
    res.json(spot);
  }
)

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

// Create a review for a spot
router.post('/:spotId/reviews',
  spotExists,
  restoreUser,
  requireAuth,
  hasAlreadyReviewed,
  validateReview,
  async (req, res, next) => {
    let review = await Review.create(req.body);
    res.status = 201;
    res.json(review)
  }
)

router.get('/:spotId/reviews',
  spotExists,
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
    res.json(reviews);
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

// Delete a spot
router.delete('/:spotId',
  spotExists,
  restoreUser,
  checkOwnership,
  requireAuth,
  async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();
    res.status = 200;
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
)

module.exports = router
