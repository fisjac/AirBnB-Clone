const express = require('express');
const router = express.Router();

const {Spot, Review, SpotImage, sequelize} = require('../../db/models');

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

module.exports = router
