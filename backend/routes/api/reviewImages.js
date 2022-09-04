const express = require('express');
const router = express.Router();
const { requireAuth} = require('../../utils/auth');
const {ReviewImage, Review} = require('../../db/models');
const errorCatching = require('../../utils/errorCatching');

// Delete a ReviewImage
router.delete('/:imageId',
  errorCatching.exists(ReviewImage,'imageId'),
  requireAuth,
  errorCatching.checkOwnership(ReviewImage, 'imageId', 'userId', Review),
  errorCatching.ownershipStatusMustBe(true),
  async (req, res) => {
    let image = await ReviewImage.findByPk(req.params.imageId);
    await image.destroy();
    res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);

module.exports = router;
