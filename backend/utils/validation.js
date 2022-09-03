const { validationResult } = require('express-validator');
const { check, query } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .reduce((obj, error) => {
        obj[error.param]= error.msg;
        return obj;
      }, {});

    const err = Error('Validation error');
    err.errors = errors;
    err.status = 400;
    err.title = 'Validation error';
    next(err);
  }
  next();
};

// Create custom validators
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

const validateSpotQuery = [

check('page')
.optional()
.custom((val) => {
  if (val < 0) {
    throw new Error("Page must be greater than or equal to 0");
  } else return true
}),
check('size')
.optional()
.custom((val) => {
  if (val < 0) {
    throw new Error("Page must be greater than or equal to 0");
  } else return true
}),
check('maxLat')
  .optional()
  .custom((val) => {
    if (val > 90 || val < -90) {
      throw new Error("Maximum latitude is invalid");
    } else return true
  }),
check('minLat')
  .optional({checkFalsy: true})
  .custom((val) => {
  if (val > 90 || val < -90) {
    throw new Error("Minimum latitude is invalid");
  } else return true
}),
check('maxLng')
  .optional({checkFalsy: true})
  .custom((val) => {
    if (val > 180 || val < -180) {
      throw new Error("Maximum longitude is invalid");
    } else return true
  }),
check('minLng')
  .optional({checkFalsy: true})
  .custom((val) => {
  if (val > 180 || val < -180) {
    throw new Error("Minimum longitude is invalid");
  } else return true
}),
check('maxPrice')
  .optional({checkFalsy: true})
  .custom((val) => {
    if (val < 0) {
      throw new Error("Maximum price must be greater than or equal to 0");
    } else return true
  }),
  check('minPrice')
    .optional({checkFalsy: true})
    .custom((val) => {
    if (val < 0) {
      throw new Error("Minimum price must be greater than or equal to 0");
    } else return true
  }),
handleValidationErrors
]

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
  check('stars')
    .exists({checkFalsy: true})
    .withMessage("Stars ,must be an integer from 1 to 5"),
    handleValidationErrors
];

const validateBooking = [
  handleValidationErrors
]

module.exports = {
  handleValidationErrors,
  validateSpot,
  validateSpotQuery,
  validateReview,
  validateBooking
};
