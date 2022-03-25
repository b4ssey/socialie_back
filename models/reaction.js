const mongoose = require("mongoose");
const Joi = require("joi");

const Reaction = mongoose.model(
  "Reaction",
  new mongoose.Schema({
    ownerId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  })
);
