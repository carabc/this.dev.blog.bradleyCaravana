const express = require("express");
const route = express.Router();
const postData = require("../data/post");
const ensureAccess = require("../middleware/ensureAccess");
const BlogPost = require("../models/BlogPost");

const testPosts = [
  {
    header: "Is this thing on?",
    subHeaderOne: "Welcome to the blog.",
    author: "Bradley Caravana",
    bodyTextOne:
      "This is the body text for my first post. Thanks for stopping by.",
    subHeaderTwo: "Welcome to the blog.",
    bodyTextTwo:
      "This is the body text for my first post. Thanks for stopping by.",
    createdAt: Date.now(),
    id: 1,
  },
  {
    header: "Welcome to your first lesson!",
    subHeaderOne: "Learning the This keyword.",
    author: "Bradley Caravana",
    bodyTextOne:
      "Lorem ipsum dolor sit amet, ius etiam intellegam ex, omnes causae in ius, cum elit tacimates et. Mea posse inciderint ad, homero menandri his no. Per ne congue consetetur, an has habeo euripidis, no pri putent principes. Eripuit assueverit has id, an vivendo quaerendum vel. Vel no consetetur cotidieque, ex per vide soleat option, ad vel eius graecisQuando mandamus pertinacia usu no. Augue laudem ceteros sed ut, te ius prodesset similique. Probo instructior consectetuer ex per. Iriure discere equidem per ei, id vix quis integre. Has esse dicta insolens ex. Erant impedit urbanitas pri eu, dolore maiestatis contentiones mei ea, ex dicit fabulas recusabo vix.Mea an expetendis neglegentur, eu verear recusabo pertinax duo, ad quas dicit expetenda pro. Cu nec inermis repudiare reprehendunt. Illum detraxit rationibus an vis, ei nam delenit eligendi moderatius. Pro adhuc munere ea, probo rebum eu vis. Vide laudem laboramus ne sit.Has iudico dictas delenit ne, eos te illum labitur delicatissimi. Magna putant dignissim nec ea. Ne pro clita tritani, eu hinc labore ullamcorper qui, cu pri graeco dictas assentior. Sea etiam mollis sapientem et. Eu sea ubique percipitur, illud harum moderatius ea ius.Nec affert laoreet contentiones ei, nam conceptam scriptorem ei, dicam utroque appellantur duo ut. Eos ad audiam forensibus. Agam eripuit mnesarchum eu mel. Usu ea etiam appetere principes. Vim legimus omnesque rationibus ei.",
    subHeaderTwo: "Learning the This keyword.",
    bodyTextTwo:
      "Lorem ipsum dolor sit amet, ius etiam intellegam ex, omnes causae in ius, cum elit tacimates et. Mea posse inciderint ad, homero menandri his no. Per ne congue consetetur, an has habeo euripidis, no pri putent principes. Eripuit assueverit has id, an vivendo quaerendum vel. Vel no consetetur cotidieque, ex per vide soleat option, ad vel eius graecisQuando mandamus pertinacia usu no. Augue laudem ceteros sed ut, te ius prodesset similique. Probo instructior consectetuer ex per. Iriure discere equidem per ei, id vix quis integre. Has esse dicta insolens ex. Erant impedit urbanitas pri eu, dolore maiestatis contentiones mei ea, ex dicit fabulas recusabo vix.Mea an expetendis neglegentur, eu verear recusabo pertinax duo, ad quas dicit expetenda pro. Cu nec inermis repudiare reprehendunt. Illum detraxit rationibus an vis, ei nam delenit eligendi moderatius. Pro adhuc munere ea, probo rebum eu vis. Vide laudem laboramus ne sit.Has iudico dictas delenit ne, eos te illum labitur delicatissimi. Magna putant dignissim nec ea. Ne pro clita tritani, eu hinc labore ullamcorper qui, cu pri graeco dictas assentior. Sea etiam mollis sapientem et. Eu sea ubique percipitur, illud harum moderatius ea ius.Nec affert laoreet contentiones ei, nam conceptam scriptorem ei, dicam utroque appellantur duo ut. Eos ad audiam forensibus. Agam eripuit mnesarchum eu mel. Usu ea etiam appetere principes. Vim legimus omnesque rationibus ei.",
    createdAt: Date.now(),
    id: 2,
  },
];

// @desc    Get all blog posts
// @method  GET /blog
route.get("/", async (req, res) => {
  // use .lean() to get a json object instead of a mongoose object/document so handlebars can process it
  let showPlus;
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
  res.render("blog", { layout: "blog.hbs", posts, showPlus });
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
