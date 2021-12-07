const express = require("express");
const User = require("../models/users"); // 스키마에서 모델을 가져옴
const router = express.Router();

router.post("/sign_up", async (req, res) => {
  try {
    const { id, password, nickname } = req.body;
    const user = new User({ id, password, nickname });
    console.log("회원가입 지나가유");
    await user.save(); // 사용자 저장하기
    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 회원가입 데이터 형식이 올바르지 않습니다.",
    });
  }
});

module.exports = router;
