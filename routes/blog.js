const express = require("express");
const route = express.Router();
const postData = require("../data/post");
const ensureAccess = require("../middleware/ensureAccess");
const BlogPost = require("../models/BlogPost");
const e = require("express");
const path = require("path");
const moment = require("moment");

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

  // For Debugging
  console.log(res.locals);

  res.render("blog", {
    layout: "blog.hbs",
    posts,
  });
});

// @desc    View Create Blog Post Form
// @method  GET /blog/new
route.get("/new", ensureAccess, (req, res) => {
  res.render("newPost");
});

// @desc    View Edit Blog Post Form
// @method  GET /blog/edit/:blogPostId
route.get("/edit/:blogPostId", ensureAccess, async (req, res, next) => {
  const post = await BlogPost.findById(req.params.blogPostId)
    .populate("user")
    .lean();
  res.render("editPost", { post });
});

// @desc    Edit Blog Post
// @method  PUT /blog/edit/:blogPostId
route.put("/edit/:blogPostId", ensureAccess, async (req, res, next) => {
  let post = await BlogPost.findByIdAndUpdate(req.params.blogPostId, req.body, {
    new: true,
    runValidators: true,
  });

  // Run .save() here so the .pre('save') mongoose middleware runs inside of BlogPost.js to update the slug and sanitizedHtml properties of the document
  post = await post.save();

  res.redirect(`/blog/${post.slug}`);
});

// @desc    Get single blog post
// @method  GET /blog/:slug
route.get("/:slug", async (req, res) => {
  const post = await BlogPost.find({ slug: req.params.slug })
    .populate("user")
    .lean();
  res.render("blogPost", { layout: "singleBlogPost.hbs", post: post[0] });
});

// @desc    Deleye single blog post
// @method  DELETE /blog/delete/blogPostId
route.delete("/delete/:blogPostId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.blogPostId);
    if (!post) {
      return res.render("errors/400");
    }
    console.log(post);
    post.remove();
  } catch (err) {
    console.log(err);
  }

  res.redirect("/blog");
});

// @desc    Create single blog post
// @method  POST /blog/new
route.post("/new", async (req, res) => {
  const thumbnail = req.files.thumbnail;

  thumbnail.mv(
    `${process.env.FILE_UPLOAD_PATH}/${thumbnail.name}`,
    async (err) => {
      if (err) {
        console.error(err);
      }
    }
  );

  // Set the post properties
  let post = {
    header: req.body.header,
    subHeader: req.body.subHeader,
    author: req.body.author,
    markdown: req.body.markdown,
    thumbnail: req.files.thumbnail.name,
    user: req.user._id,
  };

  // Create the new blog post by passing the post object to .create()
  post = await BlogPost.create(post);
  console.log(post);

  res.redirect("/blog");
});

module.exports = route;
