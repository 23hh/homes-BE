const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // commentId sequence 처리

const { Schema } = mongoose;

const commentSchema = new Schema({
  commentId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  postId: {
    type: Number,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});

commentSchema.plugin(AutoIncrement, { inc_field: "commentId" });

module.exports = mongoose.model("Comments", commentSchema);
