const BlogPost = require("../models/BlogPost");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

async function findUser(findCondition, populate) {
  return await User.findById(findCondition).populate(populate).lean();
}
