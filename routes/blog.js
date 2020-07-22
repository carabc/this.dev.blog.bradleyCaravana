const express = require("express");
const router = express.Router();
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
const { protect } = require("../middleware/auth");

router.route("/").get(getAllBlogPosts);

router.route("/:slug").put(likeABlogPost);

router
  .route("/new")
  .get(protect, viewCreateBlogPostForm)
  .post(protect, createSingleBlogPost);

router
  .route("/edit/:blogPostId")
  .get(protect, viewEditBlogPostForm)
  .put(protect, editBlogPost);

router.route("/:slug").get(getSingleBlogPost);

router.route("/delete/:blogPostId").delete(protect, deleteSingleBlogPost);

module.exports = router;
