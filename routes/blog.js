const express = require("express");
const router = express.Router();
const ensureAccess = require("../middleware/ensureAccess");
const ensurePermissionToLikePost = require("../middleware/ensurePermissionToLikePost");
const {
  getAllBlogPosts,
  likeABlogPost,
  viewCreateBlogPostForm,
  viewEditBlogPostForm,
  editBlogPost,
  getSingleBlogPost,
  deleteSingleBlogPost,
  createSingleBlogPost,
} = require("../controllers/blog");

router.route("/").get(getAllBlogPosts);

router.route("/:slug").put(ensurePermissionToLikePost, likeABlogPost);

router
  .route("/new")
  .get(ensureAccess, viewCreateBlogPostForm)
  .post(ensureAccess, createSingleBlogPost);

router
  .route("/edit/:blogPostId")
  .get(ensureAccess, viewEditBlogPostForm)
  .put(ensureAccess, editBlogPost);

router.route("/:slug").get(getSingleBlogPost);

router.route("/delete/:blogPostId").delete(ensureAccess, deleteSingleBlogPost);

module.exports = router;
