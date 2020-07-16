const express = require("express");
const route = express.Router();
const passport = require("passport");

// @desc    Auth with Google
// @route   GET /auth/google
route.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google Auth Callback
// @route   GET /auth/google/callback
route.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
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
