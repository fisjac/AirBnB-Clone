const express = require('express');
const router = express.Router();
const { requireAuth} = require('../../utils/auth');
const customValidators = require('../../utils/validation');
const errorCatching = require('../../utils/errorCatching');
const {User, Spot, Review, ReviewImage} = require('../../db/models');
const helperFuncs = require('../../utils/helperFuncs');

router.get('/current',
  requireAuth,
  async (req, res) => {
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
      review.dataValues.Spot.dataValues.previewImage = await helperFuncs.getPreviewForSpot(review.dataValues.Spot)
    };

    jsonArray = helperFuncs.arrayToJSON(reviews)
    res.status = 200;
    res.json({Reviews: reviews})
  }
);

router.post('/:reviewId/images',
  requireAuth,
  errorCatching.exists(Review, 'reviewId'),
  errorCatching.alreadyHasNImages(10),
  async (req, res) => {
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
  errorCatching.exists(Review, 'reviewId'),
  requireAuth,
  errorCatching.checkOwnership(Review, 'reviewId'),
  customValidators.validateReview,
  async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    review.set(req.body);
    updatedReview = await review.save();
    res.status = 200;
    res.json(updatedReview);
  }
);

router.delete('/:reviewId',
  errorCatching.exists(Review, 'reviewId'),
  requireAuth,
  errorCatching.checkOwnership(Review, 'reviewId'),
  errorCatching.ownershipStatusMustBe(true),
  async (req, res) => {
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
