const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  thumbnail: {
    type: String,
    required: false,
  },
  title: {
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
  bodyText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bodyPicOne: {
    type: String,
    required: false,
  },
  bodyPicTwo: {
    type: String,
    required: false,
  },
  bodyPicThree: {
    type: String,
    required: false,
  },
  slug: String,
});

module.exports = mongoose.model("Post", PostSchema);
