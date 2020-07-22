const express = require("express");
const route = express.Router();
const passport = require("passport");

// @desc    Auth with Google
// @route   GET /auth/google
// route.get("/google", passport.authenticate("google", { scope: ["profile"] }));
route.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read",
    ],
  })
);

// @desc    Google Auth Callback
// @route   GET /auth/google/callback
route.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/blog" }),
  (req, res) => {
    // Successful authentication, redirect home
    res.redirect("/blog");
  }
);

// @desc    Logout user
// @route   GET /auth/logout
route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/blog");
});

module.exports = route;
