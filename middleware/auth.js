const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //   Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route."), 401);
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id);

    if (req.user.email !== process.env.MY_EMAIL) {
      return next(
        new ErrorResponse(
          "You do not have authorization to access this page.",
          401
        )
      );
    }

    next();
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Not authorized to access this route."), 401);
  }
});
