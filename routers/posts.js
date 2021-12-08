const express = require("express");
const Posts = require("../models/posts"); // 스키마에서 모델을 가져옴
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 게시물조회
router.route("/posts").get(async (req, res, next) => {
  const posts = await Posts.find({}).sort("-postId");
  res.json({ posts });
});

//게시글저장
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content, img_url, area, date } = await req.body;
  const nickname = res.locals.users.nickname;
  const userId = res.locals.users.userId;
  const id = res.locals.users.id;
  await Posts.create({
    nickname,
    userId,
    id,
    img_url,
    title,
    area,
    content,
    date,
  });
  res.send({ result: "success" });
});

//상세게시글
router.get("/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({ postId }).exec();
    res.json({ post });
  } catch (error) {
    res.render("error");
  }
});

//게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content, area, img_url } = req.body;

  const isIdInBoard = await Posts.find({ postId });
  if (isIdInBoard.length > 0) {
    await Posts.updateOne(
      { postId },
      { $set: { title, content, area, img_url } }
    );
  }
  res.send({ result: "success" });
});

//게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;

  const isIdInBoard = await Posts.find({ postId });
  if (isIdInBoard.length > 0) {
    await Posts.deleteOne({ postId });
  }
  res.send({ result: "success" });
});

module.exports = router;
