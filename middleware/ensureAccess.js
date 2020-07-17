function ensureAccess(req, res, next) {
  // Check if there is an authenticated user
  if (res.locals.user === null) {
    return res.render("errors/signin");
  }
  //   Check if the user is Bradley
  if (res.locals.user.googleId !== process.env.GOOGLE_ACCOUNT_ID) {
    console.log("its not brad");
    console.log(res.locals.user);
    return res.render("errors/400");
  }

  next();
}

module.exports = ensureAccess;
