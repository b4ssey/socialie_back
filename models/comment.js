const mongoose = require("mongoose");
const Joi = require("joi");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    caption: {
      type: String,
      required: true,
    },
    postId: {
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
    likeCount: {
      type: Number,
      min: 0,
    },
  })
);

function validateComment(cptn, pstd, wnrd) {
  const schema = Joi.object({
    caption: Joi.string().min(1).max(300).required(),
    postId: Joi.objectId().required(),
    ownerId: Joi.objectId().required(),
  });
  return schema.validate({
    caption: cptn,
    postId: pstd,
    ownerId: wnrd,
  });
}

exports.Comment = Comment;
exports.validate = validateComment;
