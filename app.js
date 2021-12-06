const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
// const express_render = require("./renders");
// const express_router = require("./routers");
// const mongoose = require("mongoose");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use("/", express_render); //Render 폴더 적용
// app.use("/api", express_router); //Router 폴더 적용

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

app.get("/", (req, res) => {
  res.send("<p>3조3조</p>");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
