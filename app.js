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

/*
const whitelist = ["http://localhost:8080"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed Origin!"));
    }
  },
};
app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가
*/
//CORS
const corsOptions = {
  //cors설정
  origin: "*", //전체 허용
  // methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  // preflightContinue: false,
  // credentials: true,
  // optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// const indexRouter = require('./routes/index');

router.get("/", (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    res.render("error");
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    res.render("error");
  }
});

router.get("/sign_up", (req, res, next) => {
  try {
    res.render("sign_up");
  } catch (error) {
    res.render("error");
  }
});
router.get("/create", (req, res, next) => {
  try {
    res.render("create");
  } catch (error) {
    res.render("error");
  }
});

router.get("/detail", (req, res, next) => {
  try {
    res.render("detail");
  } catch (error) {
    res.render("error");
  }
});

router.get("/update", (req, res, next) => {
  try {
    res.render("update");
  } catch (error) {
    res.render("error");
  }
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
