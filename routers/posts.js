const express = require("express");
const Posts = require("../models/posts"); // 스키마에서 모델을 가져옴
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 이미지 업로드에 필요
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });
const s3 = require('../utils/s3_upload.js');

// 게시글 등록 및 s3에 이미지 업로드
router.post('/posts', upload.single("file"), async (req, res) => {

  const s3Client = s3.s3Client;
  const params = s3.uploadParams;
  console.log(params);
  params.Key = req.file.originalname;
  params.Body = req.file.buffer;

  // body로 임의의 값 들어온다고 가정하고 셋팅 (실제로 프론트 연결되면 nickname, userId, id는 authMiddleware 로 값 넣음 )
  const nickname = "test123";
  const userId = 3;
  const id = "test1";
  const title = "1월 입주 가능!";
  const content = "사진 보다 넓어요~";
  let img_url = params; // 이것만 실제로 클라이언트가 올리는 사진 경로
  const area = "강서구";
  const date = "2021-12-10";

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

    res.json({ message: "업로드 성공! 파일명: " + req.file.originalname }); // 일단 이렇게 메세지 보냄 (실제로는 게시글 목록으로 돌려주던가 그런식으로 처리해야할듯)
  });

});


// 게시물조회
router.route("/posts").get(async (req, res, next) => {
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
