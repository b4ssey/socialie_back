const express = require("express");
const router = express.Router();
const upload = require("../middleware/common");
const { uploadFile, getFileStream } = require("../startup/s3");
const fs = require("fs");
const util = require("util");
const auth = require("../middleware/auth");
const { validate, Post } = require("../models/post");
const { User } = require("../models/user");

const unlinkFile = util.promisify(fs.unlink);

//test set
router.post("/single", upload.single("image"), async (req, res) => {
  console.log(req.file);
  //uploading to AWS S3
  const result = await uploadFile(req.file); // Calling above function in s3.js
  console.log("S3 response", result);
  // You may apply filter, resize image before sending to client
  // Deleting from local if uploaded in S3 bucket
  await unlinkFile(req.file.path);
  res.send({
    status: "success",
    message: "File uploaded successfully",
    data: req.file,
  });
});

//test get
router.get("/images/:key", (req, res) => {
  const key = req.params.key;
  // console.log(req.params.key);
  const readStream = getFileStream(key);
  readStream.pipe(res); // this line will make image readable
});

router.post("/", auth, async (req, res) => {
  let { caption, imageId, ownerId } = req.body;
  const { error } = validate(caption, imageId, ownerId);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(ownerId);
  if (!user) return res.status(400).send("Invalid user.");

  let post = new Post({
    caption,
    imageId,
    ownerId,
    replyCount: 0,
    likeCount: 0,
  });

  const session = User.startSession();

  try {
    await post.save();
    (await session).withTransaction(async () => {
      user.postCount.count += 1;
      user.postCount.post.push(`${post._id}`);
      user.timeline.push({
        postId: post._id,
        date: post.date,
        caption: post.caption,
      }),
        (await session).commitTransaction();
    });
  } catch (error) {
    (await session).abortTransaction();
  }

  user.save();

  res.send(post);
});

router.get("/timeline/:id", (req, res) => {
  const id = req.params.id;
});

module.exports = router;
