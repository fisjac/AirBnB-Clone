const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const {arrayToJSON} = require('../../utils/parseTools')
const { check } = require('express-validator');
const {User, Spot, Review, ReviewImage, SpotImage, sequelize} = require('../../db/models');
const review = require('../../db/models/review');

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
  check('stars')
    .exists({checkFalsy: true})
    .withMessage("Stars ,must be an integer from 1 to 5"),
    handleValidationErrors
];


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
  let review = await Review.findByPk(req.params.reviewId);
  let userId = req.body.userId;
  let ownerId = review.dataValues.userId;
  if (ownerId !== userId) {
    req.user = null;
  }
  next();
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
}
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

router.get('/current',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot.scope('defaultScope'),
        },
        {
          model: ReviewImage, as: 'ReviewImages',
          attributes: ['id', 'url']
        },
      ],
      where: {'userId': req.body.userId}
    })

    for (let review of reviews) {
      review.dataValues.Spot.dataValues.previewImage = await getPreview(review.dataValues.Spot)
      console.log(review.dataValues.Spot.dataValues)
    };

    jsonArray = arrayToJSON(reviews)
    res.status = 200;
    res.json({Reviews: reviews})
  }
);

router.post('/:reviewId/images',
  restoreUser,
  requireAuth,
  reviewExists,
  alreadyHasNImages(10),
  async (req, res, next) => {
    const reviewImage = await ReviewImage.create(req.body);
    res.status = 200;
    let jsonReviewImage = reviewImage.toJSON();
    res.json({
      'id': jsonReviewImage.id,
      'url': jsonReviewImage.url
    });
  }
);

router.put('/:reviewId',
  reviewExists,
  restoreUser,
  checkOwnership,
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    review.set(req.body);
    updatedReview = await review.save();
    res.status = 200;
    res.json(updatedReview);
  }
)

router.delete('/:reviewId',
  reviewExists,
  restoreUser,
  checkOwnership,
  requireAuth,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    await review.destroy();
    res.status = 200;
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
)

module.exports = router;
