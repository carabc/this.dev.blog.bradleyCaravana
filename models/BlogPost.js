const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  thumbnail: {
    type: String,
    required: false,
  },
  header: {
    type: String,
    required: true,
  },
  subHeaderOne: {
    type: String,
    required: true,
  },
  subHeaderTwo: {
    type: String,
    required: true,
  },
  subHeaderThree: {
    type: String,
    required: false,
  },
  subHeaderFour: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
  bodyTextOne: {
    type: String,
    required: true,
  },
  bodyTextTwo: {
    type: String,
    required: true,
  },
  bodyTextThree: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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
  slug: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("Post", PostSchema);
