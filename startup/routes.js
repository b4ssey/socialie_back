const express = require("express");
const home = require("../routes/home");
const comments = require("../routes/comments");
const followings = require("../routes/followings");
const posts = require("../routes/posts");
const reactions = require("../routes/reactions");
const replies = require("../routes/replies");
const users = require("../routes/users");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/", home);
  app.use("/api/comments", comments);
  app.use("/api/followings", followings);
  app.use("/api/posts", posts);
  app.use("/api/reactions", reactions);
  app.use("/api/replies", replies);
  app.use("/api/users", users);
  app.use(error);
};
