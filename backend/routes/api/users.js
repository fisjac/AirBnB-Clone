const express = require('express')

const { setTokenCookie} = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const customValidators = require('../../utils/validation')

// Sign up
router.post(
  '/',
  customValidators.validateSignup,
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
