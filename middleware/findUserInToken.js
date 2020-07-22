const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function findUserInToken(req, res, next) {
  let token;
  // Check if there is a cookie token
  if (!req.cookies.token) {
    return next();
  }

  // Set the token
  token = req.cookies.token;

  // Make sure there is a token
  if (!token) {
    return next();
  }

  try {
    // Veryify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken.id);

    // Check if there is a user
    if (!req.user) {
      return next();
    }

    // Set user object on res.locals
    res.locals.user = req.user;

    if (req.user.email === process.env.MY_EMAIL) {
      console.log("User Is Bradley...");
      console.log("Setting res variables to true...");

      res.locals.showPlus = true;
      res.locals.showEdit = true;
      res.locals.showDelete = true;
      console.log(res.locals);
    } else {
      console.log("User Is Not Bradley...");
      console.log("Setting res variables to false...");
      res.locals.showPlus = false;
      res.locals.showEdit = false;
      res.locals.showDelete = false;
    }

    res.locals.firstName = req.user.firstName;
    res.locals.lastName = req.user.lastName;
    res.locals.email = req.user.email;

    return next();
  } catch (err) {
    console.log(err);
    return next();
  }
}

module.exports = findUserInToken;
