const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const customValidators = require('../../utils/validation');
const errorCatching = require('../../utils/errorCatching');
const {User, Spot, Review, ReviewImage, SpotImage, sequelize} = require('../../db/models');
const review = require('../../db/models/review');
const helperFuncs = require('../../utils/helperFuncs');

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
      review.dataValues.Spot.dataValues.previewImage = await helperFuncs.getPreview(review.dataValues.Spot)
    };

    jsonArray = arrayToJSON(reviews)
    res.status = 200;
    res.json({Reviews: reviews})
  }
);

router.post('/:reviewId/images',
  restoreUser,
  requireAuth,
  errorCatching.reviewExists,
  errorCatching.alreadyHasNImages(10),
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
  errorCatching.reviewExists,
  restoreUser,
  requireAuth,
  errorCatching.checkOwnership,
  customValidators.validateReview,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    review.set(req.body);
    updatedReview = await review.save();
    res.status = 200;
    res.json(updatedReview);
  }
);

router.delete('/:reviewId',
  errorCatching.reviewExists,
  restoreUser,
  requireAuth,
  errorCatching.checkOwnership,
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    await review.destroy();
    res.status = 200;
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

module.exports = router;
