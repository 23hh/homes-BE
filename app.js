const express = require("express");
const app = express();
const port = 8080;

const cors = require("cors");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const commentRouter = require("./routers/comments");

// const mongoose = require("mongoose");
// require("dotenv").config(); git test
// conflict 발생하여 수정 진행
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs"); // 템플릿엔진 ejs를 이 웹의 뷰엔진으로 사용하겠다.

app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

const connect = require("./models");
connect();

const options = {
  origin: "*", // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
};

app.use(cors(options));

app.get("/", (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    res.render("error");
  }
});

app.get("/sign_in", (req, res, next) => {
  try {
    res.render("sign_in");
  } catch (error) {
    res.render("error");
  }
});

app.get("/sign_up", (req, res, next) => {
  try {
    res.render("sign_up");
  } catch (error) {
    res.render("error");
  }
});
app.get("/create", (req, res, next) => {
  try {
    res.render("create");
  } catch (error) {
    res.render("error");
  }
});

app.get("/detail", (req, res, next) => {
  try {
    res.render("detail");
  } catch (error) {
    res.render("error");
  }
});

app.get("/update", (req, res, next) => {
  try {
    res.render("update");
  } catch (error) {
    res.render("error");
  }
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
