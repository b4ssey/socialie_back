const express = require("express");
const auth = require("../middleware/auth");
const { validate } = require("../models/following");
const { User } = require("../models/user");
const router = express.Router();

router.post("/follow", auth, async (req, res) => {
  let { followeeId, followerId } = req.body;
  const { error } = validate(ownerId, followerId);
  if (error) return res.status(400).send(error.details[0].message);

  const followee = await User.findById(followeeId);
  if (!user) return res.status(400).send("Invalid user to follow.");

  const follower = await User.findById(followerId);
  if (!user) return res.status(400).send("Invalid user.");

  followee.FollowerCount++;
  followee.save();

  follower.FollowingCount++;
  follower.save();
});

router.post("/unfollow", auth, async (req, res) => {
  let { followeeId, followerId } = req.body;
  const { error } = validate(ownerId, followerId);
  if (error) return res.status(400).send(error.details[0].message);

  const unfollowee = await User.findById(followeeId);
  if (!unfollowee) return res.status(400).send("Invalid user to follow.");

  const unfollower = await User.findById(followerId);
  if (!unfollower) return res.status(400).send("Invalid user.");

  unfollowee.FollowerCount--;
  unfollowee.save();

  unfollower.FollowingCount--;
  unfollower.save();
});

module.exports = router;
