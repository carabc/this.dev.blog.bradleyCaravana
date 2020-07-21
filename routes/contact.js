const express = require("express");
const route = express.Router();

// @desc    View Contact Form
// @method  GET /contact
route.get("/", (req, res) => {
  res.render("contact");
});

// @desc    Send Contact Form
// @method  POST /contact
route.post("/", (req, res) => {
  console.log(req.body);
  res.redirect("/blog");
});

module.exports = route;
