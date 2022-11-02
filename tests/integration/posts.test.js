const request = require("supertest");
const { Post } = require("../../models/post");
const logger = require("../../middleware/logger");
const mongoose = require("mongoose");

let server;

describe("/api/posts", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Post.remove({});
    mongoose
      .disconnect()
      .then(() => logger.info(`Disconnected from Post.test DB`));
  });

  describe("GET /", () => {
    it("should return all posts by friends", async () => {
      await Post.collection.insertMany([
        {
          caption: "abcd",
          imageId: "abcd.jpg",
          ownerId: "6298e0420510bcc6513957f4",
        },
        {
          caption: "efgh",
          imageId: "efgh.jpg",
          ownerId: "6298e4420510bcc6513957f4",
        },
      ]);
      const res = await request(server).get("/api/posts");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((p) => p.caption === "abcd")).toBeTruthy();
      expect(res.body.some((p) => p.caption === "efgh")).toBeTruthy();
    });
  });
});
