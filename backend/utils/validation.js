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

// Validate Signup
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Please provide a password of 6 characters or more.'),
  handleValidationErrors
];


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
    .exists({checkNull: true})
    .withMessage("Latitude is required")
    .custom((val) => {
      if (val > 90 || val < -90) {
        throw new Error("Latitude must be between -90 and 90");
      } else return true
    }),
  check('lng')
    .exists({checkNull: true})
    .withMessage("Longitude is required")
    .custom((val) => {
      if (val > 180 || val < -180) {
        throw new Error("Longitude must be between -180 and 180");
      } else return true
    }),
  check('name')
    .exists({checkFalsy: true})
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 character"),
  check('description')
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
  check('price')
    .exists({checkFalsy: true})
    .withMessage("Price per day is required")
    .custom((val) => {
      if (val <= 0) {
        throw new Error("Price must be greater than zero");
      } else return true
    }),
  handleValidationErrors
];

const validateImage = [
  check('url')
    .exists({checkFalsy: true})
    .withMessage("URL is required")
    .custom((val) => {
      if (!(val.endsWith('.png') || val.endsWith('.jpg'))){
        throw new Error("URL must link to an image");
      } else return true
    }),
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
    .withMessage("Stars are required")
    .custom((val)=> {
      if (!Number.isInteger(val) || val > 5 || val < 1) {
        throw new Error()
      } else return true
    })
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const validateBooking = [
  check('startDate')
  .exists({checkFalsy: true})
  .withMessage("StartDate is required")
  .custom((val) => {
    if (Date.parse(val) < Date.now()) {
      throw new Error("startDate cannot be in the past");
    } else return true
  }),
  check('endDate')
  .exists({checkFalsy: true})
  .withMessage("endDate is required")
  .custom((_val, {req})=> {
    let {startDate, endDate} = req.body;
    [startDate, endDate] = [startDate, endDate].map(ele => Date.parse(ele));
    console.log(startDate, endDate)
    if (startDate >= endDate) {
      throw new Error("endDate cannot be on or before startDate")
    } else return true
  })
  .custom((val) => {
    if (Date.parse(val) < Date.now()) {
      throw new Error("endDate cannot be in the past");
    } else return true
  }),
  handleValidationErrors
]

module.exports = {
  handleValidationErrors,
  validateImage,
  validateSignup,
  validateSpot,
  validateSpotQuery,
  validateReview,
  validateBooking
};
