const mongoose = require("mongoose");
const Joi = require("joi");

const Following = mongoose.model(
  "Following",
  new mongoose.Schema({
    followeeId: {
      type: String,
      required: true,
    },
    followerId: {
      type: String,
      required: true,
    },
  })
);

function validateFollowing(fllwd, fllwrd) {
  const schema = Joi.object({
    followeeId: fllwd,
    followerId: fllwrd,
  });
  return schema.validate({
    followeeId: wnrd,
    followerId: fllwrd,
  });
}

exports.Following = Following;
exports.validate = validateFollowing;
