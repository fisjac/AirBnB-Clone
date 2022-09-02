const express = require('express');
const router = express.Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const {arrayToJSON} = require('../../utils/parseTools')
const { check } = require('express-validator');
const {User, Spot, Review, ReviewImage, SpotImage, sequelize} = require('../../db/models');
const review = require('../../db/models/review');


// Create custom validator
const validateReview = [handleValidationErrors];

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
      where: {'userId': req.userId}
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

module.exports = router;
