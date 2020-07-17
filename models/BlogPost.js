const mongoose = require("mongoose");
const slugify = require("slugify");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

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
  thumbnail: {
    type: String,
    required: false,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  viewCount: {
    type: Number,
  },
  comments: [
    {
      type: String,
    },
  ],
});

PostSchema.pre("validate", function (next) {
  if (this.header) {
    this.slug = slugify(this.header, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

PostSchema.pre("save", function (next) {
  if (this.header) {
    this.slug = slugify(this.header, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

module.exports = mongoose.model("Post", PostSchema);
