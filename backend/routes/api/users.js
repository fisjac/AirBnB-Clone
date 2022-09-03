const express = require('express')

const { setTokenCookie} = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

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
    .withMessage('Please provie a password of 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    const usernameTaken = await User.findOne({
      where: {username: username}
    });
    const emailTaken = await User.findOne({
      where: {email: email}
    });
    if (usernameTaken) {
      const err = new Error("User already exists");
      err.status = 403;
      err.errors = {"username": "User with that username already exists"}
      next(err)
    }
    if (emailTaken) {
      const err = new Error("User already exists");
      err.status = 403;
      err.errors = {"email": "User with that email already exists"}
      next(err)
    }

    let user = await User.signup({ email, username, password, firstName, lastName });

    await setTokenCookie(res, user);
    user = user.toJSON();
    delete user.createdAt;
    delete user.updatedAt;
    user.token = '';
    res.json(user);
  }
);

module.exports = router;
