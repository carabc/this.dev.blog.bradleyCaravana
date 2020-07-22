const BlogPost = require("../models/BlogPost");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const findUserInToken = require("../middleware/findUserInToken");

// @desc    Get all blog posts
// @route  GET /blog
// @access Public
exports.getAllBlogPosts = asyncHandler(async (req, res, next) => {
  // use .lean() to get a json object instead of a mongoose object/document so handlebars can process it
  const posts = await BlogPost.find()
    .populate("user")
    .sort({ createdAt: "desc" })
    .lean();

  await findUserInToken(req, res);
  console.log(res.locals);

  res.render("blog", {
    layout: "blog.hbs",
    posts,
  });
});

// @desc    Like a blog post
// @route  PUT /blog/:slug
// @access Logged in users only
exports.likeABlogPost = asyncHandler(async (req, res, next) => {
  // Find the post by the slug and increment the likes field by 1
  const post = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { likes: 1 } }
  );

  if (!post) {
    return next(
      new ErrorResponse(`No post found with title ${req.params.slug}`, 404)
    );
  }

  // Find a user by the logged in users id on the req object and update the array of liked posts to include the post being liked
  const user = await User.findByIdAndUpdate(req.user._id, {
    $push: { likedPosts: post._id },
  });

  if (!user) {
    return next(
      new ErrorResponse(`No user found with id ${req.user._id}`, 404)
    );
  }

  // Save both the user and post document changes
  await post.save();
  await user.save();

  // Redirect the client to the blog page
  res.redirect("/blog");
});

// @desc    View Create Blog Post Form
// @method  GET /blog/new
exports.viewCreateBlogPostForm = (req, res, next) => {
  res.render("posts/newPost");
};

// @desc    View Edit Blog Post Form
// @method  GET /blog/edit/:blogPostId
exports.viewEditBlogPostForm = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.blogPostId)
    .populate("user")
    .lean();

  if (!post) {
    return next(
      new ErrorResponse(`No Post Found With ID ${req.params.blogPostId}`)
    );
  }
  res.render("posts/editPost", { post });
});

// @desc    Edit Blog Post
// @method  PUT /blog/edit/:blogPostId
exports.editBlogPost = asyncHandler(async (req, res, next) => {
  let post = await BlogPost.findById(req.params.blogPostId).lean();
  if (!post) {
    return next(
      new ErrorResponse(`No Post Found With ID ${req.params.blogPostId}`)
    );
  }

  // If there is no new thumbnail uploaded, set the req.body.thumnail equal to the original post's thumbnail. If there is, set req.body.thumbnail equal to the new uploaded thumbnail from req.files
  if (req.files === null) {
    req.body.thumbnail = post.thumbnail;
  } else {
    req.body.thumbnail = req.files.thumbnail.name;

    // Move the thumbnail file into a folder called uploads, and name it the name of the uploaded file.
    req.files.thumbnail.mv(
      `${process.env.FILE_UPLOAD_PATH}/${req.files.thumbnail.name}`,
      async (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }
  post = await BlogPost.findByIdAndUpdate(req.params.blogPostId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(
      new ErrorResponse(`No Post Found With ID ${req.params.blogPostId}`)
    );
  }

  // Run .save() here so the .pre('save') mongoose middleware runs inside of BlogPost.js to update the slug and sanitizedHtml properties of the document. I'm able to call save() because I never called .lean() when getting the document the second time. If I were to call lean(), it would be a plain javascript object. If I don't it is still a mongoose document which has the save() method on it.
  post = await post.save();

  res.redirect(`/blog/${post.slug}`);
});

// @desc    Get single blog post
// @method  GET /blog/:slug
exports.getSingleBlogPost = asyncHandler(async (req, res, next) => {
  // Find the blog post by the slug, and increment the view count by one
  let post = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { viewCount: 1 } }
  );

  if (!post) {
    return next(
      new ErrorResponse(`No Post Found With Title ${req.params.slug}`)
    );
  }

  // Save the view count changes
  await post.save();
  post = await BlogPost.find({ slug: req.params.slug }).populate("user").lean();
  if (!post) {
    return next(
      new ErrorResponse(`No Post Found With Title ${req.params.slug}`)
    );
  }
  console.log(post[0]);
  res.render("posts/blogPost", { layout: "singleBlogPost.hbs", post: post[0] });
});

// @desc    Delete single blog post
// @method  DELETE /blog/delete/:blogPostId
exports.deleteSingleBlogPost = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.blogPostId);
  if (!post) {
    return next(
      new ErrorResponse(`No Post Found With ID ${req.params.blogPostId}`)
    );
  }
  console.log(post);
  post.remove();

  res.redirect("/blog");
});

// @desc    Create single blog post
// @method  POST /blog/new
exports.createSingleBlogPost = asyncHandler(async (req, res, next) => {
  const thumbnail = req.files.thumbnail;

  // Move the thumbnail file into a folder called uploads, and name it the name of the uploaded file.
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
  post = await (await BlogPost.create(post)).save();
  console.log(post);

  res.redirect("/blog");
});
