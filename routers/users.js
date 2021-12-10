const express = require("express");
const bcrypt = require("bcrypt")
const Users = require("../models/users"); // 스키마에서 모델을 가져옴
const router = express.Router();
const jwt = require("jsonwebtoken"); // token 호출

const authMiddleware = require("../middlewares/auth-middleware"); // 미들웨어 호출

// 회원가입
router.post("/sign-up", async (req, res) => {
  try {
    const { id, password, password_confirm, nickname } = req.body;
    const hashed = bcrypt.hashSync(password, 10)
    const hashed_password = hashed

    // 아이디는 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성
    let chkId = id.search(/^[A-za-z0-9]{3,15}$/g);
    if (chkId === -1) {
      // console.log("아이디 형식 체크를 스쳐지나간다")
      res.status(400).send({
        errorMessage: "아이디가 형식에 맞지 않습니다.",
      });
      return;
    }

    // 이미 동일 정보가 있을 경우
    const existUsers = await Users.findOne({
      $or: [{ id }], // 조건[{ nickname }이 하나라도 맞으면 가져와라
    });
    if (existUsers) {
      res.status(400).send({
        errorMessage: "중복된 아이디입니다.",
      });
      return;
    }

    // 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
    let chkPw = password;
    substring = id;
    if (password.length < 4 || chkPw.includes(substring)) {
      // console.log("패스워드 형식을 스쳐지나간다")
      res.status(400).send({
        errorMessage:
          "패스워드는 최소 4자 이상이며, 아이디와 같은 값은 포함될 수 없습니다.",
      });
      return;
    }

    // 패스워드 불일치(입력, 재입력 칸)
    if (password !== password_confirm) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return; 
    }

    /* 닉네임은 아직 유효성/중복체크 진행안함 */

    // 회원가입 정보를 db에 저장
    const users = new Users({ id, hashed_password, nickname });
    await users.save();

    res.status(201).send({ result: "success" });

    return;
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
    return;
  }
});

// 로그인
router.post("/sign-in", async (req, res) => {
  try {
    const { id, password } = req.body; // 입력한 로그인 정보 받음
    const users = await Users.findOne({ id, password }).exec(); // user 조회

    // user 정보 불일치
    if (!users) {
      res.status(400).send({
        errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }
    // users 정보 일치 (users가 없을 경우 본 코드까지 안넘어옴)
    const token = jwt.sign({ userId: users.userId }, "my-secret-key"); // sign 성공 시 token 생성
    console.log(token);

    res.send({
      token,
      result: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

// token 정보조회 -> 이 부분 API URL Front분들이랑 확인해야함
router.get("/users/me", authMiddleware, async (req, res) => {
  // 해당 경로로 들어오는 경우에만 authMiddleware 붙음
  const { users } = res.locals;
  res.send({ users });
});

module.exports = router;
