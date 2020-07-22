const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function findUserInToken(req, res) {
  let token;
  // Check if there is a cookie token
  if (!req.cookies.token) {
    return;
  }

  // Set the token
  token = req.cookies.token;

  // Make sure there is a token
  if (!token) {
    return;
  }

  try {
    // Veryify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken.id);

    // Check if there is a user
    if (!req.user) {
      return;
    }

    // Set user object on res.locals
    res.locals.user = req.user;

    if (req.user.email === process.env.MY_EMAIL) {
      console.log("User Is Bradley...");
      console.log("Setting res variables...");

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

    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = findUserInToken;
