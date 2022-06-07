const mongoose = require("mongoose");
const Joi = require("joi");

const Reaction = mongoose.model(
  "Reaction",
  new mongoose.Schema({
    ownerId: {
      type: String,
      required: true,
    },
    // captionType: { type: String, enum: ["post", "comment"], required: true },
    captionId: {
      type: String,
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
  })
);

function validateReaction(wnrd, cptnd) {
  const schema = Joi.object({
    ownerId: Joi.objectId().required(),
    captionId: Joi.objectId().required(),
  });
  return schema.validate({
    ownerId: wnrd,
    captionId: cptnd,
  });
}

exports.Reaction = Reaction;
exports.validate = validateReaction;
