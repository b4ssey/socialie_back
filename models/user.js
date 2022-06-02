const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  postCount: { post: [String], count: { type: Number, default: 0 } },
  followerCount: { follower: [Number], count: { type: Number, min: 0 } },
  followingCount: { following: [Number], count: { type: Number, min: 0 } },
  confirmationCode: {
    type: String,
    unique: true,
  },
  bio: { type: String, minlength: 5, maxlength: 1024 },
  site: { type: String, minlength: 5, maxlength: 64 },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(nm, ml, psswrd) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    password: passwordComplexity({
      min: 5,
      max: 1024,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    }),
  });

  return schema.validate({
    name: nm,
    email: ml,
    password: psswrd,
  });
}

exports.User = User;
exports.validate = validateUser;
