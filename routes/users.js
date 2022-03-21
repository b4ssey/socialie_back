const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const nodemailer = require("../startup/nodemailer");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = validate(name, email, password);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: email });
  if (user) return res.status(400).send("User already registered.");

  const confirmationToken = jwt.sign({ email }, config.get("jwtPrivateKey"));

  user = new User({
    name,
    email,
    password,
    confirmationCode: confirmationToken,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send("User was registered successfully! Please check your email");

  nodemailer.sendConfirmationEmail(
    user.name,
    user.email,
    user.confirmationCode
  );
});

router.get("/confirm/:confirmationCode", async (req, res) => {
  let user = await User.findOne({
    confirmationCode: req.params.confirmationCode,
  });

  if (!user) return res.status(404).send("User Not found.");

  user.status = "Active";

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
