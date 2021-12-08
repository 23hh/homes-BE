const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // postId sequence 처리

const { Schema } = mongoose;

const postSchema = new Schema({
  // postId: {
  //   type: Number,
  //   required: true,
  // },
  userId: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  img_url: {
    type: String,
    required: true,
  },
});

postSchema.plugin(AutoIncrement, { inc_field: "postId" });

module.exports = mongoose.model("Posts", postSchema); // 이 모델을 라우터에서 사용한다?
