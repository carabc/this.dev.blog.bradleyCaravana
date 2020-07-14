const express = require("express");

const route = express.Router();

route.get("/", (req, res) => {
  res.render("posts", { layout: "posts.hbs" });
});

route.get("/new", (req, res) => {
  res.render("newPost");
});

route.post("/new", (req, res) => {
  console.log(req.body);
  res.redirect("/posts");
});

module.exports = route;
