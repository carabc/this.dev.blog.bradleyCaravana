const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
  },
  subHeader: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  markdown: {
    type: String,
    required: true,
  },
  heroImage: {
    type: String,
    required: false,
  },
  bodyPicOne: {
    type: String,
    required: false,
  },
  bodyPicTwo: {
    type: String,
    required: false,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  slug: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", PostSchema);
