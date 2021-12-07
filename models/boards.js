const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // commentId sequence 처리

const { Schema } = mongoose;
const boardSchema = new Schema({
  boardId: {
    type: Number,
    required: true,
  },
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
});

boardSchema.plugin(AutoIncrement, { inc_field: "boardId" });

module.exports = mongoose.model("Boards", boardSchema); // 이 모델을 라우터에서 사용한다?
