const express = require("express");
const auth = require("../middleware/auth");
const { validate } = require("../models/following");
const { User } = require("../models/user");
const router = express.Router();

router.post("/follow", auth, async (req, res) => {
  let { followeeId, followerId } = req.body;
  const { error } = validate(followeeId, followerId);
  if (error) return res.status(400).send(error.details[0].message);

  const followee = await User.findById(followeeId);
  if (!followee) return res.status(400).send("Invalid user to follow.");

  const follower = await User.findById(followerId);
  if (!follower) return res.status(400).send("Invalid user.");

  if (followee.followerCount.follower.some((x) => x == followerId))
    return res.status(400).send("Already Following User");

  const session = User.startSession();

  // try {
  //   (await session).withTransaction(async () => {
  //     followee.followerCount.count++;
  //     follower.followingCount.count++;
  //     (await session).commitTransaction();
  //   });
  // } catch (error) {
  //   (await session).abortTransaction();
  // }

  followee.followerCount.count++;
  followee.followerCount.follower.push(`${follower._id}`);
  await followee.save();

  follower.followingCount.count++;
  follower.followingCount.following.push(`${followee._id}`);
  await follower.save();

  res.send(`${follower.name} followed ${followee.name}`);
});

router.post("/unfollow", auth, async (req, res) => {
  let { followeeId, followerId } = req.body;
  const { error } = validate(followeeId, followerId);
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
