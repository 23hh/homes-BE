const express = require("express");
const Posts = require("../models/posts"); // 스키마에서 모델을 가져옴
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 이미지 업로드에 필요
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });
const s3 = require('../utils/s3_upload.js');


// 게시글 등록 및 s3에 이미지 업로드 (POSTMAN TEST STATUS : DONE)
router.post('/posts', authMiddleware, upload.single("file"), async (req, res) => {

  // console.log(req.file);

  const s3Client = s3.s3Client;
  const params = s3.uploadParams;
  // console.log(params);
  params.Key = req.file.originalname; // 사용자가 업로드한 파일명
  params.Body = req.file.buffer;

  const { title, content, area, date } = await req.body;
  const nickname = res.locals.users.nickname;
  const userId = res.locals.users.userId;
  const id = res.locals.users.id;

  let img_url = params; // 이것만 실제로 클라이언트가 올리는 사진 경로

  s3Client.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: "errorMessage: " + err });
    }
    // console.log("data: " + data); // data의 Location에 src 경로 있음
    // console.log("data.Location: " + data.Location); s3 이미지 경로

    img_url = data.Location; // data에 들어있는 s3 이미지 경로로 바꿔줌

    // DB 저장
    Posts.create({ // await 있으면 에러나서 우선 떼어둠
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

});


// 게시물조회
router.get("/posts").get(async (req, res, next) => {
  const posts = await Posts.find({}).sort("-postId");
  res.json({ posts });
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
