const express = require('express');
const router = express.Router();
const { requireAuth} = require('../../utils/auth');
const {SpotImage, Spot} = require('../../db/models');
const errorCatching = require('../../utils/errorCatching');


// Delete a SpotImage
router.delete('/:imageId',
  errorCatching.exists(SpotImage,'imageId'),
  requireAuth,
  errorCatching.checkOwnership(SpotImage, 'imageId', 'ownerId', Spot),
  errorCatching.ownershipStatusMustBe(true),
  async (req, res) => {
    let image = await SpotImage.findByPk(req.params.imageId);
    await image.destroy();
    res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }
);


module.exports = router;
