function setResVariables(req, res, next) {
  // set res.locals.isAuthenticated to either true or false. If a user is signed in, res.locals.isAuthenticated is equal to true.
  res.locals.isAuthenticated = req.isAuthenticated();
  // Check if there is a signed in user, if there is, go to the next code block and set a user on res.locals.user. If not, go to the next middleware.
  if (!res.locals.isAuthenticated) {
    return next();
  } else {
    res.locals.user = req.user || null;
  }
  // Check if the signed in user is me, if it is, set a bunch of variables to true. IF not, set them to false.
  if (req.user.googleId === process.env.GOOGLE_ACCOUNT_ID) {
    res.locals.showPlus = true;
    res.locals.showEdit = true;
    res.locals.showDelete = true;
  } else {
    res.locals.showPlus = false;
    res.locals.showEdit = false;
    res.locals.showDelete = false;
  }
  return next();
}

module.exports = setResVariables;
