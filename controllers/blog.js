const BlogPost = require("../models/BlogPost");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc    Get all blog posts
// @route  GET /blog
// @access Public
exports.getAllBlogPosts = asyncHandler(async (req, res, next) => {
  // use .lean() to get a json object instead of a mongoose object/document so handlebars can process it
  const posts = await BlogPost.find()
    .populate("user")
    .sort({ createdAt: "desc" })
    .lean();

  // await findUserInToken(req, res);
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
  if (!res.locals.user) {
    console.log(res.locals);
    console.log("there is no user on res.locals...");
    return res.redirect("/auth/login");
  }

  try {
    // Find user in database from user object on res.locals, if there is one
    let user = await User.findById(res.locals.user._id)
      .populate("likedPosts")
      .lean();
    // If theres no user, redirect them to the login page
    if (!user) {
      return res.redirect("/auth/login");
    }

    // If the user already liked the post, redirect them to the recent posts page without incrementing the like count
    if (user.likedPosts.find((post) => post.slug === req.params.slug)) {
      console.log("User already liked the post...redirecting...");
      return res.redirect("/blog");
    }

    // If the post can't be found in the likedPosts array of the user, increment the like count by 1
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { likes: 1 } }
    );

    if (!post) {
      return next(
        new ErrorResponse(`No post found with title ${req.params.slug}`, 404)
      );
    }

    // Push the post into the likedPosts array of the user
    user = await User.findByIdAndUpdate(res.locals.user._id, {
      $push: { likedPosts: post._id },
    });
  } catch (err) {
    console.log(err);
    console.log("Something went wrong...");
    return res.redirect("/");
  }

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
  // See if the user is me before incrementing the view count
  let user = res.locals.user;
  let post;

  if (user.email === process.env.MY_EMAIL) {
    post = await BlogPost.find({ slug: req.params.slug })
      .populate("user")
      .lean();
    if (!post) {
      return next(
        new ErrorResponse(`No Post Found With Title ${req.params.slug}`)
      );
    }
    console.log(post[0]);
    return res.render("posts/blogPost", {
      layout: "singleBlogPost.hbs",
      post: post[0],
    });
  }

  // If the user isn't me or there isn't a logged in user
  // Find the blog post by the slug, and increment the view count by one
  post = await BlogPost.findOneAndUpdate(
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
