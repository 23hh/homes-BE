const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/show-me-homes", {
      //로컬DB 테스트용
      // "mongodb://test:test@localhost:27017/admin"
      // "mongodb://localhost:27017/testAfterSubmitBoard2"
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ignoreUndefined: true,
    })
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;
