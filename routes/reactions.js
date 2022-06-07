const express = require("express");
const auth = require("../middleware/auth");
const { Post } = require("../models/post");
const { validate, Reaction } = require("../models/reaction");
const { User } = require("../models/user");
const router = express.Router();

router.post("/like", auth, async (req, res) => {
  let { ownerId, postId } = req.body;
  const { error } = validate(ownerId, postId);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(ownerId);
  if (!user) return res.status(400).send("Invalid user.");

  const post = await Post.findById(postId);
  if (!post) return res.status(400).send("Invalid post.");

  let reaction = new Reaction({
    ownerId,
    captionId: postId,
  });

  const session = Post.startSession();

  try {
    await reaction.save();
    (await session).withTransaction(async () => {
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            like: { userId: ownerId, date: reaction.date },
          },
        }
      );
    });
    (await session).commitTransaction();
  } catch (error) {
    (await session).abortTransaction();
  }

  res.send(reaction);
});

module.exports = router;
