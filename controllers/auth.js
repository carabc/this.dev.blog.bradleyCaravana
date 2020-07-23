const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc   Register User Page
// @route  GET /auth/register
// @access Public
exports.registerPage = (req, res, next) => {
  res.render("auth/register");
};

// @desc   Register User
// @route  POST /auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //   Create our user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  //   Create JSON Web Token
  sendTokenResponse(user, 200, res);
});

// @desc   Login User
// @route  GET /auth/login
// @access Public
exports.loginPage = (req, res, next) => {
  res.render("auth/login");
};

// @desc   Login User
// @route  POST /auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //   Validate email & password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and password.", 400)
    );
  }

  // Check for the user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }

  //   Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Incorrect password.", 401));
  }

  //   Create JSON Web Token
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  console.log("inside the sendTokenResponse Function");
  //   Create JSON Web Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  console.log(user, token);

  res.cookie("token", token, options).redirect("/blog");
};
