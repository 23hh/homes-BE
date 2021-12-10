const express = require("express");
const Posts = require("../models/posts"); // 스키마에서 모델을 가져옴
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


const env = require("../config/s3_env");
var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

var s3 = new aws.S3({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.REGION,
});


var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: env.Bucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {

      cb(null, `test/${Date.now()}_${file.originalname}`);
    },
  }),
});

// 게시글 및 이미지 s3 등록 처리
router.post(
  "/posts",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);

    const { title, content, area, date } = await req.body;
    const nickname = res.locals.users.nickname;
    const userId = res.locals.users.userId;
    const id = res.locals.users.id;

    // let image_name = req.file.originalname;
    let img_url = req.file.location;
    console.log("img_url: " + img_url);

    Posts.create({
      // await 있으면 에러나서 우선 떼어둠
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
  }
);


// 게시물조회
router.get("/posts", async (req, res, next) => {
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
