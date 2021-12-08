const express = require("express");
const Comments = require("../models/comments"); // 스키마에서 모델을 가져옴
const Posts = require("../models/posts");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//상세게시글, 댓글 조회
router.get("/posts/:postId/all", async (req, res, next) => {
    const { postId } = req.params;
    const post = await Posts.find({ postId }).exec();
    const comments = await Comments.find({ postId }).exec();

    res.json({post, comments});

});


//댓글 작성
router.post("/comments/:postId", authMiddleware, async (req, res, next) => {
    const { postId } = req.params;
    const nickname = res.locals.users.nickname;
    const  userId  = res.locals.users.userId;
    const { comment }  = req.body;

    const date = "2021-12-12";

    await Comments.create({ postId, nickname, userId, comment, date });
    res.send({result : "작성 성공"})
});

//댓글 수정
router.put("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
  
    const { comment } = req.body;
  
    const updateComment = await Comments.find({ commentId });
    if (updateComment.length > 0) {
      await Comments.updateOne({ commentId: commentId }, { $set: { comment } });
    }
    res.send({ result: "success" });
  });
  
  //댓글 삭제
  router.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
  
    const deleteComment = await Comments.find({ commentId });
    if (deleteComment.length > 0) {
      await Comments.deleteOne({ commentId });
    }
    res.send({ result: "success" });
  });
  
  module.exports = router;



module.exports = router;
