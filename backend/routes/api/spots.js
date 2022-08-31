const express = require('express');
const router = express.Router();

const {Spot} = require('../../db/models');

router.get(
  '/',
  async (req, res, next) => {
    const allSpots = await Spot.findAll();
    res.statusCode = 200;
    return res.json({Spots: allSpots});
  }
);

module.exports = router
