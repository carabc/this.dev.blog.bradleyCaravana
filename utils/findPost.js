const BlogPost = require("../models/BlogPost");

exports.findPost = async (findCondition, populate) => {
  let post;
  return await BlogPost.find(findCondition).populate(populate);
};

exports.findPosts = async (populate) => {
  let posts;
  return await BlogPost.find()
    .populate(populate)
    .sort({ createdAt: "desc" })
    .lean();
};

exports.updatePost = async (findCondition, updatedData) => {
  let post;
  post = await BlogPost.findOneAndUpdate(findCondition, updatedData);
};

exports.findPostByIdAndUpdateViewCount = async (findCondition) => {
  let post;
  return await BlogPost.findByIdAndUpdate(findCondition, {
    $inc: { viewCount: 1 },
  });
};

exports.findPostAndUpdateViewCount = async (findCondition) => {
  let post;
  return await BlogPost.findOneAndUpdate(findCondition, {
    $inc: { viewCount: 1 },
  });
};

exports.findPostByIdAndUpdate = async (
  findCondition,
  updateCondition,
  options
) => {
  let post;
  return await BlogPost.findByIdAndUpdate(
    findCondition,
    updateCondition,
    options
  );
};
