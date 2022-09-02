const {User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../db/models');
const { Op } = require('sequelize');


const arrayToJSON = (array) => {
  return array.reduce((accum, record) => {
    accum.push(record.toJSON());
    return accum;
  }, [] );
};

// Add previewImage to each record
const getPreviewForSpot = async (spot) => {
  let preview = await spot.getSpotImages({
    attributes: ['url'],
    where: {preview: true}
  });
  let hasPreview = preview[0];
  if (!hasPreview) return null;
  let url = preview[0].dataValues.url;
  return url;
};

// add avgRating to spot instance
const avgRatingForSpot = async (spot) => {
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

module.exports = {
  arrayToJSON,
  getPreviewForSpot,
  avgRatingForSpot
}
