const express = require("express");
const auth = require("../middleware/auth");
const { validate, Comment } = require("../models/comment");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  let { caption, postId, ownerId } = req.body;
  const { error } = validate(caption, postId, ownerId);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(ownerId);
  if (!user) return res.status(400).send("Invalid user.");

  const post = await Post.findById(postId);
  if (!post) return res.status(400).send("Invalid post.");

  let comment = new Comment({
    caption,
    ownerId,
    postId,
  });

  const session = Post.startSession();

  try {
    await comment.save();
    (await session).withTransaction(async () => {
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            reply: {
              userId: ownerId,
              date: comment.date,
              caption,
            },
          },
        }
      );
    });
    (await session).commitTransaction();
  } catch (error) {
    (await session).abortTransaction();
  }

  // //transaction REMEBERRRR
  // post.replyCount++;
  // post.save();

  res.send(comment);
});

module.exports = router;
