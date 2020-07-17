const express = require("express");
const route = express.Router();
const postData = require("../data/post");
const ensureAccess = require("../middleware/ensureAccess");
const BlogPost = require("../models/BlogPost");
const e = require("express");

// @desc    Get all blog posts
// @method  GET /blog
route.get("/", async (req, res) => {
  // use .lean() to get a json object instead of a mongoose object/document so handlebars can process it
  let showPlus;
  let isThereALoggedInUser;
  const posts = await BlogPost.find()
    .populate("user")
    .sort({ createdAt: "desc" })
    .lean();
  const user = res.locals.user || {};

  if (user.googleId === process.env.GOOGLE_ACCOUNT_ID) {
    showPlus = true;
  } else {
    showPlus = false;
  }
  res.render("blog", {
    layout: "blog.hbs",
    posts,
    showPlus,
  });
});

route.get("/new", ensureAccess, (req, res) => {
  res.render("newPost");
});

// @desc    Get single blog post
// @method  GET /blog/:blogPostId
route.get("/:blogPostId", async (req, res) => {
  const paramId = parseInt(req.params.blogPostId);
  const blogPost = testPosts.find((post) => post.id === paramId);

  res.render("blogPost", { layout: "singleBlogPost.hbs", blogPost });
});

route.post("/new", async (req, res) => {
  let post = {
    header: req.body.header,
    subHeader: req.body.subHeader,
    author: req.body.author,
    markdown: req.body.markdown,
    user: req.user._id,
  };

  try {
    post = await BlogPost.create(post);
  } catch (err) {
    console.log(err);
  }

  res.redirect("/blog");
});

module.exports = route;
