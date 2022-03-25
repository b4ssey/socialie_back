const mongoose = require("mongoose");
const Joi = require("joi");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    caption: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300,
    },
    imageId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    replyCount: {
      type: Number,
      min: 0,
    },
    likeCount: {
      type: Number,
      min: 0,
    },
  })
);

function validatePost(cptn, mgd, wnrd) {
  const schema = Joi.object({
    caption: Joi.string().min(1).max(300).required(),
    imageId: Joi.required(),
    ownerId: Joi.objectId().required(),
  });
  return schema.validate({
    caption: cptn,
    imageId: mgd,
    ownerId: wnrd,
  });
}

exports.Post = Post;
exports.validate = validatePost;
